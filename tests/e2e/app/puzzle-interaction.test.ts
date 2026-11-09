import { createPage } from '@nuxt/test-utils/e2e';
import { describe, expect, it } from 'vitest';
import { setupE2E } from '../setup';

describe('puzzle interaction e2e test', async () => {
  await setupE2E();

  it('fills, marks, clears, and paints cells while dragging', async () => {
    const page = await createPage('/puzzles/normal/5x5');

    try {
      const grid = page.locator('.puzzle-grid');
      const cells = page.locator('[data-cell-index]');
      await grid.waitFor();
      await expect(cells).toHaveCount(25);

      const cell = (index: number) => page.locator(`[data-cell-index="${index}"]`);

      // Cell filling
      await cell(0).click();
      await expect(cell(0)).toHaveClass(/\bfilled\b/);

      // Cell marking
      await cell(1).click({ button: 'right' });
      await expect(cell(1)).toHaveClass(/\bmarked\b/);

      // Cell clearing
      await cell(0).click();
      await expect(cell(0)).toHaveClass(/\bempty\b/);

      // Dragging paints each cell along the row
      const start = await cell(5).boundingBox();
      const end = await cell(8).boundingBox();
      expect(start).not.toBeNull();
      expect(end).not.toBeNull();

      await page.mouse.move(start!.x + start!.width / 2, start!.y + start!.height / 2);
      await page.mouse.down();
      await page.mouse.move(end!.x + end!.width / 2, end!.y + end!.height / 2, { steps: 4 });
      await page.mouse.up();

      for (const index of [5, 6, 7, 8]) {
        await expect(cell(index)).toHaveClass(/\bfilled\b/);
      }
    } finally {
      await page.close();
    }
  });
});
