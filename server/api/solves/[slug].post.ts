import { defineEventHandler, getRouterParams } from 'nuxt/server';
import { z } from 'zod';
import { validatePuzzleSolution } from '../../repository/PuzzleRepository';

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

  const solved: boolean = await validatePuzzleSolution(slug, grid);

  return {
    solved,
  };
});
