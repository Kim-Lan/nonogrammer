import type { PublicPuzzle, PuzzleDifficulty, PuzzleType } from '../../../shared/types/puzzle';
import { createError, defineEventHandler, getQuery } from 'nuxt/server';
import { getPuzzle } from '../../repository/PuzzleRepository';

export default defineEventHandler(async (event) => {
  const { type, height, width, difficulty } = getQuery<{
    type: string;
    height: string;
    width: string;
    difficulty: string;
  }>(event);

  if (!['system', 'daily', 'community'].includes(type)) {
    throw createError({
      status: 400,
      statusText: 'Bad Request',
      message: 'Invalid puzzle type',
    });
  }

  if (difficulty !== 'normal' && difficulty !== 'hard') {
    throw createError({
      status: 400,
      statusText: 'Bad Request',
      message: 'Invalid puzzle difficulty',
    });
  }

  const puzzle: PublicPuzzle = await getPuzzle(type as PuzzleType, parseInt(height), parseInt(width), difficulty as PuzzleDifficulty);

  return puzzle;
});
