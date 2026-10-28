import type { Clues } from '../../../../server/utils/nonograms-utils';
import { describe, expect, it } from 'vitest';
import { getBlocks, getClues, getSolutionBitsFromGrid, getSolutionBitsFromSolverOutput, getSolutionHashFromGrid } from '../../../../server/utils/nonograms-utils';

const sampleGrid = [
  ['0', '1', '1', '0', '1'],
  ['1', '1', '0', '0', '0'],
  ['1', '0', '0', '0', '1'],
  ['1', '1', '1', '1', '0'],
  ['0', '0', '0', '1', '1'],
];

describe('nonograms utils unit test', () => {
  it('gets correct blocks from a row or column', () => {
    const line: string[] = ['0', '1', '1', '0', '1'];

    expect(getBlocks(line)).toEqual([2, 1]);
  });

  it('throws an error trying to get block from an undefined line', () => {
    expect(() => getBlocks(undefined)).toThrow();
  });

  it('gets correct clues from a grid', () => {
    const clues: Clues = getClues(sampleGrid);

    expect(clues).toBeDefined();
    expect(clues.rowClues).toEqual([[2, 1], [2], [1, 1], [4], [2]]);
    expect(clues.columnClues).toEqual([[3], [2, 1], [1, 1], [2], [1, 1, 1]]);
  });

  it('gets correct solution bits', () => {
    expect(getSolutionBitsFromGrid(sampleGrid)).toBe('0110111000100011111000011');
  });

  it('creates a consistent solution hash', () => {
    const hashA = getSolutionHashFromGrid(sampleGrid);
    const hashB = getSolutionHashFromGrid(sampleGrid);

    expect(hashA).toBeDefined();
    expect(hashA).toHaveLength(64);
    expect(hashB).toHaveLength(64);
    expect(hashA).toBe(hashB);
  });

  it('gets correct solution bits from pbnsolve solver output', () => {
    const solverOutput = 'UNIQUE LINE SOLUTION:\n'
      + 'X.X.X\n'
      + '.X.X.\n'
      + 'X.X.X\n'
      + '.X.X.\n'
      + 'X.X.X';

    const solutionBits = getSolutionBitsFromSolverOutput(solverOutput);
    expect(solutionBits).toBe('1010101010101010101010101');
  });
});
