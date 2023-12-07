<?php
namespace HeadlessExample\Services;

class WixStoresProducts
{
    public static function getProducts(string $slug = null): array {
        $tokens = Auth::getTokens();

        if (! $tokens['accessToken']) {
            throw new \RuntimeException('No access token');
        }

        $response = wp_remote_post('https://www.wixapis.com/stores/v1/products/query', array(
            'method'      => 'POST',
            'headers'     => array('Content-Type' => 'application/json', 'Authorization' => $tokens['accessToken']['value']),
            'body'        => $slug ? '{"query": {"filter": "{\"slug\": \"'.$slug.'\"}"}}' : '',
            'data_format' => 'body',
        ));

        if (!is_wp_error($response) && $response['response']['code'] === 200) {
            $body = wp_remote_retrieve_body($response);
            return json_decode($body, true);
        } else {
            error_log('Failed to get products, request ID: '.get_wix_request_id($response).' full response: '.json_encode($response));
            throw new \RuntimeException('Failed to get products');
        }
    }
}
