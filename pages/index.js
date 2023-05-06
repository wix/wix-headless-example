import styles from '@/styles/pages.module.css'

export default function Home() {
  return (
    <>
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
