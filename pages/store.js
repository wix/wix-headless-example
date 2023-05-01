import styles from '@/styles/Home.module.css'
import { useEffect, useState } from 'react';

import { createClient, OAuthStrategy } from '@wix/api-client';
import { products } from '@wix/stores';
import { currentCart } from '@wix/ecom';
import { redirects } from '@wix/redirects';

const myWixClient = createClient({
  modules: { products, currentCart, redirects },
  auth: OAuthStrategy({ clientId: `10c1663b-2cdf-47c5-a3ef-30c2e8543849` })
});

export default function Store() {
  const [productList, setProductList] = useState([]);
  const [cart, setCart] = useState({});

  async function fetchProducts() {
    const productList = await myWixClient.products.queryProducts().find();
    setProductList(productList.items);
  }

  async function addToCart(product) {
    const options = product.productOptions.reduce((selected, option) => ({ ...selected, [option.name]: option.choices[0].description }), {});
    const { cart } = await myWixClient.currentCart.addToCurrentCart({
      lineItems: [{
        catalogReference: {
          appId: '1380b703-ce81-ff05-f115-39571d94dfcd',
          catalogItemId: product._id,
          options: { options }
        },
        quantity: 1
      }]
    });
    setCart(cart);
  }

  async function createRedirect() {
    const { checkoutId } = await myWixClient.currentCart.createCheckoutFromCurrentCart({ channelType: currentCart.ChannelType.WEB });
    const redirect = await myWixClient.redirects.createRedirectSession({
      ecomCheckout: { checkoutId }, callbacks: { postFlowUrl: window.location }
    });
    window.location = redirect.redirectSession.fullUrl;
  }

  useEffect(() => { fetchProducts(); }, []);

  return (
    <div className={styles.grid}>
      <div>
        <h2>Choose Products:</h2>
        {productList.map((product) => {
          return <div className={styles.card} key={product._id} onClick={() => addToCart(product)}>{product.name}</div>;
        })}
      </div>
      <div>
        <h2>Cart:</h2>
        {cart.lineItems?.length > 0 && <>
          <div className={styles.card} onClick={() => createRedirect()}>
            <h3>{cart.lineItems.length} items ({cart.subtotal.formattedAmount})</h3>
            <span>Checkout</span>
          </div>
        </>}
      </div>
    </div>
  )
}
