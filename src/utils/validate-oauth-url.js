export const isValidOauthUrl = async (myWixClient) => {
  try {
    const data = myWixClient.auth.generateOAuthData(
      `${window.location.origin}/login-callback`,
      window.location.href,
    );
    const { authUrl } = await myWixClient.auth.getAuthUrl(data);
    const corsProxy = "https://thingproxy.freeboard.io/fetch/"; // CORS proxy to bypass CORS restrictions
    const url = corsProxy + encodeURIComponent(authUrl);
    // Attempt to fetch the URL to check if it's valid and accessible
    const response = await fetch(url);

    // Check if the response was successful
    return response.status === 200;
  } catch (error) {
    return true;
  }
};
