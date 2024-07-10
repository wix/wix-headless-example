export const isValidOauthUrl = async (myWixClient) => {
    const data = myWixClient.auth.generateOAuthData(
        `${window.location.origin}/login-callback`,
        window.location.href,
    );

    const {authUrl} = await myWixClient.auth.getAuthUrl(data);
    // check that the authUrl is reachable
    const response = await fetch(authUrl, {
        mode: 'no-cors'  // This mode sends the request without requiring CORS
    });

    return response.ok;
}