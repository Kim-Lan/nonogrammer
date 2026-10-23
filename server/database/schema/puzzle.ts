import type { PuzzleClues } from '../../../shared/types/puzzle';
import { sql } from 'drizzle-orm';
import { check, index, integer, jsonb, pgEnum, smallint, snakeCase, text, timestamp, uniqueIndex, varchar } from 'drizzle-orm/pg-core';
import { puzzleDifficulties, puzzleGenerators, puzzlePublicationStatuses, puzzleSolvers, puzzleTypes, puzzleValidationStatuses } from '../../../shared/types/puzzle';
import { generatePuzzleSlug } from '../../utils/puzzle-utils.ts';

export const puzzleTypeEnum = pgEnum('puzzle_type', puzzleTypes);
export const puzzleGeneratorEnum = pgEnum('puzzle_generator', puzzleGenerators);
export const puzzleDifficultyEnum = pgEnum('puzzle_difficulty', puzzleDifficulties);
export const puzzleSolverEnum = pgEnum('puzzle_solver', puzzleSolvers);
export const puzzlePublicationStatusEnum = pgEnum('puzzle_publication_status', puzzlePublicationStatuses);
export const puzzleValidationStatusEnum = pgEnum('puzzle_validation_status', puzzleValidationStatuses);

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

  filledCellCount: smallint().generatedAlwaysAs(
    sql`length(replace("solution_bits", '0', ''))`,
  ),

  difficulty: puzzleDifficultyEnum(),
  generator: puzzleGeneratorEnum(),
  solver: puzzleSolverEnum(),
  lineSolverIterationCount: integer(),
  fourSolverIntersectionCount: integer(),

  publicationStatus: puzzlePublicationStatusEnum().default('draft').notNull(),
  validationStatus: puzzleValidationStatusEnum().default('pending').notNull(),

  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp({ withTimezone: true }).defaultNow().notNull().$onUpdate(() => new Date()),
}, t => [
  uniqueIndex('puzzles_slug_unique').on(sql`lower(${t.slug})`),
  uniqueIndex('puzzles_system_puzzle_solution_unique').on(t.height, t.width, t.solutionHash).where(sql`${t.type} = 'system'`),
  uniqueIndex('puzzles_daily_puzzle_solution_unique').on(t.height, t.width, t.solutionHash).where(sql`${t.type} = 'daily'`),
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
  check('clue_dimensions', sql`
    CASE
      WHEN jsonb_typeof(${t.rowClues}) = 'array'
        AND jsonb_typeof(${t.columnClues}) = 'array'
      THEN
        jsonb_array_length(${t.rowClues}) = ${t.height}
        AND jsonb_array_length(${t.columnClues}) = ${t.width}
      ELSE TRUE
    END
  `),
  check('generator_consistency', sql`
    ${t.type} NOT IN ('system', 'daily')
    OR ${t.generator} IS NOT NULL
  `),
  check('difficulty_solver_consistency', sql`
    (${t.difficulty} IS NULL AND ${t.solver} IS NULL)
    OR (
      ${t.difficulty} IS NOT NULL
      AND ${t.solver} IS NOT NULL
      AND (
        (${t.difficulty} = 'normal' AND ${t.solver} = 'line')
        OR (${t.difficulty} = 'hard' AND ${t.solver} = 'four')
      )
    )
  `),
  check('line_solver_iteration_count_nonnegative', sql`${t.lineSolverIterationCount} >= 0`),
  check('four_solver_intersection_count_nonnegative', sql`${t.fourSolverIntersectionCount} >= 0`),
  check('published_puzzle_validity', sql`${t.publicationStatus} <> 'published' OR ${t.validationStatus} = 'valid'`),
  check('solver_iteration_intersection_consistency', sql`
    ${t.solver} IS NULL
    OR (
      ${t.solver} = 'line'
      AND ${t.lineSolverIterationCount} > 0
      AND ${t.fourSolverIntersectionCount} = 0
    )
    OR (
      ${t.solver} = 'four'
      AND ${t.lineSolverIterationCount} >= 0
      AND ${t.fourSolverIntersectionCount} > 0
    )
  `),
  check('validation_solver_consistency', sql`
    (
      ${t.validationStatus} <> 'valid'
      AND ${t.difficulty} IS NULL
      AND ${t.solver} IS NULL
      AND ${t.lineSolverIterationCount} IS NULL
      AND ${t.fourSolverIntersectionCount} IS NULL
    )
    OR (
      ${t.validationStatus} = 'valid'
      AND ${t.difficulty} IS NOT NULL
      AND ${t.solver} IS NOT NULL
      AND ${t.lineSolverIterationCount} IS NOT NULL
      AND ${t.fourSolverIntersectionCount} IS NOT NULL
    )
  `),
]);

export type Puzzle = typeof puzzles.$inferSelect;
export type NewPuzzle = typeof puzzles.$inferInsert;
