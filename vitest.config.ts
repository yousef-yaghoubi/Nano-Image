import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./lib/test-utils.tsx'],
    globals: true,
    css: true,
    exclude: [
      'node_modules/**',
      '__tests__/e2e/**',
      'tests/e2e/**',
      '.mimocode/**',
    ],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});
