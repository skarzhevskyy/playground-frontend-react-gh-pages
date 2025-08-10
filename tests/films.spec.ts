import { test, expect } from '@playwright/test';

test.describe('Star Wars Films Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Navigate to films page
    await page.click('button:has-text("View Star Wars Films")');
    await expect(page.locator('h1:has-text("Star Wars Films")')).toBeVisible();
  });

  test('should filter films by title containing "Jedi" and show "Return of the Jedi"', async ({ page }) => {
    // Wait for the films grid to load
    await expect(page.locator('table')).toBeVisible();
    
    // Enter "Jedi" in the title filter
    await page.fill('[data-testid="title-filter"]', 'Jedi');
    
    // Wait for filtering to complete
    await page.waitForTimeout(500);
    
    // Check that "Return of the Jedi" is in the results
    await expect(page.locator('table tbody tr')).toContainText('Return of the Jedi');
    
    // Verify that only films with "Jedi" in the title are shown
    const filmRows = page.locator('table tbody tr');
    const count = await filmRows.count();
    
    // Should show "Return of the Jedi" and "Revenge of the Sith" (which doesn't contain Jedi)
    // Actually, let's check that all visible films contain "Jedi" in their title
    for (let i = 0; i < count; i++) {
      const titleCell = filmRows.nth(i).locator('td').first();
      const titleText = await titleCell.textContent();
      expect(titleText?.toLowerCase()).toContain('jedi');
    }
  });

  test('should allow column configuration', async ({ page }) => {
    // Wait for the films grid to load
    await expect(page.locator('table')).toBeVisible();
    
    // Click to show column configuration
    await page.click('button:has-text("Show Columns")');
    
    // Verify column checkboxes are visible
    await expect(page.locator('input[type="checkbox"]').first()).toBeVisible();
    
    // Count initial visible columns
    const initialColumns = await page.locator('table thead th').count();
    
    // Uncheck a column (e.g., Director)
    const directorCheckbox = page.locator('label:has-text("Director") input[type="checkbox"]');
    if (await directorCheckbox.isChecked()) {
      await directorCheckbox.uncheck();
    }
    
    // Verify the column is hidden
    const newColumns = await page.locator('table thead th').count();
    expect(newColumns).toBeLessThan(initialColumns);
  });

  test('should support pagination', async ({ page }) => {
    // Wait for the films grid to load
    await expect(page.locator('table')).toBeVisible();
    
    // Change items per page to 3
    await page.selectOption('select', '3');
    
    // Verify pagination controls are visible
    await expect(page.locator('button:has-text("Next")')).toBeVisible();
    await expect(page.locator('button:has-text("Previous")')).toBeVisible();
    
    // Verify only 3 rows are shown (or less if there are fewer films)
    const rows = await page.locator('table tbody tr').count();
    expect(rows).toBeLessThanOrEqual(3);
  });

  test('should support sorting', async ({ page }) => {
    // Wait for the films grid to load
    await expect(page.locator('table')).toBeVisible();
    
    // Click on Title column header to sort
    await page.click('table thead th:has-text("Title")');
    
    // Verify sort indicator is present (look for the arrow specifically)
    await expect(page.locator('table thead th:has-text("Title") .text-indigo-600')).toBeVisible();
    
    // Get first film title
    const firstTitle = await page.locator('table tbody tr:first-child td:first-child').textContent();
    
    // Click again to reverse sort
    await page.click('table thead th:has-text("Title")');
    
    // Get first film title after reverse sort
    const newFirstTitle = await page.locator('table tbody tr:first-child td:first-child').textContent();
    
    // Titles should be different (unless there's only one film)
    if (await page.locator('table tbody tr').count() > 1) {
      expect(firstTitle).not.toBe(newFirstTitle);
    }
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Navigate to films page
    await page.goto('/');
    await page.click('button:has-text("View Star Wars Films")');
    
    // Wait for the films grid to load
    await expect(page.locator('table')).toBeVisible();
    
    // Verify the table is scrollable horizontally
    const table = page.locator('.overflow-x-auto');
    await expect(table).toBeVisible();
    
    // Verify filters stack vertically on mobile
    const filtersContainer = page.locator('.grid-cols-1');
    await expect(filtersContainer).toBeVisible();
  });
});