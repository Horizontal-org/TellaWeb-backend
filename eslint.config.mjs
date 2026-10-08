import globals from 'globals';
import tseslint from 'typescript-eslint';
import prettierRecommended from 'eslint-plugin-prettier/recommended';

// Same rules as the old .eslintrc.js (ESLint 7): typescript-eslint's
// recommended set plus Prettier, without type-aware rules, so the test files
// need no tsconfig of their own.
export default tseslint.config(
  {
    ignores: ['dist/', 'coverage/', 'test/.e2e-workdir/'],
  },
  ...tseslint.configs.recommended,
  prettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      // a warning in typescript-eslint 4, an error since 6
      '@typescript-eslint/no-unused-vars': 'warn',
      // import x = require('...') is how TypeScript imports CommonJS modules (heic-convert)
      '@typescript-eslint/no-require-imports': ['error', { allowAsImport: true }],
    },
  },
);
