export const puzzleTypes = ['system', 'daily', 'community'] as const;
export const puzzleGenerators = ['batenburg-kosters', 'tatham'] as const;
export const puzzleDifficulties = ['normal', 'hard'] as const;
export const puzzleSolvers = ['line', 'four'] as const;
export const puzzlePublicationStatuses = ['draft', 'published', 'unpublished'] as const;
export const puzzleValidationStatuses = ['pending', 'valid', 'invalid'] as const;

export type PuzzleType = typeof puzzleTypes[number];
export type PuzzleGeneartor = typeof puzzleGenerators[number];
export type PuzzleDifficulty = typeof puzzleDifficulties[number];
export type PuzzleSolver = typeof puzzleSolvers[number];
export type PuzzlePublicationStatus = typeof puzzlePublicationStatuses[number];
export type PuzzleValidationStatus = typeof puzzleValidationStatuses[number];
export type PuzzleClues = number[][];

export type PublicPuzzle = {
  slug: string;
  height: number;
  width: number;
  rowClues: PuzzleClues;
  columnClues: PuzzleClues;
  solutionHash: string;
  difficulty: PuzzleDifficulty | null;
};
