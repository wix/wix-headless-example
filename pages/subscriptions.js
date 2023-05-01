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

export default function Subscriptions() {
  const [planList, setPlanList] = useState([]);

  async function fetchPlans() {
    const planList = await myWixClient.plans.queryPublicPlans().find();
    setPlanList(planList.items);
  }

  async function createRedirect(plan) {
    const redirect = await myWixClient.redirects.createRedirectSession({
      paidPlansCheckout: { planId: plan._id },
    });
    window.location = redirect.redirectSession.fullUrl;
  }

  useEffect(() => { fetchPlans(); }, []);

  return (
    <>
      <Head>
        <title>Wix Headless Subscriptions</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <div className={styles.grid}>
          <div>
            <h2>Choose Plan:</h2>
            {planList.map((plan) => {
              return <div className={styles.card} key={plan._id} onClick={() => createRedirect(plan)}>{plan.name}</div>;
            })}
          </div>
        </div>
      </main>
    </>
  )
}
