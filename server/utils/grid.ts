import type { Grid, Line } from '../../shared/types/grid';
import { isGrid } from '../../shared/utils/grid';

export function getColumn(grid: Grid<string>, index: number): Line<string> {
  if (!isGrid(grid)) {
    throw new Error('Invalid grid');
  }

  if (index < 0 || index >= grid[0].length || !Number.isInteger(index)) {
    throw new Error('Invalid index');
  }

  return grid.map(row => row[index]!) as Line<string>;
}

export function convert2DToIndex(rowIndex: number, columnIndex: number, width: number): number {
  return rowIndex * width + columnIndex;
}
