import { describe, expect, it } from 'vitest';
import { createEmptyGrid } from '../../../../app/utils/grid-utils';
import { EMPTY_VALUE } from '../../../../shared/constants/nonograms-constants';

describe('app grid utils unit test: createEmptyGrid', () => {
  it('creates a grid with the requested dimensions filled with empty values', () => {
    expect(createEmptyGrid(2, 3)).toEqual([
      [EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE],
      [EMPTY_VALUE, EMPTY_VALUE, EMPTY_VALUE],
    ]);
  });

  it('creates independent rows', () => {
    const grid = createEmptyGrid(2, 3);

    expect(grid[0]).not.toBe(grid[1]);
  });

  it('creates an empty grid when the height is zero', () => {
    expect(createEmptyGrid(0, 3)).toEqual([]);
  });

  it('creates empty rows when the width is zero', () => {
    expect(createEmptyGrid(2, 0)).toEqual([[], []]);
  });
});
