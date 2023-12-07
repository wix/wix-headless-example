<?php
namespace HeadlessExample\Services;

class Auth
{
    private static string $COOKIE_NAME = 'wix-headless-example-tokens';
    private static $tokens = null;

    public static function getTokens() {
        return Auth::$tokens;
    }

    public static function init(): void {
        Auth::$tokens = Auth::getPersistedTokens();
        if (!Auth::isAccessTokenValid()) {
            Auth::$tokens = Auth::generateVisitorTokens();
            Auth::persistTokens();
        }
    }

    public static function getPersistedTokens() {
        if (isset($_COOKIE[Auth::$COOKIE_NAME])) {
            // Retrieve the JSON data from the cookie
            $jsonData = urldecode($_COOKIE[Auth::$COOKIE_NAME]);

            // Decode the JSON data
            $decodedData = json_decode($jsonData, true);

            if ($decodedData !== null) {
                // Return the decoded JSON data
                return $decodedData;
            } else {
                // Debug: Output the JSON decoding error
                error_log('Failed to decode JSON from the cookie.');
                return null;
            }
        } else {
            // Cookie not set or expired, handle accordingly
            return null;
        }
    }

    public static function persistTokens(): void {
        $jsonData = json_encode(Auth::$tokens);
        $expiry = time() + 60 * 60 * 24 * 30; // 30 days
        $path = '/'; // Cookie available across the entire domain
        $domain = '';
        setcookie(Auth::$COOKIE_NAME, urlencode($jsonData), $expiry, $path, $domain, false, false);
    }

    public static function isAccessTokenValid(): bool {
        $currentDate = time(); // Get the current UNIX timestamp
        return !!(Auth::$tokens['accessToken']['value'] ?? false) && Auth::$tokens['accessToken']['expiresAt'] > $currentDate;
    }

    public static function generateVisitorTokens(): array {
        $client_id = get_option('wix_example_client_id');
        if (!empty($client_id)) {
            $token_request = Auth::$tokens['refreshToken'] && Auth::$tokens['refreshToken']['role'] == TokenRole::VISITOR ? array(
                'refresh_token' => Auth::$tokens['refreshToken']['value'], 'grantType' => 'refresh_token', 'scope' => 'offline_access',
            ) : array(
                'clientId' => $client_id, 'grantType' => 'anonymous', 'scope' => 'offline_access',
            );
            $response = wp_remote_post('https://www.wixapis.com/oauth2/token', array(
                'method' => 'POST',
                'headers' => array('Content-Type' => 'application/json'),
                'body' => wp_json_encode($token_request),
                'data_format' => 'body',
            ));

            if (!is_wp_error($response) && $response['response']['code'] === 200) {
                $body = wp_remote_retrieve_body($response);
                $raw_tokens = json_decode($body, true);
                return Auth::rawTokensToTokensResult($raw_tokens);
            } else {
                error_log('Failed to get tokens : Wix request ID: '.get_wix_request_id($response).' full response '.json_encode($response));
                throw new \RuntimeException('Failed to get tokens');
            }
        } else {
            return [];
        }

    }

    private static function rawTokensToTokensResult(array $raw_tokens): array {
        return array(
            'accessToken' => Auth::createAccessToken($raw_tokens['access_token'], $raw_tokens['expires_in']),
            'refreshToken' => array(
                'value' => $raw_tokens['refresh_token'],
                'role' => TokenRole::VISITOR,
            ),
        );
    }

    private static function createAccessToken(string $accessToken, int $expiresIn): array {
        $now = time(); // Get the current UNIX timestamp
        return array(
            'value' => $accessToken,
            'expiresAt' => $expiresIn + $now,
        );
    }
}

class TokenRole {
    const NONE = 'none';
    const VISITOR = 'visitor';
//    for future use
    const MEMBER = 'member';
}
