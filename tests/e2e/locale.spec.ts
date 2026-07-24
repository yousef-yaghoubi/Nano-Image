import { test, expect } from '@playwright/test';
import { gotoPage, openLocaleMenu } from './helpers/navigation';

test.describe('Locale Switching', () => {
  test.beforeEach(async ({ page }) => {
    await gotoPage(page, '/en');
  });

  const locales = [
    { name: 'Persian', option: 'Persian', path: 'fa' },
    { name: 'Arabic', option: 'Arabic', path: 'ar' },
  ];

  for (const locale of locales) {
    test(`switches to ${locale.name} locale`, async ({ page }) => {
      const menu = await openLocaleMenu(page);

      const localeOption = menu.getByText(locale.option, { exact: true });
      await expect(localeOption).toBeVisible();

      await localeOption.click();
      await expect(page).toHaveURL(`/${locale.path}`, {
        timeout: 10_000,
      });
    });
  }
});
