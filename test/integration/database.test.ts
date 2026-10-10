import type { TestDatabase } from './helper/database';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { dockerAvailable, startTestDatabase } from './helper/database';

const hasDocker = await dockerAvailable();
const suite = hasDocker ? describe : describe.skip;

if (!hasDocker) {
  console.warn('Docker not available. Skipping integration tests.');
}

suite('database integration', () => {
  let testDatabase: TestDatabase;

  beforeAll(async () => {
    testDatabase = await startTestDatabase();
  });

  afterAll(async () => {
    await testDatabase?.cleanup();
  });

  it('connects to PostgreSQL', async () => {
    const result = await testDatabase.pool.query(
      'SELECT 1 AS value',
    );

    expect(result.rows[0]?.value).toBe(1);
  });
});
