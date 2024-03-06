import { createClient, OAuthStrategy } from "@wix/sdk";
import { NextResponse } from "next/server";

export async function middleware(request) {
  // generate a session for the visitor if no session exists
  if (!request.cookies.get("session")) {
    const response = NextResponse.next();
    const myWixClient = createClient({
      auth: OAuthStrategy({ clientId: `a491d07a-24a9-4b64-a566-0525c26a081b` }),
    });
    response.cookies.set(
      "session",
      JSON.stringify(await myWixClient.auth.generateVisitorTokens())
    );
    return response;
  }
}

export const config = {
  unstable_allowDynamic: [
    "**/node_modules/lodash/lodash.js",
    "**/node_modules/lodash/_root.js",
  ],
};
