import Image from 'next/image'
import styles from '@/styles/Home.module.css'

export default function Home() {
  return (
    <>
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
        <h1>Quick start examples with Next.js for Wix Headless</h1>
        <span>This is an example site to demonstrate how to use Wix&apos;s business solution APIs headless. Click on each example to see how it works.</span>
        <span>
          <a href="https://dev.wix.com/api/sdk/about-wix-headless/overview">Documentation</a>
          &nbsp;|&nbsp;
          <a href="https://github.com/wix-incubator/wix-headless-example">Repo</a>
        </span>
      </div>
    </>
  )
}
