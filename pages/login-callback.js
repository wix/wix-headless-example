import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { createClient, OAuthStrategy } from '@wix/sdk';

const myWixClient = createClient({
  auth: OAuthStrategy({
    clientId: `10c1663b-2cdf-47c5-a3ef-30c2e8543849`,
    tokens: JSON.parse(Cookies.get('session') || null)
  })
});

export default function LoginCallback() {
  const [nextPage, setNextPage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  async function verifyLogin() {
    const data = JSON.parse(localStorage.getItem('oauthRedirectData'));
    localStorage.removeItem('oauthRedirectData');

    try {
      const { code, state } = myWixClient.auth.parseFromUrl();
      const tokens = await myWixClient.auth.getMemberTokens(code, state, data);
      Cookies.set('session', JSON.stringify(tokens));
      window.location = data?.originalUri || '/';
    } catch (e) {
      setNextPage(data?.originalUri || '/');
      setErrorMessage(e.toString());
    }
  }

  useEffect(() => { verifyLogin(); }, []);

  return (
    <article>
      {errorMessage && <><span>{errorMessage}</span><br /><br /></>}
      {nextPage ? <a href={nextPage}>Continue</a> : <>Loading...</>}
    </article>
  );
}
