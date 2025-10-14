//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config'

export default [
  ...tanstackConfig,
  {
    ignores: ['src/shared/components/ui/**'],
  },
  {
    rules: {
      '@typescript-eslint/array-type': 'off',
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'sibling',
            'parent',
            'internal',
            'index',
            'type',
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
          pathGroups: [
            {
              pattern: '@/**',
              group: 'internal',
              position: 'after',
            },
          ],
          pathGroupsExcludedImportTypes: ['type'],
          distinctGroup: false,
        },
      ],
    },
  },
]
