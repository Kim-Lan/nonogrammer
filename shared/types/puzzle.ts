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

export type PublicPuzzle = {
  slug: string;
  height: number;
  width: number;
  rowClues: Clues;
  columnClues: Clues;
  solutionHash: string;
  difficulty: PuzzleDifficulty | null;
};
