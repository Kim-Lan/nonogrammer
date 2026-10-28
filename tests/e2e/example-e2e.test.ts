import { createPage, setup } from '@nuxt/test-utils/e2e';
import { describe, expect, it } from 'vitest';

await setup({
  server: true,
  browser: true,
  setupTimeout: 300_000,
});

describe('browser', () => {
  it('runs a test', { timeout: 120_000 }, async () => {
    const page = await createPage('/');
    const text = await page.getByRole('link', { name: 'Nonogrammer' }).textContent();
    expect(text).toContain('Nonogrammer');
    await page.close();
  });
});
