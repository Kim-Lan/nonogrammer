import type { Grid } from '../../../../server/types/grid';
import type { CandidatePuzzle } from '../../../../server/types/puzzle';
import type { Clues } from '../../../../shared/types/puzzle';
import { describe, expect, it } from 'vitest';
import {
  convertPuzzleToNon,
  getBlocks,
  getClues,
  getSolutionBitsFromGrid,
  getSolutionBitsFromSolverOutput,
  getSolutionHash,
  getSolutionHashFromGrid,
} from '../../../../server/utils/nonograms-utils';

const sampleGrid: Grid = [
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

  it('gets correct solution bits from a grid', () => {
    expect(getSolutionBitsFromGrid(sampleGrid)).toBe('0110111000100011111000011');
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

  it('creates the correct .non file from a candidate puzzle', () => {
    const puzzle: CandidatePuzzle = {
      height: 5,
      width: 5,
      rowClues: [[1, 1, 1], [1, 1], [1, 1, 1], [1, 1], [1, 1, 1]],
      columnClues: [[1, 1, 1], [1, 1], [1, 1, 1], [1, 1], [1, 1, 1]],
      solutionBits: '1010101010101010101010101',
    };

    expect(convertPuzzleToNon(puzzle)).toBe(
      'width 5\n'
      + 'height 5\n\n'
      + 'rows\n'
      + '1,1,1\n'
      + '1,1\n'
      + '1,1,1\n'
      + '1,1\n'
      + '1,1,1\n\n'
      + 'columns\n'
      + '1,1,1\n'
      + '1,1\n'
      + '1,1,1\n'
      + '1,1\n'
      + '1,1,1\n\n'
      + 'goal "1010101010101010101010101"',
    );
  });
});
