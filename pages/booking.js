import Head from 'next/head'
import styles from '@/styles/Home.module.css'

import { createClient, OAuthStrategy } from '@wix/api-client';
import { availabilityCalendar, services } from '@wix/bookings';
import { redirects } from '@wix/redirects';
import { useEffect, useState } from 'react';

const myWixClient = createClient({
  modules: { services, availabilityCalendar, redirects },
  auth: OAuthStrategy({ clientId: `10c1663b-2cdf-47c5-a3ef-30c2e8543849` })
});

export default function Home() {
  const [serviceList, setServiceList] = useState([]);
  const [availabilityEntries, setAvailabilityEntries] = useState([]);

  async function fetchServices() {
    const serviceList = await myWixClient.services.queryServices().find();
    setServiceList(serviceList.items);
  }

  async function fetchAvailability(service) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const availability = await myWixClient.availabilityCalendar.queryAvailability({
      filter: { serviceId: [service._id], startDate: today.toISOString(), endDate: tomorrow.toISOString() }
    }, { timezone: 'UTC' });
    setAvailabilityEntries(availability.availabilityEntries);
  }

  async function createRedirect(entry) {
    const redirect = await myWixClient.redirects.createRedirectSession({
      bookingsCheckout: { serviceId: entry.slot.serviceId, slotAvailability: entry, timezone: 'UTC' }
    });
    window.location = redirect.redirectSession.fullUrl;
  }

  useEffect(() => { fetchServices(); });

  return (
    <>
      <Head>
        <title>Wix Headless Booking</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${styles.grid}`}>
        <a href="#">
          {serviceList.map((service) => <p key={service._id} onClick={() => fetchAvailability(service)}>{service.name}</p>)}
        </a>
        <a href="#">
          {availabilityEntries.map((entry) => <p key={entry.slot.startDate} onClick={() => createRedirect(entry)}>{entry.slot.startDate}</p>)}
        </a>
      </main>
    </>
  )
}
