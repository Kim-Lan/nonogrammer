import type { PublicPuzzle } from '../../../../shared/types/puzzle';
import { describe, expect, it } from 'vitest';
import { generatePuzzleBySize } from '../../../../server/nonograms/nonograms-generator';

describe('nonograms generator unit test', () => {
  it('generates system puzzles by size', () => {
    const puzzle_5x5: PublicPuzzle = generatePuzzleBySize(5, 5);

    expect(puzzle_5x5).toBeDefined();
    expect(puzzle_5x5.slug).toBeDefined();
    expect(puzzle_5x5.height).toBe(5);
    expect(puzzle_5x5.width).toBe(5);
    expect(puzzle_5x5.rowClues).toHaveLength(5);
    expect(puzzle_5x5.columnClues).toHaveLength(5);
    expect(puzzle_5x5.solutionHash).toBeDefined();
    expect(puzzle_5x5.difficulty).toBeDefined();

    const puzzle_30x30: PublicPuzzle = generatePuzzleBySize(30, 30);

    expect(puzzle_30x30).toBeDefined();
    expect(puzzle_30x30.slug).toBeDefined();
    expect(puzzle_30x30.height).toBe(30);
    expect(puzzle_30x30.width).toBe(30);
    expect(puzzle_30x30.rowClues).toHaveLength(30);
    expect(puzzle_30x30.columnClues).toHaveLength(30);
    expect(puzzle_30x30.solutionHash).toBeDefined();
    expect(puzzle_30x30.difficulty).toBeDefined();
  });
});
