import { test, expect } from '@playwright/test';
import { gotoPage, openLocaleMenu, waitForAppUrl } from './helpers/navigation';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await gotoPage(page, '/en');
  });

  test('loads and displays the page', async ({ page }) => {
    await expect(page).toHaveTitle(/Nano/);
  });

  test('displays navigation elements', async ({ page }) => {
    await expect(page.getByRole('img', { name: 'NanoImage' })).toBeVisible();
  });

  test('language switcher changes locale', async ({ page }) => {
    const menu = await openLocaleMenu(page);

    await expect(menu.getByText('Persian', { exact: true })).toBeVisible();
    await expect(menu.getByText('Arabic', { exact: true })).toBeVisible();
  });

  test('navigates to prompts page', async ({ page }) => {
    const promptsLink = page
      .getByRole('navigation')
      .getByRole('link', { name: 'Prompts', exact: true });

    await expect(promptsLink).toBeVisible();

    await Promise.all([
      waitForAppUrl(page, /\/en\/prompts\/?$/),
      promptsLink.click(),
    ]);
  });
});
