import Link from 'next/link'
import styles from '@/styles/style.module.css'
import Cookies from 'js-cookie';

import { createClient, OAuthStrategy } from '@wix/api-client';
import { items } from '@wix/data';
import { useEffect, useState } from 'react';

const myWixClient = createClient({
  modules: { items },
  auth: OAuthStrategy({
    clientId: `10c1663b-2cdf-47c5-a3ef-30c2e8543849`,
    tokens: JSON.parse(Cookies.get('session') || null)
  })
});

export default function Footer() {
  const [examples, setExamples] = useState([]);

  async function fetchExamples() {
    const examples = await myWixClient.items.queryDataItems({ dataCollectionId: 'examples' }).ascending('orderId').find();
    setExamples(examples.items);
  }

  useEffect(() => { fetchExamples(); }, []);

  return (
    <div className={styles.grid}>
      {examples.map((example) => (
        <Link href={example.data.slug} className={styles.card} key={example._id}>
          <h2>{example.data.title} <span>-&gt;</span></h2>
          <p>{example.data.description}</p>
        </Link>
      ))}
    </div>
  )
}
