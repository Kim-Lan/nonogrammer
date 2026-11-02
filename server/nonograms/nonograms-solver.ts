import type { Nullable } from '../../shared/types/puzzle';
import type { CandidatePuzzle, PuzzleSolver } from '../types/puzzle';
import { execSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { createError } from 'nuxt/server';
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
  const solverPath = path.join(__dirname, 'solver', 'pbnsolve');

  fs.writeFileSync(testPath, data);
  let solverOutput = '';
  try {
    solverOutput = (execSync(`${solverPath} -aLEC -d2 ${testPath}`)).toString();
  } catch {
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
