import Head from 'next/head'
import Link from 'next/link'
import '@/styles/globals.css'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'

import { createClient, OAuthStrategy } from '@wix/api-client';
import { collections, items } from '@wix/data';
import { useEffect, useState } from 'react'

const myWixClient = createClient({
  modules: { collections, items },
  auth: OAuthStrategy({ clientId: `10c1663b-2cdf-47c5-a3ef-30c2e8543849` })
});

const inter = Inter({ subsets: ['latin'] });

export default function App({ Component, pageProps }) {
  const [examples, setExamples] = useState([]);

  async function fetchExamples() {
    const examples = await myWixClient.items.queryDataItems({ dataCollectionId: 'examples' }).ascending('orderId').find();
    setExamples(examples.items);
  }

  useEffect(() => { fetchExamples(); }, []);

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
          {examples.map((example) => (
            <Link href={example.data.slug} className={styles.card} key={example._id}>
              <h2>{example.data.title} <span>-&gt;</span></h2>
              <p>{example.data.description}</p>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
