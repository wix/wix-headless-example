<?php
namespace HeadlessExample;

use HeadlessExample\Services\Auth;
use HeadlessExample\Services\WixStoresProducts;
defined( 'ABSPATH' ) || exit;
/**
 * Plugin Name: Wix Headless Example
 * Description: A plugin which demonstrates how to write a WordPress plugin which uses Wix Headless.
 * Version: 1.0.0
 * Author: Your Name
 * Author URI: https://yourwebsite.com
 */
require_once plugin_dir_path(__FILE__) . 'utils/wix-request-id.php';
require_once plugin_dir_path(__FILE__) . 'services/wix-auth.php';
require_once plugin_dir_path(__FILE__) . 'services/wix-products.php';
require_once plugin_dir_path(__FILE__) . 'services/wix-checkout.php';
require_once plugin_dir_path(__FILE__) . 'utils/routes.php';
class WixHeadlessPlugin
{
    public function __construct() {
        add_filter('init', array($this, 'init'));
        // Register the plugin's settings
        add_action('admin_init', array($this, 'register_settings'));

        // Create the plugin's settings page
        add_action('admin_menu', array($this, 'create_settings_page'));
        add_shortcode('wixwp_products', array($this, 'wix_headless_render_product_list'));
        add_action('rest_api_init', 'wix_headless_buy_now_endpoint');
    }

    public static function init() {
        Auth::init();
    }

    public static function register_settings() {
        add_option('wix_example_client_id', ''); // Add your desired settings here

        // Register the settings
        register_setting('wix_headless_example_settings_group', 'wix_example_client_id');
    }

    public static function create_settings_page() {
        add_options_page(
            'Wix Headless Example Settings',    // Page title
            'Wix Headless Example',             // Menu title
            'manage_options',           // Capability required to access the page
            'wix-headless-example-settings',    // Menu slug
            array(__CLASS__, 'render_settings_page') // Callback function to render the page
        );
    }

    public static function render_settings_page() {
        $template = plugin_dir_path(__FILE__) . 'templates/settings.php';
        if (file_exists($template)) {
            include $template;
        } else {
            error_log('Wix Headless Example: Could not find settings template');
        }
    }

    public static function wix_headless_render_product_list($attrs) {

        // Simulating the ProductServices.getProducts() call
        $product_list = WixStoresProducts::getProducts();
        $products = $product_list['products'];
        $attrs = shortcode_atts(array(
            'template' => '',
        ), $attrs);

        $templates = array( $attrs['template'], 'templates/product-list.php');

        $template_file = locate_template( $templates, true, true );
        if (!file_exists($template_file)) {
            // use plugin template if not defined in theme/ attribute
            $template_file = plugin_dir_path(__FILE__).'templates/product-list.php';
        }
        extract($products);
        ob_start();
        if (file_exists($template_file)) {
            include $template_file;
        } else {
            echo 'Template file not found!!';
        }

        return ob_get_clean();
    }
}

$WixHeadlessPlugin = new WixHeadlessPlugin();
