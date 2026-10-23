import type { LineSolverOutput } from '../../../../server/nonograms/nonograms-solver';
import type { CandidatePuzzle } from '../../../../server/types/puzzle';
import { describe, expect, it } from 'vitest';

describe('nonograms solver unit test', () => {
  describe('line solver', () => {
    it('detects a puzzle with a unique solution', () => {
      const puzzle: CandidatePuzzle = {
        height: 5,
        width: 5,
        rowClues: [[1, 1, 1], [1, 1], [1, 1, 1], [1, 1], [1, 1, 1]],
        columnClues: [[1, 1, 1], [1, 1], [1, 1, 1], [1, 1], [1, 1, 1]],
      };

      const result: LineSolverOutput = checkWithLineSolver(puzzle);

      expect(result).toBeDefined();
      expect(result).toMatchObject({
        solvable: true,
        uniqueSolution: true,
      });
      expect(result.iterationCount).toBeGreaterThan(0);
      expect(result.solutionBits).toMatch(/^[01]{25}$/);
    });

    it('detects a puzzle with a unique solution when given the solution', () => {
      const puzzle: CandidatePuzzle = {
        height: 5,
        width: 5,
        rowClues: [[1, 1, 1], [1, 1], [1, 1, 1], [1, 1], [1, 1, 1]],
        columnClues: [[1, 1, 1], [1, 1], [1, 1, 1], [1, 1], [1, 1, 1]],
        solutionBits: '1010101010101010101010101',
      };

      const result: LineSolverOutput = checkWithLineSolver(puzzle);

      expect(result).toBeDefined();
      expect(result).toMatchObject({
        solvable: true,
        uniqueSolution: true,
      });
      expect(result.iterationCount).toBeGreaterThan(0);
      expect(result.solutionBits).toMatch(/^[01]{25}$/);
    });

    it('detects a puzzle without a unique solution', () => {
      const puzzle: CandidatePuzzle = {
        height: 5,
        width: 5,
        rowClues: [[1, 1], [1, 1], [1, 1], [1, 1], [1, 1]],
        columnClues: [[1, 1], [1, 1], [1, 1], [1, 1], [1, 1]],
      };

      const result: LineSolverOutput = checkWithLineSolver(puzzle);

      expect(result).toBeDefined();
      expect(result).toMatchObject({
        solvable: true,
        uniqueSolution: false,
      });
      expect(result.iterationCount).toBeGreaterThan(0);
      expect(result.solutionBits).toBeNull();
    });

    it('detects a puzzle without a unique solution when given a solution', () => {
      const puzzle: CandidatePuzzle = {
        height: 5,
        width: 5,
        rowClues: [[1, 1], [1, 1], [1, 1], [1, 1], [1, 1]],
        columnClues: [[1, 1], [1, 1], [1, 1], [1, 1], [1, 1]],
        solutionBits: '0101010100010100010110001',
      };

      const result: LineSolverOutput = checkWithLineSolver(puzzle);

      expect(result).toBeDefined();
      expect(result).toMatchObject({
        solvable: true,
        uniqueSolution: false,
      });
      expect(result.iterationCount).toBeGreaterThan(0);
      expect(result.solutionBits).toBeNull();
    });

    it('detects an unsolvable puzzle', () => {
      const puzzle: CandidatePuzzle = {
        height: 5,
        width: 5,
        rowClues: [[3, 1], [1, 1], [1, 1, 1], [1, 1], [1, 1, 1]],
        columnClues: [[1, 1, 1], [1, 1], [1, 1, 1], [1, 1], [1, 1, 1]],
      };

      const result: LineSolverOutput = checkWithLineSolver(puzzle);

      expect(result).toBeDefined();
      expect(result).toMatchObject({
        solvable: false,
        uniqueSolution: false,
      });
      expect(result.iterationCount).toBeNull();
      expect(result.solutionBits).toBeNull();
    });

    it('detects an unsolvable puzzle when given an incorrect solution', () => {
      const puzzle: CandidatePuzzle = {
        height: 5,
        width: 5,
        rowClues: [[3, 1], [1, 1], [1, 1, 1], [1, 1], [1, 1, 1]],
        columnClues: [[1, 1, 1], [1, 1], [1, 1, 1], [1, 1], [1, 1, 1]],
        solutionBits: '1010101010101010101010101',
      };

      const result: LineSolverOutput = checkWithLineSolver(puzzle);

      expect(result).toBeDefined();
      expect(result).toMatchObject({
        solvable: false,
        uniqueSolution: false,
      });
      expect(result.iterationCount).toBeNull();
      expect(result.solutionBits).toBeNull();
    });
  });
});
