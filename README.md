# Wix Headless Examples

This [Next.js](https://nextjs.org/) project provides a minimal example site to demonstrate basic usage of various Wix Headless APIs. The implementation focuses on simplicity and readability, rather than feature richness, performance, or completeness. This repository can be used as a quick reference for bootstrapping a Wix Headless application, but it should not be treated as a best practices guide.

For a more comprehensive example of Wix Headless integration, we recommend checking out our [stater templates](https://www.wix.com/developers/headless/templates).

You can view the latest version of this repo deployed at [https://wix-headless-example.vercel.app/](https://wix-headless-example.vercel.app/), but we recommend cloning it and experimenting with it locally.

## Getting Started

First, run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

The following files demonstrate the usage of various Wix Headless APIs:

* Authentication: 
  * Login/Logout button: [pages/members.js](./pages/members.js)
  * Login callback page: [pages/login-callback.js](./pages/login-callback.js)
  * Visitor cookie generation: [middleware.js](./middleware.js)
* Headless CMS: [pages/content.js](./pages/content.js)
* Headless Bookings: [pages/booking.js](./pages/booking.js)
* Headless Store: [pages/store.js](./pages/store.js)
* Headless Tickets: [pages/tickets.js](./pages/tickets.js)
* Headless Subscriptions: [pages/subscriptions.js](./pages/subscriptions.js)