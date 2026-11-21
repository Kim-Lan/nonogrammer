import { describe, expect, it } from 'vitest';
import { convertIndexTo2D, getDimensions, isGrid, isValidGrid } from '../../../../shared/utils/grid';
import { isValidCell } from '../../../../shared/utils/nonograms';

const sampleGrid = [
  ['0', '1', '1', '0', '1'],
  ['1', '1', '0', '0', '0'],
  ['1', '0', '0', '0', '1'],
  ['1', '1', '1', '1', '0'],
  ['0', '0', '0', '1', '1'],
];

describe('shared grid utils unit test', () => {
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

  it('gets correct grid dimensions', () => {
    expect(getDimensions(sampleGrid)).toMatchObject({
      height: 5,
      width: 5,
    });
  });

  it.each([
    [0, 5, 0, 0],
    [1, 5, 0, 1],
    [2, 5, 0, 2],
    [3, 5, 0, 3],
    [4, 5, 0, 4],
    [5, 5, 1, 0],
    [10, 5, 2, 0],
    [12, 5, 2, 2],
  ])('gets the correct 2D grid coordinate from a 1D grid index %i', (index: number, width: number, rowIndex: number, columnIndex: number) => {
    expect(convertIndexTo2D(index, width)).toMatchObject({ rowIndex, columnIndex });
  });
});
