import styles from '@/styles/Home.module.css'
import Cookies from 'js-cookie';

import { createClient, OAuthStrategy } from '@wix/api-client';
import { members } from '@wix/members';

export async function getServerSideProps({ req }) {
  const tokens = JSON.parse(req.headers['x-wix-session']); // this header is set in middleware.js
  const myWixClient = createClient({
    modules: { members },
    auth: OAuthStrategy({ clientId: `10c1663b-2cdf-47c5-a3ef-30c2e8543849`, tokens })
  });
  const { member } = myWixClient.auth.loggedIn() ? await myWixClient.members.getMyMember() : {};
  return { props: { tokens, member: member || null } };
}

export default function Store({ tokens, member }) {
  const myWixClient = createClient({
    auth: OAuthStrategy({ clientId: `10c1663b-2cdf-47c5-a3ef-30c2e8543849`, tokens })
  });

  async function login() {
    const data = myWixClient.auth.generateOAuthData(`${window.location.origin}/login-callback`, window.location.href);
    localStorage.setItem('oauthRedirectData', JSON.stringify(data));
    const { authUrl } = await myWixClient.auth.getAuthUrl(data);
    window.location = authUrl; // wix auth will send the user back to the callback page (login-callback.js)
  }

  async function logout() {
    const { logoutUrl } = await myWixClient.auth.logout(window.location.href);
    Cookies.remove('session');
    window.location = logoutUrl;
  }

  return (
    <div className={styles.grid}>
      <div>
        <h2>Auth:</h2>
        <div className={styles.card} onClick={() => myWixClient.auth.loggedIn() ? logout() : login()}>
          <h3>Hello {myWixClient.auth.loggedIn() ? member?.profile?.nickname || member?.profile?.slug || '' : 'visitor'},</h3>
          <span>{myWixClient.auth.loggedIn() ? 'Logout' : 'Login'}</span>
        </div>
      </div>
    </div>
  )
}
