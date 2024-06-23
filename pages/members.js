import Cookies from "js-cookie";
import {useEffect, useState} from "react";

/*
  This line is importing two modules from the Wix SDK.
  createClient is a function used to create a new instance of the Wix client, which is used to interact with the Wix APIs.
  OAuthStrategy is a module that provides a method for authenticating API calls using OAuth tokens.
 */
import {createClient, OAuthStrategy} from "@wix/sdk";
/*
    This line is importing the members module from the Wix Members API.
    The members module provides methods for managing members of a site.
 */
import {members} from "@wix/members";

/*
  A Wix client is an instance created using the createClient function from the Wix SDK.
  It's essentially an object that allows you to interact with various Wix APIs, such as the members module in this case.
  Creating a Wix client is necessary because it provides a structured way to interact with Wix APIs.
  It handles the details of making requests to the APIs and processing the responses.
  This allows you to focus on the logic of your application rather than the details of the API.
 */
const myWixClient = createClient({
    // We specify the modules we want to use with the client.
    // Wix Members allows a site owner to manage members of the site.
    modules: {members},

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
export default function LoginBar() {
    const [member, setMember] = useState(null);

    // This function is responsible for retrieving the current logged-in member's information.
    async function fetchMember() {
        // We check if the user is logged in using the loggedIn method from the auth module of the Wix client.
        // If the user is logged in, we call the getCurrentMember method from the members module of the Wix client.
        // This method retrieves the current member.
        // If the user is not logged in, we default to an empty object.
        const {member} = myWixClient.auth.loggedIn()
            ? await myWixClient.members.getCurrentMember()
            : {};

        // Then, we update the state of the member in the React component.
        // If the member is undefined, we default to undefined.
        setMember(member || undefined);
    }

    // This function initiates the login process.
    async function login() {
        // We call the generateOAuthData method from the auth module of the Wix client.
        // This method generates the necessary data for the OAuth authentication process.
        // We specify the redirect URI, which is the URL to which the user will be sent after they have authenticated on the OAuth server.
        // In this case, the redirect URI is set to the '/login-callback' route on the current origin (the base URL of the current page).
        const data = myWixClient.auth.generateOAuthData(
            `${window.location.origin}/login-callback`,
            window.location.href,
        );

        // We store the generated OAuth data in the local storage.
        // This data will be used later in the authentication process.
        localStorage.setItem("oauthRedirectData", JSON.stringify(data));

        // We call the getAuthUrl method from the auth module of the Wix client.
        // This method generates the URL for the authentication page.
        const {authUrl} = await myWixClient.auth.getAuthUrl(data);

        // Finally, we redirect the user to the authentication page.
        window.location = authUrl; // Wix auth will send the user back to the callback page (login-callback.js)
    }

    // This function initiates the logout process.
    async function logout() {
        // We call the logout method from the auth module of the Wix client.
        // This method generates the URL for the logout page.
        // We pass the current page URL as the parameter.
        const {logoutUrl} = await myWixClient.auth.logout(window.location.href);

        // We remove the session cookie.
        // This effectively logs the user out on the client side.
        Cookies.remove("session");

        // Finally, we redirect the user to the logout page.
        window.location = logoutUrl;
    }

    // Fetch the current member when the component mounts.
    useEffect(() => {
        fetchMember();
    }, []);

    return (
        <div>
            {/* We check if the member state is not null. If it's not null, we render a section. */}
            {member !== null && (
                <section
                    // When the section is clicked, we check if the user is logged in.
                    // If the user is logged in, we call the logout function.
                    // If the user is not logged in, we call the login function.
                    onClick={() => (myWixClient.auth.loggedIn() ? logout() : login())}
                >
                    <h3>
                        {/* We display a greeting message. */}
                        Hello{" "}
                        {/* If the user is logged in, we display the user's nickname or slug, if they exist.
                          If neither exist, we display an empty string.
                          If the user is not logged in, we display "visitor". */}
                        {myWixClient.auth.loggedIn()
                            ? member.profile?.nickname || member.profile?.slug || ""
                            : "visitor"}
                        ,
                    </h3>
                    {/* We display a link that allows the user to login or logout.
                    The text of the link depends on whether the user is logged in or not. */}
                    <span>{myWixClient.auth.loggedIn() ? "Logout" : "Login"}</span>
                </section>
            )}
        </div>
    );
}
