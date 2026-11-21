import type { Grid } from '../types/grid';
import { EMPTY_VALUE, FILLED_VALUE, MARKED_VALUE } from '../constants/nonograms-constants';

export function isValidCell(value: unknown): value is CellState {
  return value === EMPTY_VALUE || value === FILLED_VALUE || value === MARKED_VALUE;
}

export function getSolutionBitsFromGrid(grid: Grid<string>): string {
  return (grid.flat()).join('');
}
