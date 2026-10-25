export const puzzleGenerators = ['batenburg-kosters', 'tatham'] as const;
export const puzzleSolvers = ['line', 'depth-2'] as const;

export type PuzzleGenerator = typeof puzzleGenerators[number];
export type PuzzleSolver = typeof puzzleSolvers[number];

export type CandidatePuzzle = {
  height: number;
  width: number;
  rowClues: number[][];
  columnClues: number[][];
  solutionBits?: string;
};
