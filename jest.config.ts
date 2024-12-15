import type { Config } from 'jest';
import nextJest from 'next/jest';

const createJestConfig = nextJest({
  dir: './',
});

const config: Config = {
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!next-auth|@auth/core|@auth/core/providers/credentials|@auth/core/providers|next/dist/client/components/|next/dist/client/|next/dist/shared/lib/|next/dist/shared/|next/dist/pages/|@next/env|next/navigation|next/dist/compiled/|next/dist/server/|@next/env|next/package.json)',
  ],
  testMatch: ['**/__tests__/**/*.test.[jt]s?(x)'],
};

export default createJestConfig(config);
