import type { CandidatePuzzle, PuzzleSolver } from '../types/puzzle';

export type SolverOutput = {
  solvable: boolean;
  uniqueSolution: boolean;
  solver: PuzzleSolver;
  solutionBits: string | null;
};

export function checkWithSolver(puzzle: CandidatePuzzle): SolverOutput {

}
