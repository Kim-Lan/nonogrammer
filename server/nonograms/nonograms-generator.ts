import type { Nullable, PublicPuzzle, PuzzleDifficulty } from '../../shared/types/puzzle';
import type { CandidatePuzzle } from '../types/puzzle';
import type { Clues } from '../utils/nonograms-utils';
import type { SolverOutput } from './nonograms-solver';
import { getClues, getSolutionBitsFromGrid, getSolutionHashFromGrid } from '../utils/nonograms-utils';
import { generatePuzzleSlug } from '../utils/puzzle-utils';
import { checkWithSolver } from './nonograms-solver';

export function generatePuzzle(height: number, width: number, difficulty: PuzzleDifficulty): Nullable<PublicPuzzle> {
  let puzzleGrid: string[][] = [];
  let puzzleObject: Nullable<PublicPuzzle> = null;
  let count: number = 0;
  let done: boolean = false;

  do {
    puzzleGrid = Array.from({ length: height },
      () => Array.from({ length: width }, () => Math.random() < 0.5 ? '0' : '1'));

    const { rowClues, columnClues }: Clues = getClues(puzzleGrid);

    const candidatePuzzle: CandidatePuzzle = {
      height,
      width,
      rowClues,
      columnClues,
      solutionBits: getSolutionBitsFromGrid(puzzleGrid),
    };

    const solverOutput: SolverOutput = checkWithSolver(candidatePuzzle);

    if (solverOutput.solvable
      && (
        (solverOutput.solver === 'line' && difficulty === 'normal')
        || (solverOutput.solver === 'depth-2' && difficulty === 'hard')
      )
    ) {
      puzzleObject = {
        slug: generatePuzzleSlug(),
        height,
        width,
        rowClues,
        columnClues,
        solutionHash: getSolutionHashFromGrid(puzzleGrid),
        difficulty,
      };

      done = true;
    }

    count++;
  } while (!done && count < 100_000);

  return puzzleObject;
}
