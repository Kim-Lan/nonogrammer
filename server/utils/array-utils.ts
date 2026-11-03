export function arraySum(arr: number[]): number {
  return arr.reduce((a, b) => a + b, 0);
}

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
