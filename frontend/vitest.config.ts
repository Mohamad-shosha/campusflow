import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    // Playwright end-to-end specs live in e2e/ and run with `npm run e2e`, not Vitest.
    include: ['src/**/*.test.{ts,tsx}'],
    css: true,
  },
});
