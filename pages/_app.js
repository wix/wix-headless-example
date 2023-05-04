import Head from 'next/head'
import Link from 'next/link'
import '@/styles/globals.css'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'

import { createClient, OAuthStrategy } from '@wix/api-client';
import { collections, items } from '@wix/data';

const myWixClient = createClient({
  modules: { collections, items },
  auth: OAuthStrategy({ clientId: `10c1663b-2cdf-47c5-a3ef-30c2e8543849` })
});

const inter = Inter({ subsets: ['latin'] });

// myWixClient.items.queryDataItems({ dataCollectionId: 'examples' }).find().then(records => {
//   console.log(records);
// });

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Wix Headless Examples</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <Component {...pageProps} />
        <div className={styles.grid}>
          <Link href="/booking" className={styles.card}>
            <h2>Booking <span>-&gt;</span></h2>
            <p>Blah blah.</p>
          </Link>
          <Link href="/store" className={styles.card}>
            <h2>Store <span>-&gt;</span></h2>
            <p>Blah blah.</p>
          </Link>
          <Link href="/tickets" className={styles.card}>
            <h2>Tickets <span>-&gt;</span></h2>
            <p>Blah blah.</p>
          </Link>
          <Link href="/subscriptions" className={styles.card}>
            <h2>Subscriptions <span>-&gt;</span></h2>
            <p>Blah blah.</p>
          </Link>
        </div>
      </main>
    </>
  );
}
