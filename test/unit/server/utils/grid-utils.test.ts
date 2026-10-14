import { describe, expect, it } from 'vitest';
import { getColumn, getDimensions, isGrid, isValidGrid } from '../../../../server/utils/grid-utils';
import { isValidCell } from '../../../../server/utils/nonograms-utils';

const sampleGrid = [
  ['0', '1', '1', '0', '1'],
  ['1', '1', '0', '0', '0'],
  ['1', '0', '0', '0', '1'],
  ['1', '1', '1', '1', '0'],
  ['0', '0', '0', '1', '1'],
];

describe('grid utils unit test', () => {
  it('verifies whether something is a grid', () => {
    expect(isGrid(null)).toBe(false);
    expect(isGrid([])).toBe(false);
    expect(isGrid([[1, 2], [3, 4]])).toBe(true);
    expect(isGrid([[1, 2, 3], [4, 5, 6]])).toBe(true);
    expect(isGrid([[1], [2], [3]])).toBe(true);
    expect(isGrid([[1, 2], [3]])).toBe(false);
    expect(isGrid([1, 2, 3])).toBe(false);
    expect(isGrid([[], []])).toBe(false);
  });

  it('verifies whether something is a valid grid according to given validator', () => {
    const isString = (value: unknown): value is string => typeof value === 'string';

    expect(isValidGrid([[1, 2], [3, 4]], isString)).toBe(false);
    expect(isValidGrid([['1', '2'], ['3', '4']], isString)).toBe(true);
  });

  it('verifies whether something is a valid nonograms grid', () => {
    expect(isValidGrid(sampleGrid, isValidCell)).toBe(true);
    expect(isValidGrid([[0, 1], [1, 0]], isValidCell)).toBe(false);
  });

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

  it('gets correct grid dimensions', () => {
    expect(getDimensions(sampleGrid)).toMatchObject({
      height: 5,
      width: 5,
    });
  });
});
