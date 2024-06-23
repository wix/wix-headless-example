import Cookies from "js-cookie";
import {useEffect, useState} from "react";
/*
  This line is importing two modules from the Wix SDK.
  createClient is a function used to create a new instance of the Wix client, which is used to interact with the Wix APIs.
  OAuthStrategy is a module that provides a method for authenticating API calls using OAuth tokens.
 */
import {createClient, OAuthStrategy} from "@wix/sdk";

/*
  A Wix client is an instance created using the createClient function from the Wix SDK.
  It's essentially an object that allows you to interact with various Wix APIs.
  Creating a Wix client is necessary because it provides a structured way to interact with Wix APIs.
  It handles the details of making requests to the APIs and processing the responses.
  This allows you to focus on the logic of your application rather than the details of the API.
 */
const myWixClient = createClient({
    // We're using the OAuthStrategy for authentication.
    // This strategy requires a client ID and a set of tokens.
    auth: OAuthStrategy({
        // The client ID is a unique identifier for the application.
        // It's used to authenticate the application with the Wix platform.
        // This is a public sample test key.
        // Sign in to add your own key in code sample and see your site data
        clientId: `9e37d7b0-3621-418f-a6b6-b82bdeaf051d`,

        // After creating a Wix client, it can generate, manage, and use tokens. These tokens, even for anonymous site visitors, are used for authentication when interacting with Wix APIs.
        // In this case, we're getting the tokens from a cookie named "session".
        // If the "session" cookie doesn't exist, the tokens default to null, indicating no authentication tokens are available.
        tokens: JSON.parse(Cookies.get("session") || null),
    }),
});

export default function LoginCallback() {
    const [nextPage, setNextPage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    // This function is responsible for the final steps of the OAuth login process.
    // It retrieves OAuth data, exchanges code for tokens, stores tokens, and handles redirection or error scenarios.
    async function verifyLogin() {
        // We retrieve the OAuth data from the local storage.
        // This data was stored there during the login process.
        const data = JSON.parse(localStorage.getItem("oauthRedirectData"));

        // This line of code removes the OAuth data from local storage after it's no longer needed, to prevent unnecessary storage usage.
        // It also enhances security by ensuring sensitive authentication data isn't left accessible in the user's browser.
        localStorage.removeItem("oauthRedirectData");

        try {
            // This code is extracting the 'code' and 'state' parameters from the current URL.
            // These parameters were added to the URL during the OAuth process and are being used to exchange for tokens.
            const {code, state} = myWixClient.auth.parseFromUrl();

            // We call the getMemberTokens method from the auth module of the Wix client.
            // This method exchanges the code and state for a set of tokens.
            // These tokens are used to authenticate the user.
            const tokens = await myWixClient.auth.getMemberTokens(code, state, data);

            // We store the tokens in a cookie named "session".
            Cookies.set("session", JSON.stringify(tokens));

            // Finally, we redirect the user to the original page they were on before the login process started.
            // If the original page URL doesn't exist, we default to the home page ("/").
            window.location = data?.originalUri || "/";
        } catch (e) {
            // If an error occurs during the process, we update the state of the next page and error message in the React component.
            setNextPage(data?.originalUri || "/");
            setErrorMessage(e.toString());
        }
    }

    // Verify the login when the component mounts.
    useEffect(() => {
        verifyLogin();
    }, []);

    return (
        <article>
            {/* We check if there's an error message. If there is, we display it. */}
            {errorMessage && (
                <>
                    <span>{errorMessage}</span>
                    <br/>
                    <br/>
                </>
            )}
            {/* We check if there's a nextPage. If there is, we display a link to it.
            If there isn't, we display a loading message. */}
            {nextPage ? <a href={nextPage}>Continue</a> : <>Loading...</>}
        </article>
    );
}
