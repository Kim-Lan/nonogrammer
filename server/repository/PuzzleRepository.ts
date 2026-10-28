import type { Nullable, PublicPuzzle, PuzzleDifficulty } from '../../shared/types/puzzle';
// import { and, eq, sql } from 'drizzle-orm';
// import db from '../database';
// import { puzzles } from '../database/schema';
import { generatePuzzle } from '../nonograms/nonograms-generator';

const VALID_SYSTEM_PUZZLE_SIZES = [5, 10, 15, 20, 25, 30];

export function getSystemPuzzle(height: number, width: number, difficulty: PuzzleDifficulty): Nullable<PublicPuzzle> {
  if (height !== width || !VALID_SYSTEM_PUZZLE_SIZES.includes(height)) {
    throw createError({
      status: 400,
      statusText: 'Bad Request',
      message: 'Invalid system puzzle dimensions',
    });
  }

  const puzzle = generatePuzzle(height, width, difficulty);

  return puzzle;

  // return await db
  //   .select({
  //     slug: puzzles.slug,
  //     height: puzzles.height,
  //     width: puzzles.width,
  //     rowClues: puzzles.rowClues,
  //     columnClues: puzzles.columnClues,
  //     solutionHash: puzzles.solutionHash,
  //     difficulty: puzzles.difficulty,
  //   })
  //   .from(puzzles)
  //   .where(
  //     and(
  //       eq(puzzles.type, 'system'),
  //       eq(puzzles.height, height),
  //       eq(puzzles.width, width),
  //       eq(puzzles.difficulty, difficulty),
  //     ),
  //   )
  //   .orderBy(sql`RANDOM()`)
  //   .limit(1);
}
