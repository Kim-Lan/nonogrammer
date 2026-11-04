import random from 'random';

export function range(x: number): number[] {
  if (!Number.isInteger(x)) {
    throw new TypeError('range function only takes integer values');
  }

  const result = [];
  for (let i = 0; i < x; i++) {
    result.push(i);
  }
  return result;
}

// Fisher-Yates shuffle
export function shuffle(array: number[]): void {
  for (let i = array.length - 1; i > 0; i--) {
    const j = random.int(0, i);
    [array[i], array[j]] = [array[j]!, array[i]!];
  }
}
