import type { PublicPuzzle, PuzzleDifficulty, PuzzleType } from '../../../shared/types/puzzle';
import { createError, defineEventHandler, getQuery } from 'nuxt/server';
import { puzzleDifficulties, puzzleTypes } from '../../../shared/types/puzzle';
import { getPuzzle } from '../../repository/PuzzleRepository';

export default defineEventHandler(async (event) => {
  const { type, height, width, difficulty } = getQuery<{
    type: string;
    height: string;
    width: string;
    difficulty: string;
  }>(event);

  if (!puzzleTypes.includes(type as PuzzleType)) {
    throw createError({
      status: 400,
      statusText: 'Bad Request',
      message: 'Invalid puzzle type',
    });
  }

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

  const puzzle: PublicPuzzle = await getPuzzle(type as PuzzleType, puzzleHeight, puzzleWidth, difficulty as PuzzleDifficulty);

  return puzzle;
});
