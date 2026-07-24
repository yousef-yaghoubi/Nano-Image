import { test, expect } from '@playwright/test';
import {
  blockHeavyAssets,
  gotoPage,
  AUTH_NAVIGATION_OPTIONS,
} from './helpers/navigation';

test.describe('Authentication', () => {
  test('redirects unauthenticated user to sign-in on profile route', async ({
    page,
  }) => {
    await blockHeavyAssets(page);
    await page.goto('/en/profile', AUTH_NAVIGATION_OPTIONS);

    await expect(page).toHaveURL(/sign-in|signup|sign/, { timeout: 30_000 });
  });

  test('redirects unauthenticated user to sign-in on admin route', async ({
    page,
  }) => {
    await blockHeavyAssets(page);
    await page.goto('/en/admin', AUTH_NAVIGATION_OPTIONS);

    await expect(page).toHaveURL(/sign-in|signup|sign/, { timeout: 30_000 });
  });

  test('shows sign in and sign up buttons when logged out', async ({
    page,
  }) => {
    await gotoPage(page, '/en');

    await expect(page.getByText('Sign in')).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText('Sign up')).toBeVisible();
  });
});
