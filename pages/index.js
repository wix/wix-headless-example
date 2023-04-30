import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Head>
        <title>Wix Headless Examples</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <div className={styles.description}>
          <p>Quick start examples for Wix Headless</p>
          <div>
            <a href="https://wix.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app">
              By{' '}
              <Image src="/wix.svg" alt="Wix Logo" className={styles.vercelLogo} width={88} height={34} priority />
            </a>
          </div>
        </div>

        <div className={styles.center}>
          <Image className={styles.logo} src="/next.svg" alt="Next.js Logo" width={180} height={37} priority />
        </div>

        <div className={styles.grid}>
          <a href="/booking" className={styles.card}>
            <h2>Booking <span>-&gt;</span></h2>
            <p>Blah blah.</p>
          </a>
          <a href="/store" className={styles.card}>
            <h2>Store <span>-&gt;</span></h2>
            <p>Blah blah.</p>
          </a>
          <a href="/tickets" className={styles.card}>
            <h2>Tickets <span>-&gt;</span></h2>
            <p>Blah blah.</p>
          </a>
          <a href="/subscriptions" className={styles.card}>
            <h2>Subscriptions <span>-&gt;</span></h2>
            <p>Blah blah.</p>
          </a>
        </div>
      </main>
    </>
  )
}
