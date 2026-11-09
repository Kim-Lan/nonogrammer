import type { Grid } from '../../shared/types/grid';
import { EMPTY_VALUE } from '../../shared/constants/nonograms-constants';

export function createEmptyGrid(height: number, width: number): Grid<string> {
  return Array.from({ length: height }, () =>
    Array.from({ length: width }).fill(EMPTY_VALUE),
  ) as Grid<string>;
}
