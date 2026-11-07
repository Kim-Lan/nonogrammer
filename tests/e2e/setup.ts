import { setup } from '@nuxt/test-utils/e2e';
import { sql } from 'drizzle-orm';
import { beforeEach } from 'vitest';
import db from '../../server/database';
import { puzzles } from '../../server/database/schema';

export function setupE2E(options: Parameters<typeof setup>[0] = {}) {
  beforeEach(async () => {
    await db.execute(sql`TRUNCATE TABLE ${puzzles} RESTART IDENTITY CASCADE`);
  });

  return setup({
    server: true,
    browser: true,
    setupTimeout: 240_000,
    captureServerLogs: false,
    ...options,
  });
}
