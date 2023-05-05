import { createClient, OAuthStrategy } from '@wix/api-client';
import { NextResponse } from 'next/server';

export async function middleware(request) {
  const response = NextResponse.next();
  let tokens = request.cookies.get('session')?.value;
  const myWixClient = createClient({
    auth: OAuthStrategy({
      clientId: `10c1663b-2cdf-47c5-a3ef-30c2e8543849`,
      tokens: JSON.parse(tokens || '{}')
    })
  });
  const wixMemberLoggedIn = request.nextUrl.searchParams.get('wixMemberLoggedIn');
  if (wixMemberLoggedIn === 'false' && myWixClient.auth.loggedIn()) {
    tokens = null;
  }
  if (!tokens) {
    tokens = JSON.stringify(await myWixClient.auth.generateVisitorTokens());
    response.cookies.set('session', tokens);
  }
  response.headers.set('x-wix-session', tokens);
  return response;
}