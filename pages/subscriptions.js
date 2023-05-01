import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { Inter } from 'next/font/google'
import { useEffect, useState } from 'react';

import { createClient, OAuthStrategy } from '@wix/api-client';
import { plans } from '@wix/pricing-plans';
import { redirects } from '@wix/redirects';

const inter = Inter({ subsets: ['latin'] })

const myWixClient = createClient({
  modules: { plans, redirects },
  auth: OAuthStrategy({ clientId: `10c1663b-2cdf-47c5-a3ef-30c2e8543849` })
});

export default function Home() {
  return (
    <>
      <Head>
        <title>Wix Headless Subscriptions</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <div className={styles.grid}>
          Hello world!
        </div>
      </main>
    </>
  )
}
