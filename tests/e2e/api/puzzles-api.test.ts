import { $fetch, fetch } from '@nuxt/test-utils/e2e';
import { describe, expect, it } from 'vitest';
import { setupE2E } from '../setup';

await setupE2E();

describe('GET /api/puzzles/[slug]', async () => {
  it('retrieves an existing puzzle by slug', async () => {
    // Generate a system puzzle
    const { slug, solutionHash } = await $fetch('/api/puzzles/system', {
      method: 'POST',
      query: {
        height: 5,
        width: 5,
        difficulty: 'normal',
      },
    });
    expect(slug).toBeDefined();
    expect(solutionHash).toBeDefined();

    // Retrieve puzzle by slug
    const response = await $fetch(`/api/puzzles/${slug}`, {
      method: 'GET',
    });

    expect(response).toBeDefined();
    expect(response.slug).toBe(slug);
    expect(response.solutionHash).toBe(solutionHash);
  });

  it('returns 404 when puzzle slug does not exist', async () => {
    const response = await fetch('/api/puzzles/nonexistent-puzzle-slug', {
      method: 'GET',
    });

    expect(response.status).toBe(404);
  });
});

describe('POST /api/puzzles/system', async () => {
  it.each([
    [5, 5],
    [10, 10],
    [15, 15],
    [20, 20],
    [25, 25],
    [30, 30],
  ])('generates and returns a normal %ix%i system puzzle', async (height, width) => {
    const query = {
      height,
      width,
      difficulty: 'normal',
    };

    const response = await $fetch('/api/puzzles/system', {
      method: 'POST',
      query,
    });

    expect(response).toBeDefined();
    expect(response).toMatchObject(query);
    expect(response.slug).toMatch(/^[a-f0-9]{12}$/); // 6 bytes hexadecimal
    expect(response.rowClues).toHaveLength(height);
    expect(response.columnClues).toHaveLength(width);
    expect(response.solutionHash).toMatch(/^[a-f0-9]{64}$/); // SHA-256 hexadecimal
  });

  it.each([
    [5, 5],
    [10, 10],
    [15, 15],
    [20, 20],
    [25, 25],
    [30, 30],
  ])('generates and returns a hard %ix%i system puzzle', async (height, width) => {
    const query = {
      height,
      width,
      difficulty: 'hard',
    };

    const response = await $fetch('/api/puzzles/system', {
      method: 'POST',
      query,
    });

    expect(response).toBeDefined();
    expect(response).toMatchObject(query);
    expect(response.slug).toMatch(/^[a-f0-9]{12}$/); // 6 bytes hexadecimal
    expect(response.rowClues).toHaveLength(height);
    expect(response.columnClues).toHaveLength(width);
    expect(response.solutionHash).toMatch(/^[a-f0-9]{64}$/); // SHA-256 hexadecimal
  });

  it.each([
    [5, 10],
    [10, 15],
    [15, 20],
    [20, 25],
    [25, 30],
    [30, 5],
    [4, 4],
    [4, 15],
    [31, 31],
    [15, 31],
    [7, 7],
    [12, 12],
    [17, 17],
    [22, 22],
    [27, 27],
  ])('returns 400 when requesting a normal %ix%i system puzzle', { timeout: 10_000 }, async (height, width) => {
    const response = await fetch('/api/puzzles/system', {
      method: 'POST',
      query: {
        height,
        width,
        difficulty: 'normal',
      },
    });

    expect(response).toBeDefined();
    expect(response.status).toBe(400);
  });

  it.each([
    [5, 10],
    [10, 15],
    [15, 20],
    [20, 25],
    [25, 30],
    [30, 5],
    [4, 4],
    [4, 15],
    [31, 31],
    [15, 31],
    [7, 7],
    [12, 12],
    [17, 17],
    [22, 22],
    [27, 27],
  ])('returns 400 when requesting a hard %ix%i system puzzle', async (height, width) => {
    const response = await fetch('/api/puzzles/system', {
      method: 'POST',
      query: {
        height,
        width,
        difficulty: 'hard',
      },
    });

    expect(response).toBeDefined();
    expect(response.status).toBe(400);
  });

  it('returns 400 when requesting an invalid puzzle difficulty', async () => {
    const response = await fetch('/api/puzzles/system', {
      method: 'POST',
      query: {
        height: 5,
        width: 5,
        difficulty: 'easy',
      },
    });

    expect(response).toBeDefined();
    expect(response.status).toBe(400);
  });
});
