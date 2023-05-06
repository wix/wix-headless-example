# Wix Headless Examples

This is a [Next.js](https://nextjs.org/) project demonstrating (extremely) basic/naive usage of Wix Headless APIs.
In implementing the examples here we greatly preferred simplicity and readability over feature richness, performance and completeness.
It can be a good reference for creating quickly bootstrapping a Wix Headless application, but should not be a reference for best practice usage.

For a deeper example of how to integrate with Wix headless we recommend looking into our [stater templates](https://www.wix.com/developers/headless/templates)

The latest version of this repo is deployed at: [https://wix-headless-example.vercel.app/](https://wix-headless-example.vercel.app/) but we recommend cloning it and playing with it locally.

## Getting Started

First, run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The following files demonstrate usage of Wix Headless APIs:
* Authentication: [pages/members.js](./pages/members.js)
* Headless CMS: [pages/content.js](./pages/content.js)
* Headless Booking: [pages/booking.js](./pages/booking.js)
* Headless Store: [pages/store.js](./pages/store.js)
* Headless Tickets: [pages/tickets.js](./pages/tickets.js)
* Headless Subscriptions: [pages/subscriptions.js](./pages/subscriptions.js)
