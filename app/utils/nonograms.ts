import type { Dimensions, Grid } from '../../shared/types/grid';
import { getSolutionBitsFromGrid } from '../../shared/utils/nonograms';
import { getSHA256Hash } from './hash';

export async function getSolutionHash(height: number, width: number, solutionBits: string): Promise<string> {
  return await getSHA256Hash(`${height}x${width}:${solutionBits}`);
};

export async function getSolutionHashFromGrid(grid: Grid<string>): Promise<string> {
  if (!isValidGrid(grid, isValidCell)) {
    throw new Error('Invalid grid');
  }

  const { height, width }: Dimensions = getDimensions(grid);

  const solutionBits: string = getSolutionBitsFromGrid(grid);

  return getSolutionHash(height, width, solutionBits);
}
