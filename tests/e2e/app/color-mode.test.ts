import { createPage, url } from '@nuxt/test-utils/e2e';
import { expect } from '@playwright/test';
import { describe, it } from 'vitest';
import { setupE2E } from '../setup';

describe('color mode toggle e2e test', async () => {
  await setupE2E();

  it.each(['light', 'dark'] as const)('toggles from %s mode to the opposite mode and back', async (initialMode) => {
    const page = await createPage(undefined, { colorScheme: initialMode });
    const oppositeMode = initialMode === 'light' ? 'dark' : 'light';
    const root = page.locator('html');

    try {
      await page.addInitScript((mode) => {
        localStorage.setItem('nuxt-color-mode', mode);
      }, initialMode);
      await page.goto(url('/'), { waitUntil: 'hydration' });

      await expect(root).toHaveClass(new RegExp(`\\b${initialMode}\\b`));

      await expect(page.getByRole('button', { name: /Switch to (light|dark) mode/ }))
        .toHaveAttribute('aria-label', `Switch to ${oppositeMode} mode`);

      await page.getByRole('button', { name: `Switch to ${oppositeMode} mode`, exact: true }).click();

      await expect(root).toHaveClass(new RegExp(`\\b${oppositeMode}\\b`));
      await expect(root).not.toHaveClass(new RegExp(`\\b${initialMode}\\b`));

      await page.getByRole('button', { name: `Switch to ${initialMode} mode`, exact: true }).click();

      await expect(root).toHaveClass(new RegExp(`\\b${initialMode}\\b`));
      await expect(root).not.toHaveClass(new RegExp(`\\b${oppositeMode}\\b`));
      await expect(page.getByRole('button', { name: `Switch to ${oppositeMode} mode`, exact: true })).toBeVisible();
    } finally {
      await page.close();
    }
  });
});
