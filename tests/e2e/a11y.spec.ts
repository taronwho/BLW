import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { acceptDisclaimer, navLink, SCREENS } from './helpers';

/**
 * Audit přístupnosti podle WCAG 2.1 AA nad hotovou stránkou.
 *
 * Běží ve světlém i tmavém motivu. Tmavá paleta je totiž druhá sada barev,
 * kterou nikdo očima nezkontroluje na všech obrazovkách — a právě kontrast
 * štítků rizika dušení je věc, kterou docs/SPEC.md kap. 6 vyžaduje.
 */

const require = createRequire(import.meta.url);
const AXE = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf-8');

interface Porusení {
  id: string;
  impact: string | null;
  pocet: number;
  ukazka: string;
}

async function auditovat(page: Page): Promise<Porusení[]> {
  await page.addScriptTag({ content: AXE });
  return page.evaluate(async () => {
    const axe = (window as unknown as { axe: { run: (o: unknown) => Promise<unknown> } }).axe;
    const vysledek = (await axe.run({
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] },
    })) as {
      violations: {
        id: string;
        impact: string | null;
        nodes: { html: string }[];
      }[];
    };
    return vysledek.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      pocet: v.nodes.length,
      ukazka: (v.nodes[0]?.html ?? '').slice(0, 160),
    }));
  });
}

const OBRAZOVKY = [
  {
    id: 'domu',
    name: 'Domů',
    open: async (page: Page) => {
      await expect(page.getByTestId('uchop-v-hlavicce')).toBeVisible();
    },
  },
  ...SCREENS,
  {
    id: 'rady',
    name: 'Rady',
    open: async (page: Page) => {
      await navLink(page, 'Rady').click();
      await expect(page.getByTestId('seznam-rad')).toBeVisible();
    },
  },
];

for (const motiv of ['light', 'dark'] as const) {
  for (const obrazovka of OBRAZOVKY) {
    test(`${motiv}: ${obrazovka.name} bez chyb přístupnosti`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: motiv });
      await acceptDisclaimer(page);
      await expect(page.locator('html')).toHaveAttribute('data-theme', motiv);
      await obrazovka.open(page);

      const porusení = await auditovat(page);
      expect(porusení, JSON.stringify(porusení, null, 2)).toEqual([]);
    });
  }
}

test('disclaimer je přístupný i v tmavém motivu', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('./');
  await expect(page.getByTestId('disclaimer')).toBeVisible();

  const porusení = await auditovat(page);
  expect(porusení, JSON.stringify(porusení, null, 2)).toEqual([]);
});

test('okénko živin se dá ovládat klávesnicí', async ({ page }) => {
  await acceptDisclaimer(page);
  await page.goto('./#/suroviny');
  await expect(page.getByTestId('pocet-surovin')).toBeVisible();

  const znacka = page.locator('[data-testid^="zeleza-"]').first();
  await znacka.click();
  await expect(page.getByTestId('okenko-zivin')).toBeVisible();

  // 1. Fokus je uvnitř okénka, ne na značce pod ním.
  const uvnitr = await page.evaluate(() =>
    document.querySelector('[data-testid="okenko-zivin"]')?.contains(document.activeElement),
  );
  expect(uvnitr).toBe(true);

  // 2. Tab se z okénka nedostane ven.
  for (let i = 0; i < 12; i += 1) await page.keyboard.press('Tab');
  const porad = await page.evaluate(() =>
    document.querySelector('[data-testid="okenko-zivin"]')?.contains(document.activeElement),
  );
  expect(porad).toBe(true);

  // 3. Po zavření se fokus vrátí na značku, ne na začátek seznamu.
  await page.keyboard.press('Escape');
  await expect(page.getByTestId('okenko-zivin')).toBeHidden();
  const zpatky = await page.evaluate(() => document.activeElement?.getAttribute('data-testid'));
  expect(zpatky).toMatch(/^zeleza-/);
});

test('počet výsledků se ohlásí odečítači obrazovky', async ({ page }) => {
  await acceptDisclaimer(page);
  await page.goto('./#/suroviny');
  await expect(page.getByTestId('pocet-surovin')).toHaveAttribute('aria-live', 'polite');
});

test('neexistující adresa vysvětlí, co se stalo', async ({ page }) => {
  await acceptDisclaimer(page);
  await page.goto('./#/stara-zalozka-na-neco');
  // Dřív to tiše přesměrovalo na úvod a vypadalo to jako rozbitá aplikace.
  await expect(page.getByTestId('nenalezena-adresa')).toBeVisible();
  await expect(page.getByTestId('nenalezena-adresa')).toContainText('neexistuje');
});
