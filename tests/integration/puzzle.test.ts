import type { NewPuzzle } from '../../server/database/schema';
import type { TestDatabase } from '../helper/database';
import { randomUUID } from 'node:crypto';
import { eq, sql } from 'drizzle-orm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { puzzles } from '../../server/database/schema';
import { dockerAvailable, startTestDatabase } from '../helper/database';

const hasDocker = await dockerAvailable();

if (!hasDocker) {
  // eslint-disable-next-line node/no-process-env
  if (process.env.CI === 'true') {
    throw new Error('Docker is required for database integration tests');
  } else {
    console.warn('Docker not available. Skipping integration tests.');
  }
}

function makeTestPuzzle(overrides: Partial<NewPuzzle> = {}): NewPuzzle {
  return {
    type: 'system',
    generator: 'tatham',
    height: 5,
    width: 5,
    rowClues: [[1], [3], [5], [3], [1]],
    columnClues: [[1], [3], [5], [3], [1]],
    solutionBits: '0010001110111110111000100',
    solutionHash: randomUUID(),
    ...overrides,
  };
}

describe.runIf(hasDocker)('puzzle schema integration', () => {
  let testDatabase: TestDatabase;

  beforeAll(async () => {
    testDatabase = await startTestDatabase();
  }, 120_000);

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
      'filled_cell_count',
      'difficulty',
      'generator',
      'solver',
      'simple_solver_sweep_count',
      'four_solver_intersection_count',
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
      { name: 'filled_cell_count', type: 'smallint', nullable: true },
      { name: 'difficulty', type: 'puzzle_difficulty', nullable: true },
      { name: 'generator', type: 'puzzle_generator', nullable: true },
      { name: 'solver', type: 'puzzle_solver', nullable: true },
      { name: 'simple_solver_sweep_count', type: 'integer', nullable: true },
      { name: 'four_solver_intersection_count', type: 'integer', nullable: true },
      { name: 'publication_status', type: 'puzzle_publication_status', nullable: false },
      { name: 'validation_status', type: 'puzzle_validation_status', nullable: false },
      { name: 'created_at', type: 'timestamp with time zone', nullable: false },
      { name: 'updated_at', type: 'timestamp with time zone', nullable: false },
    ]);
  });

  it('adds and retrieves pending system puzzle and generates correct default values and filled cell count', async () => {
    const [puzzle] = await testDatabase.db
      .insert(puzzles)
      .values(makeTestPuzzle())
      .returning();

    expect(puzzle).toBeDefined();

    expect(puzzle.slug).toMatch(/^[a-f0-9]{24}$/);
    expect(puzzle.id).toBeGreaterThan(0);
    expect(puzzle.solutionBits).toHaveLength(25);
    expect(puzzle.rowClues).toHaveLength(5);
    expect(puzzle.columnClues).toHaveLength(5);
    expect(puzzle.createdAt).toBeInstanceOf(Date);
    expect(puzzle.updatedAt).toBeInstanceOf(Date);

    expect(puzzle).toMatchObject({
      filledCellCount: 13,
      difficulty: null,
      solver: null,
      simpleSolverSweepCount: null,
      fourSolverIntersectionCount: null,
      publicationStatus: 'draft',
      validationStatus: 'pending',
    });

    const retrieved = await testDatabase.db.query.puzzles.findFirst({
      where: {
        id: puzzle.id,
      },
    });

    expect(retrieved).toEqual(puzzle);
  });

  it('adds and retrieves valid normal puzzle with simple solver metadata', async () => {
    const testPuzzle = makeTestPuzzle({
      difficulty: 'normal',
      solver: 'simple',
      simpleSolverSweepCount: 4,
      fourSolverIntersectionCount: 0,
      validationStatus: 'valid',
    });

    const [puzzle] = await testDatabase.db
      .insert(puzzles)
      .values(testPuzzle)
      .returning();

    expect(puzzle).toBeDefined();

    expect(puzzle).toMatchObject(testPuzzle);

    expect(puzzle.slug).toMatch(/^[a-f0-9]{24}$/);
    expect(puzzle.id).toBeGreaterThan(0);
    expect(puzzle.createdAt).toBeInstanceOf(Date);
    expect(puzzle.updatedAt).toBeInstanceOf(Date);

    const retrieved = await testDatabase.db.query.puzzles.findFirst({
      where: {
        id: puzzle.id,
      },
    });

    expect(retrieved).toEqual(puzzle);
  });

  it('adds and retrieves valid hard puzzle with four solver metadata', async () => {
    const testPuzzle = makeTestPuzzle({
      difficulty: 'hard',
      solver: 'four',
      simpleSolverSweepCount: 4,
      fourSolverIntersectionCount: 4,
      validationStatus: 'valid',
    });

    const [puzzle] = await testDatabase.db
      .insert(puzzles)
      .values(testPuzzle)
      .returning();

    expect(puzzle).toBeDefined();

    expect(puzzle).toMatchObject(testPuzzle);

    expect(puzzle.slug).toMatch(/^[a-f0-9]{24}$/);
    expect(puzzle.id).toBeGreaterThan(0);
    expect(puzzle.createdAt).toBeInstanceOf(Date);
    expect(puzzle.updatedAt).toBeInstanceOf(Date);

    const retrieved = await testDatabase.db.query.puzzles.findFirst({
      where: {
        id: puzzle.id,
      },
    });

    expect(retrieved).toEqual(puzzle);
  });

  it('retrieves a puzzle by slug regardless of case', async () => {
    const slug = `test-puzzle-${randomUUID().slice(0, 8)}`;

    const [puzzle] = await testDatabase.db
      .insert(puzzles)
      .values(makeTestPuzzle({
        type: 'community',
        slug,
      }))
      .returning();

    const [found] = await testDatabase.db
      .select()
      .from(puzzles)
      .where(sql`lower(${puzzles.slug}) = lower(${slug.toUpperCase()})`);

    expect(found?.id).toBe(puzzle.id);
  });

  it('rejects duplicate slug with different capitalization', async () => {
    const slug = `test-puzzle-${randomUUID().slice(0, 8)}`;

    const [puzzle] = await testDatabase.db
      .insert(puzzles)
      .values(makeTestPuzzle({
        type: 'community',
        slug,
      }))
      .returning();

    expect(puzzle).toBeDefined();

    await expect(
      testDatabase.db.insert(puzzles).values(makeTestPuzzle({
        type: 'community',
        slug: slug.toUpperCase(),
      })),
    ).rejects.toMatchObject({
      cause: {
        code: '23505',
        constraint: 'puzzles_slug_unique',
      },
    });
  });

  it('rejects duplicate slugs across puzzle types', async () => {
    const slug = `test-${randomUUID().slice(0, 8)}`;

    await testDatabase.db.insert(puzzles).values(
      makeTestPuzzle({
        type: 'system',
        slug,
      }),
    );

    await expect(
      testDatabase.db.insert(puzzles).values(
        makeTestPuzzle({
          type: 'community',
          slug,
        }),
      ),
    ).rejects.toMatchObject({
      cause: {
        code: '23505',
        constraint: 'puzzles_slug_unique',
      },
    });

    await expect(
      testDatabase.db.insert(puzzles).values(
        makeTestPuzzle({
          type: 'community',
          slug: slug.toUpperCase(),
        }),
      ),
    ).rejects.toMatchObject({
      cause: {
        code: '23505',
        constraint: 'puzzles_slug_unique',
      },
    });
  });

  it('rejects duplicate system puzzle solutions', async () => {
    const testPuzzle = makeTestPuzzle();

    const [puzzle] = await testDatabase.db
      .insert(puzzles)
      .values(testPuzzle)
      .returning();

    expect(puzzle).toBeDefined();

    await expect(
      testDatabase.db.insert(puzzles).values({
        ...testPuzzle,
        slug: `duplicate-${randomUUID()}`,
      }),
    ).rejects.toMatchObject({
      cause: {
        code: '23505',
        constraint: 'puzzles_system_puzzle_solution_unique',
      },
    });
  });

  it('rejects duplicate daily puzzle solutions', async () => {
    const testPuzzle = makeTestPuzzle({
      type: 'daily',
    });

    const [puzzle] = await testDatabase.db
      .insert(puzzles)
      .values(testPuzzle)
      .returning();

    expect(puzzle).toBeDefined();

    await expect(
      testDatabase.db.insert(puzzles).values({
        ...testPuzzle,
        slug: `duplicate-${randomUUID()}`,
      }),
    ).rejects.toMatchObject({
      cause: {
        code: '23505',
        constraint: 'puzzles_daily_puzzle_solution_unique',
      },
    });
  });

  it('allows duplicate community puzzle solutions', async () => {
    const testPuzzle = makeTestPuzzle({
      type: 'community',
    });

    const [puzzleA] = await testDatabase.db
      .insert(puzzles)
      .values(testPuzzle)
      .returning();

    expect(puzzleA).toBeDefined();

    const [puzzleB] = await testDatabase.db
      .insert(puzzles)
      .values(testPuzzle)
      .returning();

    expect(puzzleB).toBeDefined();
    expect(puzzleB.id).not.toBe(puzzleA.id);
    expect(puzzleB.solutionHash).toBe(puzzleA.solutionHash);
  });

  it('accepts slugs with internal hyphens/underscores', async () => {
    const slug = `test_puzzle-${randomUUID().slice(0, 8)}`;
    const [puzzle] = await testDatabase.db
      .insert(puzzles)
      .values(makeTestPuzzle({
        slug,
      }))
      .returning();

    expect(puzzle).toBeDefined();
  });

  it.each([
    '_invalid_slug',
    'invalid_slug_',
    'invalid%slug',
  ])('rejects invalid slug format: %s', async (slug) => {
    await expect(
      testDatabase.db.insert(puzzles).values(
        makeTestPuzzle({
          type: 'community',
          slug,
        }),
      ),
    ).rejects.toMatchObject({
      cause: {
        code: '23514',
        constraint: 'slug_format',
      },
    });
  });

  it('rejects slugs with invalid length', async () => {
    await expect(
      testDatabase.db.insert(puzzles).values(makeTestPuzzle({
        type: 'community',
        slug: 'a',
      })),
    ).rejects.toMatchObject({
      cause: {
        code: '23514',
        constraint: 'slug_min_length',
      },
    });

    await expect(
      testDatabase.db.insert(puzzles).values(makeTestPuzzle({
        type: 'community',
        slug: 'aa',
      })),
    ).rejects.toMatchObject({
      cause: {
        code: '23514',
        constraint: 'slug_min_length',
      },
    });

    await expect(
      testDatabase.db.insert(puzzles).values(makeTestPuzzle({
        type: 'community',
        slug: 'a'.repeat(129),
      })),
    ).rejects.toMatchObject({
      cause: {
        code: '22001',
      },
    });
  });

  it('accepts slug with length 3', async () => {
    const [puzzle] = await testDatabase.db
      .insert(puzzles)
      .values(makeTestPuzzle({
        type: 'community',
        slug: 'aaa',
      }))
      .returning();

    expect(puzzle).toBeDefined();
    expect(puzzle.slug).toHaveLength(3);
  });

  it('accepts slug with length 128', async () => {
    const [puzzle] = await testDatabase.db
      .insert(puzzles)
      .values(makeTestPuzzle({
        type: 'community',
        slug: 'a'.repeat(128),
      }))
      .returning();

    expect(puzzle).toBeDefined();
    expect(puzzle.slug).toHaveLength(128);
  });

  it.each([
    [5, 5],
    [10, 10],
    [15, 15],
    [20, 20],
    [25, 25],
    [30, 30],
    [5, 30],
    [30, 5],
    [5, 6],
    [6, 5],
    [6, 6],
    [6, 29],
    [29, 29],
    [29, 6],
    [30, 29],
    [29, 30],
  ])('accepts %ix%i puzzle', async (height, width) => {
    const [puzzle] = await testDatabase.db
      .insert(puzzles)
      .values(makeTestPuzzle({
        height,
        width,
        rowClues: Array.from(
          { length: height },
          () => Array.from({ length: Math.floor(height / 2) }).fill(1),
        ),
        columnClues: Array.from(
          { length: width },
          () => Array.from({ length: Math.floor(width / 2) }).fill(1),
        ),
        solutionBits: Array.from(
          { length: height },
          (_, row) =>
            Array.from(
              { length: width },
              (_, col) => (row + col) % 2 === 0 ? '1' : '0',
            ).join(''),
        ).join(''),
      }))
      .returning();

    expect(puzzle).toBeDefined();
    expect(puzzle).toMatchObject({
      height,
      width,
      filledCellCount: Math.ceil(height * width / 2),
    });
    expect(puzzle.solutionBits).toHaveLength(height * width);
    expect(puzzle.rowClues).toHaveLength(height);
    expect(puzzle.columnClues).toHaveLength(width);
  });

  it.each([
    [4, 5, 'height_range'],
    [5, 4, 'width_range'],
    [31, 5, 'height_range'],
    [5, 31, 'width_range'],
    [4, 15, 'height_range'],
    [15, 4, 'width_range'],
    [31, 15, 'height_range'],
    [15, 31, 'width_range'],
  ] as const)(
    'rejects puzzle with dimensions %ix%i',
    async (height, width, constraint) => {
      await expect(
        testDatabase.db.insert(puzzles).values(makeTestPuzzle({
          height,
          width,
          rowClues: Array.from({ length: height }, () => []),
          columnClues: Array.from({ length: width }, () => []),
          solutionBits: '0'.repeat(height * width),
        })),
      ).rejects.toMatchObject({
        cause: {
          code: '23514',
          constraint,
        },
      });
    });

  it('rejects solution with incorrect length', async () => {
    await expect(
      testDatabase.db.insert(puzzles).values(makeTestPuzzle({
        height: 5,
        width: 5,
        rowClues: [[1], [3], [5], [3], [1]],
        columnClues: [[1], [3], [5], [3], [1]],
        solutionBits: '001000111011111011100010',
      })),
    ).rejects.toMatchObject({
      cause: {
        code: '23514',
        constraint: 'solution_length',
      },
    });
  });

  it('rejects invalid binary solution', async () => {
    await expect(
      testDatabase.db.insert(puzzles).values(makeTestPuzzle({
        solutionBits: '0010001110111110111000102',
      })),
    ).rejects.toMatchObject({
      cause: {
        code: '23514',
        constraint: 'binary_solution',
      },
    });
  });

  it('rejects invalid row/column clue dimensions', async () => {
    await expect(
      testDatabase.db.insert(puzzles).values(makeTestPuzzle({
        height: 5,
        width: 5,
        rowClues: [[1], [3], [5], [3]],
        columnClues: [[1], [3], [5], [3], [1]],
      })),
    ).rejects.toMatchObject({
      cause: {
        code: '23514',
        constraint: 'clue_dimensions',
      },
    });

    await expect(
      testDatabase.db.insert(puzzles).values(makeTestPuzzle({
        height: 5,
        width: 5,
        rowClues: [[1], [3], [5], [3], [1]],
        columnClues: [[1], [3], [5], [3]],
      })),
    ).rejects.toMatchObject({
      cause: {
        code: '23514',
        constraint: 'clue_dimensions',
      },
    });
  });

  it('rejects system puzzle without generator', async () => {
    await expect(
      testDatabase.db.insert(puzzles).values(makeTestPuzzle({
        type: 'system',
        generator: null,
      })),
    ).rejects.toMatchObject({
      cause: {
        code: '23514',
        constraint: 'generator_consistency',
      },
    });
  });

  it('rejects faily puzzle without generator', async () => {
    await expect(
      testDatabase.db.insert(puzzles).values(makeTestPuzzle({
        type: 'daily',
        generator: null,
      })),
    ).rejects.toMatchObject({
      cause: {
        code: '23514',
        constraint: 'generator_consistency',
      },
    });
  });

  it('allows community puzzle without generator', async () => {
    const [puzzle] = await testDatabase.db
      .insert(puzzles)
      .values(makeTestPuzzle({
        type: 'community',
        generator: null,
      }))
      .returning();

    expect(puzzle).toBeDefined();
    expect(puzzle.type).toBe('community');
    expect(puzzle.generator).toBeNull();
  });

  it('rejects published puzzle with pending validation', async () => {
    await expect(
      testDatabase.db.insert(puzzles).values(makeTestPuzzle({
        publicationStatus: 'published',
      })),
    ).rejects.toMatchObject({
      cause: {
        code: '23514',
        constraint: 'published_puzzle_validity',
      },
    });

    await expect(
      testDatabase.db.insert(puzzles).values(makeTestPuzzle({
        publicationStatus: 'published',
        validationStatus: 'pending',
      })),
    ).rejects.toMatchObject({
      cause: {
        code: '23514',
        constraint: 'published_puzzle_validity',
      },
    });
  });

  it('rejects invalid published puzzle', async () => {
    await expect(
      testDatabase.db.insert(puzzles).values(makeTestPuzzle({
        publicationStatus: 'published',
        validationStatus: 'invalid',
      })),
    ).rejects.toMatchObject({
      cause: {
        code: '23514',
        constraint: 'published_puzzle_validity',
      },
    });
  });

  it('accepts a valid published puzzle', async () => {
    const [puzzle] = await testDatabase.db
      .insert(puzzles)
      .values(makeTestPuzzle({
        difficulty: 'normal',
        solver: 'simple',
        simpleSolverSweepCount: 4,
        fourSolverIntersectionCount: 0,
        publicationStatus: 'published',
        validationStatus: 'valid',
      }))
      .returning();

    expect(puzzle).toBeDefined();
    expect(puzzle.publicationStatus).toBe('published');
    expect(puzzle.validationStatus).toBe('valid');
  });

  it('rejects normal puzzle with four solver intersections', async () => {
    await expect(
      testDatabase.db.insert(puzzles).values(makeTestPuzzle({
        difficulty: 'normal',
        solver: 'simple',
        simpleSolverSweepCount: 4,
        fourSolverIntersectionCount: 4,
        validationStatus: 'valid',
      })),
    ).rejects.toMatchObject({
      cause: {
        code: '23514',
        constraint: 'solver_sweep_intersection_consistency',
      },
    });
  });

  it('rejects hard puzzle with zero four solver intersections', async () => {
    await expect(
      testDatabase.db.insert(puzzles).values(makeTestPuzzle({
        difficulty: 'hard',
        solver: 'four',
        simpleSolverSweepCount: 4,
        fourSolverIntersectionCount: 0,
        validationStatus: 'valid',
      })),
    ).rejects.toMatchObject({
      cause: {
        code: '23514',
        constraint: 'solver_sweep_intersection_consistency',
      },
    });
  });

  it('rejects puzzle with invalid sweep or intersection counts', async () => {
    await expect(
      testDatabase.db.insert(puzzles).values(makeTestPuzzle({
        difficulty: 'normal',
        solver: 'simple',
        simpleSolverSweepCount: 0,
        fourSolverIntersectionCount: 0,
        validationStatus: 'valid',
      })),
    ).rejects.toMatchObject({
      cause: {
        code: '23514',
        constraint: 'solver_sweep_intersection_consistency',
      },
    });

    await expect(
      testDatabase.db.insert(puzzles).values(makeTestPuzzle({
        difficulty: 'hard',
        solver: 'four',
        simpleSolverSweepCount: 0,
        fourSolverIntersectionCount: 0,
        validationStatus: 'valid',
      })),
    ).rejects.toMatchObject({
      cause: {
        code: '23514',
        constraint: 'solver_sweep_intersection_consistency',
      },
    });

    await expect(
      testDatabase.db.insert(puzzles).values(makeTestPuzzle({
        difficulty: 'normal',
        solver: 'simple',
        simpleSolverSweepCount: -1,
        fourSolverIntersectionCount: 0,
        validationStatus: 'valid',
      })),
    ).rejects.toMatchObject({
      cause: {
        code: '23514',
      },
    });

    await expect(
      testDatabase.db.insert(puzzles).values(makeTestPuzzle({
        difficulty: 'hard',
        solver: 'four',
        simpleSolverSweepCount: 0,
        fourSolverIntersectionCount: -1,
        validationStatus: 'valid',
      })),
    ).rejects.toMatchObject({
      cause: {
        code: '23514',
      },
    });
  });

  it('rejects puzzle with invalid solver and difficulty combination', async () => {
    await expect(
      testDatabase.db.insert(puzzles).values(makeTestPuzzle({
        difficulty: 'hard',
        solver: 'simple',
        simpleSolverSweepCount: 4,
        fourSolverIntersectionCount: 0,
        validationStatus: 'valid',
      })),
    ).rejects.toMatchObject({
      cause: {
        code: '23514',
        constraint: 'difficulty_solver_consistency',
      },
    });

    await expect(
      testDatabase.db.insert(puzzles).values(makeTestPuzzle({
        difficulty: 'normal',
        solver: 'four',
        simpleSolverSweepCount: 4,
        fourSolverIntersectionCount: 4,
        validationStatus: 'valid',
      })),
    ).rejects.toMatchObject({
      cause: {
        code: '23514',
        constraint: 'difficulty_solver_consistency',
      },
    });
  });

  it('rejects validated puzzle without solver and difficulty metadata', async () => {
    await expect(
      testDatabase.db.insert(puzzles).values(makeTestPuzzle({
        validationStatus: 'valid',
      })),
    ).rejects.toMatchObject({
      cause: {
        code: '23514',
        constraint: 'validation_solver_consistency',
      },
    });

    await expect(
      testDatabase.db.insert(puzzles).values(makeTestPuzzle({
        difficulty: 'normal',
        validationStatus: 'valid',
      })),
    ).rejects.toMatchObject({
      cause: {
        code: '23514',
      },
    });

    await expect(
      testDatabase.db.insert(puzzles).values(makeTestPuzzle({
        difficulty: 'normal',
        solver: 'simple',
        validationStatus: 'valid',
      })),
    ).rejects.toMatchObject({
      cause: {
        code: '23514',
        constraint: 'validation_solver_consistency',
      },
    });

    await expect(
      testDatabase.db.insert(puzzles).values(makeTestPuzzle({
        difficulty: 'normal',
        solver: 'simple',
        simpleSolverSweepCount: 4,
        validationStatus: 'valid',
      })),
    ).rejects.toMatchObject({
      cause: {
        code: '23514',
        constraint: 'validation_solver_consistency',
      },
    });

    await expect(
      testDatabase.db.insert(puzzles).values(makeTestPuzzle({
        difficulty: 'normal',
        solver: 'simple',
        fourSolverIntersectionCount: 0,
        validationStatus: 'valid',
      })),
    ).rejects.toMatchObject({
      cause: {
        code: '23514',
        constraint: 'validation_solver_consistency',
      },
    });
  });

  it('rejects pending puzzle with solver and difficulty metadata', async () => {
    await expect(
      testDatabase.db.insert(puzzles).values(makeTestPuzzle({
        difficulty: 'normal',
        solver: 'simple',
        validationStatus: 'pending',
      })),
    ).rejects.toMatchObject({
      cause: {
        code: '23514',
        constraint: 'validation_solver_consistency',
      },
    });

    await expect(
      testDatabase.db.insert(puzzles).values(makeTestPuzzle({
        difficulty: 'normal',
        solver: 'simple',
        simpleSolverSweepCount: 4,
        fourSolverIntersectionCount: 0,
        validationStatus: 'pending',
      })),
    ).rejects.toMatchObject({
      cause: {
        code: '23514',
        constraint: 'validation_solver_consistency',
      },
    });
  });

  it('rejects invalid puzzle with solver and difficulty metadata', async () => {
    await expect(
      testDatabase.db.insert(puzzles).values(makeTestPuzzle({
        difficulty: 'normal',
        solver: 'simple',
        simpleSolverSweepCount: 4,
        fourSolverIntersectionCount: 0,
        validationStatus: 'invalid',
      })),
    ).rejects.toMatchObject({
      cause: {
        code: '23514',
        constraint: 'validation_solver_consistency',
      },
    });

    await expect(
      testDatabase.db.insert(puzzles).values(makeTestPuzzle({
        difficulty: 'normal',
        solver: 'simple',
        validationStatus: 'invalid',
      })),
    ).rejects.toMatchObject({
      cause: {
        code: '23514',
        constraint: 'validation_solver_consistency',
      },
    });
  });

  it('updates pending puzzle to valid', async () => {
    const [puzzle] = await testDatabase.db
      .insert(puzzles)
      .values(makeTestPuzzle())
      .returning();

    expect(puzzle).toBeDefined();
    expect(puzzle.difficulty).toBeNull();
    expect(puzzle.solver).toBeNull();
    expect(puzzle.validationStatus).toBe('pending');

    const [updated] = await testDatabase.db
      .update(puzzles)
      .set({
        validationStatus: 'valid',
        difficulty: 'normal',
        solver: 'simple',
        simpleSolverSweepCount: 4,
        fourSolverIntersectionCount: 0,
      })
      .where(eq(puzzles.id, puzzle.id))
      .returning();

    expect(updated).toMatchObject({
      id: puzzle.id,
      validationStatus: 'valid',
      difficulty: 'normal',
      solver: 'simple',
      simpleSolverSweepCount: 4,
      fourSolverIntersectionCount: 0,
    });

    const retrieved = await testDatabase.db.query.puzzles.findFirst({
      where: {
        id: puzzle.id,
      },
    });

    expect(retrieved).toEqual(updated);
  });

  it('rejects publishing pending puzzle via update', async () => {
    const [puzzle] = await testDatabase.db
      .insert(puzzles)
      .values(makeTestPuzzle())
      .returning();

    expect(puzzle.publicationStatus).toBe('draft');
    expect(puzzle.validationStatus).toBe('pending');

    await expect(
      testDatabase.db
        .update(puzzles)
        .set({
          publicationStatus: 'published',
        })
        .where(eq(puzzles.id, puzzle.id)),
    ).rejects.toMatchObject({
      cause: {
        code: '23514',
        constraint: 'published_puzzle_validity',
      },
    });

    const retrieved = await testDatabase.db.query.puzzles.findFirst({
      where: {
        id: puzzle.id,
      },
    });

    expect(retrieved).toBeDefined();
    expect(retrieved.publicationStatus).toBe('draft');
    expect(retrieved.validationStatus).toBe('pending');
  });

  it('rejects changing slug to a case-insensitive duplicate', async () => {
    const [puzzleA] = await testDatabase.db
      .insert(puzzles)
      .values(makeTestPuzzle({
        type: 'community',
        slug: 'test-puzzle-a',
      }))
      .returning();

    const [puzzleB] = await testDatabase.db
      .insert(puzzles)
      .values(makeTestPuzzle({
        type: 'community',
        slug: 'test-puzzle-b',
      }))
      .returning();

    expect(puzzleA).toBeDefined();
    expect(puzzleB).toBeDefined();

    await expect(
      testDatabase.db
        .update(puzzles)
        .set({
          slug: 'TEST-PUZZLE-A',
        })
        .where(eq(puzzles.id, puzzleB.id)),
    ).rejects.toMatchObject({
      cause: {
        code: '23505',
        constraint: 'puzzles_slug_unique',
      },
    });

    const retrieved = await testDatabase.db.query.puzzles.findFirst({
      where: {
        id: puzzleB.id,
      },
    });

    expect(retrieved).toBeDefined();
    expect(retrieved.slug).toBe('test-puzzle-b');
  });

  it('rejects updating valid puzzle to pending without clearing metadata', async () => {
    const [puzzle] = await testDatabase.db
      .insert(puzzles)
      .values(makeTestPuzzle({
        validationStatus: 'valid',
        difficulty: 'normal',
        solver: 'simple',
        simpleSolverSweepCount: 4,
        fourSolverIntersectionCount: 0,
      }))
      .returning();

    expect(puzzle).toBeDefined();
    expect(puzzle.validationStatus).toBe('valid');

    await expect(
      testDatabase.db
        .update(puzzles)
        .set({
          validationStatus: 'pending',
        })
        .where(eq(puzzles.id, puzzle.id)),
    ).rejects.toMatchObject({
      cause: {
        code: '23514',
        constraint: 'validation_solver_consistency',
      },
    });

    const retrieved = await testDatabase.db.query.puzzles.findFirst({
      where: {
        id: puzzle.id,
      },
    });

    expect(retrieved).toEqual(puzzle);
  });

  it('rejects changing published puzzle to pending', async () => {
    const [puzzle] = await testDatabase.db
      .insert(puzzles)
      .values(makeTestPuzzle({
        publicationStatus: 'published',
        validationStatus: 'valid',
        difficulty: 'normal',
        solver: 'simple',
        simpleSolverSweepCount: 4,
        fourSolverIntersectionCount: 0,
      }))
      .returning();

    expect(puzzle).toBeDefined();
    expect(puzzle.publicationStatus).toBe('published');
    expect(puzzle.validationStatus).toBe('valid');

    await expect(
      testDatabase.db
        .update(puzzles)
        .set({
          validationStatus: 'pending',
          difficulty: null,
          solver: null,
          simpleSolverSweepCount: null,
          fourSolverIntersectionCount: null,
        })
        .where(eq(puzzles.id, puzzle.id)),
    ).rejects.toMatchObject({
      cause: {
        code: '23514',
        constraint: 'published_puzzle_validity',
      },
    });

    const retrieved = await testDatabase.db.query.puzzles.findFirst({
      where: {
        id: puzzle.id,
      },
    });

    expect(retrieved).toEqual(puzzle);
  });

  it('allows changing published puzzle to unpublished and pending', async () => {
    const [puzzle] = await testDatabase.db
      .insert(puzzles)
      .values(makeTestPuzzle({
        publicationStatus: 'published',
        validationStatus: 'valid',
        difficulty: 'normal',
        solver: 'simple',
        simpleSolverSweepCount: 4,
        fourSolverIntersectionCount: 0,
      }))
      .returning();

    expect(puzzle).toBeDefined();
    expect(puzzle.publicationStatus).toBe('published');
    expect(puzzle.validationStatus).toBe('valid');

    const [updated] = await testDatabase.db
      .update(puzzles)
      .set({
        publicationStatus: 'unpublished',
        validationStatus: 'pending',
        difficulty: null,
        solver: null,
        simpleSolverSweepCount: null,
        fourSolverIntersectionCount: null,
      })
      .where(eq(puzzles.id, puzzle.id))
      .returning();

    expect(updated).toMatchObject({
      id: puzzle.id,
      publicationStatus: 'unpublished',
      validationStatus: 'pending',
      difficulty: null,
      solver: null,
      simpleSolverSweepCount: null,
      fourSolverIntersectionCount: null,
    });

    const retrieved = await testDatabase.db.query.puzzles.findFirst({
      where: {
        id: puzzle.id,
      },
    });

    expect(retrieved).toEqual(updated);
  });

  it('rejects explicit values for generated filled cell count', async () => {
    await expect(
      testDatabase.pool.query(`
        INSERT INTO puzzles (
          slug,
          type,
          generator,
          height,
          width,
          row_clues,
          column_clues,
          solution_bits,
          solution_hash,
          filled_cell_count
        )
        VALUES (
          'generated-column-test',
          'system',
          'tatham',
          5,
          5,
          '[[1],[3],[5],[3],[1]]'::jsonb,
          '[[1],[3],[5],[3],[1]]'::jsonb,
          '0010001110111110111000100',
          $1,
          13
        )
      `, [randomUUID()]),
    ).rejects.toMatchObject({
      code: '428C9',
    });
  });

  it('rejects non-array clues', async () => {
    await expect(
      testDatabase.db.insert(puzzles).values(
        makeTestPuzzle({
          rowClues: { invalid: true } as unknown as number[][],
        }),
      ),
    ).rejects.toMatchObject({
      cause: {
        code: '23514',
        constraint: 'row_clues_array',
      },
    });

    await expect(
      testDatabase.db.insert(puzzles).values(
        makeTestPuzzle({
          columnClues: { invalid: true } as unknown as number[][],
        }),
      ),
    ).rejects.toMatchObject({
      cause: {
        code: '23514',
        constraint: 'column_clues_array',
      },
    });
  });

  it('rejects invalid difficulty enum', async () => {
    await expect(
      testDatabase.db.insert(puzzles).values(
        makeTestPuzzle({
          difficulty: 'extreme' as NewPuzzle['difficulty'],
          solver: 'simple',
          simpleSolverSweepCount: 4,
          fourSolverIntersectionCount: 0,
          validationStatus: 'valid',
        }),
      ),
    ).rejects.toMatchObject({
      cause: {
        code: '22P02',
      },
    });
  });
});
