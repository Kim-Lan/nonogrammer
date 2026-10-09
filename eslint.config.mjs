import antfu from '@antfu/eslint-config';
import betterTailwindcss from 'eslint-plugin-better-tailwindcss';
import { getDefaultAttributes } from 'eslint-plugin-better-tailwindcss/api/defaults';
// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt(
  antfu({
    stylistic: {
      semi: true,
      braceStyle: '1tbs',
    },
    ignores: ['**/migrations/*'],
  }, {
    rules: {
      'ts/no-redeclare': 'off',
      'ts/consistent-type-definitions': ['error', 'type'],
      'no-console': ['warn'],
      'antfu/no-top-level-await': ['off'],
      'node/prefer-global/process': ['off'],
      'node/no-process-env': ['error'],
    },
  }),
  betterTailwindcss.configs['correctness-error'],
  {
    settings: {
      'better-tailwindcss': {
        entryPoint: 'app/assets/css/main.css',
        attributes: [
          ...getDefaultAttributes(),
          ['^v-bind:ui$', [{ match: 'objectValues' }]],
        ],
      },
    },
  },
);
