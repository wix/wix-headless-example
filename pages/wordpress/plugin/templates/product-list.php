<?php

if (!defined('ABSPATH')) {
    exit;
}

/** @var array $products */
$buy_now_url = rest_url() . 'wix-headless-example/v1/buy-now?productSlug=';
?>
<?php if (empty($products)) : ?>
    <p>No products found.</p>
<?php else : ?>
    <ul>
        <?php foreach ($products as $product) : ?>
            <li>
                <a href="<?php echo $buy_now_url.$product['slug'] ?>"><?php echo esc_html($product['name']); ?></a>
            </li>
        <?php endforeach; ?>
    </ul>
<?php endif; ?>
