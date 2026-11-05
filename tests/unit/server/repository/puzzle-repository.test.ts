import { beforeEach, describe, expect, it, vi } from 'vitest';
import { generateSystemPuzzle } from '../../../../server/repository/PuzzleRepository';
import { getSolutionHash } from '../../../../server/utils/nonograms-utils';
import { generatePuzzleSlug } from '../../../../server/utils/puzzle-utils';

const mocks = vi.hoisted(() => ({
  generatePuzzle: vi.fn(),
  findFirst: vi.fn(),
}));

vi.mock('../../../../server/nonograms/nonograms-generator', () => ({
  generatePuzzle: mocks.generatePuzzle,
}));

vi.mock('../../../../server/database', () => ({
  default: {
    query: {
      puzzles: {
        findFirst: mocks.findFirst,
      },
    },
  },
}));

describe('puzzle repository unit tests', async () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('finds an existing system puzzle', async () => {
    const solutionBits = '0010001110111110111000100';

    const generatedPuzzle = {
      height: 5,
      width: 5,
      rowClues: [[1], [3], [5], [3], [1]],
      columnClues: [[1], [3], [5], [3], [1]],
      solutionBits,
      solutionHash: getSolutionHash(5, 5, solutionBits),
      difficulty: 'normal',
      solver: 'line',
    };

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
        solutionBits,
        difficulty: 'normal',
      },
    });
    expect(retrievedPuzzle).toBeDefined();
    expect(retrievedPuzzle.slug).toBe(existingPuzzle.slug);
  });
});
