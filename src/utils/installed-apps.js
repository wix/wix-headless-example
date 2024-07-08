import {CLIENT_ID} from "@/constants/constants";
import {createClient, OAuthStrategy} from "@wix/sdk";
import {redirects} from "@wix/redirects";
import Cookies from "js-cookie";
import {availabilityCalendar, services} from "@wix/bookings";

const fetchToken = async () => {
    try {
        const response = await fetch('https://www.wixapis.com/oauth2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                clientId: CLIENT_ID,
                grantType: 'anonymous',
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.access_token;
    } catch (error) {
        console.error('Error fetching token:', error);
    }
};
export const installedApps = async () => {
    const installedApps = [];
    const myWixClient = createClient({
        // We specify the modules we want to use with the client.
        // In this case, we're using the services, availabilityCalendar, and redirects modules.
        modules: {services, availabilityCalendar, redirects},

        // We're using the OAuthStrategy for authentication.
        // This strategy requires a client ID and a set of tokens.
        auth: OAuthStrategy({
            // The client ID is a unique identifier for the application.
            // It's used to authenticate the application with the Wix platform.
            clientId: CLIENT_ID,

            // The tokens are used to authenticate the user.
            // In this case, we're getting the tokens from a cookie named "session".
            // If the cookie doesn't exist, we default to null.
            tokens: JSON.parse(Cookies.get("session") || null),
        }),
    });
    const plugins = myWixClient.servicePlugins.getRegisteredServicePlugins();
    console.log(plugins);

}