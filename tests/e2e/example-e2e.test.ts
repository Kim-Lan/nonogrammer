import { createPage, setup } from '@nuxt/test-utils/e2e';
import { describe, expect, it } from 'vitest';

await setup();

describe('browser', () => {
  it('runs a test', { timeout: 20000 }, async () => {
    const page = await createPage('/');
    const text = await page.getByRole('link', { name: 'Nonogrammer' }).textContent();
    expect(text).toContain('Nonogrammer');
    await page.close();
  });
});
