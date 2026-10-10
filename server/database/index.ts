import { defineRelations } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/neon-http';
import env from '~~/lib/env';
import * as schema from './schema';

const relations = defineRelations(schema, () => ({}));

const db = drizzle(env.DATABASE_URL, {
  relations,
});

export default db;
