import type { Nullable } from '../../shared/types/puzzle';
import type { CandidatePuzzle, PuzzleSolver } from '../types/puzzle';
import { spawnSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { createError } from 'nuxt/server';
import env from '../../lib/env';
import { convertPuzzleToNon, getSolutionBitsFromSolverOutput } from '../utils/nonograms-utils';

export type SolverOutput = {
  valid: boolean;
  uniqueSolution: boolean;
  solver: Nullable<PuzzleSolver>;
  solutionBits: string | null;
};

export function checkWithSolver(puzzle: CandidatePuzzle): SolverOutput {
  const __dirname = path.resolve(path.dirname(''));
  const data = convertPuzzleToNon(puzzle);

  const testPath = path.join(__dirname, 'solver', `test-${randomUUID()}.non`);
  const localSolverPath = path.join(__dirname, 'solver', 'pbnsolve');

  const solverPath = env.PBNSOLVE_PATH
    || (fs.existsSync(localSolverPath) ? localSolverPath : 'pbnsolve');

  let solverOutput = '';
  try {
    fs.writeFileSync(testPath, data);

    const result = spawnSync(solverPath, ['-aLEC', '-d2', testPath], {
      encoding: 'utf8',
      timeout: 30_000,
    });

    if (result.error) {
      throw result.error;
    }

    if (result.status !== 0) {
      throw new Error(
        `pbnsolve exited with status ${result.status}: ${result.stderr}`,
      );
    }

    solverOutput = result.stdout;
  } catch (error) {
    console.error('pbnsolve execution failed:', {
      error,
      solverPath,
      testPath,
      cwd: process.cwd(),
    });

    throw createError({
      status: 500,
      statusText: 'Internal Server Error',
      message: 'Failed to use pbnsolve to validate puzzle',
    });
  } finally {
    fs.unlinkSync(testPath);
  }

  const uniqueSolution = solverOutput.toLowerCase().includes('unique');
  const lineSolvable = solverOutput.toLowerCase().includes('line');
  const depth2Solvable = solverOutput.toLowerCase().includes('depth-2');
  const valid = uniqueSolution && (lineSolvable || depth2Solvable);

  let solutionBits = null;
  if (valid) {
    solutionBits = puzzle.solutionBits || getSolutionBitsFromSolverOutput(solverOutput);
  }

  return {
    valid,
    uniqueSolution,
    solver: lineSolvable ? 'line' : (depth2Solvable ? 'depth-2' : null),
    solutionBits,
  };
}
