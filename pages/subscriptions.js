import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';

import { createClient, OAuthStrategy } from '@wix/sdk';
import { plans } from '@wix/pricing-plans';
import { redirects } from '@wix/redirects';
import testIds from "@/src/utils/test-ids";

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
    <main data-testid={testIds.SUBSCRIPTIONS_PAGE.CONTAINER}>
      <div>
        <h2>Choose a Plan:</h2>
        {planList.map((plan) => {
          return <section key={plan._id} data-testid={testIds.SUBSCRIPTIONS_PAGE.PRICING_PLAN}
                          onClick={() => createRedirect(plan)}>{plan.name}</section>;
        })}
      </div>
    </main>
  )
}
