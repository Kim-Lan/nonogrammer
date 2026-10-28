import { $fetch, fetch, setup } from '@nuxt/test-utils/e2e';
import { describe, expect, it } from 'vitest';

await setup({
  server: true,
  browser: false,
  setupTimeout: 300_000,
});

describe('GET /api/puzzle/system', () => {
  it.each([
    [5, 5],
    [10, 10],
    [15, 15],
    [20, 20],
    [25, 25],
    [30, 30],
  ])('returns a normal %ix%i system puzzle', { timeout: 120_000 }, async (height, width) => {
    const query = {
      height,
      width,
      difficulty: 'normal',
    };

    const response = await $fetch('/api/puzzle/system', {
      method: 'GET',
      query,
    });

    expect(response).toBeDefined();
    expect(response).toMatchObject(query);
    expect(response.slug).toMatch(/^[a-f0-9]{24}$/); // 12 bytes hexadecimal
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
  ])('returns 400 when requesting a normal %ix%i system puzzle', async (height, width) => {
    const response = await fetch('/api/puzzle/system', {
      method: 'GET',
      query: {
        height,
        width,
        difficulty: 'normal',
      },
    });

    expect(response).toBeDefined();
    expect(response.status).toBe(400);
  });

  it('returns 400 when requesting an invalid puzzle difficulty', async () => {
    const response = await fetch('/api/puzzle/system', {
      method: 'GET',
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
