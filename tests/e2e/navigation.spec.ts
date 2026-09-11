import { expect, test, type Page } from '@playwright/test';

/**
 * Průchod všemi obrazovkami na třech mobilních viewportech.
 * Kontroluje požadavky z docs/SPEC.md kapitola 6 — přetečení a dotykové cíle.
 */

const SCREENS = [
  { name: 'Suroviny', heading: 'Suroviny' },
  { name: 'Recepty', heading: 'Recepty' },
  { name: 'Deník', heading: 'Deník' },
  { name: 'Domácnost', heading: 'Domácnost' },
] as const;

async function acceptDisclaimer(page: Page): Promise<void> {
  await page.goto('./');
  await page.getByTestId('disclaimer-accept').click();
  await expect(page.getByTestId('disclaimer')).toBeHidden();
}

test.describe('navigace', () => {
  test('spodní lišta prochází všemi čtyřmi obrazovkami', async ({ page }) => {
    await acceptDisclaimer(page);
    for (const screen of SCREENS) {
      await page.getByTestId('spodni-navigace').getByRole('link', { name: screen.name }).click();
      await expect(page.getByRole('heading', { name: screen.heading, level: 1 })).toBeVisible();
    }
  });

  test('žádná obrazovka vodorovně nepřetéká', async ({ page }, testInfo) => {
    await acceptDisclaimer(page);
    const width = testInfo.project.use.viewport?.width ?? 0;

    for (const screen of SCREENS) {
      await page.getByTestId('spodni-navigace').getByRole('link', { name: screen.name }).click();
      await expect(page.getByRole('heading', { name: screen.heading, level: 1 })).toBeVisible();
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(scrollWidth, `${screen.name}: vodorovné přetečení`).toBeLessThanOrEqual(width);
    }
  });

  test('dotykové cíle ve spodní liště mají aspoň 44 px', async ({ page }) => {
    await acceptDisclaimer(page);
    const links = page.getByTestId('spodni-navigace').getByRole('link');
    const count = await links.count();
    expect(count).toBe(4);
    for (let i = 0; i < count; i += 1) {
      const box = await links.nth(i).boundingBox();
      expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
      expect(box?.width ?? 0).toBeGreaterThanOrEqual(44);
    }
  });

  test('obsah má pod sebou rezervu na spodní lištu', async ({ page }) => {
    await acceptDisclaimer(page);
    const navHeight = (await page.getByTestId('spodni-navigace').boundingBox())?.height ?? 0;
    expect(navHeight).toBeGreaterThan(0);

    // Spodní odsazení obsahu musí lištu pokrýt, jinak by se poslední položka
    // seznamu schovala pod navigaci.
    const paddingBottom = await page
      .getByRole('main')
      .evaluate((el) => Number.parseFloat(getComputedStyle(el).paddingBottom));
    expect(paddingBottom).toBeGreaterThanOrEqual(navHeight);
  });
});

test.describe('suroviny', () => {
  test('prázdný katalog nabízí radu, ne chybovou hlášku', async ({ page }) => {
    await acceptDisclaimer(page);
    await page.getByTestId('spodni-navigace').getByRole('link', { name: 'Suroviny' }).click();

    const empty = page.getByTestId('prazdny-stav');
    await expect(empty).toBeVisible();
    await expect(empty).not.toContainText(/chyba|error/i);
  });

  test('hledání a filtry reagují', async ({ page }) => {
    await acceptDisclaimer(page);
    await page.getByTestId('spodni-navigace').getByRole('link', { name: 'Suroviny' }).click();

    await page.getByTestId('hledani').fill('brokolice');
    await expect(page.getByTestId('prazdny-stav')).toContainText('brokolice');

    await page.getByRole('button', { name: 'Zrušit filtry' }).click();
    await expect(page.getByTestId('hledani')).toHaveValue('');
  });
});

test.describe('nastavení dítěte', () => {
  test('datum narození se uloží a ukáže věk', async ({ page }) => {
    await acceptDisclaimer(page);
    await page.getByTestId('spodni-navigace').getByRole('link', { name: 'Domácnost' }).click();

    await page.getByLabel('Jméno dcery').fill('Anna');
    await page.getByLabel('Datum narození').fill('2026-03-11');

    await expect(page.getByText(/Teď je jí/)).toBeVisible();
  });
});
