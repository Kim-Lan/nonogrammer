import type { Dimensions, Grid } from '../types/grid';

export function isGrid(value: unknown): value is Grid<unknown> {
  return (
    Array.isArray(value)
    && value.length > 0
    && Array.isArray(value[0])
    && value[0].length > 0
    && value.every(
      row => Array.isArray(row)
        && row.length === value[0].length,
    )
  );
}

export function isValidGrid<T>(
  value: unknown,
  isValidCell: (value: unknown) => boolean,
): value is Grid<T> {
  return (
    isGrid(value)
    && value.every(
      row => row.every(isValidCell),
    )
  );
}

export function getDimensions(grid: Grid<string>): Dimensions {
  const height: number = grid.length;
  const width: number = grid[0].length;

  return { height, width };
}

export function convertIndexTo2D(index: number, width: number): { rowIndex: number; columnIndex: number } {
  const rowIndex: number = Math.floor(index / width);
  const columnIndex: number = index % width;
  return { rowIndex, columnIndex };
}
