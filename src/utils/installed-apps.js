import { CLIENT_ID } from "@/constants/constants";
import { createClient, OAuthStrategy } from "@wix/sdk";
import { redirects } from "@wix/redirects";
import Cookies from "js-cookie";
import { availabilityCalendar, services } from "@wix/bookings";
import { products } from "@wix/stores";
import { currentCart } from "@wix/ecom";
import { plans } from "@wix/pricing-plans";
import { orders as checkout, wixEventsV2 as wixEvents } from "@wix/events";
import { jwtDecode } from "jwt-decode";

export const WixApplications = Object.freeze({
  BOOKINGS: 0,
  STORE: 1,
  EVENTS: 2,
  SUBSCRIPTIONS: 3,
});

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

const checkAppInstallation = async (client, queryFunction, appType) => {
  try {
    const result = await queryFunction();
    return result ? [appType] : [];
  } catch (error) {
    return [];
  }
};

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

export const getMetaSiteId = async () => {
  const myWixClient = createWixClient();
  const accessToken = myWixClient.auth.getTokens().accessToken.value;
  try {
    const { data } = jwtDecode(parseJwt(accessToken));
    const parsedData = JSON.parse(data);
    return parsedData.instance.metaSiteId;
  } catch (error) {
    return null;
  }
};

const parseJwt = (token) => {
  return token.replace(/^OauthNG\.JWS\./, "");
};
