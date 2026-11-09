export type NonEmptyArray<T> = [T, ...T[]];

export type Grid<T> = NonEmptyArray<Line<T>>;

export type Line<T> = NonEmptyArray<T>;

export type Dimensions = {
  height: number;
  width: number;
};
