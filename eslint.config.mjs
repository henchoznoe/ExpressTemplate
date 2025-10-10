import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettierPlugin from 'eslint-plugin-prettier';
import importPlugin from 'eslint-plugin-import';
import globals from 'globals';

export default [
  js.configs.recommended,

  {
    ignores: ['dist/**', 'coverage/**', '.github/**', 'eslint.config.mjs', 'jest.config.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: process.cwd(),
      },
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      prettier: prettierPlugin,
      import: importPlugin,
    },
    rules: {
      // ---------------------------
      // Prettier intégré
      // ---------------------------
      'prettier/prettier': 'error',

      // ---------------------------
      // Console
      // ---------------------------
      'no-console': 'warn',

      // ---------------------------
      // TypeScript: warnings
      // ---------------------------
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/typedef': [
        'warn',
        {
          parameter: true,
          propertyDeclaration: true,
          variableDeclaration: true,
          memberVariableDeclaration: true,
          variableDeclarationIgnoreFunction: true,
        },
      ],
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-var-requires': 'off',

      // ---------------------------
      // Imports order
      // ---------------------------
      'import/order': [
        'warn',
        {
          groups: [['builtin', 'external', 'internal', 'parent', 'sibling', 'index']],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],

      // ---------------------------
      // Style JS/TS
      // ---------------------------
      'newline-per-chained-call': ['error', { ignoreChainWithDepth: 2 }],
      'space-before-blocks': ['error', 'always'],
      'prefer-const': 'error',
      'arrow-body-style': ['error', 'as-needed'],
    },
    files: ['./**/*.ts'],
  },
];
