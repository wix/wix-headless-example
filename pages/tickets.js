import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { Inter } from 'next/font/google'
import { useEffect, useState } from 'react';

import { createClient, OAuthStrategy } from '@wix/api-client';
import { wixEvents, checkout } from '@wix/events';
import { redirects } from '@wix/redirects';

const inter = Inter({ subsets: ['latin'] })

const myWixClient = createClient({
  modules: { wixEvents, checkout, redirects },
  auth: OAuthStrategy({ clientId: `10c1663b-2cdf-47c5-a3ef-30c2e8543849` })
});

export default function Tickets() {
  const [eventsList, setEventsList] = useState([]);
  const [ticketsAvailability, setTicketsAvailability] = useState([]);

  async function fetchEvents() {
    const eventsList = await myWixClient.wixEvents.queryEventsV2({ query: { paging: { limit: 10 } } });
    setEventsList(eventsList.events);
  }

  async function fetchTicketsAvailability(event) {
    const tickets = await myWixClient.checkout.queryAvailableTickets({
      filter: { eventId: event._id },
      limit: 10,
    });
    setTicketsAvailability(tickets.definitions);
  }

  async function createRedirect(ticket) {
    const eventSlug = eventsList.find((event) => event._id === ticket.eventId).slug;
    const reservation = await myWixClient.checkout.createReservation(ticket.eventId, {
      ticketQuantities: [{
        ticketDefinitionId: ticket._id,
        quantity: 1,
      }],
    });
    const redirect = await myWixClient.redirects.createRedirectSession({
      eventsCheckout: { eventSlug, reservationId: reservation._id }
    });
    window.location = redirect.redirectSession.fullUrl;
  }

  useEffect(() => { fetchEvents(); }, []);

  return (
    <>
      <Head>
        <title>Wix Headless Tickets</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <div className={styles.grid}>
          <div>
            <h2>Choose Event:</h2>
            {eventsList.map((event) => {
              return <div className={styles.card} key={event._id} onClick={() => fetchTicketsAvailability(event)}>{event.title}</div>;
            })}
          </div>
          <div>
            <h2>Choose Tickets:</h2>
            {ticketsAvailability.map((ticket) => {
              return <div className={styles.card} key={ticket._id} onClick={() => createRedirect(ticket)}>{ticket.name}</div>;
            })}
          </div>
        </div>
      </main>
    </>
  )
}
