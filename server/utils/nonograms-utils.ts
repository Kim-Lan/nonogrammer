import type { ClueGroup, Clues } from '../../shared/types/puzzle';
import type { CandidatePuzzle } from '../types/puzzle';
import type { Dimensions, Grid, Line } from './grid-utils';
import { createHash } from 'node:crypto';
import { ALLOWED_VALUES, EMPTY_VALUE, FILLED_VALUE } from '../../shared/constants/nonograms-constants';
import { getColumn, getDimensions, isValidGrid } from './grid-utils';

export function isValidCell(value: unknown): boolean {
  return typeof value === 'string' && ALLOWED_VALUES.includes(value);
}

export function getBlocks(arr: Line<string>): ClueGroup {
  const result: number[] = [];

  let current = 0;

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === FILLED_VALUE) {
      current++;
    } else if (current > 0) {
      result.push(current);
      current = 0;
    }
  }

  if (current > 0) {
    result.push(current);
  }

  return result;
}

export function getClues(grid: Grid<string>): { rowClues: Clues; columnClues: Clues } {
  if (!isValidGrid(grid, isValidCell)) {
    throw new Error('Invalid grid');
  }

  const rowClues: Clues = grid.map(row => getBlocks(row));

  const columnClues: Clues = Array.from(
    { length: grid[0].length },
    (_, c) => getBlocks(getColumn(grid, c)),
  );

  return {
    rowClues,
    columnClues,
  };
}

export function getSolutionBitsFromGrid(grid: Grid<string>): string {
  return (grid.flat()).join('');
}

export function getSolutionBitsFromSolverOutput(solverOutput: string): string {
  const result = solverOutput.split('\n');
  result.shift();
  return result.join('').replaceAll('X', FILLED_VALUE).replaceAll('.', EMPTY_VALUE);
}

export function getSolutionHashFromGrid(grid: Grid<string>): string {
  if (!isValidGrid(grid, isValidCell)) {
    throw new Error('Invalid grid');
  }

  const { height, width }: Dimensions = getDimensions(grid);

  const solutionBits: string = getSolutionBitsFromGrid(grid);

  return createHash('sha256')
    .update(`${height}x${width}:${solutionBits}`)
    .digest('hex');
}

export function convertPuzzleToNon(puzzle: CandidatePuzzle): string {
  const strArray: string[] = [];
  strArray.push(`width ${puzzle.width}`);
  strArray.push(`height ${puzzle.height}`);

  strArray.push('');
  strArray.push('rows');
  for (const row of puzzle.rowClues) {
    strArray.push(row.join(','));
  }

  strArray.push('');
  strArray.push('columns');
  for (const column of puzzle.columnClues) {
    strArray.push(column.join(','));
  }

  if (puzzle.solutionBits) {
    strArray.push('');
    strArray.push(`goal "${puzzle.solutionBits}"`);
  }

  return strArray.join('\n');
}
