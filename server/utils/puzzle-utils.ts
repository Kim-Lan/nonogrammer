import { randomBytes } from 'node:crypto';

export function generatePuzzleSlug(): string {
  return randomBytes(6).toString('hex');
}
