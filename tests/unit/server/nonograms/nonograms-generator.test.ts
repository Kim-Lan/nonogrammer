import type { PublicPuzzle } from '../../../../shared/types/puzzle';
import { describe, expect, it } from 'vitest';
import { generateNormalPuzzleBySize } from '../../../../server/nonograms/nonograms-generator';

describe('nonograms generator unit test', () => {
  it.each([
    [5, 5],
    [10, 10],
    [15, 15],
    [20, 20],
    [25, 25],
    [30, 30],
  ])('generates normal %ix%i puzzle', (height, width) => {
    const puzzle: PublicPuzzle = generateNormalPuzzleBySize(height, width);

    expect(puzzle).toBeDefined();
    expect(puzzle.slug).toMatch(/^[a-f0-9]{24}$/); // 12 bytes hexadecimal
    expect(puzzle.height).toBe(height);
    expect(puzzle.width).toBe(width);
    expect(puzzle.rowClues).toHaveLength(height);
    expect(puzzle.columnClues).toHaveLength(width);
    expect(puzzle.solutionHash).toMatch(/^[a-f0-9]{64}$/); // SHA-256 hexadecimal
    expect(puzzle.difficulty).toBe('normal');
  });
});
