import { defineConfig } from 'drizzle-kit';
import env from './lib/env';

export default defineConfig({
  out: './server/database/migrations',
  schema: './server/database/schema',
  casing: 'snake_case',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL_UNPOOLED,
  },
});
