import { createClient, OAuthStrategy } from '@wix/sdk';
import { NextResponse } from 'next/server';

export async function middleware(request) {
  // generate a session for the visitor if no session exists
  if (!request.cookies.get('session')) {
    const response = NextResponse.next();
    const myWixClient = createClient({ auth: OAuthStrategy({ clientId: `10c1663b-2cdf-47c5-a3ef-30c2e8543849` }) });
    response.cookies.set('session', JSON.stringify(await myWixClient.auth.generateVisitorTokens()));
    return response;
  }
}

export const config = {
  unstable_allowDynamic: [
    '**/node_modules/lodash/lodash.js',
    '**/node_modules/lodash/_root.js',
  ],
};
