import type { Nullable, PublicPuzzle, PuzzleDifficulty, PuzzleType } from '../../shared/types/puzzle';
import type { GeneratedPuzzle, NewPuzzle } from '../types/puzzle';
import { and, eq, sql } from 'drizzle-orm';
import { createError } from 'nuxt/server';
import db from '../database';
import { puzzles } from '../database/schema';
import { generatePuzzle } from '../nonograms/nonograms-generator';
import { generatePuzzleSlug } from '../utils/puzzle-utils';

const VALID_SYSTEM_PUZZLE_SIZES = [5, 10, 15, 20, 25, 30];

export async function getPuzzle(type: PuzzleType, height?: number, width?: number, difficulty?: PuzzleDifficulty): Promise<PublicPuzzle> {
  if (type === 'system') {
    if (!height || !width || !difficulty) {
      throw createError({
        status: 400,
        statusText: 'Bad Request',
        message: 'Invalid system puzzle query: height, width, and difficulty are required',
      });
    }

    const [puzzle] = await db
      .select({
        slug: puzzles.slug,
        type: puzzles.type,
        height: puzzles.height,
        width: puzzles.width,
        rowClues: puzzles.rowClues,
        columnClues: puzzles.columnClues,
        solutionHash: puzzles.solutionHash,
        difficulty: puzzles.difficulty,
      })
      .from(puzzles)
      .where(and(
        eq(puzzles.type, 'system'),
        eq(puzzles.publicationStatus, 'published'),
        eq(puzzles.height, height),
        eq(puzzles.width, width),
        eq(puzzles.difficulty, difficulty),
      ))
      .orderBy(sql`random()`)
      .limit(1);

    if (!puzzle) {
      throw createError({
        status: 404,
        statusText: 'Not Found',
        message: 'No matching system puzzle found',
      });
    }

    return puzzle;
  } else {
    throw createError({
      status: 400,
      statusText: 'Bad Request',
      message: 'This puzzle type is not available right now',
    });
  }
}

export async function getPuzzleBySlug(slug: string): Promise<PublicPuzzle> {
  const [puzzle] = await db
    .select({
      slug: puzzles.slug,
      type: puzzles.type,
      height: puzzles.height,
      width: puzzles.width,
      rowClues: puzzles.rowClues,
      columnClues: puzzles.columnClues,
      solutionHash: puzzles.solutionHash,
      difficulty: puzzles.difficulty,
    })
    .from(puzzles)
    .where(eq(puzzles.slug, slug))
    .limit(1);

  if (!puzzle) {
    throw createError({
      status: 404,
      statusText: 'Not Found',
      message: `Puzzle ID "${slug}" not found`,
    });
  }

  return puzzle;
}

export async function generateSystemPuzzle(height: number, width: number, difficulty: PuzzleDifficulty): Promise<PublicPuzzle> {
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
      type: 'system',
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
    slug: generatePuzzleSlug(),
    type: 'system',
    publicationStatus: 'published',
    validationStatus: 'valid',
  };

  let puzzle;
  while (!puzzle) {
    try {
      [puzzle] = await db
        .insert(puzzles)
        .values(newPuzzle)
        .returning();
    } catch (error) {
      const databaseError = error as { code?: string; constraint?: string; cause?: { code?: string; constraint?: string } };
      const cause = databaseError.cause ?? databaseError;
      if (cause.code !== '23505' || cause.constraint !== 'puzzles_slug_unique') {
        throw error;
      }
    }
  }

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
}
