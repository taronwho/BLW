import { defineConfig, devices } from '@playwright/test';

/**
 * Někde (např. předinstalovaný prohlížeč v kontejneru) neodpovídá build
 * Chromia tomu, který si stáhne `npx playwright install`. V takovém případě
 * stačí nastavit PLAYWRIGHT_CHROMIUM_EXECUTABLE na cestu k binárce.
 */
const chromiumExecutable = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE;
const launchOptions = chromiumExecutable ? { executablePath: chromiumExecutable } : {};

/**
 * Mobilní viewporty z docs/SPEC.md kapitola 6 — test selže při vodorovném
 * přetečení.
 *
 * Tři šířky jsou ze specifikace a zůstávají. Co se změnilo: dřív to byly
 * tři instance `devices['Desktop Chrome']` s `isMobile: false`, tedy
 * desktopový prohlížeč v malém okně. Testovala se myš, ne prst, a hlavně
 * se nikdy nespustil žádný WebKit — přitom PWA pro rodiče s telefonem
 * v ruce se na iOSu chová jinak v instalaci na plochu, v `env(safe-area-inset-*)`
 * i v limitech IndexedDB. Teď jedou dvě jádra.
 *
 * WebKit se instaluje zvlášť: `npx playwright install webkit`. Bez něj
 * projekt `mobile-webkit-375` selže na chybějící binárce, ne na aplikaci.
 */
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
    // Nejužší displej ze specifikace. `Pixel 5` nese `isMobile: true`
    // i `hasTouch: true`, takže se konečně testuje dotyk a ne myš;
    // viewport se přepisuje na rozměr ze specifikace.
    {
      name: 'mobile-320',
      use: { ...devices['Pixel 5'], viewport: { width: 320, height: 568 } },
    },
    {
      name: 'mobile-375',
      use: { ...devices['Pixel 5'], viewport: { width: 375, height: 667 } },
    },
    {
      name: 'mobile-414',
      use: { ...devices['Pixel 5'], viewport: { width: 414, height: 896 } },
    },
    // Druhé jádro. Rozměr odpovídá iPhonu SE / 8, tedy tomu nejmenšímu,
    // co ještě lidi běžně nosí.
    {
      name: 'mobile-webkit-375',
      use: { ...devices['iPhone SE'], viewport: { width: 375, height: 667 } },
    },
  ],
  webServer: {
    command: 'npm run build && npm run preview -- --port 4173 --host 127.0.0.1',
    url: 'http://127.0.0.1:4173/BLW/',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
