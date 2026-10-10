import type { PuzzleClues } from '../../../shared/types/puzzle';
import { randomBytes } from 'node:crypto';
import { sql } from 'drizzle-orm';
import { check, index, integer, jsonb, pgEnum, smallint, snakeCase, text, timestamp, uniqueIndex, varchar } from 'drizzle-orm/pg-core';
import { puzzleDifficulties, puzzlePublicationStatuses, puzzleSolverMethods, puzzleTypes, puzzleValidationStatuses } from '../../../shared/types/puzzle';

export const puzzleTypeEnum = pgEnum('puzzle_type', puzzleTypes);
export const puzzleDifficultyEnum = pgEnum('puzzle_difficulty', puzzleDifficulties);
export const puzzleSolverMethodEnum = pgEnum('puzzle_solver_method', puzzleSolverMethods);
export const puzzlePublicationStatusEnum = pgEnum('puzzle_publication_status', puzzlePublicationStatuses);
export const puzzleValidationStatusEnum = pgEnum('puzzle_validation_status', puzzleValidationStatuses);

function generatePuzzleSlug(): string {
  return randomBytes(12).toString('hex');
}

export const puzzles = snakeCase.table('puzzles', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  slug: varchar({ length: 128 }).$defaultFn(generatePuzzleSlug).notNull(),

  type: puzzleTypeEnum().notNull(),

  height: smallint().notNull(),
  width: smallint().notNull(),

  rowClues: jsonb().$type<PuzzleClues>().notNull(),
  columnClues: jsonb().$type<PuzzleClues>().notNull(),

  solutionBits: text().notNull(),
  solutionHash: text().notNull(),

  difficulty: puzzleDifficultyEnum(),
  solverMethod: puzzleSolverMethodEnum(),
  simpleSolverSweepCount: integer(),
  fourSolverIntersectionCount: integer(),

  filledCellCount: smallint().generatedAlwaysAs(
    sql`length(replace("solution_bits", '0', ''))`,
  ),

  publicationStatus: puzzlePublicationStatusEnum().default('draft').notNull(),
  validationStatus: puzzleValidationStatusEnum().default('pending').notNull(),

  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp({ withTimezone: true }).defaultNow().notNull().$onUpdate(() => new Date()),
}, t => [
  uniqueIndex('puzzles_slug_unique').on(sql`lower(${t.slug})`),
  uniqueIndex('puzzles_system_puzzle_solution_unique').on(t.height, t.width, t.solutionHash).where(sql`${t.type} = 'system'`),
  index('puzzles_selection_index').on(t.height, t.width, t.difficulty, t.id).where(sql`
    ${t.type} = 'system' AND ${t.publicationStatus} = 'published'
  `),
  check('slug_format', sql`${t.slug} ~* '^[a-z0-9]([a-z0-9_-]*[a-z0-9])?$'`),
  check('slug_min_length', sql`char_length(${t.slug}) >= 3`),
  check('height_range', sql`${t.height} BETWEEN 5 AND 30`),
  check('width_range', sql`${t.width} BETWEEN 5 AND 30`),
  check('solution_length', sql`length(${t.solutionBits}) = ${t.height} * ${t.width}`),
  check('binary_solution', sql`${t.solutionBits} ~ '^[01]+$'`),
  check('row_clues_array', sql`jsonb_typeof(${t.rowClues}) = 'array'`),
  check('column_clues_array', sql`jsonb_typeof(${t.columnClues}) = 'array'`),
  check('clue_dimensions', sql`jsonb_array_length(${t.rowClues}) = ${t.height} AND jsonb_array_length(${t.columnClues}) = ${t.width}`),
  check('difficulty_solver_consistency', sql`
    (${t.difficulty} IS NULL AND ${t.solverMethod} IS NULL)
    OR (
      ${t.difficulty} IS NOT NULL
      AND ${t.solverMethod} IS NOT NULL
      AND (
        (${t.difficulty} = 'normal' AND ${t.solverMethod} = 'simple')
        OR (${t.difficulty} = 'hard' AND ${t.solverMethod} = 'four')
      )
    )
  `),
  check('simple_solver_sweep_count_nonnegative', sql`${t.simpleSolverSweepCount} >= 0`),
  check('four_solver_intersection_count_nonnegative', sql`${t.fourSolverIntersectionCount} >= 0`),
  check('published_puzzle_valid', sql`${t.publicationStatus} <> 'published' OR ${t.validationStatus} = 'valid'`),
  check('solver_sweep_intersection_consistency', sql`
    ${t.solverMethod} IS NULL
    OR (
      ${t.solverMethod} = 'simple'
      AND ${t.simpleSolverSweepCount} > 0
      AND ${t.fourSolverIntersectionCount} = 0
    )
    OR (
      ${t.solverMethod} = 'four'
      AND ${t.simpleSolverSweepCount} >= 0
      AND ${t.fourSolverIntersectionCount} > 0
    )
  `),
  check('validation_solver_consistency', sql`
    (
      ${t.validationStatus} <> 'valid'
      AND ${t.difficulty} IS NULL
      AND ${t.solverMethod} IS NULL
      AND ${t.simpleSolverSweepCount} IS NULL
      AND ${t.fourSolverIntersectionCount} IS NULL
    )
    OR (
      ${t.validationStatus} = 'valid'
      AND ${t.difficulty} IS NOT NULL
      AND ${t.solverMethod} IS NOT NULL
      AND ${t.simpleSolverSweepCount} IS NOT NULL
      AND ${t.fourSolverIntersectionCount} IS NOT NULL
    )
  `),
]);

export type Puzzle = typeof puzzles.$inferSelect;
export type NewPuzzle = typeof puzzles.$inferInsert;
