import { test, expect } from '@playwright/test';
import { gotoPage } from './helpers/navigation';

test.describe('Prompts Page', () => {
  test.beforeEach(async ({ page }) => {
    await gotoPage(page, '/en/prompts');
  });

  test('loads prompts page', async ({ page }) => {
    await expect(page).toHaveURL(/\/en\/prompts/);
  });

  test('shows filter and sort controls', async ({ page }) => {
    await expect(page.getByLabel('Open filters')).toBeVisible();
    await expect(page.getByLabel('Sort options')).toBeVisible();
  });
});
