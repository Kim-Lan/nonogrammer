import type { Clues, Nullable, PublicPuzzle, PuzzleDifficulty } from '../../shared/types/puzzle';
import type { CandidatePuzzle } from '../types/puzzle';
import type { Grid } from '../utils/grid-utils';
import type { SolverOutput } from './nonograms-solver';
import { EMPTY_VALUE, FILLED_VALUE } from '../../shared/constants/nonograms-constants';
import { getClues, getSolutionBitsFromGrid, getSolutionHashFromGrid } from '../utils/nonograms-utils';
import { generatePuzzleSlug } from '../utils/puzzle-utils';
import { checkWithSolver } from './nonograms-solver';

export function generatePuzzle(height: number, width: number, difficulty: PuzzleDifficulty): Nullable<PublicPuzzle> {
  let puzzleGrid: Nullable<Grid<string>> = null;
  let puzzleObject: Nullable<PublicPuzzle> = null;
  let count: number = 0;
  let done: boolean = false;

  do {
    puzzleGrid = generatePuzzleGrid(height, width);

    const { rowClues, columnClues }: { rowClues: Clues; columnClues: Clues } = getClues(puzzleGrid);

    const candidatePuzzle: CandidatePuzzle = {
      height,
      width,
      rowClues,
      columnClues,
      solutionBits: getSolutionBitsFromGrid(puzzleGrid),
    };

    const solverOutput: SolverOutput = checkWithSolver(candidatePuzzle);

    if (solverOutput.valid
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

export function generatePuzzleGrid(height: number, width: number): Grid<string> {
  const grid: Grid<string> = Array.from({ length: height },
    () => Array.from({ length: width }, () => Math.random() < 0.5 ? EMPTY_VALUE : FILLED_VALUE)) as Grid<string>;

  return grid;
}
