import type { Grid } from '../../../../shared/types/grid';
import { defineEventHandler, getRouterParams } from 'nuxt/server';
import { z } from 'zod';
import { validatePuzzleSolution } from '../../../repository/PuzzleRepository';
import { isGrid } from '../../../utils/grid-utils';

const paramsSchema = z.object({
  slug: z.string().min(1),
});

export default defineEventHandler(async (event) => {
  const result = paramsSchema.safeParse(getRouterParams(event));

  if (!result.success) {
    throw createError({
      status: 400,
      statusText: 'Bad Request',
      message: 'Invalid puzzle slug',
    });
  }

  const { slug } = result.data;

  const { grid } = await readBody(event);

  if (!isGrid(grid)) {
    throw createError({
      status: 400,
      statusText: 'Bad Request',
      message: 'Invalid grid',
    });
  }

  const solved: boolean = await validatePuzzleSolution(slug, grid as Grid);

  return {
    solved,
  };
});
