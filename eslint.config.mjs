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
  }, {
    rules: {
      'ts/consistent-type-definitions': ['error', 'type'],
      'no-console': ['warn'],
      'antfu/no-top-level-await': ['off'],
      'node/prefer-global/process': ['off'],
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
