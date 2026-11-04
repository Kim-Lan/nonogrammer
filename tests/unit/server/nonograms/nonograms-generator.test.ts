import type { NewPuzzle } from '../../../../server/database/schema';
import { describe, expect, it } from 'vitest';
import { generatePuzzle, generatePuzzleGrid } from '../../../../server/nonograms/nonograms-generator';
import { getClues } from '../../../../server/utils/nonograms-utils';
import { FILLED_VALUE } from '../../../../shared/constants/nonograms-constants';

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
  ])('generates a normal %ix%i puzzle', { timeout: 10_000 }, (height, width) => {
    const puzzle: NewPuzzle = generatePuzzle(height, width, 'normal');

    expect(puzzle).toBeDefined();
    expect(puzzle.height).toBe(height);
    expect(puzzle.width).toBe(width);
    expect(puzzle.rowClues).toHaveLength(height);
    expect(puzzle.columnClues).toHaveLength(width);
    expect(puzzle.solutionBits).toHaveLength(height * width);
    expect(puzzle.solutionBits).toMatch(/^[01]+$/);
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
  ])('generates a hard %ix%i puzzle', { timeout: 10_000 }, (height, width) => {
    const puzzle: NewPuzzle = generatePuzzle(height, width, 'hard');

    expect(puzzle).toBeDefined();
    expect(puzzle.height).toBe(height);
    expect(puzzle.width).toBe(width);
    expect(puzzle.rowClues).toHaveLength(height);
    expect(puzzle.columnClues).toHaveLength(width);
    expect(puzzle.solutionBits).toHaveLength(height * width);
    expect(puzzle.solutionBits).toMatch(/^[01]+$/);
    expect(puzzle.solutionHash).toMatch(/^[a-f0-9]{64}$/); // SHA-256 hexadecimal
    expect(puzzle.difficulty).toBe('hard');
  });

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
  ])('generates valid %ix%i puzzle grids (no empty lines, no full lines, and between 40% to 60% filled cells)', (height, width) => {
    for (let i = 0; i < 1000; i++) {
      const grid = generatePuzzleGrid(height, width);

      const { rowClues, columnClues } = getClues(grid);

      // Every row and column must have filled cells
      expect(rowClues.every(clues => clues.length > 0)).toBe(true);
      expect(columnClues.every(clues => clues.length > 0)).toBe(true);

      // No row or column may be completely filled
      expect(rowClues.every(clues => clues[0] !== width)).toBe(true);
      expect(columnClues.every(clues => clues[0] !== height)).toBe(true);

      // Verify the target density
      const filledCellCount = grid.flat().filter(cell => cell === FILLED_VALUE).length;
      const density = filledCellCount / (height * width);

      expect(density).toBeGreaterThanOrEqual(0.4);
      expect(density).toBeLessThanOrEqual(0.6);
    }
  });
});
