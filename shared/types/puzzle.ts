export const puzzleTypes = ['system', 'daily', 'community'] as const;
export const puzzleDifficulties = ['normal', 'hard'] as const;
export const puzzleSolverMethods = ['simple', 'four'] as const;
export const puzzlePublicationStatuses = ['draft', 'published', 'unpublished'] as const;
export const puzzleValidationStatuses = ['pending', 'valid', 'invalid'] as const;

export type PuzzleType = typeof puzzleTypes[number];
export type PuzzleDifficulty = typeof puzzleDifficulties[number];
export type PuzzleSolverMethod = typeof puzzleSolverMethods[number];
export type PuzzlePublicationStatus = typeof puzzlePublicationStatuses[number];
export type PuzzleValidationStatus = typeof puzzleValidationStatuses[number];
export type PuzzleClues = number[][];

export type PublicPuzzle = {
  id: number;
  slug: string;
  height: number;
  width: number;
  rowClues: PuzzleClues;
  columnClues: PuzzleClues;
  difficulty: PuzzleDifficulty | null;
};
