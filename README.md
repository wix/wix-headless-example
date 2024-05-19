# Wix Headless Examples

This [Next.js](https://nextjs.org/) project provides a minimal example site to demonstrate basic usage of various Wix Headless APIs. The implementation focuses on simplicity and readability, rather than feature richness, performance, or completeness. This repository can be used as a quick reference for bootstrapping a Wix Headless application, but it should not be treated as a best practices guide.

For a more comprehensive example of Wix Headless integration, we recommend checking out our [starter templates](https://www.wix.com/developers/headless/templates).

You can view the latest version of this repo deployed at [https://wix-headless-example.vercel.app/](https://wix-headless-example.vercel.app/), but we recommend cloning it and experimenting with it locally.

## Getting Started

First, run the development server:

```bash
yarn
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Wix Headless APIs Usage

This project demonstrates the usage of various Wix Headless APIs. Here's a brief overview of each:

### Authentication

The authentication process is handled in the following files:

- [`pages/members.js`](./pages/members.js): This file contains the Login/Logout button implementation. It demonstrates how to use the [Wix Members API](https://dev.wix.com/docs/sdk/backend-modules/members/members/introduction) to get the current user's information.
- [`pages/login-callback.js`](./pages/login-callback.js): This file handles the login callback process. It demonstrates how to use the [Wix OAuthStrategy API](https://dev.wix.com/docs/sdk/core-modules/sdk/oauth-strategy#oauthstrategy) to authenticate users.
- [`middleware.js`](./middleware.js): This file generates a visitor cookie if no session exists. It demonstrates how to use the [Wix OAuthStrategy API](https://dev.wix.com/docs/sdk/core-modules/sdk/oauth-strategy#oauthstrategy) to generate a visitor cookie.
> **[Wix Members API](https://dev.wix.com/docs/sdk/backend-modules/members/members/introduction)**: This API allows you to manage a site's members, including creating, updating, deleting members, retrieving member's information, and managing a member's community status.
> 
> **[Wix OAuthStrategy API](https://dev.wix.com/docs/sdk/core-modules/sdk/oauth-strategy#oauthstrategy)**: This is an authentication strategy used with a Wix Client to authenticate API calls using OAuth tokens. It helps in identifying the requester's identity and their assigned roles.
### Headless CMS

The Headless CMS API is demonstrated in the [`pages/content.js`](./pages/content.js) file. This file fetches and displays content from the Wix CMS.
It demonstrates how to use the [Wix Data API](https://dev.wix.com/docs/sdk/backend-modules/data/introduction) to retrieve, create, update, and delete content in your site database collections.
> **[Wix Data API](https://dev.wix.com/docs/sdk/backend-modules/data/introduction)**: This API provides a complete solution for accessing, organizing, configuring, and managing data stored in a Wix project or site's database.
> It allows you to create, modify, delete data collections, manage data items, create indexes for data collections, and connect external databases to a Wix project or site.
### Headless Bookings

The Headless Bookings API is demonstrated in the [`pages/booking.js`](./pages/booking.js) file. This file handles the booking process.
It demonstrates how to use the [Wix Bookings API](https://dev.wix.com/docs/sdk/backend-modules/bookings/bookings/introduction) to manage and create bookings for services provided by your site.

> **[Wix Bookings API](https://dev.wix.com/docs/sdk/backend-modules/bookings/bookings/introduction)**: This API allows you to manage bookings for a site's services. It holds information about the customer and the session or schedule they have booked.
### Headless Store

The Headless Store API is demonstrated in the [`pages/store.js`](./pages/store.js) file. This file handles the store operations.
It demonstrates how to use the [Wix Stores API](https://dev.wix.com/docs/sdk/backend-modules/stores) allows you to manage your store inventory, orders, and collections,
and it also demonstrates how to use the [Wix eCommerce API](https://dev.wix.com/docs/sdk/backend-modules/ecom/introduction) to manage carts, checkouts, discount rules, item promotion, and orders.

> **[Wix Stores API](https://dev.wix.com/docs/sdk/backend-modules/stores)**: This API allows you to manage your store inventory, orders, and collections.
    It provides a comprehensive set of services for customizing store functionality.
> 
> **[Wix eCommerce API](https://dev.wix.com/docs/sdk/backend-modules/ecom/introduction)**: This API provides a comprehensive set of services for customizing eCommerce functionality on Wix sites.
    It allows you to manage a site visitor's cart, handle checkout and payment flow, create and manage discount rules, promote items, and manage orders.
### Headless Tickets

The Headless Tickets API is demonstrated in the [`pages/tickets.js`](./pages/tickets.js) file. This file handles the ticket operations.
It demonstrates how to use the [Wix Events API](https://dev.wix.com/docs/sdk/backend-modules/events/introduction) to manage and sell tickets for events on your site.

> **[Wix Events API](https://dev.wix.com/docs/sdk/backend-modules/events/introduction)**: This API provides functionality for creating, updating, and managing Wix events.
    It allows you to manage event details like location, scheduling, registration, tickets, RSVPs, online conferencing, messaging customization, and basic registration form customization.
### Headless Subscriptions

The Headless Subscriptions API is demonstrated in the [`pages/subscriptions.js`](./pages/subscriptions.js) file. This file handles the subscription operations.
It demonstrates how to use the [Wix Pricing Plans API](https://dev.wix.com/docs/sdk/backend-modules/pricing-plans/introduction) to manage and sell subscriptions to services provided by your site.

> **[Wix Pricing Plans API](https://dev.wix.com/docs/sdk/backend-modules/pricing-plans/introduction)**: This API allows you to create and manage your plans and orders.
>   It supports different pricing models like subscription, single payment for duration, and single payment unlimited.
>   It also allows you to manage plan visibility, handle free plans and trial periods, and manage orders and subscriptions.
## Package dependency management

To ensure this repo always uses the latest APIs from the Wix JavaScript SDK, the repo is preconfigured with [Dependabot](https://docs.github.com/en/code-security/dependabot), GitHub's automated dependency management system. Due to the numerous pull requests generated by Dependabot, the repo also includes a preconfigured GitHub Action called "Combine PRs." This action can be executed manually to merge all of Dependabot's pull requests into a single PR, allowing for sanity checks to be performed only once. If the sanity check fails, each Dependabot PR can be inspected individually.
