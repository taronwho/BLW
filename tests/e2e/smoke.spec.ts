import { expect, test } from '@playwright/test';
import { householdLink, navLink } from './helpers';

/**
 * Vstup do aplikace: disclaimer při prvním spuštění a obrazovka Domácnost
 * s párovacím kódem (docs/SPEC.md kap. 4.6 a akceptační kritérium 10).
 */
test.describe('vstup do aplikace', () => {
  test('disclaimer se ukáže při prvním spuštění a dá se potvrdit', async ({ page }) => {
    await page.goto('./');

    const disclaimer = page.getByTestId('disclaimer');
    await expect(disclaimer).toBeVisible();

    const accept = page.getByTestId('disclaimer-accept');
    const box = await accept.boundingBox();
    expect(box, 'Tlačítko musí být vykreslené').not.toBeNull();
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);

    await accept.click();
    await expect(disclaimer).toBeHidden();
    // Po potvrzení aplikace startuje na úvodním rozcestníku.
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Příkrmy krok za krokem');
  });

  test('spodní navigace vede na všechny obrazovky', async ({ page }) => {
    await page.goto('./');
    await page.getByTestId('disclaimer-accept').click();

    for (const [label, heading] of [
      ['Recepty', 'Recepty'],
      ['Rady', 'Rady'],
      ['Deník', 'Deník'],
      ['Suroviny', 'Suroviny'],
      ['Domů', 'Příkrmy krok za krokem'],
    ] as const) {
      await navLink(page, label).click();
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(heading);
    }
  });
});

test.describe('domácnost', () => {
  test('založení domácnosti ukáže kód po pěticích i QR', async ({ page }) => {
    await page.goto('./');
    await page.getByTestId('disclaimer-accept').click();

    await householdLink(page).click();
    await expect(page.getByTestId('stav-synchronizace')).toContainText('Jen na tomto zařízení');

    await page.getByRole('button', { name: 'Založit domácnost' }).click();

    const code = page.getByTestId('parovaci-kod');
    await expect(code).toBeVisible();
    // 10 znaků Crockford Base32 zobrazených po pěticích: K7M2X-9QRT4
    await expect(code).toHaveText(/^[0-9A-HJKMNP-TV-Z]{5}-[0-9A-HJKMNP-TV-Z]{5}$/);
    await expect(page.getByTestId('qr-kod')).toBeVisible();
  });

  test('datum narození předvybere fázi v detailu suroviny', async ({ page }) => {
    await page.goto('./');
    await page.getByTestId('disclaimer-accept').click();

    await householdLink(page).click();
    await page.getByTestId('jmeno-ditete').fill('Ema');
    // Dítě starší 12 měsíců → předvybraná fáze 12m+.
    await page.getByTestId('datum-narozeni').fill('2024-01-15');
    await page.getByRole('button', { name: 'Uložit', exact: true }).click();
    await expect(page.getByTestId('dite-v-hlavicce')).toContainText('Ema');

    await navLink(page, 'Suroviny').click();
    await page.getByTestId('hledat-surovinu').fill('brokolice');
    await page.getByTestId('seznam-surovin').getByRole('link').first().click();
    await expect(page.getByTestId('faze-12m')).toHaveAttribute('aria-pressed', 'true');
  });
});
