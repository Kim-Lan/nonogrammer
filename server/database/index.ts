import { drizzle } from 'drizzle-orm/neon-http';
import env from '~/lib/env';
import * as schema from './schema';

const db = drizzle(env.DATABASE_URL, {
  schema,
  casing: 'snake_case',
});

export default db;
