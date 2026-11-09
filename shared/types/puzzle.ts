import type { EMPTY_VALUE, FILLED_VALUE, MARKED_VALUE } from '../constants/nonograms-constants';

export const puzzleTypes = ['system', 'daily', 'community'] as const;
export const puzzleDifficulties = ['normal', 'hard'] as const;
export const puzzlePublicationStatuses = ['draft', 'published', 'unpublished'] as const;
export const puzzleValidationStatuses = ['pending', 'valid', 'invalid'] as const;

export type Nullable<T> = T | null | undefined;

export type PuzzleType = typeof puzzleTypes[number];
export type PuzzleDifficulty = typeof puzzleDifficulties[number];
export type PuzzlePublicationStatus = typeof puzzlePublicationStatuses[number];
export type PuzzleValidationStatus = typeof puzzleValidationStatuses[number];

export type Clues = ClueGroup[];
export type ClueGroup = number[];

export type CellState = typeof EMPTY_VALUE | typeof FILLED_VALUE | typeof MARKED_VALUE;

export type PublicPuzzle = {
  slug: string;
  type: PuzzleType;
  height: number;
  width: number;
  rowClues: Clues;
  columnClues: Clues;
  solutionHash: string;
  difficulty: PuzzleDifficulty | null;
};
