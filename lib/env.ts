import { z } from 'zod';

import tryParseEnv from './try-parse-env';

const EnvSchema = z.object({
  NODE_ENV: z.string(),
  DATABASE_URL: z.string(),
  DATABASE_URL_UNPOOLED: z.string(),
});

export type EnvSchema = z.infer<typeof EnvSchema>;

tryParseEnv(EnvSchema);

export function getEnv(): EnvSchema {
  // eslint-disable-next-line node/no-process-env
  return EnvSchema.parse(process.env);
}
