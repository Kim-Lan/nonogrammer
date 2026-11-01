import type { TestDatabase } from '../../helper/database';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { puzzles } from '../../../server/database/schema';
import { getSolutionHash } from '../../../server/utils/nonograms-utils';
import { dockerAvailable, startTestDatabase } from '../../helper/database';

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
  const solutionBits = '0010001110111110111000100';

  return {
    height: 5,
    width: 5,
    rowClues: [[1], [3], [5], [3], [1]],
    columnClues: [[1], [3], [5], [3], [1]],
    solutionBits,
    solutionHash: getSolutionHash(5, 5, solutionBits),
    difficulty: 'normal',
    solver: 'line',
    ...overrides,
  };
}

describe.runIf(hasDocker)('puzzle repository integration test', () => {
  let testDatabase: TestDatabase;
  let repository: typeof import('../../../server/repository/PuzzleRepository');

  const generatePuzzleMock = vi.fn();

  beforeAll(async () => {
    testDatabase = await startTestDatabase();

    vi.resetModules();

    vi.doMock('../../../server/database', () => ({
      default: testDatabase.db,
    }));

    vi.doMock('../../../server/nonograms/nonograms-generator', () => ({
      generatePuzzle: generatePuzzleMock,
    }));

    repository = await import('../../../server/repository/PuzzleRepository');
  }, 120_000);

  beforeEach(() => {
    generatePuzzleMock.mockReset();

    generatePuzzleMock.mockReturnValue(
      makeTestPuzzle(),
    );
  });

  afterEach(async () => {
    await testDatabase.db.delete(puzzles);
  });

  afterAll(async () => {
    vi.doUnmock('../../../server/database');
    vi.doUnmock('../../../server/nonograms/puzzle-generator');

    await testDatabase?.cleanup();
  });

  it('finds an existing system puzzle', async () => {
    // Insert an existing puzzle
    const [existingPuzzle] = await testDatabase.db
      .insert(puzzles)
      .values(makeTestPuzzle({
        type: 'system',
        validationStatus: 'valid',
      }))
      .returning();

    expect(existingPuzzle).toBeDefined();

    // Call the actual repository
    const result = await repository.getSystemPuzzle(
      5, 5, 'normal',
    );

    expect(generatePuzzleMock).toHaveBeenCalled();

    // Check the existing puzzle is returned
    expect(result.slug).toBe(existingPuzzle!.slug);

    expect(result).toMatchObject({
      type: 'system',
      height: 5,
      width: 5,
      solutionHash: getSolutionHash(5, 5, '0010001110111110111000100'),
      difficulty: 'normal',
    });

    // Check no duplicate was inserted
    const rows = await testDatabase.db
      .select()
      .from(puzzles);

    expect(rows).toHaveLength(1);
  });

  it('creates a new puzzle when there is no duplicate', async () => {
    // Generate a new puzzle
    const result = await repository.getSystemPuzzle(
      5, 5, 'normal',
    );

    // Check the repository returned a new puzzle
    const solutionHash = getSolutionHash(5, 5, '0010001110111110111000100');

    expect(result).toMatchObject({
      type: 'system',
      height: 5,
      width: 5,
      solutionHash,
      difficulty: 'normal',
    });

    // Check the puzzle was stored in the database
    const rows = await testDatabase.db
      .select()
      .from(puzzles);

    expect(rows).toHaveLength(1);
    expect(rows[0]!.slug).toBe(result.slug);
    expect(rows[0]!.solutionHash).toBe(solutionHash);
  });

  it('does not match a puzzle with a different solution', async () => {
    // Add another 5x5 puzzle
    const otherSolutionBits = '1111100000111110000011111';

    const [otherPuzzle] = await testDatabase.db
      .insert(puzzles)
      .values(makeTestPuzzle({
        solutionBits: otherSolutionBits,
        solutionHash: getSolutionHash(5, 5, otherSolutionBits),
        rowClues: [[5], [], [5], [], [5]],
        columnClues: [
          [1, 1, 1],
          [1, 1, 1],
          [1, 1, 1],
          [1, 1, 1],
          [1, 1, 1],
        ],
        type: 'system',
        validationStatus: 'valid',
      }))
      .returning();

    // Generate the original puzzle
    const result = await repository.getSystemPuzzle(5, 5, 'normal');

    // Check the other puzzle was not returned
    expect(result.id).not.toBe(otherPuzzle!.id);
    expect(result.slug).not.toBe(otherPuzzle!.slug);
    expect(result.solutionHash).toBe(getSolutionHash(5, 5, '0010001110111110111000100'));

    const rows = await testDatabase.db
      .select()
      .from(puzzles);

    expect(rows).toHaveLength(2);
  });

  it('returns an existing puzzle on repeated requests', async () => {
    // First request creates the puzzle
    const first = await repository.getSystemPuzzle(5, 5, 'normal');

    // Second request generates the identical solution
    const second = await repository.getSystemPuzzle(5, 5, 'normal');

    expect(second.id).toBe(first.id);
    expect(second.slug).toBe(first.slug);

    const rows = await testDatabase.db
      .select()
      .from(puzzles);

    expect(rows).toHaveLength(1);
    expect(generatePuzzleMock).toHaveBeenCalledTimes(2);
  });
});
