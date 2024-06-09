import Cookies from "js-cookie";
import {useEffect, useState} from "react";

/*
  This line is importing two modules from the Wix SDK.
  createClient is a function used to create a new instance of the Wix client, which is used to interact with the Wix APIs.
  OAuthStrategy is a module that provides a method for authenticating API calls using OAuth tokens.
 */
import {createClient, OAuthStrategy} from "@wix/sdk";
/*
    These line is importing a module from the Wix Stores API.
    The products module provides methods for managing products in a store.
 */
import {products} from "@wix/stores";
/*
    These line is importing a module from the Wix Ecom API.
    The currentCart module provides methods for managing the current cart of a site visitor.
 */
import {currentCart} from "@wix/ecom";
/*
    This line is importing the redirects' module.
    The redirects module provides methods for managing URL redirects.
 */
import {redirects} from "@wix/redirects";

import testIds from "@/src/utils/test-ids";

/*
  A Wix client is an instance created using the createClient function from the Wix SDK.
  It's essentially an object that allows you to interact with various Wix APIs, such as the products, currentCart, and redirects modules in this case.
  Creating a Wix client is necessary because it provides a structured way to interact with Wix APIs.
  It handles the details of making requests to the APIs and processing the responses.
  This allows you to focus on the logic of your application rather than the details of the API.
 */
const myWixClient = createClient({
    // We specify the modules we want to use with the client.
    // In this case, we're using the products, currentCart, and redirects modules.
    // We also use the redirects module to eventually create a redirect to the checkout page.
    modules: {products, currentCart, redirects},

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

export default function Store() {
    const [productList, setProductList] = useState([]);
    const [cart, setCart] = useState({});

    // This function fetches the list of products
    async function fetchProducts() {
        // Querying products and setting the product list state variable
        const productList = await myWixClient.products.queryProducts().find();
        setProductList(productList.items);
    }

    // This function fetches the current cart
    async function fetchCart() {
        // try-catch block to handle errors if the cart is not available
        // the meaning of unavailable cart is that we never created a cart for the user whether by adding a product or by creating a cart
        try {
            // We call the getCurrentCart method from the currentCart module of the Wix client.
            // This method retrieves the current user's shopping cart.
            setCart(await myWixClient.currentCart.getCurrentCart());
        } catch {
            // If the cart is not available, do something (e.g., show an error message)
        }
    }

    // This function adds a product to the cart using the currentCart module of the Wix client created
    async function addToCart(product) {
        // First, we create an options object from the product's options.
        // We use the reduce function to transform the productOptions array into an object.
        // The transformation of product options into an object is necessary because the `addToCurrentCart` method from the `currentCart` module
        // expects the options to be in this format when adding a product to the cart.
        // The options object represents the selected options for the product being added to the cart.
        // In this case, the first choice of each option is automatically selected.

        const options = product.productOptions.reduce(
            (selected, option) => ({
                // For each product option, a new property is created in the object. The property's key is the option's name and its value is the description of the option's first choice.
                ...selected,
                [option.name]: option.choices[0].description,
            }),
            {}, // This is the initial value of the reduce function. It's an empty object that we'll add properties to.
        );

        // Then, we call the addToCurrentCart method from the currentCart module of the Wix client.
        // This method adds items to the current user's shopping cart.
        const {cart} = await myWixClient.currentCart.addToCurrentCart({
            // We pass an object that describes the product to be added.
            lineItems: [
                {
                    // Each product is identified by a catalogReference object.
                    catalogReference: {
                        appId: "1380b703-ce81-ff05-f115-39571d94dfcd", // This is the application ID of stores app.
                        catalogItemId: product._id, // This is the product's ID.
                        options: {options}, // These are the product options we created earlier.
                    },
                    quantity: 1, // We're adding one unit of the product.
                },
            ],
        });

        // Finally, we update the state of the cart in the React component.
        setCart(cart);
    }

    // This is a function that clears the cart.
    async function clearCart() {
        // We call the deleteCurrentCart method from the currentCart module of the Wix client.
        // This method deletes the current site visitor's shopping cart.
        await myWixClient.currentCart.deleteCurrentCart();

        // Then, we update the state of the cart in the React component to be an empty object.
        setCart({});
    }

    // We recommend you to use the Wix-managed checkout page.
    // This is the function that creates a redirect to the checkout page.
    async function createRedirect() {
        // We call the createCheckoutFromCurrentCart method from the currentCart module of the Wix client.
        // This method creates a checkout from the current user's shopping cart.
        const {checkoutId} =
            await myWixClient.currentCart.createCheckoutFromCurrentCart({
                // We specify the channel type to be WEB.
                channelType: currentCart.ChannelType.WEB,
            });

        // Then, we call the createRedirectSession method from the redirects module of the Wix client.
        // This method creates a redirect session to the checkout page.
        const redirect = await myWixClient.redirects.createRedirectSession({
            // We pass an object that specifies the checkoutId for the ecomCheckout.
            ecomCheckout: {checkoutId},
            // We also specify the postFlowUrl to be the current page URL. This is where the user will be redirected after the checkout flow.
            callbacks: {postFlowUrl: window.location.href},
        });

        // Finally, we redirect the user to the URL generated by the redirect session.
        window.location = redirect.redirectSession.fullUrl;
    }

    // Fetch products and cart on component mount
    useEffect(() => {
        fetchProducts();
    }, []);

    // Fetch cart on component mount
    useEffect(() => {
        fetchCart();
    }, []);

    return (
        <main data-testid={testIds.COMMERCE_PAGE.CONTAINER}>
            <div>
                <h2>Choose Products:</h2>
                {/* Mapping through the product list and displaying each product */}
                {productList.map((product) => {
                    return (
                        // Each product is displayed in a section. When clicked, the product is added to the cart.
                        <section
                            data-testid={testIds.COMMERCE_PAGE.PRODUCT}
                            key={product._id}
                            onClick={() => addToCart(product)}
                        >
                            {product.name}
                        </section>
                    );
                })}
            </div>
            <div>
                <h2>Cart:</h2>
                {/* If there are items in the cart, display the checkout and clear cart options */}
                {cart.lineItems?.length > 0 && (
                    <>
                        {/* When clicked, the user is redirected to the checkout page */}
                        <section
                            data-testid={testIds.COMMERCE_PAGE.CHECKOUT}
                            onClick={() => createRedirect()}
                        >
                            <h3>
                                {/* Display the number of items in the cart and the total amount */}
                                {cart.lineItems.length} items ({cart.subtotal.formattedAmount})
                            </h3>
                            <span>Checkout</span>
                        </section>
                        {/* When clicked, the cart will be cleared */}
                        <section onClick={() => clearCart()}>
                            <span>Clear cart</span>
                        </section>
                    </>
                )}
            </div>
        </main>
    );
}
