export const isValidOauthUrl = async (myWixClient) => {
  try {
    const data = myWixClient.auth.generateOAuthData(
      `${window.location.origin}/login-callback`,
      window.location.href,
    );
    const { authUrl } = await myWixClient.auth.getAuthUrl(data);

    // Attempt to fetch the authUrl and check if it's reachable
    const response = await fetch(authUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Log the response for debugging
    console.log(response);

    // Check if the response was successful
    return response.ok;
  } catch (error) {
    console.error("Error checking authUrl:", error);
    return false;
  }
};
