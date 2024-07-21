// @ts-check
const { test, expect,request } = require('@playwright/test');

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test("Web Test", async ({page}) =>
  {
      await page.goto('https://playwright.dev/');
      await page.getByRole('link', { name: 'Get started' }).click();
      expect(page.locator("h1")).toHaveText("Installation");
   
  });