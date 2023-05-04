import Cookies from 'js-cookie';
import { createClient, OAuthStrategy } from '@wix/api-client';
import { useEffect, useState } from 'react';

const myWixClient = createClient({
  auth: OAuthStrategy({
    clientId: `10c1663b-2cdf-47c5-a3ef-30c2e8543849`,
    tokens: JSON.parse(Cookies.get('session') || '{}')
  })
});

export default function Home() {
  const [nextPage, setNextPage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  async function verifyLogin() {
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

    const params = new URLSearchParams(window.location.search);
    if (params.get('error')) {
      setNextPage(data?.originalUri || '/');
      setErrorMessage(`${params.get('error')}: ${params.get('error_description')}`);
    } else {
      window.location = data?.originalUri || '/';
    }
  }

  useEffect(() => { verifyLogin(); }, []);

  return (
    <div>
      {errorMessage && <><span>{errorMessage}</span><br /><br /></>}
      {nextPage ? <a href={nextPage}>Continue</a> : <>Loading...</>}
    </div>
  );
}