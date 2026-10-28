import type { PublicPuzzle } from '../../../../shared/types/puzzle';
import { describe, expect, it } from 'vitest';
import { generatePuzzle } from '../../../../server/nonograms/nonograms-generator';

describe('nonograms generator unit test', () => {
  it.each([
    [5, 5],
    [10, 10],
    [15, 15],
    [20, 20],
    [25, 25],
    [30, 30],
    [7, 7],
    [12, 12],
    [17, 17],
    [22, 22],
    [27, 27],
  ])('generates a normal %ix%i puzzle', (height, width) => {
    const puzzle: PublicPuzzle = generatePuzzle(height, width, 'normal');

    expect(puzzle).toBeDefined();
    expect(puzzle.slug).toMatch(/^[a-f0-9]{24}$/); // 12 bytes hexadecimal
    expect(puzzle.height).toBe(height);
    expect(puzzle.width).toBe(width);
    expect(puzzle.rowClues).toHaveLength(height);
    expect(puzzle.columnClues).toHaveLength(width);
    expect(puzzle.solutionHash).toMatch(/^[a-f0-9]{64}$/); // SHA-256 hexadecimal
    expect(puzzle.difficulty).toBe('normal');
  });

  it.each([
    [5, 5],
    [10, 10],
    [15, 15],
    [20, 20],
    [25, 25],
    [30, 30],
  ])('generates a hard %ix%i puzzle', (height, width) => {
    const puzzle: PublicPuzzle = generatePuzzle(height, width, 'hard');

    expect(puzzle).toBeDefined();
    expect(puzzle.slug).toMatch(/^[a-f0-9]{24}$/); // 12 bytes hexadecimal
    expect(puzzle.height).toBe(height);
    expect(puzzle.width).toBe(width);
    expect(puzzle.rowClues).toHaveLength(height);
    expect(puzzle.columnClues).toHaveLength(width);
    expect(puzzle.solutionHash).toMatch(/^[a-f0-9]{64}$/); // SHA-256 hexadecimal
    expect(puzzle.difficulty).toBe('hard');
  });
});
