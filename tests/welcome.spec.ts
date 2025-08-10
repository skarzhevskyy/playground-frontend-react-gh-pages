import { test, expect } from '@playwright/test';

test('welcome page renders', async ({ page, baseURL }) => {
  await page.goto(baseURL ?? '/');
  await expect(page.getByTestId('welcome-title')).toHaveText(/welcome/i);
});

test('navigation to films page works', async ({ page, baseURL }) => {
  await page.goto(baseURL ?? '/');

  // Click the films navigation button
  await page.getByRole('button', { name: 'View Star Wars Films' }).click();

  // Expect to be on films page
  await expect(page.locator('h1:has-text("Star Wars Films")')).toBeVisible();
});

test('learn vite link opens in new tab', async ({ page, baseURL }) => {
  await page.goto(baseURL ?? '/');

  // Click the learn vite link - it should open in a new tab
  const [newPage] = await Promise.all([
    page.waitForEvent('popup'),
    page.getByRole('link', { name: 'Learn Vite' }).click()
  ]);

  // Expects the new page to be Vite's website (updated domain)
  await expect(newPage).toHaveURL(/vite\.dev/);
});
