import type { Nullable, PublicPuzzle, PuzzleDifficulty } from '../../../../shared/types/puzzle';
import { getSystemPuzzle } from '../../../repository/PuzzleRepository';

export default defineEventHandler<{
  query: {
    height: string;
    width: string;
    difficulty: string;
  };
}>(async (event) => {
  const { height, width, difficulty } = getQuery(event);

  if (difficulty !== 'normal' && difficulty !== 'hard') {
    throw createError({
      status: 400,
      statusText: 'Bad Request',
      message: 'Invalid puzzle difficulty',
    });
  }

  const puzzle: Nullable<PublicPuzzle> = await getSystemPuzzle(parseInt(height), parseInt(width), difficulty as PuzzleDifficulty);

  if (!puzzle) {
    throw createError({
      status: 500,
      statusText: 'Internal Server Error',
      message: 'Failed to get puzzle',
    });
  }

  return puzzle;
});
