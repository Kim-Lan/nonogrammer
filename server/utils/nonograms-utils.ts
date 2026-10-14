import type { Dimensions } from './grid-utils';
import { createHash } from 'node:crypto';
import { ALLOWED_VALUES, FILLED_VALUE } from '../../shared/constants/nonograms-constants';
import { getColumn, getDimensions, isValidGrid } from './grid-utils';

export type Clues = {
  rowClues: number[][];
  columnClues: number[][];
};

export function isValidCell(value: unknown): boolean {
  return typeof value === 'string' && ALLOWED_VALUES.includes(value);
}

export function getBlocks(arr: string[]): number[] {
  if (!arr) {
    throw new Error('Invalid line');
  }

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

export function getClues(grid: string[][]): Clues {
  if (!isValidGrid(grid, isValidCell)) {
    throw new Error('Invalid grid');
  }

  const rowClues: number[][] = grid.map(row => getBlocks(row));

  const columnClues: number[][] = Array.from(
    { length: grid[0].length },
    (_, c) => getBlocks(getColumn(grid, c)),
  );

  return {
    rowClues,
    columnClues,
  };
}

export function getSolutionBits(grid: string[][]): string {
  return (grid.flat()).join('');
}

export function getSolutionHash(grid: string[][]): string {
  if (!isValidGrid(grid, isValidCell)) {
    throw new Error('Invalid grid');
  }

  const { height, width }: Dimensions = getDimensions(grid);

  const solutionBits: string = getSolutionBits(grid);

  return createHash('sha256')
    .update(`${height}x${width}:${solutionBits}`)
    .digest('hex');
}
