import Cookies from "js-cookie";
import {useEffect, useState} from "react";

/*
  This line is importing two modules from the Wix SDK.
  createClient is a function used to create a new instance of the Wix client, which is used to interact with the Wix APIs.
  OAuthStrategy is a module that provides a method for authenticating API calls using OAuth tokens.
 */
import {createClient, OAuthStrategy} from "@wix/sdk";
/*
  This line is importing two modules from the Wix Bookings API.
  availabilityCalendar is a module that provides methods for managing the availability calendar of a service.
  services is a module that provides methods for managing the services that can be booked.
 */
import {availabilityCalendar, services} from "@wix/bookings";
/*
    This line is importing the redirects' module.
    The redirects module provides methods for managing URL redirects to Wix pages.
 */
import {redirects} from "@wix/redirects";

import testIds from "@/src/utils/test-ids";

/*
  A Wix client is an instance created using the createClient function from the Wix SDK.
  It's essentially an object that allows you to interact with various Wix APIs, such as the services, availabilityCalendar, and redirects modules in this case.
  Creating a Wix client is necessary because it provides a structured way to interact with Wix APIs.
  It handles the details of making requests to the APIs and processing the responses.
  This allows you to focus on the logic of your application rather than the details of the API.
 */
const myWixClient = createClient({
    // We specify the modules we want to use with the client.
    // Wix Bookings allows a business owner to set up a system to manage bookings for services. So in this case we're using the services, availabilityCalendar, and redirects modules.
    // We also use the redirects module to eventually create a redirect to the checkout page.
    modules: {services, availabilityCalendar, redirects},

    // We're using the OAuthStrategy for authentication.
    // This strategy requires a client ID and a set of tokens.
    auth: OAuthStrategy({
        // The client ID is a unique identifier for the application.
        // It's used to authenticate the application with the Wix platform.
        // This is a public sample test key.
        // Sign in to add your own key in code sample and see your site data
        clientId: `9e37d7b0-3621-418f-a6b6-b82bdeaf051d`,

        // After creating a Wix client, it can generate, manage, and use tokens. These tokens, even for anonymous site visitors, are used for authentication when interacting with Wix APIs.
        // In this case, we're getting the tokens from a cookie named "session".
        // If the "session" cookie doesn't exist, the tokens default to null, indicating no authentication tokens are available.
        tokens: JSON.parse(Cookies.get("session") || null),
    }),
});

export default function Booking() {
    const [serviceList, setServiceList] = useState([]);
    const [availabilityEntries, setAvailabilityEntries] = useState([]);

    // This is function fetches the list of the services available.
    async function fetchServices() {
        // We call the queryServices method from the services module of the Wix client.
        // This method retrieves the list of services.
        const serviceList = await myWixClient.services.queryServices().find();

        // Then, we update the state of the service list in the React component.
        setServiceList(serviceList.items);
    }

    // This is function fetches the availability of a service.
    async function fetchAvailability(service) {
        // In this example, we're fetching the availability up to the next day.
        // You can adjust the date range as needed.
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // This method retrieves the availability of a service.
        // We call the queryAvailability method from the availabilityCalendar module of the Wix client.
        const availability =
            await myWixClient.availabilityCalendar.queryAvailability(
                {
                    filter: {
                        serviceId: [service._id], // We filter by the service ID.
                        startDate: today.toISOString(), // We set the start date to be today.
                        endDate: tomorrow.toISOString(), // We set the end date to be tomorrow.
                    },
                },
                {timezone: "UTC"}, // We set the timezone to be UTC.
            ); // the response contains the availability entries for the service within the specified time range.

        // Then, we update the state of the availability entries in the React component.
        setAvailabilityEntries(availability.availabilityEntries);
    }

    // We recommend you use the Wix-managed checkout page. This function creates a redirect to the checkout page.
    async function createRedirect(slotAvailability) {
        // We call the createRedirectSession method from the redirects module of the Wix client.
        // This method creates a redirect session to the checkout page.
        const redirect = await myWixClient.redirects.createRedirectSession({
            // We pass an object that specifies the slotAvailability for the bookingsCheckout.
            bookingsCheckout: {slotAvailability, timezone: "UTC"},
            // We also specify the postFlowUrl to be the current page URL. This is where the user will be redirected after the checkout flow.
            callbacks: {postFlowUrl: window.location.href},
        });

        // Finally, we redirect the user to the URL generated by the redirect session.
        window.location = redirect.redirectSession.fullUrl;
    }

    // Fetch services on component mount
    useEffect(() => {
        fetchServices();
    }, []);

    return (
        <main data-testid={testIds.BOOKINGS_PAGE.CONTAINER}>
            <div>
                <h2>Choose a Service:</h2>
                {/* Mapping through service list and displaying each service */}
                {serviceList.map((service) => {
                    return (
                        // Each service is displayed in a section. When clicked, the availability of the service is fetched.
                        <section
                            key={service._id}
                            data-testid={testIds.BOOKINGS_PAGE.SERVICE}
                            onClick={() => fetchAvailability(service)}
                        >
                            {service.name}
                        </section>
                    );
                })}
            </div>
            <div>
                <h2>Choose a Slot:</h2>
                {/* Mapping through availability entries and displaying each slot */}
                {availabilityEntries.map((entry) => {
                    return (
                        // Each slot is displayed in a section. When clicked, a redirect to the checkout page is created.
                        <section
                            key={entry.slot.startDate}
                            data-testid={testIds.BOOKINGS_PAGE.SLOT}
                            onClick={() => createRedirect(entry)}
                        >
                            {new Date(entry.slot.startDate).toLocaleString()}
                        </section>
                    );
                })}
            </div>
        </main>
    );
}
