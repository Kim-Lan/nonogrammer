export function convertIndexTo2D(index: number, width: number): { rowIndex: number; columnIndex: number } {
  const rowIndex: number = Math.floor(index / width);
  const columnIndex: number = index % width;
  return { rowIndex, columnIndex };
}
