import { createClient, OAuthStrategy } from "@wix/sdk";
import { NextResponse } from "next/server";

export async function middleware(request) {
  // generate a session for the visitor if no session exists
  if (!request.cookies.get("session")) {
    const myWixClient = createClient({
      auth: OAuthStrategy({ clientId: `a491d07a-24a9-4b64-a566-0525c26a081b` }),
    });
    const visitorTokens = await myWixClient.auth.generateVisitorTokens();

    request.cookies.set("session", JSON.stringify(visitorTokens));
    const response = NextResponse.next({
      request,
    });

    response.cookies.set("session", JSON.stringify(visitorTokens));
    return response;
  }
}

export const config = {
  unstable_allowDynamic: [
    "**/node_modules/lodash/lodash.js",
    "**/node_modules/lodash/_root.js",
  ],
};
