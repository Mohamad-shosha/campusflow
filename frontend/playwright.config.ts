import { defineConfig, devices } from '@playwright/test';

/**
 * End-to-end suite (P8-02). Runs against a running stack: the Docker Compose app on
 * http://localhost by default (nginx -> Spring Boot -> PostgreSQL), or E2E_BASE_URL.
 *
 *   docker compose up -d --build --wait
 *   npm run e2e
 */
const baseURL = process.env.E2E_BASE_URL ?? 'http://localhost';

export default defineConfig({
  testDir: './e2e',
  outputDir: './e2e-results',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : 4,
  reporter: process.env.CI
    ? [['list'], ['html', { open: 'never', outputFolder: 'e2e-report' }]]
    : [['list']],
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'off',
  },
  projects: [
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } },
      testIgnore: /\.mobile\.spec\.ts$/,
    },
    {
      name: 'mobile',
      use: { ...devices['Pixel 5'], viewport: { width: 360, height: 740 } },
      testMatch: /\.mobile\.spec\.ts$/,
    },
  ],
});
