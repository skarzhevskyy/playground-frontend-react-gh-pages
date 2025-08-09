import { test, expect } from '@playwright/test';

test('welcome page renders', async ({ page, baseURL }) => {
  await page.goto(baseURL ?? '/');
  await expect(page.getByTestId('welcome-title')).toHaveText(/welcome/i);
});
