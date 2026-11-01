export function range(x: number): number[] {
  const n = Math.abs(Math.round(x));
  const result = [];
  for (let i = 0; i < n; i++) {
    result.push(i);
  }
  return result;
}

export function arraySum(arr: string[]): number {
  const numArray: number[] = Array.from(arr, Number);
  return numArray.reduce((a, b) => a + b, 0);
}
