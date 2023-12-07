<?php
namespace HeadlessExample\Services;

class CheckoutServices {
    public static function createCheckout($productId, $quantity) {
        $tokens = Auth::getTokens();

        if (! $tokens['accessToken']) {
            throw new \RuntimeException('No access token');
        }

        // this does not handle product options which requires client side logic
        $item = [
            'quantity' => $quantity,
            'catalogReference' => [
                'catalogItemId' => $productId,
                'appId' => '1380b703-ce81-ff05-f115-39571d94dfcd',
            ],
        ];

        $lineItems = [$item];
        $channelType = "WEB";

        $data = [
            "lineItems" => $lineItems,
            "channelType" => $channelType
        ];

        $response = wp_remote_post('https://www.wixapis.com/ecom/v1/checkouts', array(
            'method'      => 'POST',
            'headers'     => array('Content-Type' => 'application/json', 'Authorization' => $tokens['accessToken']['value']),
            'body'        => json_encode($data),
            'data_format' => 'body',
        ));

        if (!is_wp_error($response) && $response['response']['code'] === 200) {
            $body = wp_remote_retrieve_body($response);
            return json_decode($body, true);
        } else {
            error_log('Failed to create checkout, request ID: '.get_wix_request_id($response).' full response: '.json_encode($response));
            throw new \RuntimeException('Failed to create checkout');
        }
    }

    public static function createCallbackUrls(): array {
        $baseUrl = get_site_url();

        return [
            "baseUrl" => $baseUrl,
            "postFlowUrl" => $baseUrl,
        ];
    }

    public static function createCheckoutRedirectSession($checkoutId) {
        $tokens = Auth::getTokens();

        if (! $tokens['accessToken']) {
            throw new \RuntimeException('No access token');
        }

        $data = [
            "ecomCheckout" => ["checkoutId" => $checkoutId],
            "callbacks" => CheckoutServices::createCallbackUrls()
        ];


        $response = wp_remote_post('https://www.wixapis.com/_api/redirects-api/v1/redirect-session', array(
            'method' => 'POST',
            'headers'     => array('Content-Type' => 'application/json', 'Authorization' => $tokens['accessToken']['value']),
            'body' => json_encode($data),
            'data_format' => 'body',
        ));

        if (!is_wp_error($response) && $response['response']['code'] === 200) {
            $body = wp_remote_retrieve_body($response);
            return json_decode($body, true);
        } else {
            error_log('Failed to create redirect session, request ID: '.get_wix_request_id($response).' full response: '.json_encode($response));
            throw new \RuntimeException('Failed to create redirect session for checkout');
        }
    }
}
