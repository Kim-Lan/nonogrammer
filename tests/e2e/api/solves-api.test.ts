import { fetch } from '@nuxt/test-utils/e2e';
import { describe, expect, it } from 'vitest';
import { setupE2E } from '../setup';

await setupE2E();

describe('POST /api/puzzles/[slug]/solves', async () => {
  it('returns a solved boolean for an existing puzzle slug', async () => {
    // Generate a system puzzle
    const { slug } = await $fetch('/api/puzzles/system', {
      method: 'POST',
      query: {
        height: 5,
        width: 5,
        difficulty: 'normal',
      },
    });
    expect(slug).toBeDefined();

    // Check puzzle solution
    const response = await $fetch(`/api/puzzles/${slug}/solves`, {
      method: 'POST',
      body: {
        grid: [['0', '0', '1', '0', '0'],
          ['0', '1', '1', '1', '0'],
          ['1', '1', '1', '1', '1'],
          ['0', '1', '1', '1', '0'],
          ['0', '0', '1', '0', '0']],
      },
    });

    expect(response.solved).toBeDefined();
    expect(typeof response.solved).toBe('boolean');
  });

  it('returns 400 when puzzle slug does not exist', async () => {
    const response = await fetch('/api/puzzles/nonexistent-puzzle-slug/solves', {
      method: 'POST',
      body: {
        grid: [['0', '0', '1', '0', '0'],
          ['0', '1', '1', '1', '0'],
          ['1', '1', '1', '1', '1'],
          ['0', '1', '1', '1', '0'],
          ['0', '0', '1', '0', '0']],
      },
    });

    expect(response.status).toBe(400);
  });
});
