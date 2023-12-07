<?php

function get_wix_request_id($response) {
    $headers = wp_remote_retrieve_headers( $response );
    return $headers['x-wix-request-id'] ?? 'Header not found';
}
