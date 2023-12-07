<?php
use HeadlessExample\Services\CheckoutServices;
use HeadlessExample\Services\WixStoresProducts;

function wix_headless_buy_now_endpoint(): void
{
    register_rest_route('wix-headless-example/v1', '/buy-now', array(
        'methods' => 'GET',
        'callback' => 'wix_headless_buy_now_callback',
        'permission_callback' => '__return_true',
        'args' => array(
            'productSlug' => array(
                'required' => true,
            ),
            'quantity' => array(
                'required' => false,
            ),
        ),
    ));
}

function wix_headless_buy_now_callback($request)
{
    error_log('wix_headless_buy_now_callback');
    $product_slug = $request->get_param('productSlug');
    $quantity = intval($request->get_param('quantity') ?? '1', 10);
    $products = WixStoresProducts::getProducts($product_slug);
    $product = (object)($products['products'][0]);

    $checkout = CheckoutServices::createCheckout($product->id, $quantity);

    $redirect_session = CheckoutServices::createCheckoutRedirectSession($checkout['checkout']['id']);

    $response = rest_ensure_response(null);
    $response->set_status(302); // Set the HTTP status code to 302 (Found/Temporary Redirect)
    $response->header('Location', $redirect_session['redirectSession']['fullUrl']);

    return $response;
}
