import { createClient, OAuthStrategy } from "@wix/sdk";
import { redirects } from "@wix/redirects";
import Cookies from "js-cookie";
import { CLIENT_ID } from "@/constants/constants";

const wixClient = createClient({
  modules: { redirects },
  auth: OAuthStrategy({
    clientId: CLIENT_ID,
    tokens: JSON.parse(Cookies.get("session") || null),
  }),
});

export async function login(email, password) {
  return wixClient.auth.login({ email, password });
}

export async function logout() {
  return wixClient.auth.logout(window.location.href);
}

export async function isLoggedIn() {
  return wixClient.auth.loggedIn();
}
