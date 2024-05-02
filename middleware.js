import { createClient, OAuthStrategy } from "@wix/sdk";
import { NextResponse } from "next/server";

export async function middleware(request) {
  // generate a session for the visitor if no session exists
  if (!request.cookies.get("session")) {
    const myWixClient = createClient({
      auth: OAuthStrategy({ clientId: `9e37d7b0-3621-418f-a6b6-b82bdeaf051d` }),
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
