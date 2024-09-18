import {CLIENT_ID} from "@/constants/constants";
import {createClient, OAuthStrategy} from "@wix/sdk";
import {redirects} from "@wix/redirects";
import Cookies from "js-cookie";
import {availabilityCalendar, services} from "@wix/bookings";
import {products} from "@wix/stores";
import {currentCart} from "@wix/ecom";
import {plans} from "@wix/pricing-plans";
import {orders as checkout, wixEventsV2 as wixEvents} from "@wix/events";
import {jwtDecode} from "jwt-decode";

// Enum for Wix applications
export const WixApplications = Object.freeze({
    BOOKINGS: 0,
    STORE: 1,
    EVENTS: 2,
    SUBSCRIPTIONS: 3,
});

// Function to create a Wix client with specified modules and OAuth authentication
const createWixClient = () => {
    return createClient({
        modules: {
            services,
            availabilityCalendar,
            redirects,
            products,
            currentCart,
            plans,
            checkout,
            wixEvents,
        },
        auth: OAuthStrategy({
            clientId: CLIENT_ID,
            tokens: JSON.parse(Cookies.get("session") || "null"),
        }),
    });
};

// Function to check if an app is installed
const checkAppInstallation = async (client, queryFunction, appType) => {
    try {
        const result = await queryFunction();
        return result ? [appType] : [];
    } catch (error) {
        return [];
    }
};

// Function to get the list of installed apps
export const installedApps = async () => {
    const myWixClient = createWixClient();

    const appChecks = [
        checkAppInstallation(
            myWixClient,
            () => myWixClient.services.queryServices().find(),
            WixApplications.BOOKINGS,
        ),
        checkAppInstallation(
            myWixClient,
            () => myWixClient.products.queryProducts().find(),
            WixApplications.STORE,
        ),
        checkAppInstallation(
            myWixClient,
            () => myWixClient.wixEvents.queryEvents().find(),
            WixApplications.EVENTS,
        ),
        checkAppInstallation(
            myWixClient,
            () => myWixClient.plans.queryPublicPlans().find(),
            WixApplications.SUBSCRIPTIONS,
        ),
    ];

    const results = await Promise.all(appChecks);
    return results.flat();
};

// Function to get the meta site ID
export const getMetaSiteId = async () => {
    const myWixClient = createWixClient();
    const session = Cookies.get("session");
    let tokens;
    if (!session) {
        tokens = await myWixClient.auth.generateVisitorTokens();
    } else {
        tokens = JSON.parse(session);
    }
    try {
        const {data} = jwtDecode(parseJwt(tokens?.accessToken?.value));
        const parsedData = JSON.parse(data);
        return parsedData.instance.metaSiteId;
    } catch (error) {
        console.error("Error getting meta site ID", error);
        return null;
    }
};

// Function to parse JWT token
const parseJwt = (token) => {
    return token.replace(/^OauthNG\.JWS\./, "");
};
