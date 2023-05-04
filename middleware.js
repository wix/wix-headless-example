import { createClient, OAuthStrategy } from '@wix/api-client';
import { NextResponse } from 'next/server';

export async function middleware(request) {
  const response = NextResponse.next();
  if (!request.cookies.get('session')) {
    const myWixClient = createClient({ auth: OAuthStrategy({ clientId: `10c1663b-2cdf-47c5-a3ef-30c2e8543849` }) });
    const tokens = await myWixClient.auth.generateVisitorTokens();
    response.cookies.set('session', JSON.stringify(tokens));
  }
  return response;
}