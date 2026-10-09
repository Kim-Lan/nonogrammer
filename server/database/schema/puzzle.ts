import type { PuzzleClues } from '../../../shared/types/puzzle';
import { sql } from 'drizzle-orm';
import { check, index, integer, jsonb, pgEnum, pgTable, smallint, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { puzzleDifficulties, puzzlePublicationStatuses, puzzleSolverMethods, puzzleTypes, puzzleValidationStatuses } from '../../../shared/types/puzzle';

export const puzzleTypeEnum = pgEnum('puzzle_type', puzzleTypes);
export const puzzleDifficultyEnum = pgEnum('puzzle_difficulty', puzzleDifficulties);
export const puzzleSolverMethodEnum = pgEnum('puzzle_solver_method', puzzleSolverMethods);
export const puzzlePublicationStatusEnum = pgEnum('puzzle_publication_status', puzzlePublicationStatuses);
export const puzzleValidationStatusEnum = pgEnum('puzzle_validation_status', puzzleValidationStatuses);

export const puzzles = pgTable('puzzles', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),

  type: puzzleTypeEnum().notNull(),

  height: smallint().notNull(),
  width: smallint().notNull(),

  rowClues: jsonb().$type<PuzzleClues>().notNull(),
  columnClues: jsonb().$type<PuzzleClues>().notNull(),

  solutionBits: text().notNull(),
  solutionHash: text().notNull(),

  difficulty: puzzleDifficultyEnum(),
  solverMethod: puzzleSolverMethodEnum(),
  simpleSolverSweepCount: integer().default(0).notNull(),
  fourSolverStepCount: integer().default(0).notNull(),

  filledCellCount: smallint().notNull(),

  publicationStatus: puzzlePublicationStatusEnum().default('draft').notNull(),
  validationStatus: puzzleValidationStatusEnum().default('pending').notNull(),

  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp({ withTimezone: true }).defaultNow().notNull().$onUpdate(() => new Date()),
}, t => [
  uniqueIndex('unique_system_puzzle_solution').on(t.height, t.width, t.solutionHash).where(sql`${t.type} = 'system'`),
  index('puzzles_selection_index').on(t.height, t.width, t.difficulty, t.id).where(sql`
    ${t.type} = 'system' AND ${t.publicationStatus} = 'published'
  `),
  check('puzzle_height_range', sql`${t.height} BETWEEN 5 AND 30`),
  check('puzzle_width_range', sql`${t.width} BETWEEN 5 AND 30`),
  check('puzzle_solution_length', sql`length(${t.solutionBits}) = ${t.height} * ${t.width}`),
  check('puzzle_binary_solution', sql`${t.solutionBits} ~ '^[01]+$'`),
  check('puzzle_filled_cell_count', sql`${t.filledCellCount} = length(replace(${t.solutionBits}, '0', ''))`),
  check('puzzle_row_clues_array', sql`jsonb_typeof(${t.rowClues}) = 'array'`),
  check('puzzle_column_clues_array', sql`jsonb_typeof(${t.columnClues}) = 'array'`),
  check('puzzle_clue_dimensions', sql`jsonb_array_length(${t.rowClues}) = ${t.height} AND jsonb_array_length(${t.columnClues}) = ${t.width}`),
  check('system_puzzle_difficulty', sql`${t.type} <> 'system' OR ${t.difficulty} IS NOT NULL`),
  check('puzzle_difficulty_solver_consistency', sql`
    (${t.difficulty} IS NULL AND ${t.solverMethod} IS NULL)
    OR (${t.difficulty} IS NOT NULL
      AND ${t.solverMethod} IS NOT NULL
      AND (
        (${t.difficulty} = 'normal' AND ${t.solverMethod} = 'simple')
        OR (${t.difficulty} = 'hard' AND ${t.solverMethod} = 'four')
      )
    )
  `),
  check('simple_solver_sweep_count_nonnegative', sql`${t.simpleSolverSweepCount} IS NULL OR ${t.simpleSolverSweepCount} >= 0`),
  check('four_solver_step_count_nonnegative', sql`${t.fourSolverStepCount} IS NULL OR ${t.fourSolverStepCount} >= 0`),
  check('published_puzzle_valid', sql`${t.publicationStatus} <> 'published' OR ${t.validationStatus} = 'valid'`),
  check('published_system_puzzle_solver_required', sql`${t.type} <> 'system'
    OR ${t.publicationStatus} <> 'published'
    OR (
      ${t.difficulty} IS NOT NULL
      AND ${t.solverMethod} IS NOT NULL
      AND ${t.simpleSolverSweepCount} IS NOT NULL
      AND ${t.fourSolverStepCount} IS NOT NULL
    )
  `),
  check('puzzle_solver_step_consistency', sql`
    ${t.solverMethod} IS NULL
    OR (
      ${t.solverMethod} = 'simple'
      AND ${t.simpleSolverSweepCount} > 0
      AND ${t.fourSolverStepCount} = 0
    )
    OR (
      ${t.solverMethod} = 'four'
      AND ${t.simpleSolverSweepCount} >= 0
      AND ${t.fourSolverStepCount} > 0
    )
  `),
]);

export type Puzzle = typeof puzzles.$inferSelect;
export type NewPuzzle = typeof puzzles.$inferInsert;
