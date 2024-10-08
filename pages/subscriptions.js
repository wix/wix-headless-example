import Cookies from "js-cookie";
import {useEffect, useState} from "react";

import {createClient, OAuthStrategy} from "@wix/sdk";
import {plans} from "@wix/pricing-plans";
import {redirects} from "@wix/redirects";
import testIds from "@/src/utils/test-ids";
import {CLIENT_ID} from "@/constants/constants";
import Link from "next/link";
import styles from "@/styles/app.module.css";
import {useAsyncHandler} from "@/src/hooks/async-handler";
import {useClient} from "@/internal/providers/client-provider";

// We're creating a Wix client using the createClient function from the Wix SDK.
const myWixClient = createClient({
    // We specify the modules we want to use with the client.
    // In this case, we're using the plans and redirects modules.
    modules: {plans, redirects},

    // We're using the OAuthStrategy for authentication.
    // This strategy requires a client ID and a set of tokens.
    auth: OAuthStrategy({
        // The client ID is a unique identifier for the application.
        // It's used to authenticate the application with the Wix platform.
        clientId: CLIENT_ID,

        // The tokens are used to authenticate the user.
        // In this case, we're getting the tokens from a cookie named "session".
        // If the cookie doesn't exist, we default to null.
        tokens: JSON.parse(Cookies.get("session") || null),
    }),
});

export default function Subscriptions() {
    // State variable to store the list of plans.
    const [planList, setPlanList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [chosenPlan, setChosenPlan] = useState(null);
    const handleAsync = useAsyncHandler();
    const {msid} = useClient();

    // This function fetches a list of public plans.
    async function fetchPlans() {
        setIsLoading(true);
        try {
            await handleAsync(async () => {
                // We call the queryPublicPlans method from the plans module of the Wix client.
                // This method retrieves a list of public plans.
                // Public plans are visible plans that site visitors can see on the site and purchase.
                const planList = await myWixClient.plans.queryPublicPlans().find();

                // Then, we update the state of the plan list in the React component.
                setPlanList(planList.items);
            });
        } catch (error) {
            console.error("Error fetching plans", error);
        } finally {
            setIsLoading(false);
        }
    }

    // This function creates a redirect to the checkout page for a specific plan.
    async function createRedirect(plan) {
        await handleAsync(async () => {
            // We call the createRedirectSession method from the redirects module of the Wix client.
            // This method creates a redirect session to the checkout page.
            // We pass an object that specifies the plan ID for the paidPlansCheckout.
            // We also specify the postFlowUrl to be the current page URL. This is where the user will be redirected after the checkout flow.
            const redirect = await myWixClient.redirects.createRedirectSession({
                paidPlansCheckout: {planId: plan._id},
                callbacks: {postFlowUrl: window.location.href},
            });
            // We set the chosen plan in the state variable.
            setChosenPlan(plan._id);

            // Finally, we redirect the user to the URL generated by the redirect session.
            window.location = redirect.redirectSession.fullUrl;
        });
    }

    // Fetch the list of plans when the component mounts.
    useEffect(() => {
        fetchPlans();
    }, []);

    return (
        <main data-testid={testIds.SUBSCRIPTIONS_PAGE.CONTAINER}>
            <div>
                <h2>Choose a Plan:</h2>
                {isLoading ? (
                    <p>Loading plans...</p>
                ) : planList.length > 0 ? (
                    planList.map((plan) => {
                        return (
                            <section
                                key={plan._id}
                                data-testid={testIds.SUBSCRIPTIONS_PAGE.PRICING_PLAN}
                                className={styles.selectable}
                                // When the section is clicked, we create a redirect to the checkout page for the plan.
                                onClick={() => createRedirect(plan)}
                                style={{
                                    background:
                                        plan._id === chosenPlan && "rgba(var(--card-rgb), 0.1)",
                                    border:
                                        plan._id === chosenPlan &&
                                        "1px solid rgba(var(--card-border-rgb), 0.15)",
                                }}
                            >
                                {/* We display the name of the plan. */}
                                {plan.name}
                            </section>
                        );
                    })
                ) : (
                    <div>
                        <p>No plans available.</p>
                        <Link
                            href={`https://manage.wix.com/dashboard/${msid}/pricing-plans`}
                            rel="noopener noreferrer"
                            target="_blank"
                            style={{textDecoration: "underline", color: "#0070f3"}}
                        >
                            Create a plan
                        </Link>
                    </div>
                )}
            </div>
        </main>
    );
}
