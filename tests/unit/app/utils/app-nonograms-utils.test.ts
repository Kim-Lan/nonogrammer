import type { Grid } from '../../../../shared/types/grid';
import { describe, expect, it } from 'vitest';
import { getSolutionHash, getSolutionHashFromGrid } from '../../../../server/utils/nonograms';

const sampleGrid: Grid = [
  ['0', '1', '1', '0', '1'],
  ['1', '1', '0', '0', '0'],
  ['1', '0', '0', '0', '1'],
  ['1', '1', '1', '1', '0'],
  ['0', '0', '0', '1', '1'],
];

describe('app nonograms utils unit test', () => {
  it('creates a consistent solution hash from puzzle info', () => {
    const solutionBits = '1010101010101010101010101';
    const hashA = getSolutionHash(5, 5, solutionBits);
    const hashB = getSolutionHash(5, 5, solutionBits);

    expect(hashA).toBeDefined();
    expect(hashA).toHaveLength(64);
    expect(hashB).toHaveLength(64);
    expect(hashA).toBe(hashB);
  });

  it('creates a consistent solution hash from a grid', () => {
    const hashA = getSolutionHashFromGrid(sampleGrid);
    const hashB = getSolutionHashFromGrid(sampleGrid);

    expect(hashA).toBeDefined();
    expect(hashA).toHaveLength(64);
    expect(hashB).toHaveLength(64);
    expect(hashA).toBe(hashB);
  });
});
