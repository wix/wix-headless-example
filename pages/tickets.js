import Cookies from "js-cookie";
import {useEffect, useState} from "react";

/*
  This line is importing two modules from the Wix SDK.
  createClient is a function used to create a new instance of the Wix client, which is used to interact with the Wix APIs.
  OAuthStrategy is a module that provides a method for authenticating API calls using OAuth tokens.
 */
import {createClient, OAuthStrategy} from "@wix/sdk";
/*
    This line is importing two modules from the Wix Events API.
    orders is a module that provides methods for managing orders for events.
    wixEventsV2 is a module that provides methods for managing events.
 */
import {orders as checkout, wixEventsV2 as wixEvents} from "@wix/events";
/*
    This line is importing the redirects' module.
    The redirects module provides methods for managing URL redirects.
 */
import {redirects} from "@wix/redirects";

import testIds from "@/src/utils/test-ids";

/*
  A Wix client is an instance created using the createClient function from the Wix SDK.
  It's essentially an object that allows you to interact with various Wix APIs, such as the wixEvents, checkout, and redirects modules in this case.
  Creating a Wix client is necessary because it provides a structured way to interact with Wix APIs.
  It handles the details of making requests to the APIs and processing the responses.
  This allows you to focus on the logic of your application rather than the details of the API.
 */
const myWixClient = createClient({
    // We specify the modules we want to use with the client.
    // In this case, we're using the wixEvents, checkout, and redirects modules.
    // We also use the redirects module to eventually create a redirect to the checkout page.
    modules: {wixEvents, checkout, redirects},

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

export default function Tickets() {
    const [eventsList, setEventsList] = useState([]);
    const [ticketsAvailability, setTicketsAvailability] = useState([]);

    // This is function fetches a list of events.
    async function fetchEvents() {
        // We call the queryEvents method from the wixEvents module of the Wix client.
        // In this case, we're limiting the number of events to 10.
        const eventsList = await myWixClient.wixEvents
            .queryEvents()
            .limit(10)
            .find();

        // Then, we update the state of the events list in the React component.
        setEventsList(eventsList.items);
    }

    // This function fetches the availability of tickets for a specific event.
    async function fetchTicketsAvailability(event) {
        // We call the queryAvailableTickets method from the checkout module of the Wix client.
        // This method retrieves the available tickets for a specific event.
        // We filter the tickets by the event ID and limit the number of tickets to 10.
        const tickets = await myWixClient.checkout.queryAvailableTickets({
            filter: {eventId: event._id},
            limit: 10,
        });

        // Then, we update the state of the tickets availability in the React component.
        setTicketsAvailability(tickets.definitions);
    }

    // This function creates a redirect to the checkout page for a specific ticket.
    async function createRedirect(ticket) {
        // We find the event associated with the ticket from the events list.
        // We're interested in the slug of the event, which is a URL-friendly version of the event name.
        const eventSlug = eventsList.find(
            (event) => event._id === ticket.eventId,
        ).slug;

        // We call the createReservation method from the checkout module of the Wix client.
        // This method creates a reservation for the ticket.
        // We pass the event ID and an object that specifies the quantity of the ticket.
        const reservation = await myWixClient.checkout.createReservation(
            ticket.eventId,
            {
                ticketQuantities: [
                    {
                        ticketDefinitionId: ticket._id,
                        quantity: 1,
                    },
                ],
            },
        );

        // We call the createRedirectSession method from the redirects module of the Wix client.
        // This method creates a redirect session to the checkout page.
        // We pass an object that specifies the event slug and the reservation ID for the eventsCheckout.
        // We also specify the postFlowUrl to be the current page URL. This is where the user will be redirected after the checkout flow.
        const redirect = await myWixClient.redirects.createRedirectSession({
            eventsCheckout: {eventSlug, reservationId: reservation._id},
            callbacks: {postFlowUrl: window.location.href},
        });

        // Finally, we redirect the user to the URL generated by the redirect session.
        window.location = redirect.redirectSession.fullUrl;
    }

    // Fetch events on component mount
    useEffect(() => {
        fetchEvents();
    }, []);

    return (
        <main data-testid={testIds.EVENTS_PAGE.CONTAINER}>
            <div>
                <h2>Choose an Event:</h2>
                {/* We map over the events list and create a section for each event. */}
                {eventsList.map((event) => {
                    return (
                        <section
                            key={event._id}
                            data-testid={testIds.EVENTS_PAGE.EVENT}
                            // When the section is clicked, we fetch the availability of tickets for the event.
                            onClick={() => fetchTicketsAvailability(event)}
                        >
                            {/* We display the title of the event. */}
                            {event.title}
                        </section>
                    );
                })}
            </div>
            <div>
                <h2>Choose a Ticket:</h2>
                {/* We map over the tickets availability list and create a section for each ticket. */}
                {ticketsAvailability.map((ticket) => {
                    return (
                        <section
                            key={ticket._id}
                            data-testid={testIds.EVENTS_PAGE.TICKET_OPTION}
                            // When the section is clicked, we create a redirect to the checkout page for the ticket.
                            onClick={() => createRedirect(ticket)}
                        >
                            {/* We display the name of the ticket. */}
                            {ticket.name}
                        </section>
                    );
                })}
            </div>
        </main>
    );
}
