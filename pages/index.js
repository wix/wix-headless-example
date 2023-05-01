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
        <Image className={styles.logo} src="/next.svg" alt="Next.js Logo" width={180} height={37} priority />
      </div>
    </>
  )
}
