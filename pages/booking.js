import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';

import { createClient, OAuthStrategy } from '@wix/sdk';
import { availabilityCalendar, services } from '@wix/bookings';
import { redirects } from '@wix/redirects';
import testIds from "@/src/utils/test-ids";

const myWixClient = createClient({
  modules: { services, availabilityCalendar, redirects },
  auth: OAuthStrategy({
    clientId: `10c1663b-2cdf-47c5-a3ef-30c2e8543849`,
    tokens: JSON.parse(Cookies.get('session') || null)
  })
});

export default function Booking() {
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

  async function createRedirect(slotAvailability) {
    const redirect = await myWixClient.redirects.createRedirectSession({
      bookingsCheckout: { slotAvailability, timezone: 'UTC' },
      callbacks: { postFlowUrl: window.location.href }
    });
    window.location = redirect.redirectSession.fullUrl;
  }

  useEffect(() => { fetchServices(); }, []);

  return (
    <main data-testid={testIds.BOOKINGS_PAGE.CONTAINER}>
      <div>
        <h2>Choose a Service:</h2>
        {serviceList.map((service) => {
          return <section key={service._id} data-testid={testIds.BOOKINGS_PAGE.SERVICE}
                          onClick={() => fetchAvailability(service)}>{service.name}</section>;
        })}
      </div>
      <div>
        <h2>Choose a Slot:</h2>
        {availabilityEntries.map((entry) => {
          return <section key={entry.slot.startDate} data-testid={testIds.BOOKINGS_PAGE.SLOT}
                          onClick={() => createRedirect(entry)}>{new Date(entry.slot.startDate).toLocaleString()}</section>;
        })}
      </div>
    </main>
  )
}
