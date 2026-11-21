import type { Grid } from '../../../../shared/types/grid';
import { describe, expect, it } from 'vitest';
import { getSolutionBitsFromGrid } from '../../../../shared/utils/nonograms';

const sampleGrid: Grid = [
  ['0', '1', '1', '0', '1'],
  ['1', '1', '0', '0', '0'],
  ['1', '0', '0', '0', '1'],
  ['1', '1', '1', '1', '0'],
  ['0', '0', '0', '1', '1'],
];

describe('shared nonograms utils unit test', () => {
  it('gets correct solution bits from a grid', () => {
    expect(getSolutionBitsFromGrid(sampleGrid)).toBe('0110111000100011111000011');
  });
});
