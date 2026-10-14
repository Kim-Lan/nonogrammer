import { drizzle } from 'drizzle-orm/neon-http';
import { getEnv } from '~~/lib/env';
import { relations } from './relations';

const env = getEnv();

const db = drizzle(env.DATABASE_URL, {
  relations,
});

export default db;
