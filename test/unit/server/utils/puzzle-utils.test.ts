import { describe, expect, it } from 'vitest';
import { generatePuzzleSlug } from '../../../../server/utils/puzzle-utils';

describe('puzzle utils unit test', () => {
  it('generates a valid puzzle slug', () => {
    const slug = generatePuzzleSlug();

    expect(slug).toMatch(/^[a-f0-9]{24}$/);
  });
});
