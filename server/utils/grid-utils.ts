export type NonEmptyArray<T> = [T, ...T[]];

export type Grid<T> = NonEmptyArray<NonEmptyArray<T>>;

export type Dimensions = {
  height: number;
  width: number;
};

export function isGrid(value: unknown): value is Grid<unknown> {
  return (
    Array.isArray(value)
    && value.length > 0
    && Array.isArray(value[0])
    && value[0].length > 0
    && value.every(
      row => Array.isArray(row)
        && row.length === value[0].length,
    )
  );
}

export function isValidGrid<T>(
  value: unknown,
  isValidCell: (value: unknown) => boolean,
): value is Grid<T> {
  return (
    isGrid(value)
    && value.every(
      row => row.every(isValidCell),
    )
  );
}

export function getColumn(grid: string[][], index: number): string[] {
  if (!isGrid(grid)) {
    throw new Error('Invalid grid');
  }

  if (index < 0 || index >= grid[0].length || !Number.isInteger(index)) {
    throw new Error('Invalid index');
  }

  return grid.map(row => row[index]!);
}

export function getDimensions(grid: string[][]): Dimensions {
  if (!isGrid(grid)) {
    throw new Error('Invalid grid');
  }

  const height: number = grid.length;
  const width: number = grid[0].length;

  return { height, width };
}
