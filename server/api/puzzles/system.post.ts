import type { PublicPuzzle, PuzzleDifficulty } from '../../../shared/types/puzzle';
import { createError, defineEventHandler, getQuery } from 'nuxt/server';
import { generateSystemPuzzle } from '../../repository/PuzzleRepository';

export default defineEventHandler(async (event) => {
  const { height, width, difficulty } = getQuery<{
    height: string;
    width: string;
    difficulty: string;
  }>(event);

  if (difficulty !== 'normal' && difficulty !== 'hard') {
    throw createError({
      status: 400,
      statusText: 'Bad Request',
      message: 'Invalid puzzle difficulty',
    });
  }

  let puzzle: PublicPuzzle;

  try {
    puzzle = await generateSystemPuzzle(
      parseInt(height),
      parseInt(width),
      difficulty as PuzzleDifficulty,
    );
  } catch (error) {
    console.error('Failed to generate puzzle:', error);
    throw createError({
      status: 500,
      statusText: 'Internal Server Error',
      message: 'Failed to generate puzzle',
    });
  }

  return puzzle;
});
