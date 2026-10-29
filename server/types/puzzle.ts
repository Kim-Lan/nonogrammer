import type { Clues, PuzzleDifficulty } from '../../shared/types/puzzle';
import type { puzzles } from '../database/schema';

export const puzzleGenerators = ['batenburg-kosters', 'tatham'] as const;
export const puzzleSolvers = ['line', 'depth-2'] as const;

export type PuzzleGenerator = typeof puzzleGenerators[number];
export type PuzzleSolver = typeof puzzleSolvers[number];

export type CandidatePuzzle = {
  height: number;
  width: number;
  rowClues: Clues;
  columnClues: Clues;
  solutionBits?: string;
};

export type GeneratedPuzzle = {
  height: number;
  width: number;
  rowClues: Clues;
  columnClues: Clues;
  solutionBits: string;
  solutionHash: string;
  difficulty: PuzzleDifficulty;
  solver: PuzzleSolver;
};

export type Puzzle = typeof puzzles.$inferSelect;
export type NewPuzzle = typeof puzzles.$inferInsert;
