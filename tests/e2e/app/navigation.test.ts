import { createPage } from '@nuxt/test-utils/e2e';
import { describe, expect, it } from 'vitest';
import { setupE2E } from '../setup';

describe('navigation e2e test', async () => {
  await setupE2E();

  it('navigates to the puzzle selection page on desktop using the desktop navigation menu', async () => {
    const page = await createPage('/');

    try {
      // Set desktop size
      await page.setViewportSize({
        width: 1280,
        height: 720,
      });

      // Click Play
      await page.getByRole('link', { name: 'Play', exact: true }).click();

      // Verify navigation
      await page.waitForURL(`**/play`);
      expect(new URL(page.url()).pathname).toBe('/play');
    } finally {
      await page.close();
    }
  });

  it('navigates to the puzzle selection page on mobile using the mobile navigation menu', async () => {
    const page = await createPage('/');

    try {
      // Set mobile viewport size
      await page.setViewportSize({
        width: 360,
        height: 800,
      });

      // Open the UHeader hamburger menu
      await page.getByRole('button', { name: 'Open menu', exact: true }).click();

      // Scope interactions to the mobile menu
      const mobileMenu = page.locator('[data-slot="body"]');

      // Click Play
      await mobileMenu.getByRole('link', { name: 'Play', exact: true }).click();

      // Verify navigation
      await page.waitForURL(`**/play`);
      expect(new URL(page.url()).pathname).toBe('/play');
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
  ])('navigates to the selected puzzle page on desktop using the desktop navigation menu: %s %s', async (difficulty: string, size: string) => {
    const page = await createPage('/');

    try {
      // Set desktop size
      await page.setViewportSize({
        width: 1280,
        height: 720,
      });

      // Open the Play navigation dropdown
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

      // Verify navigation
      const expectedPath = `/puzzles/${difficulty}/${size}`;
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
  ])('navigates to the selected puzzle page on mobile using the mobile navigation menu: %s %s', async (difficulty: string, size: string) => {
    const page = await createPage('/');

    try {
      // Set mobile viewport size
      await page.setViewportSize({
        width: 360,
        height: 800,
      });

      // Open the UHeader hamburger menu
      await page.getByRole('button', { name: 'Open menu', exact: true }).click();

      // Scope interactions to the mobile #body slot.
      const mobileMenu = page.locator('[data-slot="body"]');

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

      // Verify navigation
      const expectedPath = `/puzzles/${difficulty}/${size}`;
      await page.waitForURL(`**${expectedPath}`);
      expect(new URL(page.url()).pathname).toBe(expectedPath);
    } finally {
      await page.close();
    }
  });

  it('navigates to an existing puzzle by slug', async () => {
    // Create puzzle
    const { slug } = await $fetch('/api/puzzles/system', {
      method: 'POST',
      query: {
        height: 5,
        width: 5,
        difficulty: 'normal',
      },
    });

    // Navigate to puzzle page by slug
    const page = await createPage(`/puzzles/id/${slug}`);

    try {
      // Verify puzzle page matches slug
      expect(new URL(page.url()).pathname).toBe(`/puzzles/id/${slug}`);

      await page.getByRole('heading', { name: 'Normal 5x5', exact: true }).waitFor();
      await page.getByRole('heading', { name: `Puzzle ID: ${slug}`, exact: true }).waitFor();
    } finally {
      await page.close();
    }
  });

  it('navigates to the credits page on desktop using the desktop navigation menu', async () => {
    const page = await createPage('/');

    try {
      // Set desktop size
      await page.setViewportSize({
        width: 1280,
        height: 720,
      });

      // Click Credits
      await page.getByRole('link', { name: 'Credits', exact: true }).click();

      // Verify navigation
      await page.waitForURL(`**/credits`);
      expect(new URL(page.url()).pathname).toBe('/credits');
    } finally {
      await page.close();
    }
  });

  it('navigates to the credits page on mobile using the mobile navigation menu', async () => {
    const page = await createPage('/');

    try {
      // Set mobile viewport size
      await page.setViewportSize({
        width: 360,
        height: 800,
      });

      // Open the UHeader hamburger menu
      await page.getByRole('button', { name: 'Open menu', exact: true }).click();

      // Scope interactions to the mobile menu
      const mobileMenu = page.locator('[data-slot="body"]');

      // Click Credits
      await mobileMenu.getByRole('link', { name: 'Credits', exact: true }).click();

      // Verify navigation
      await page.waitForURL(`**/credits`);
      expect(new URL(page.url()).pathname).toBe('/credits');
    } finally {
      await page.close();
    }
  });
});
