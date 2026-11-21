import type { Grid } from '../../../../shared/types/grid';
import { defineEventHandler, getRouterParams, readValidatedBody } from 'nuxt/server';
import { z } from 'zod';
import { isValidGrid } from '../../../../shared/utils/grid';
import { isValidCell } from '../../../../shared/utils/nonograms';
import { checkPuzzleSolution } from '../../../repository/PuzzleRepository';

const paramsSchema = z.object({
  slug: z.string().min(1),
});

const bodySchema = z.object({
  grid: z.string().array().array(),
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

  const { grid } = await readValidatedBody(event, bodySchema);

  if (!isValidGrid(grid, isValidCell)) {
    throw createError({
      status: 400,
      statusText: 'Bad Request',
      message: 'Invalid grid',
    });
  }

  const solved: boolean = await checkPuzzleSolution(slug, grid as Grid<string>);

  return {
    solved,
  };
});
