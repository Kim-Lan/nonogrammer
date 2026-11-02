import { describe, expect, it } from 'vitest';
import { arraySum, range } from '../../../../server/utils/array-utils';

describe('array utils unit tests', () => {
  it('returns the correct sum for a number array', () => {
    const numArray = [0, 1, 2, 3, 4, 5];
    expect(arraySum(numArray)).toBe(15);
  });

  it('returns the correct sum when converted from a string array', () => {
    const strArray = ['0', '1', '2', '3', '4', '5'];
    expect(arraySum(Array.from(strArray, Number))).toBe(15);
  });

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
