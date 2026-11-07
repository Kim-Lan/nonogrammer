import { createPage } from '@nuxt/test-utils/e2e';
import { describe, expect, it } from 'vitest';
import { setupE2E } from '../setup';

describe('homepage e2e test', async () => {
  await setupE2E();

  it('navigates to the homepage', async () => {
    const page = await createPage('/');
    const text = await page.getByRole('link', { name: 'nonogrammer' }).textContent();
    expect(text).toContain('nonogrammer');
    await page.close();
  });

  it('navigates to the puzzle selection page using the homepage button', async () => {
    const page = await createPage('/');

    try {
      await page.getByRole('main').getByRole('link', { name: 'Play', exact: true }).click();

      await page.waitForURL('**/play');
      expect(new URL(page.url()).pathname).toBe('/play');
    } finally {
      await page.close();
    }
  });
});
