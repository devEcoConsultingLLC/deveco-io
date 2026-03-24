import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    coverage: {
      reporter: ['text', 'html'],
      include: ['server/**/*.ts', 'composables/**/*.ts'],
    },
  },
  resolve: {
    alias: {
      '~': resolve(__dirname),
    },
  },
});
