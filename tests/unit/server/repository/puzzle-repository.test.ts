import { eq } from 'drizzle-orm';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { puzzles } from '../../../../server/database/schema';
import { checkPuzzleSolution, generateSystemPuzzle, getPuzzleBySlug } from '../../../../server/repository/PuzzleRepository';
import { getSolutionHash } from '../../../../server/utils/nonograms';
import { generatePuzzleSlug } from '../../../../server/utils/puzzle';

const mocks = vi.hoisted(() => ({
  generatePuzzle: vi.fn(),
  findFirst: vi.fn(),
  select: vi.fn(),
  from: vi.fn(),
  where: vi.fn(),
  limit: vi.fn(),
}));

vi.mock('../../../../server/nonograms/nonograms-generator', () => ({
  generatePuzzle: mocks.generatePuzzle,
}));

vi.mock('../../../../server/database', () => ({
  default: {
    select: mocks.select,
    query: {
      puzzles: {
        findFirst: mocks.findFirst,
      },
    },
  },
}));

function makeTestPuzzle(overrides: Partial<NewPuzzle> = {}): NewPuzzle {
  return {
    height: 5,
    width: 5,
    rowClues: [[1], [3], [5], [3], [1]],
    columnClues: [[1], [3], [5], [3], [1]],
    solutionBits: '0010001110111110111000100',
    solutionHash: getSolutionHash(5, 5, '0010001110111110111000100'),
    ...overrides,
  };
}

describe('puzzle repository unit tests: getPuzzleBySlug', async () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mocks.select.mockReturnValue({ from: mocks.from });
    mocks.from.mockReturnValue({ where: mocks.where });
    mocks.where.mockReturnValue({ limit: mocks.limit });
  });

  it('finds an existing puzzle by slug', async () => {
    const existingPuzzle = makeTestPuzzle({
      slug: generatePuzzleSlug(),
      type: 'system',
      difficulty: 'normal',
    });
    mocks.limit.mockResolvedValue([existingPuzzle]);

    const retrievedPuzzle = await getPuzzleBySlug(existingPuzzle.slug);

    expect(mocks.select).toHaveBeenCalledWith({
      slug: puzzles.slug,
      type: puzzles.type,
      height: puzzles.height,
      width: puzzles.width,
      rowClues: puzzles.rowClues,
      columnClues: puzzles.columnClues,
      solutionHash: puzzles.solutionHash,
      difficulty: puzzles.difficulty,
    });
    expect(mocks.from).toHaveBeenCalledWith(puzzles);
    expect(mocks.where).toHaveBeenCalledWith(eq(puzzles.slug, existingPuzzle.slug));
    expect(mocks.limit).toHaveBeenCalledWith(1);
    expect(retrievedPuzzle).toEqual(existingPuzzle);
  });

  it('returns 404 when the requested slug does not exist', async () => {
    mocks.limit.mockResolvedValue([]);
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    try {
      await expect(getPuzzleBySlug('nonexistent-puzzle-slug')).rejects.toMatchObject({
        status: 404,
        statusText: 'Not Found',
        message: 'Puzzle ID "nonexistent-puzzle-slug" not found',
      });
      expect(mocks.where).toHaveBeenCalledWith(eq(puzzles.slug, 'nonexistent-puzzle-slug'));
    } finally {
      consoleError.mockRestore();
    }
  });
});

describe('puzzle repository unit tests: generateSystemPuzzle', async () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('finds an existing system puzzle', async () => {
    const generatedPuzzle = makeTestPuzzle({
      difficulty: 'normal',
      solver: 'line',
    });

    const existingPuzzle = {
      ...generatedPuzzle,
      slug: generatePuzzleSlug(),
      type: 'system',
    };

    mocks.generatePuzzle.mockReturnValue(generatedPuzzle);
    mocks.findFirst.mockResolvedValue(existingPuzzle);

    const retrievedPuzzle = await generateSystemPuzzle(5, 5, 'normal');

    expect(mocks.generatePuzzle).toHaveBeenCalledWith(5, 5, 'normal');
    expect(mocks.findFirst).toHaveBeenCalledWith({
      where: {
        type: 'system',
        height: 5,
        width: 5,
        solutionBits: '0010001110111110111000100',
        difficulty: 'normal',
      },
    });
    expect(retrievedPuzzle).toBeDefined();
    expect(retrievedPuzzle.slug).toBe(existingPuzzle.slug);
  });
});

describe('puzzle repository unit tests: checkPuzzleSolution', async () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('check a submitted puzzle solution', async () => {
    const slug = generatePuzzleSlug();
    const puzzle = makeTestPuzzle({
      slug,
      type: 'system',
      difficulty: 'normal',
      solver: 'line',
    });

    mocks.findFirst.mockResolvedValue(puzzle);

    const correctGrid = [['0', '0', '1', '0', '0'],
      ['0', '1', '1', '1', '0'],
      ['1', '1', '1', '1', '1'],
      ['0', '1', '1', '1', '0'],
      ['0', '0', '1', '0', '0']];

    const incorrectGrid = [['1', '0', '0', '0', '0'],
      ['0', '1', '1', '0', '0'],
      ['1', '1', '1', '1', '1'],
      ['0', '0', '1', '1', '0'],
      ['0', '0', '1', '0', '0']];

    await expect(checkPuzzleSolution(slug, correctGrid)).resolves.toBe(true);
    await expect(checkPuzzleSolution(slug, incorrectGrid)).resolves.toBe(false);
  });
});
