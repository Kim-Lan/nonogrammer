import type { PublicPuzzle, PuzzleDifficulty } from '../../../../shared/types/puzzle';
import { getSystemPuzzleBySizeAndDifficulty } from '../../../repository/PuzzleRepository';

export default defineEventHandler<{
  query: {
    height: string;
    width: string;
    difficulty: string;
  };
}>((event) => {
  const { height, width, difficulty } = getQuery(event);

  if (difficulty !== 'normal' && difficulty !== 'hard') {
    throw createError({
      status: 400,
      statusText: 'Bad Request',
      message: 'Invalid puzzle difficulty',
    });
  }

  const puzzle: PublicPuzzle = getSystemPuzzleBySizeAndDifficulty(parseInt(height), parseInt(width), difficulty as PuzzleDifficulty);

  if (!puzzle) {
    throw createError({
      status: 500,
      statusText: 'Internal Server Error',
      message: 'Failed to find puzzle',
    });
  }

  return puzzle;
});
