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
});
