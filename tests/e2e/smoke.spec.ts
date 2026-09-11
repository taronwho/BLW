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
    await expect(page.getByRole('heading', { level: 1 })).toContainText('BLW');
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
