import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { Inter } from 'next/font/google'

import '@/styles/globals.css'
import styles from '@/styles/pages.module.css'

import LoginBar from './members';
import Footer from './content';

const inter = Inter({ subsets: ['latin'] });

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Wix Headless Examples</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <div className={styles.content}>
          <div className={styles.header}>
            <Link href="/">
              <Image src="/wix.svg" alt="Wix Logo" width={88} height={34} priority />
            </Link>
            <LoginBar />
          </div>
          <Component {...pageProps} />
        </div>
        <Footer />
      </main>
    </>
  );
}
