import { describe, expect, it } from 'vitest';
import { formatTime, formatTimeWithoutMilliseconds } from '../../../../app/utils/time';

describe('time utils unit test', () => {
  it('outputs the correct formatted time string including milliseconds', () => {
    const time = 60080586;

    expect(formatTime(time)).toBe('16:41:20.586');
  });

  it('outputs the correct formatted time string without milliseconds', () => {
    const time = 60080586;

    expect(formatTimeWithoutMilliseconds(time)).toBe('16:41:20');
  });
});
