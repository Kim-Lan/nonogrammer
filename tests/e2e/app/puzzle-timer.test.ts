import { createPage } from '@nuxt/test-utils/e2e';
import { describe, expect, it } from 'vitest';
import { setupE2E } from '../setup';

describe('puzzle timer e2e test', async () => {
  await setupE2E();

  it('stops the timer when the submit button is pressed', async () => {
    const page = await createPage('/puzzles/normal/5x5');

    try {
      // Wait for 3 seconds after timer/puzzle loads
      const timer = page.getByLabel('timer');
      await timer.waitFor({ state: 'visible' });
      await page.waitForTimeout(3000);

      // Click submit button
      await page.getByRole('button', { name: 'Submit', exact: true }).click();

      // Check timer text
      await expect(timer.textContent()).resolves.toBe('00:03');
    } finally {
      await page.close();
    }
  });
});
