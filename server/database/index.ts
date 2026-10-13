import { drizzle } from 'drizzle-orm/neon-http';
import env from '~~/lib/env';
import { relations } from './relations';

const db = drizzle(env.DATABASE_URL, {
  relations,
});

export default db;
