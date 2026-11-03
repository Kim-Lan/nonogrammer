import { setup } from '@nuxt/test-utils/e2e';

export function setupE2E(options: Parameters<typeof setup>[0] = {}) {
  return setup({
    server: true,
    browser: true,
    setupTimeout: 240_000,
    ...options,
  });
}
