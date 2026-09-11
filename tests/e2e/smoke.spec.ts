import { expect, test } from '@playwright/test';

/**
 * Kostra fáze 0: disclaimer je vidět při prvním spuštění a žádná obrazovka
 * vodorovně nepřetéká (docs/SPEC.md kapitola 6). Plné testy UI přijdou ve fázi 4.
 */
test.describe('kostra aplikace', () => {
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
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Suroviny');
  });

  test('žádné vodorovné přetečení', async ({ page }, testInfo) => {
    await page.goto('./');
    const width = testInfo.project.use.viewport?.width ?? 0;

    for (const step of ['disclaimer', 'po potvrzení'] as const) {
      if (step === 'po potvrzení') {
        await page.getByTestId('disclaimer-accept').click();
        await expect(page.getByTestId('disclaimer')).toBeHidden();
      }
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(scrollWidth, `${step}: vodorovné přetečení`).toBeLessThanOrEqual(width);
    }
  });
});

test.describe('domácnost', () => {
  test('založení domácnosti ukáže kód po pěticích i QR', async ({ page }) => {
    await page.goto('./');
    await page.getByTestId('disclaimer-accept').click();

    await page.getByRole('link', { name: /Domácnost/ }).click();
    await expect(page.getByTestId('stav-synchronizace')).toContainText('Jen na tomto zařízení');

    await page.getByRole('button', { name: 'Založit domácnost' }).click();

    const code = page.getByTestId('parovaci-kod');
    await expect(code).toBeVisible();
    // 10 znaků Crockford Base32 zobrazených po pěticích: K7M2X-9QRT4
    await expect(code).toHaveText(/^[0-9A-HJKMNP-TV-Z]{5}-[0-9A-HJKMNP-TV-Z]{5}$/);
    await expect(page.getByTestId('qr-kod')).toBeVisible();
  });

  test('žádné vodorovné přetečení na obrazovce domácnosti', async ({ page }, testInfo) => {
    await page.goto('./');
    await page.getByTestId('disclaimer-accept').click();
    await page.getByRole('link', { name: /Domácnost/ }).click();
    await expect(page.getByTestId('stav-synchronizace')).toBeVisible();

    const width = testInfo.project.use.viewport?.width ?? 0;
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(width);
  });
});
