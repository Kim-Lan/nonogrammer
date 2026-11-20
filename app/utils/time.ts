// input time in milliseconds, output formatted string
export function formatTime(time: number): string {
  const hours: number = Math.floor(time / (60 * 60 * 1000));
  const minutes: number = Math.floor(time / (60 * 1000)) % 60;
  const seconds: number = Math.floor(time / 1000) % 60;
  const milliseconds: number = Math.floor(time % 1000);

  const hoursString: string = hours > 0 ? `${hours.toString().padStart(2, '0')}:` : '';

  return `${hoursString}${minutes.toString().padStart(2, '0')}`
    + `:${seconds.toString().padStart(2, '0')}`
    + `.${milliseconds.toString().padStart(3, '0')}`;
}
