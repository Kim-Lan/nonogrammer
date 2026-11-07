import type { Clues, Nullable, PuzzleDifficulty } from '../../shared/types/puzzle';
import type { Grid } from '../types/grid';
import type { CandidatePuzzle, GeneratedPuzzle } from '../types/puzzle';
import type { SolverOutput } from './nonograms-solver';
import { createError } from 'nuxt/server';
import random from 'random';
import { FILLED_VALUE } from '../../shared/constants/nonograms-constants';
import { range, shuffle } from '../utils/array-utils';
import { convert2DToIndex, convertIndexTo2D, getColumn } from '../utils/grid-utils';
import { createEmptyPuzzleGrid, getClues, getSolutionBitsFromGrid, getSolutionHashFromGrid } from '../utils/nonograms-utils';
import { checkWithSolver } from './nonograms-solver';

export function generatePuzzle(height: number, width: number, difficulty: PuzzleDifficulty): Nullable<GeneratedPuzzle> {
  if (!Number.isInteger(height) || !Number.isInteger(width) || height < 2 || width < 2) {
    throw createError({
      status: 400,
      statusText: 'Bad Request',
      message: 'Invalid puzzle dimensions',
    });
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
  if (!Number.isInteger(height) || !Number.isInteger(width)) {
    throw createError({
      status: 400,
      statusText: 'Bad Request',
      message: 'Puzzle dimensions must be integers',
    });
  } else if (height < 2 || width < 2) {
    throw createError({
      status: 400,
      statusText: 'Bad Request',
      message: 'Puzzle dimensions must be at least 2x2',
    });
  }

  const grid: Grid<string> = createEmptyPuzzleGrid(height, width);

  const totalCells: number = height * width;
  const requiredCells = Math.max(height, width);
  const minFilledCells: number = Math.max(Math.ceil(0.4 * totalCells), requiredCells);
  const maxFilledCells: number = Math.min(Math.floor(0.6 * totalCells), totalCells - requiredCells);
  const filledCells: number = random.int(minFilledCells, maxFilledCells);

  const availableIndices: number[] = range(totalCells);
  let filledCellCount = 0;

  function fillCell(r: number, c: number) {
    if (r < 0 || r >= height || c < 0 || c >= width) {
      throw createError({
        status: 500,
        statusText: 'Internal Server Error',
        message: 'Filling invalid cell',
      });
    }

    if (grid[r]![c] === FILLED_VALUE) {
      return;
    }

    const index: number = convert2DToIndex(r, c, width);
    const position: number = availableIndices.indexOf(index);

    if (position === -1) {
      throw createError({
        status: 500,
        statusText: 'Internal Server Error',
        message: 'Cell index not found',
      });
    }

    availableIndices.splice(position, 1);

    grid[r]![c] = FILLED_VALUE;
    filledCellCount++;
  }

  const rowIndices: number[] = range(height);
  const columnIndices: number[] = range(width);

  shuffle(rowIndices);
  shuffle(columnIndices);

  // Guarantee every row and column has at least one filled cell
  // and at least one empty cell
  for (let i = 0; i < requiredCells; i++) {
    // Fill one cell
    const filledR = rowIndices[i % height]!;
    const filledC = columnIndices[i % width]!;
    fillCell(filledR, filledC);

    // Reserve one cell as empty
    const emptyR = width >= height ? rowIndices[(i + 1) % height]! : filledR;
    const emptyC = width >= height ? filledC : columnIndices[(i + 1) % width]!;

    const emptyIndex: number = convert2DToIndex(emptyR, emptyC, width);
    const position: number = availableIndices.indexOf(emptyIndex);

    if (position === -1) {
      throw createError({
        status: 500,
        statusText: 'Internal Server Error',
        message: 'Failed to reserve empty cell',
      });
    }

    availableIndices.splice(position, 1);
  }

  while (filledCellCount < filledCells && availableIndices.length > 0) {
    const chosenIndex: number = random.int(0, availableIndices.length - 1);
    const index: number = availableIndices[chosenIndex]!;
    const { rowIndex: r, columnIndex: c }: { rowIndex: number; columnIndex: number } = convertIndexTo2D(index, width);

    fillCell(r, c);
  }

  if (filledCellCount !== filledCells) {
    throw createError({
      status: 500,
      statusText: 'Internal Server Error',
      message: 'Failed to fill puzzle',
    });
  }

  // Check rows
  for (const row of grid) {
    if (!row.includes(FILLED_VALUE)) {
      throw createError({
        status: 500,
        statusText: 'Internal Server Error',
        message: 'Generated puzzle contains an empty row',
      });
    }

    if (row.every(cell => cell === FILLED_VALUE)) {
      throw createError({
        status: 500,
        statusText: 'Internal Server Error',
        message: 'Generated puzzle contains a completely filled row',
      });
    }
  }

  // Check columns
  for (let c = 0; c < width; c++) {
    const column = getColumn(grid, c);

    if (!column.includes(FILLED_VALUE)) {
      throw createError({
        status: 500,
        statusText: 'Internal Server Error',
        message: 'Generated puzzle contains an empty column',
      });
    }

    if (column.every(cell => cell === FILLED_VALUE)) {
      throw createError({
        status: 500,
        statusText: 'Internal Server Error',
        message: 'Generated puzzle contains a completely filled column',
      });
    }
  }

  return grid;
}
