import { $fetch, createPage } from '@nuxt/test-utils/e2e';
import { describe, expect, it } from 'vitest';
import { setupE2E } from '../setup';

describe('puzzle selection page e2e test', async () => {
  await setupE2E();

  it.each([
    ['normal', '5x5'],
    ['normal', '10x10'],
    ['normal', '15x15'],
    ['normal', '20x20'],
    ['normal', '25x25'],
    ['normal', '30x30'],
    ['hard', '5x5'],
    ['hard', '10x10'],
    ['hard', '15x15'],
    ['hard', '20x20'],
    ['hard', '25x25'],
    ['hard', '30x30'],
  ])('navigates to the selected puzzle page from the puzzle selection page: %s %s', async (difficulty: string, size: string) => {
    const page = await createPage('/play');

    try {
      // Select puzzle difficulty
      const capitalizedDifficulty = difficulty.charAt(0).toUpperCase() + difficulty.substring(1);
      await page.getByRole('combobox', { name: 'Puzzle Difficulty' }).click();
      await page.getByRole('option', { name: capitalizedDifficulty, exact: true }).click();

      // Select puzzle size
      await page.getByRole('combobox', { name: 'Puzzle Size' }).click();
      await page.getByRole('option', { name: size, exact: true }).click();

      // Navigate to puzzle
      await page.getByRole('button', { name: 'Go to Puzzle' }).click();

      // Verify navigation
      const expectedPath = `/puzzles/${difficulty}/${size}`;
      await page.waitForURL(`**${expectedPath}`);
      expect(new URL(page.url()).pathname).toBe(expectedPath);
    } finally {
      await page.close();
    }
  });

  it('navigates to an existing puzzle when searching by slug from the puzzle selection page', async () => {
    // Create puzzle
    const { slug } = await $fetch('/api/puzzles/system', {
      method: 'POST',
      query: {
        height: 5,
        width: 5,
        difficulty: 'normal',
      },
    });

    // Navigate to puzzle selection page
    const page = await createPage('/play');

    try {
      // Search for puzzle by slug
      await page.getByRole('textbox', { name: 'Puzzle ID', exact: true }).fill(slug);
      await page.getByRole('button', { name: 'Find Puzzle', exact: true }).click();

      // Verify navigation to puzzle page
      const expectedPath = `/puzzles/id/${slug}`;
      await page.waitForURL(`**${expectedPath}`);
      expect(new URL(page.url()).pathname).toBe(expectedPath);

      // Verify puzzle loaded
      await page.getByRole('heading', { name: 'Normal 5x5', exact: true }).waitFor();
      await page.getByRole('heading', { name: `Puzzle ID: ${slug}`, exact: true }).waitFor();
    } finally {
      await page.close();
    }
  });
});
