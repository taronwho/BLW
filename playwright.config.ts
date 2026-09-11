import { defineConfig, devices } from '@playwright/test';

/**
 * Někde (např. předinstalovaný prohlížeč v kontejneru) neodpovídá build
 * Chromia tomu, který si stáhne `npx playwright install`. V takovém případě
 * stačí nastavit PLAYWRIGHT_CHROMIUM_EXECUTABLE na cestu k binárce.
 */
const chromiumExecutable = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE;
const launchOptions = chromiumExecutable ? { executablePath: chromiumExecutable } : {};

/** Mobilní viewporty z docs/SPEC.md kapitola 6 — test selže při vodorovném přetečení. */
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'list' : [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://127.0.0.1:4173/BLW/',
    trace: 'on-first-retry',
    launchOptions,
  },
  projects: [
    {
      name: 'mobile-320',
      use: { ...devices['Desktop Chrome'], viewport: { width: 320, height: 568 }, isMobile: false },
    },
    {
      name: 'mobile-375',
      use: { ...devices['Desktop Chrome'], viewport: { width: 375, height: 667 }, isMobile: false },
    },
    {
      name: 'mobile-414',
      use: { ...devices['Desktop Chrome'], viewport: { width: 414, height: 896 }, isMobile: false },
    },
  ],
  webServer: {
    command: 'npm run build && npm run preview -- --port 4173 --host 127.0.0.1',
    url: 'http://127.0.0.1:4173/BLW/',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
