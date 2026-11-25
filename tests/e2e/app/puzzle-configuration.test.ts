import { createPage } from '@nuxt/test-utils/e2e';
import { describe, expect, it } from 'vitest';
import { setupE2E } from '../setup';

describe('puzzle configuration e2e test', async () => {
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
  ])('loads the last selected puzzle configuration on the puzzle selection page: %s %s', async (difficulty: string, size: string) => {
    const page = await createPage('/play');

    try {
      // Set desktop size
      await page.setViewportSize({
        width: 1280,
        height: 720,
      });

      // Select puzzle difficulty
      const capitalizedDifficulty = difficulty.charAt(0).toUpperCase() + difficulty.substring(1);
      await page.getByRole('combobox', { name: 'Puzzle Difficulty' }).click();
      await page.getByRole('option', { name: capitalizedDifficulty, exact: true }).click();

      // Select puzzle size
      await page.getByRole('combobox', { name: 'Puzzle Size' }).click();
      await page.getByRole('option', { name: size, exact: true }).click();

      // Navigate to puzzle
      await page.getByRole('button', { name: 'Go to Puzzle' }).click();

      // Verify navigation to selected puzzle configuration
      const expectedPath = `/puzzles/${difficulty}/${size}`;
      await page.waitForURL(`**${expectedPath}`);
      expect(new URL(page.url()).pathname).toBe(expectedPath);

      // Wait for puzzle to load
      await page.waitForTimeout(3000);

      // Navigate back to Play page
      // Click Play in header
      await page.getByRole('banner').getByRole('link', { name: 'Play', exact: true }).click();

      // Verify navigation to puzzle selection page
      await page.waitForURL(`**/play`);
      expect(new URL(page.url()).pathname).toBe('/play');

      // Verify last puzzle configuration is loaded
      const selectedDifficulty = page.getByRole('combobox', { name: 'Puzzle Difficulty' });
      expect(await selectedDifficulty.textContent()).toBe(capitalizedDifficulty);

      const selectedSize = page.getByRole('combobox', { name: 'Puzzle Size' });
      expect(await selectedSize.textContent()).toBe(size);

      // Navigate to loaded puzzle configuration
      await page.getByRole('button', { name: 'Go to Puzzle' }).click();

      // Verify navigation to loaded puzzle configuration
      await page.waitForURL(`**${expectedPath}`);
      expect(new URL(page.url()).pathname).toBe(expectedPath);
    } finally {
      await page.close();
    }
  });

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
  ])('loads the last visited puzzle configuration using desktop navigation: %s %s', async (difficulty: string, size: string) => {
    const page = await createPage('/play');

    try {
      // Set desktop size
      await page.setViewportSize({
        width: 1280,
        height: 720,
      });

      // Open the Puzzles navigation dropdown
      await page.getByRole('button', { name: 'Puzzles', exact: true }).hover();

      // Open the difficulty popover
      const capitalizedDifficulty = difficulty.charAt(0).toUpperCase() + difficulty.substring(1);
      const difficultyButton = page.getByRole('button', { name: capitalizedDifficulty, exact: true });
      await difficultyButton.waitFor({ state: 'visible' });
      await difficultyButton.hover();

      // Click the puzzle size
      const sizeLink = page.getByRole('link', { name: size, exact: true });
      await sizeLink.waitFor({ state: 'visible' });
      await sizeLink.click();

      // Verify navigation to selected puzzle configuration
      const expectedPath = `/puzzles/${difficulty}/${size}`;
      await page.waitForURL(`**${expectedPath}`);
      expect(new URL(page.url()).pathname).toBe(expectedPath);

      // Wait for puzzle to load
      await page.waitForTimeout(3000);

      // Navigate back to Play page
      // Click Play in header
      await page.getByRole('banner').getByRole('link', { name: 'Play', exact: true }).click();

      // Verify navigation to puzzle selection page
      await page.waitForURL(`**/play`);
      expect(new URL(page.url()).pathname).toBe('/play');

      // Verify last puzzle configuration is loaded
      const selectedDifficulty = page.getByRole('combobox', { name: 'Puzzle Difficulty' });
      expect(await selectedDifficulty.textContent()).toBe(capitalizedDifficulty);

      const selectedSize = page.getByRole('combobox', { name: 'Puzzle Size' });
      expect(await selectedSize.textContent()).toBe(size);

      // Navigate to loaded puzzle configuration
      await page.getByRole('button', { name: 'Go to Puzzle' }).click();

      // Verify navigation to loaded puzzle configuration
      await page.waitForURL(`**${expectedPath}`);
      expect(new URL(page.url()).pathname).toBe(expectedPath);
    } finally {
      await page.close();
    }
  });

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
  ])('loads the last visited puzzle configuration using mobile navigation: %s %s', async (difficulty: string, size: string) => {
    const page = await createPage('/play');

    try {
      // Set mobile viewport size
      await page.setViewportSize({
        width: 360,
        height: 800,
      });

      // Open the UHeader hamburger menu
      await page.getByRole('button', { name: 'Open menu', exact: true }).click();

      // Scope interactions to the mobile #body slot.
      let mobileMenu = page.locator('[data-slot="body"]');

      // Expand Play
      await mobileMenu.getByRole('button', { name: 'Puzzles', exact: true }).click();

      // Expand difficulty
      const capitalizedDifficulty = difficulty.charAt(0).toUpperCase() + difficulty.substring(1);
      const difficultyButton = mobileMenu.getByRole('button', { name: capitalizedDifficulty, exact: true });
      await difficultyButton.waitFor({ state: 'visible' });
      await difficultyButton.click();

      // Click the puzzle size
      const sizeLink = page.getByRole('link', { name: size, exact: true });
      await sizeLink.waitFor({ state: 'visible' });
      await sizeLink.click();

      // Verify navigation to selected puzzle configuration
      const expectedPath = `/puzzles/${difficulty}/${size}`;
      await page.waitForURL(`**${expectedPath}`);
      expect(new URL(page.url()).pathname).toBe(expectedPath);

      // Wait for puzzle to load
      await page.waitForTimeout(3000);

      // Navigate back to Play page
      // Open the UHeader hamburger menu
      await page.getByRole('button', { name: 'Open menu', exact: true }).click();

      // Scope interactions to the mobile menu
      mobileMenu = page.locator('[data-slot="body"]');

      // Click Play
      await mobileMenu.getByRole('link', { name: 'Play', exact: true }).click();

      // Verify navigation to puzzle selection page
      await page.waitForURL(`**/play`);
      expect(new URL(page.url()).pathname).toBe('/play');

      // Verify last puzzle configuration is loaded
      const selectedDifficulty = page.getByRole('combobox', { name: 'Puzzle Difficulty' });
      expect(await selectedDifficulty.textContent()).toBe(capitalizedDifficulty);

      const selectedSize = page.getByRole('combobox', { name: 'Puzzle Size' });
      expect(await selectedSize.textContent()).toBe(size);

      // Navigate to loaded puzzle configuration
      await page.getByRole('button', { name: 'Go to Puzzle' }).click();

      // Verify navigation to loaded puzzle configuration
      await page.waitForURL(`**${expectedPath}`);
      expect(new URL(page.url()).pathname).toBe(expectedPath);
    } finally {
      await page.close();
    }
  });
});
