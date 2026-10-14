import type { PublicPuzzle } from '../../shared/types/puzzle';
import type { Clues } from '../utils/nonograms-utils';
import { getClues, getSolutionHash } from '../utils/nonograms-utils';
import { generatePuzzleSlug } from '../utils/puzzle-utils';

export function generatePuzzleBySize(height: number, width: number): PublicPuzzle {
  const puzzleGrid: string[][] = Array.from({ length: height },
    () => Array.from({ length: width }, () => Math.random() < 0.5 ? '0' : '1'));

  const { rowClues, columnClues }: Clues = getClues(puzzleGrid);

  const puzzleObject: PublicPuzzle = {
    slug: generatePuzzleSlug(),
    height,
    width,
    rowClues,
    columnClues,
    solutionHash: getSolutionHash(puzzleGrid),
    difficulty: 'normal',
  };

  return puzzleObject;
}
