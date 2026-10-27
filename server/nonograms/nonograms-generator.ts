import type { PublicPuzzle } from '../../shared/types/puzzle';
import type { CandidatePuzzle } from '../types/puzzle';
import type { Clues } from '../utils/nonograms-utils';
import type { SolverOutput } from './nonograms-solver';
import { getClues, getSolutionBitsFromGrid, getSolutionHashFromGrid } from '../utils/nonograms-utils';
import { generatePuzzleSlug } from '../utils/puzzle-utils';
import { checkWithSolver } from './nonograms-solver';

// TODO: refactor to take difficulty as an input
export function generateNormalPuzzleBySize(height: number, width: number): PublicPuzzle {
  // TODO: create a do-while loop to generate puzzles until a valid is one is found
  const puzzleGrid: string[][] = Array.from({ length: height },
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

  if (solverOutput.solvable) {
    const puzzleObject: PublicPuzzle = {
      slug: generatePuzzleSlug(),
      height,
      width,
      rowClues,
      columnClues,
      solutionHash: getSolutionHashFromGrid(puzzleGrid),
      difficulty: 'normal',
    };

    return puzzleObject;
  }

  return null;
}
