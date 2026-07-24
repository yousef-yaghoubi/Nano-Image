import { expect, type Page } from '@playwright/test';

export const NAVIGATION_OPTIONS = {
  waitUntil: 'domcontentloaded' as const,
};

export const AUTH_NAVIGATION_OPTIONS = {
  waitUntil: 'commit' as const,
};

export async function blockHeavyAssets(page: Page) {
  await page.route('**/cdn.bananaprompts.xyz/**', (route) => route.abort());
  await page.route('**/api/prompts/quantity**', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: { prompts: 100, tags: 30, likes: 1000 },
      }),
    })
  );
}

export async function waitForAppReady(page: Page) {
  await page.locator('nav').waitFor({ state: 'visible' });
  await page.waitForFunction(
    () => {
      const triggers = document.querySelectorAll(
        '[data-slot="dropdown-menu-trigger"]'
      );
      const visible = Array.from(triggers).filter((el) => {
        const style = window.getComputedStyle(el);
        return style.display !== 'none' && style.visibility !== 'hidden';
      });
      if (visible.length === 0) return false;
      return visible.every((el) => el.hasAttribute('data-state'));
    },
    { timeout: 15_000 }
  );
}

export async function gotoPage(page: Page, path: string) {
  await blockHeavyAssets(page);
  await page.goto(path, NAVIGATION_OPTIONS);
  await waitForAppReady(page);
}

export async function waitForAppUrl(
  page: Page,
  url: string | RegExp,
  timeout?: number
) {
  await page.waitForURL(url, {
    ...NAVIGATION_OPTIONS,
    timeout,
  });
}

export async function openLocaleMenu(page: Page) {
  const trigger = page
    .locator('[data-slot="dropdown-menu-trigger"]:visible')
    .first();
  await expect(trigger).toBeVisible();
  await trigger.click();
  const menu = page.locator('[data-slot="dropdown-menu-content"]');
  await expect(menu).toBeVisible({ timeout: 10_000 });
  return menu;
}

export async function openMobileMenu(page: Page) {
  await page.waitForFunction(
    () => {
      const trigger = document.querySelector('[data-slot="sheet-trigger"]');
      return trigger?.hasAttribute('data-state') ?? false;
    },
    { timeout: 15_000 }
  );

  const trigger = page.getByRole('button', { name: 'Open menu' });
  await expect(trigger).toBeVisible();
  await trigger.click();

  const sheet = page.locator('[data-slot="sheet-content"]');
  await expect(sheet).toBeVisible({ timeout: 10_000 });
  return sheet;
}
