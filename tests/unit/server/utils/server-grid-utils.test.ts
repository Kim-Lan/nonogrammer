import { describe, expect, it } from 'vitest';
import { convert2DToIndex, getColumn } from '../../../../server/utils/grid';

const sampleGrid = [
  ['0', '1', '1', '0', '1'],
  ['1', '1', '0', '0', '0'],
  ['1', '0', '0', '0', '1'],
  ['1', '1', '1', '1', '0'],
  ['0', '0', '0', '1', '1'],
];

describe('server grid utils unit test', () => {
  it('gets correct column from grid', () => {
    expect(getColumn(sampleGrid, 0)).toEqual(['0', '1', '1', '1', '0']);
    expect(getColumn(sampleGrid, 1)).toEqual(['1', '1', '0', '1', '0']);
    expect(getColumn(sampleGrid, 2)).toEqual(['1', '0', '0', '1', '0']);
    expect(getColumn(sampleGrid, 3)).toEqual(['0', '0', '0', '1', '1']);
    expect(getColumn(sampleGrid, 4)).toEqual(['1', '0', '1', '0', '1']);
  });

  it('throws an error trying to get an invalid index column', () => {
    const shouldErrorA = () => getColumn(sampleGrid, -1);
    const shouldErrorB = () => getColumn(sampleGrid, 5);

    expect(shouldErrorA).toThrow();
    expect(shouldErrorB).toThrow();
  });

  it('throws an error trying to get a column from an invalid grid', () => {
    const shouldErrorA = () => getColumn([], 0);
    const shouldErrorB = () => getColumn([[1, 2], [3]], 1);

    expect(shouldErrorA).toThrow();
    expect(shouldErrorB).toThrow();
  });

  it.each([
    [0, 0, 5, 0],
    [0, 2, 5, 2],
    [2, 0, 5, 10],
    [2, 2, 5, 12],
  ])('gets the correct 1D grid index from a 2D grid coordinate (%i, %i)', (rowIndex: number, columnIndex: number, width: number, index: number) => {
    expect(convert2DToIndex(rowIndex, columnIndex, width)).toBe(index);
  });
});
