import { test, expect } from '@playwright/test';

// Basic E2E for films page filtering

test('filter films by title', async ({ page, baseURL }) => {
  await page.goto(baseURL ?? '/');
  await page.getByTestId('nav-films').click();
  await expect(page.getByTestId('films-page')).toBeVisible();
  await page.getByTestId('filter-title').fill('Jedi');
  // Wait for table to update
  const rows = page.getByTestId('film-row');
  await expect(rows).toContainText(['Return of the Jedi']);
});

test('sorting by title asc/desc', async ({ page, baseURL }) => {
  await page.goto(baseURL ?? '/#/films');
  await expect(page.getByTestId('films-page')).toBeVisible();
  const headerTitle = page.getByRole('columnheader', { name: 'title' });
  await headerTitle.click(); // asc
  const firstAsc = await page.getByTestId('film-row').first().innerText();
  await headerTitle.click(); // desc
  const firstDesc = await page.getByTestId('film-row').first().innerText();
  expect(firstAsc).not.toEqual(firstDesc);
});
