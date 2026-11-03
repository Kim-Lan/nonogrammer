import { createPage, setup } from '@nuxt/test-utils/e2e';
import { describe, expect, it } from 'vitest';

describe('homepage e2e test', () => {
  await setup({
    server: true,
    browser: true,
    setupTimeout: 240_000,
  });

  it('navigates to the homepage', async () => {
    const page = await createPage('/');
    const text = await page.getByRole('link', { name: 'nonogrammer' }).textContent();
    expect(text).toContain('nonogrammer');
    await page.close();
  });
});
