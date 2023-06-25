import { test, expect } from '@playwright/test';
import testIds from '../../src/utils/test-ids';
import { waitForWixSite } from "./utils/wix-checkout";

test.describe('eCommerce Flow', () => {
  const PATH = '/store';

  test('eCommerce e2e', async ({ page }) => {
    await page.goto(PATH);

    await expect(
      await page.getByTestId(testIds.COMMERCE_PAGE.CONTAINER)
    ).toBeVisible();

    await page.getByTestId(testIds.COMMERCE_PAGE.PRODUCT).first().click();

    const productName = await page.getByTestId(testIds.COMMERCE_PAGE.PRODUCT).first().textContent();

    await page.getByTestId(testIds.COMMERCE_PAGE.CHECKOUT).first().click();

    await waitForWixSite(page);

    let checkoutIframeSelector = 'iframe[title="Checkout"]';
    const isCheckoutIframe =
      (await page.locator(checkoutIframeSelector).count()) > 0;

    const frame = isCheckoutIframe
      ? page.frameLocator(checkoutIframeSelector)
      : page;
    await expect(await frame.getByText(productName)).toBeVisible();
  });
});
