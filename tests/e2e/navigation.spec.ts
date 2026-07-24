import { test, expect } from '@playwright/test';
import {
  gotoPage,
  openMobileMenu,
  waitForAppUrl,
} from './helpers/navigation';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await gotoPage(page, '/en');
  });

  test('navigates between pages using nav links', async ({ page }) => {
    await page.getByRole('link', { name: 'Home' }).click();
    await expect(page).toHaveURL(/\/en$/);

    await Promise.all([
      waitForAppUrl(page, /\/en\/newPrompt$/),
      page.getByRole('link', { name: 'New prompt' }).click(),
    ]);
  });

  test('mobile menu opens and closes', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await gotoPage(page, '/en');

    const sheet = await openMobileMenu(page);

    const homeLink = sheet.getByRole('link', { name: 'Home' });
    const promptsLink = sheet.getByRole('link', { name: 'Prompts' });
    const newPromptLink = sheet.getByRole('link', { name: 'New prompt' });

    await expect(homeLink).toBeVisible();
    await expect(promptsLink).toBeVisible();
    await expect(newPromptLink).toBeVisible();

    const closeBtn = page.getByRole('button', { name: /close/i });
    await expect(closeBtn).toBeVisible();
    await closeBtn.click();

    await expect(sheet).not.toBeVisible();
  });
});
