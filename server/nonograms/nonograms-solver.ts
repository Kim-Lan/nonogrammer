import type { CandidatePuzzle } from '../types/puzzle';

export type SimpleSolverOutput = {
  solvable: boolean;
  uniqueSolution: boolean;
  sweepCount: number | null;
  solutionBits: string | null;
};

export function checkWithSimpleSolver(puzzle: CandidatePuzzle): SimpleSolverOutput {

}

export function horizontalSweep(grid: string[][], rowClues: number[][], columnClues: number[][]) {

}

export function verticalSweep(grid: string[][], rowClues: number[][], columnClues: number[][]) {

}

export function settleLine(line: string[], clues: number[]) {

}

export function isSolved(grid: string[][], rowClues: number[][], columnClues: number[][]) {

}
