import { drizzle } from 'drizzle-orm/neon-http';
import env from '~/lib/env';
import * as schema from './schema';

const db = drizzle({
  connections: {
    url: env.DATABASE_URL,
  },
  casing: 'snake_case',
  schema,
});

export default db;
