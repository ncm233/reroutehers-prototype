import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: true,
  retries: 1,
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['junit', { outputFile: 'results/junit.xml' }],
    ['list'],
  ],
  use: {
    baseURL: process.env.E2E_BASE_URL ?? 'http://localhost:4173',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } },
    { name: 'mobile-safari', use: { ...devices['iPhone 13'] } },
  ],
  // Skipped when E2E_BASE_URL points at a deployed environment.
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: 'npm run preview',
        port: 4173,
        reuseExistingServer: true,
      },
});
