import Cookies from 'js-cookie';

import { createClient, OAuthStrategy } from '@wix/api-client';

const myWixClient = createClient({
  auth: OAuthStrategy({
    clientId: `10c1663b-2cdf-47c5-a3ef-30c2e8543849`,
    tokens: JSON.parse(Cookies.get('session') || '{}')
  })
});

async function verifyLogin() {
  if (typeof window !== 'undefined') {
    const { code, state } = myWixClient.auth.parseFromUrl();
    const data = JSON.parse(localStorage.getItem('oauthRedirectData'));
    localStorage.removeItem('oauthRedirectData');

    try {
      const tokens = await myWixClient.auth.getMemberTokens(code, state, data);
      myWixClient.auth.setTokens(tokens);
      Cookies.set('session', JSON.stringify(myWixClient.auth.getTokens()));
    } catch {
      //
    }
    window.location = data?.originalUri || '/';
  }
}

verifyLogin();

export default function Home() {
  return <>...</>;
}