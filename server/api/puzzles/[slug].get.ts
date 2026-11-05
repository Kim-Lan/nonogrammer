import type { PublicPuzzle } from '../../../shared/types/puzzle';
import { defineEventHandler, getRouterParams } from 'nuxt/server';
import { z } from 'zod';
import { getPuzzleBySlug } from '../../repository/PuzzleRepository';

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

  const puzzle: PublicPuzzle = await getPuzzleBySlug(slug);

  return puzzle;
});
