import { defineConfig, devices } from '@playwright/test';

/**
 * The browser acceptance lane. Deliberately narrow: it loads the emitted
 * artifact and checks that it behaves there as it does in Node (gate 05 D6).
 *
 * The verification viewport is one of the values gate 10 still owns
 * (DECISIONS-OWED Part 4), so the default below is a runner setting, not a
 * sealed decision — no acceptance result is judged against it yet.
 */
export default defineConfig({
  testDir: './tests/browser',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: process.env.CI ? 'line' : 'list',
  use: {
    ...devices['Desktop Chrome'],
    trace: 'off',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
