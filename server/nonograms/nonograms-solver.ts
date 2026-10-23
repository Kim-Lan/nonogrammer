import type { CandidatePuzzle } from '../types/puzzle';

export type LineSolverOutput = {
  solvable: boolean;
  uniqueSolution: boolean;
  iterationCount: number | null;
  solutionBits: string | null;
};

export function checkWithLineSolver(puzzle: CandidatePuzzle): LineSolverOutput {

}

export function lineSolve(line: string[], clues: number[]) {

}

export function isSolved(grid: string[][], rowClues: number[][], columnClues: number[][]) {

}
