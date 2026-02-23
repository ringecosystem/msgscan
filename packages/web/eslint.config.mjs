import path from 'node:path';
import { fileURLToPath } from 'node:url';
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier';
import tanstackQuery from '@tanstack/eslint-plugin-query';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  ...tanstackQuery.configs['flat/recommended'],
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: ['./tsconfig.json'],
        tsconfigRootDir: __dirname
      }
    },
    settings: {
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx']
      },
      'import/resolver': {
        typescript: true,
        node: true
      }
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-empty-object-type': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'index',
            'sibling',
            'object',
            'type'
          ],
          pathGroups: [
            {
              pattern: 'react',
              group: 'external'
            },
            {
              pattern: '@/**',
              group: 'internal',
              position: 'after'
            }
          ],
          pathGroupsExcludedImportTypes: ['type'],
          'newlines-between': 'always'
        }
      ],
      '@typescript-eslint/consistent-type-exports': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-import-type-side-effects': 'error'
    }
  },
  prettier,
  {
    ignores: ['node_modules/**', '.next/**', 'public/sw.js', 'next.config.mjs']
  }
];

export default config;
