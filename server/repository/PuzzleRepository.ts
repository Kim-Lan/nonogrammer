import type { Nullable, PublicPuzzle, PuzzleDifficulty } from '../../shared/types/puzzle';
import type { GeneratedPuzzle, NewPuzzle } from '../types/puzzle';
// import { and, eq, sql } from 'drizzle-orm';
import db from '../database';
import { puzzles } from '../database/schema';
import { generatePuzzle } from '../nonograms/nonograms-generator';

const VALID_SYSTEM_PUZZLE_SIZES = [5, 10, 15, 20, 25, 30];

export async function getSystemPuzzle(height: number, width: number, difficulty: PuzzleDifficulty): Promise<PublicPuzzle> {
  if (height !== width || !VALID_SYSTEM_PUZZLE_SIZES.includes(height)) {
    throw createError({
      status: 400,
      statusText: 'Bad Request',
      message: 'Invalid system puzzle dimensions',
    });
  }

  const generatedPuzzle: Nullable<GeneratedPuzzle> = generatePuzzle(height, width, difficulty);

  if (!generatedPuzzle) {
    throw createError({
      status: 500,
      statusText: 'Internal Server Error',
      message: 'Failed to generate puzzle',
    });
  }

  const foundPuzzle = await db.query.puzzles.findFirst({
    where: {
      height,
      width,
      solutionBits: generatedPuzzle.solutionBits,
      difficulty,
    },
  });

  if (foundPuzzle) {
    return {
      slug: foundPuzzle.slug,
      type: foundPuzzle.type,
      height,
      width,
      rowClues: foundPuzzle.rowClues,
      columnClues: foundPuzzle.columnClues,
      solutionHash: foundPuzzle.solutionHash,
      difficulty,
    };
  }

  const newPuzzle: NewPuzzle = {
    ...generatedPuzzle,
    type: 'system',
  };

  const [puzzle] = await db
    .insert(puzzles)
    .values(newPuzzle)
    .returning();

  if (!puzzle) {
    throw createError({
      status: 500,
      statusText: 'Internal Server Error',
      message: 'Failed to add puzzle to database',
    });
  }

  return {
    slug: puzzle.slug!,
    type: puzzle.type!,
    height,
    width,
    rowClues: puzzle.rowClues,
    columnClues: puzzle.columnClues,
    solutionHash: puzzle.solutionHash,
    difficulty,
  };

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
