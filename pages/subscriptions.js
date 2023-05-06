import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import styles from '@/styles/pages.module.css'

import { createClient, OAuthStrategy } from '@wix/api-client';
import { plans } from '@wix/pricing-plans';
import { redirects } from '@wix/redirects';

const myWixClient = createClient({
  modules: { plans, redirects },
  auth: OAuthStrategy({
    clientId: `10c1663b-2cdf-47c5-a3ef-30c2e8543849`,
    tokens: JSON.parse(Cookies.get('session') || null)
  })
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
      callbacks: { postFlowUrl: window.location.href }
    });
    window.location = redirect.redirectSession.fullUrl;
  }

  useEffect(() => { fetchPlans(); }, []);

  return (
    <div className={styles.grid}>
      <div>
        <h2>Choose Plan:</h2>
        {planList.map((plan) => {
          return <div className={styles.card} key={plan._id} onClick={() => createRedirect(plan)}>{plan.name}</div>;
        })}
      </div>
    </div>
  )
}
