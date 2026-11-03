import { createPage, setup } from '@nuxt/test-utils/e2e';
import { describe, expect, it } from 'vitest';

describe('puzzle index page e2e test', async () => {
  await setup({
    server: true,
    browser: true,
    setupTimeout: 240_000,
  });

  it.each([
    ['5x5', 'normal'],
    ['10x10', 'normal'],
    ['15x15', 'normal'],
    ['20x20', 'normal'],
    ['25x25', 'normal'],
    ['30x30', 'normal'],
    ['5x5', 'hard'],
    ['10x10', 'hard'],
    ['15x15', 'hard'],
    ['20x20', 'hard'],
    ['25x25', 'hard'],
    ['30x30', 'hard'],
  ])('navigates to the selected puzzle page: %s %s', async (size: string, difficulty: string) => {
    const page = await createPage('/puzzle');

    // Select puzzle size
    await page.getByRole('combobox', { name: 'Puzzle Size' }).click();
    await page.getByRole('option', { name: size, exact: true }).click();

    // Select puzzle difficulty
    await page.getByRole('combobox', { name: 'Puzzle Difficulty' }).click();
    await page.getByRole('option', { name: difficulty, exact: true }).click();

    // Navigate to puzzle
    await page.getByRole('button', { name: 'Go to Puzzle' }).click();

    // Verify navigation
    const expectedPath = `/puzzle/${size}/${difficulty}`;
    await page.waitForURL(`**${expectedPath}`);
    expect(new URL(page.url()).pathname).toBe(expectedPath);
  });
});
