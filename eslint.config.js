import { FlatCompat } from '@eslint/eslintrc';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

// Custom plugin for Jest globals
const requireJestGlobals = {
  create(context) {
    return {
      Program(node) {
        const source = context.getSourceCode();
        const hasJestGlobals = source.text.includes("require('@jest/globals')");

        if (!hasJestGlobals) {
          context.report({
            node,
            message: "Test files must include require('@jest/globals')",
          });
        }
      },
    };
  },
};

export default [
  {
    ...compat.config,
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'public/**',
      'dist/**',
      'build/**',
    ],
  },
  {
    files: ['src/**/*.ts', 'src/**/*.tsx'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
    },
    rules: {
      ...typescript.configs['recommended'].rules,
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      'no-undef': 'off',
      'no-debugger': 'error',
      'no-console': [
        'error',
        { allow: ['warn', 'error', 'info', 'debug', 'trace'] },
      ],
    },
  },
  {
    files: ['**/*.test.ts', '**/*.test.tsx', 'src/test/**/*'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
      custom: { rules: { 'require-jest-globals': requireJestGlobals } },
    },
    rules: {
      ...typescript.configs['recommended'].rules,
      '@typescript-eslint/no-var-requires': 'off',
      'no-undef': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      'import/no-commonjs': 'off',
      'custom/require-jest-globals': 'error',
    },
  },
];
