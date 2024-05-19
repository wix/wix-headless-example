import { createClient, OAuthStrategy } from "@wix/sdk";
import { NextResponse } from "next/server";

// This function acts as a middleware for the Next.js application.
// We use this middleware to generate a session for the visitor.
// read more about next.js middleware here https://nextjs.org/docs/app/building-your-application/routing/middleware
export async function middleware(request) {
  // We check if a session cookie exists.
  // If it doesn't exist, we generate a session for the visitor.
  if (!request.cookies.get("session")) {
    // We create a Wix client using the createClient function from the Wix SDK.
    // We're using the OAuthStrategy for authentication.
    // This strategy requires a client ID.
    const myWixClient = createClient({
      auth: OAuthStrategy({ clientId: `9e37d7b0-3621-418f-a6b6-b82bdeaf051d` }),
    });

    // We call the generateVisitorTokens method from the auth module of the Wix client.
    // This method generates a set of tokens for the visitor.
    const visitorTokens = await myWixClient.auth.generateVisitorTokens();

    // We store the tokens in a cookie named "session".
    request.cookies.set("session", JSON.stringify(visitorTokens));

    // We create a new response using the NextResponse.next method.
    const response = NextResponse.next({
      request,
    });

    // We also store the tokens in a cookie named "session" in the response.
    response.cookies.set("session", JSON.stringify(visitorTokens));

    // Finally, we return the response.
    return response;
  }
}

export const config = {
  unstable_allowDynamic: [
    "**/node_modules/lodash/lodash.js",
    "**/node_modules/lodash/_root.js",
  ],
};
