import Cookies from "js-cookie";
import { useEffect, useState } from "react";

import { createClient, OAuthStrategy } from "@wix/sdk";
import { wixEventsV2 as wixEvents, orders as checkout } from "@wix/events";
import { redirects } from "@wix/redirects";
import testIds from "@/src/utils/test-ids";

const myWixClient = createClient({
  modules: { wixEvents, checkout, redirects },
  auth: OAuthStrategy({
    clientId: `a491d07a-24a9-4b64-a566-0525c26a081b`,
    tokens: JSON.parse(Cookies.get("session") || null),
  }),
});

export default function Tickets() {
  const [eventsList, setEventsList] = useState([]);
  const [ticketsAvailability, setTicketsAvailability] = useState([]);

  async function fetchEvents() {
    const eventsList = await myWixClient.wixEvents
      .queryEvents()
      .limit(10)
      .find();
    setEventsList(eventsList.items);
  }

  async function fetchTicketsAvailability(event) {
    const tickets = await myWixClient.checkout.queryAvailableTickets({
      filter: { eventId: event._id },
      limit: 10,
    });
    setTicketsAvailability(tickets.definitions);
  }

  async function createRedirect(ticket) {
    const eventSlug = eventsList.find(
      (event) => event._id === ticket.eventId
    ).slug;
    const reservation = await myWixClient.checkout.createReservation(
      ticket.eventId,
      {
        ticketQuantities: [
          {
            ticketDefinitionId: ticket._id,
            quantity: 1,
          },
        ],
      }
    );
    const redirect = await myWixClient.redirects.createRedirectSession({
      eventsCheckout: { eventSlug, reservationId: reservation._id },
      callbacks: { postFlowUrl: window.location.href },
    });
    window.location = redirect.redirectSession.fullUrl;
  }

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <main data-testid={testIds.EVENTS_PAGE.CONTAINER}>
      <div>
        <h2>Choose an Event:</h2>
        {eventsList.map((event) => {
          return (
            <section
              key={event._id}
              data-testid={testIds.EVENTS_PAGE.EVENT}
              onClick={() => fetchTicketsAvailability(event)}
            >
              {event.title}
            </section>
          );
        })}
      </div>
      <div>
        <h2>Choose a Ticket:</h2>
        {ticketsAvailability.map((ticket) => {
          return (
            <section
              key={ticket._id}
              data-testid={testIds.EVENTS_PAGE.TICKET_OPTION}
              onClick={() => createRedirect(ticket)}
            >
              {ticket.name}
            </section>
          );
        })}
      </div>
    </main>
  );
}
