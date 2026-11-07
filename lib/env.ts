import { z } from 'zod';

import tryParseEnv from './try-parse-env.ts';

const EnvSchema = z.object({
  NODE_ENV: z.string(),
  DATABASE_URL: z.string(),
  DATABASE_URL_UNPOOLED: z.string(),
  PBNSOLVE_PATH: z.string().optional(),
});

export type EnvSchema = z.infer<typeof EnvSchema>;

tryParseEnv(EnvSchema);

// eslint-disable-next-line node/no-process-env
export default EnvSchema.parse(process.env);
