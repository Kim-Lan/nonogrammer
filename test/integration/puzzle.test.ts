import type { TestDatabase } from '../helper/database';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { dockerAvailable, startTestDatabase } from '../helper/database';

const hasDocker = await dockerAvailable();

if (!hasDocker) {
  console.warn('Docker not available. Skipping integration tests.');
}

describe.runIf(hasDocker)('', () => {
  let testDatabase: TestDatabase;

  beforeAll(async () => {
    testDatabase = await startTestDatabase();
  });

  afterAll(async () => {
    await testDatabase?.cleanup();
  });

  it('has the correct puzzle columns', async () => {
    const result = await testDatabase.pool.query<{
      column_name: string;
    }>(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'puzzles'
      ORDER BY ordinal_position
    `);

    const columns = result.rows.map(row => row.column_name);

    expect(columns).toEqual([
      'id',
      'slug',
      'type',
      'height',
      'width',
      'row_clues',
      'column_clues',
      'solution_bits',
      'solution_hash',
      'difficulty',
      'generator',
      'solver',
      'simple_solver_sweep_count',
      'four_solver_intersection_count',
      'filled_cell_count',
      'publication_status',
      'validation_status',
      'created_at',
      'updated_at',
    ]);
  });

  it('has correct puzzle column definitions', async () => {
    const result = await testDatabase.pool.query<{
      column_name: string;
      data_type: string;
      udt_name: string;
      is_nullable: string;
    }>(`
      SELECT
        column_name,
        data_type,
        udt_name,
        is_nullable
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'puzzles'
      ORDER BY ordinal_position
    `);

    const columns = result.rows.map(row => ({
      name: row.column_name,
      type: row.data_type === 'USER-DEFINED'
        ? row.udt_name
        : row.data_type,
      nullable: row.is_nullable === 'YES',
    }));

    expect(columns).toEqual([
      { name: 'id', type: 'integer', nullable: false },
      { name: 'slug', type: 'character varying', nullable: false },
      { name: 'type', type: 'puzzle_type', nullable: false },
      { name: 'height', type: 'smallint', nullable: false },
      { name: 'width', type: 'smallint', nullable: false },
      { name: 'row_clues', type: 'jsonb', nullable: false },
      { name: 'column_clues', type: 'jsonb', nullable: false },
      { name: 'solution_bits', type: 'text', nullable: false },
      { name: 'solution_hash', type: 'text', nullable: false },
      { name: 'difficulty', type: 'puzzle_difficulty', nullable: true },
      { name: 'generator', type: 'puzzle_generator', nullable: true },
      { name: 'solver', type: 'puzzle_solver', nullable: true },
      { name: 'simple_solver_sweep_count', type: 'integer', nullable: true },
      { name: 'four_solver_intersection_count', type: 'integer', nullable: true },
      { name: 'filled_cell_count', type: 'smallint', nullable: true },
      { name: 'publication_status', type: 'puzzle_publication_status', nullable: false },
      { name: 'validation_status', type: 'puzzle_validation_status', nullable: false },
      { name: 'created_at', type: 'timestamp with time zone', nullable: false },
      { name: 'updated_at', type: 'timestamp with time zone', nullable: false },
    ]);
  });

  it('adds pending system puzzle made with generator', async () => {

  });

  it('adds valid normal puzzle with simple solver metadata', async () => {

  });

  it('adds valid hard puzzle with four solver metadata', async () => {

  });

  it('generates correct filled_cell_count', async () => {

  });

  it('generates correct default statuses and timestamps', async () => {

  });

  it('rejects duplicate slug with different capitalization', async () => {

  });

  it('rejects duplicate system puzzle solutions', async () => {

  });

  it('allows duplicate community puzzle solutions', async () => {

  });

  it('rejects invalid slugs with invalid format', async () => {

  });

  it('rejects slugs with invalid length', async () => {

  });

  it('rejects puzzle with invalid dimensions', async () => {

  });

  it('rejects solution with incorrect length', async () => {

  });

  it('rejects invalid binary solution', async () => {

  });

  it('rejects invalid row/column clue dimensions', async () => {

  });

  it('rejects system puzzle without generator', async () => {

  });

  it('allows community puzzle without generator', async () => {

  });

  it('rejects published puzzle with pending validation', async () => {

  });

  it('rejects normal puzzle with four solver intersections', async () => {

  });

  it('rejects hard puzzle with zero four solver intersections', async () => {

  });

  it('rejects puzzle using simple solver with four solver intersections', async () => {

  });

  it('rejects puzzle using four solver with zero four solver intersections', async () => {

  });

  it('rejects puzzle with invalid sweep or intersection counts', async () => {

  });

  it('rejects puzzle with invalid solver and difficulty combination', async () => {

  });

  it('rejects validated puzzle without solver and difficulty metadata', async () => {

  });

  it('rejects pending puzzle with solver and difficulty metadata', async () => {

  });

  it('rejects invalid puzzle with solver and difficulty metadata', async () => {

  });
});
