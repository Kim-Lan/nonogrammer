import type { PublicPuzzle, PuzzleDifficulty } from '../../../shared/types/puzzle';
import { createError, defineEventHandler, getQuery } from 'nuxt/server';
import { puzzleDifficulties } from '../../../shared/types/puzzle';
import { generateSystemPuzzle } from '../../repository/PuzzleRepository';

export default defineEventHandler(async (event) => {
  const { height, width, difficulty } = getQuery<{
    height: string;
    width: string;
    difficulty: string;
  }>(event);

  if (!puzzleDifficulties.includes(difficulty as PuzzleDifficulty)) {
    throw createError({
      status: 400,
      statusText: 'Bad Request',
      message: 'Invalid puzzle difficulty',
    });
  }

  const puzzleHeight = Number(height);
  const puzzleWidth = Number(width);

  if (!Number.isSafeInteger(puzzleHeight) || !Number.isSafeInteger(puzzleWidth)) {
    throw createError({
      status: 400,
      statusText: 'Bad Request',
      message: 'Invalid puzzle dimensions',
    });
  }

  let puzzle: PublicPuzzle;
  try {
    puzzle = await generateSystemPuzzle(
      puzzleHeight,
      puzzleWidth,
      difficulty as PuzzleDifficulty,
    );
  } catch (error) {
    console.error('Failed to generate puzzle:', error);
    throw error;
  }

  return puzzle;
});
