import type { StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import * as schema from '../../../server/database/schema';

export type TestDatabase = {
  db: NodePgDatabase<typeof schema>;
  container: StartedPostgreSqlContainer;
  pool: Pool;
  cleanup: () => Promise<void>;
};

export async function startTestDatabase(): Promise<TestDatabase> {
  const container = await new PostgreSqlContainer('postgres:18-alpine').start();
  const pool = new Pool({
    connectionString: container.getConnectionUri(),
    max: 1,
  });

  const db = drizzle({
    client: pool,
    schema,
  });

  try {
    await migrate(db, {
      migrationsFolder: './server/database/migrations',
    });

    const cleanup = async () => {
      try {
        await pool.end();
      } finally {
        await container.stop();
      }
    };

    return {
      db,
      pool,
      container,
      cleanup,
    };
  } catch (error) {
    try {
      await pool.end();
    } finally {
      await container.stop();
    }

    throw error;
  }
}

export async function dockerAvailable(): Promise<boolean> {
  try {
    const { execSync } = await import('node:child_process');
    execSync('docker info', { stdio: 'ignore', timeout: 10000 });
    return true;
  } catch {
    return false;
  }
}
