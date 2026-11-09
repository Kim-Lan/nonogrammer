import { describe, expect, it } from 'vitest';
import { convertIndexTo2D } from '../../../../shared/utils/grid-utils';

describe('shared grid utils unit test', () => {
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
