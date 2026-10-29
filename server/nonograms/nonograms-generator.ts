import type { Clues, Nullable, PuzzleDifficulty } from '../../shared/types/puzzle';
import type { CandidatePuzzle, GeneratedPuzzle } from '../types/puzzle';
import type { Grid } from '../utils/grid-utils';
import type { SolverOutput } from './nonograms-solver';
import random from 'random';
import { FILLED_VALUE } from '../../shared/constants/nonograms-constants';
import { range } from '../utils/array-utils';
import { convert2DToIndex, convertIndexTo2D, getColumn } from '../utils/grid-utils';
import { createEmptyPuzzleGrid, getClues, getSolutionBitsFromGrid, getSolutionHashFromGrid, hasSpace } from '../utils/nonograms-utils';
import { checkWithSolver } from './nonograms-solver';

export function generatePuzzle(height: number, width: number, difficulty: PuzzleDifficulty): Nullable<GeneratedPuzzle> {
  if (!height || !width || height <= 0 || width <= 0) {
    throw new Error('Invalid puzzle dimensions');
  }

  let puzzleGrid: Nullable<Grid<string>> = null;
  let puzzleObject: Nullable<GeneratedPuzzle> = null;
  let count: number = 0;
  let done: boolean = false;

  do {
    puzzleGrid = generatePuzzleGrid(height, width);

    const { rowClues, columnClues }: { rowClues: Clues; columnClues: Clues } = getClues(puzzleGrid);

    const solutionBits: string = getSolutionBitsFromGrid(puzzleGrid);

    const candidatePuzzle: CandidatePuzzle = {
      height,
      width,
      rowClues,
      columnClues,
      solutionBits,
    };

    const solverOutput: SolverOutput = checkWithSolver(candidatePuzzle);

    if (solverOutput.valid
      && (
        (solverOutput.solver === 'line' && difficulty === 'normal')
        || (solverOutput.solver === 'depth-2' && difficulty === 'hard')
      )
    ) {
      puzzleObject = {
        height,
        width,
        rowClues,
        columnClues,
        solutionBits,
        solutionHash: getSolutionHashFromGrid(puzzleGrid),
        difficulty,
        solver: solverOutput.solver,
      };

      done = true;
    }

    count++;
  } while (!done && count < 100_000);

  return puzzleObject;
}

export function generatePuzzleGrid(height: number, width: number): Grid<string> {
  const grid: Grid<string> = createEmptyPuzzleGrid(height, width);

  const totalCells: number = height * width;
  const filledCells: number = random.int(Math.ceil(0.4 * totalCells), Math.floor(0.6 * totalCells)); // fill between 40% and 60% of total cells

  const indexArray: number[] = range(totalCells);
  let count = 0;

  function fillCell(r: number, c: number) {
    const index: number = convert2DToIndex(r, c, width);
    indexArray.splice(indexArray.indexOf(index), 1);

    if (r < 0 || r > grid.length || c < 0 || c > grid[0].length) {
      throw new Error('Filling invalid cell');
    }

    grid[r]![c] = FILLED_VALUE;
    count++;
  }

  // prevent empty rows or columns
  // fill one cell in each row
  for (let r = 0; r < height; r++) {
    const c: number = random.int(0, width - 1);
    fillCell(r, c);
  }

  // check if each column has a filled cell; if not, fill one
  for (let c = 0; c < width; c++) {
    const column: Line<string> = getColumn(grid, c);
    if (!column.indexOf(FILLED_VALUE)) {
      const r: number = random.int(0, height - 1);
      fillCell(r, c);
    }
  }

  while (count < filledCells && indexArray.length > 0) {
    const chosenIndex: number = random.int(0, indexArray.length - 1);
    const index: number = indexArray[chosenIndex]!;
    const { rowIndex: r, columnIndex: c }: { rowIndex: number; columnIndex: number } = convertIndexTo2D(index, width);

    if (hasSpace(grid, r, c)) {
      fillCell(r, c);
    } else {
      indexArray.splice(chosenIndex, 1); // remove possible index if there is a full row or column
    }
  }

  if (count !== filledCells) {
    throw new Error('Failed to fill puzzle');
  }

  return grid;
}
