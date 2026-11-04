import { describe, expect, it } from 'vitest';
import { range, shuffle } from '../../../../server/utils/array-utils';

describe('array utils unit test: range', () => {
  it('returns the correct range', () => {
    const result = range(5);
    expect(result).toContain(0);
    expect(result).toContain(1);
    expect(result).toContain(2);
    expect(result).toContain(3);
    expect(result).toContain(4);
    expect(result).not.toContain(5);
  });

  it('throws an error when trying to get the range of a non-integer number', () => {
    const shouldError = () => range(3.14);
    expect(shouldError).toThrow();
  });
});

describe('array utils unit test: shuffle', () => {
  it('preserves all elements after shuffling', () => {
    const array: number[] = Array.from({ length: 100 }, (_, i) => i);
    const original: number[] = [...array];

    shuffle(array);

    expect(array).toHaveLength(original.length);
    expect(array.toSorted((a, b) => a - b)).toEqual(original);
  });

  it('shuffles the array in place', () => {
    const array: number[] = [1, 2, 3, 4, 5];
    const originalReference = array;

    shuffle(array);

    expect(array).toBe(originalReference);
  });

  it('handles an empty array', () => {
    const array: number[] = [];

    expect(() => shuffle(array)).not.toThrow();
    expect(array).toEqual([]);
  });

  it('handles an array containing one element', () => {
    const array: number[] = [1];

    shuffle(array);

    expect(array).toEqual([1]);
  });

  it('preserves duplicate elements', () => {
    const array: number[] = [1, 1, 2, 2, 3, 3];

    shuffle(array);

    expect(array.toSorted((a, b) => a - b)).toEqual([1, 1, 2, 2, 3, 3]);
  });

  it('produces different permutations across multiple shuffles', () => {
    const original: number[] = Array.from({ length: 10 }, (_, i) => i);
    const permutations: Set<string> = new Set<string>();

    for (let i = 0; i < 100; i++) {
      const array: number[] = [...original];

      shuffle(array);

      permutations.add(array.join(','));
    }

    expect(permutations.size).toBeGreaterThan(1);
  });
});
