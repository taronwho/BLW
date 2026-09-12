import { expect, test } from '@playwright/test';
import { acceptDisclaimer, horizontalOverflow, SCREENS, tooSmallTargets } from './helpers';

/**
 * Mobilní kvalita UI na 320×568, 375×667 a 414×896 (docs/SPEC.md kap. 6).
 * Projekty s těmi viewporty jsou v playwright.config.ts, takže každý test
 * v tomhle souboru běží na všech třech šířkách.
 */

for (const screen of SCREENS) {
  test(`${screen.name}: žádné vodorovné přetečení`, async ({ page }, testInfo) => {
    const width = testInfo.project.use.viewport?.width ?? 0;
    await acceptDisclaimer(page);
    await screen.open(page);

    const scrollWidth = await horizontalOverflow(page);
    expect(scrollWidth, `${screen.name} přetéká vodorovně`).toBeLessThanOrEqual(width);

    // Screenshot horní části obrazovky. Ukládá se mimo repozitář
    // (tests/e2e/screenshots je v .gitignore) a slouží k doložení vzhledu.
    const shot = `tests/e2e/screenshots/${testInfo.project.name}/${screen.id}.png`;
    await page.screenshot({ path: shot, fullPage: false });
    await testInfo.attach(`${screen.id}-${width}`, { path: shot, contentType: 'image/png' });

    // Po odscrollování dolů se může objevit další obsah — kontrolujeme i to.
    await page.mouse.wheel(0, 2000);
    const afterScroll = await horizontalOverflow(page);
    expect(afterScroll, `${screen.name} přetéká po odscrollování`).toBeLessThanOrEqual(width);
  });

  test(`${screen.name}: dotykové cíle jsou aspoň 44 px`, async ({ page }) => {
    await acceptDisclaimer(page);
    await screen.open(page);

    const bad = await tooSmallTargets(page);
    expect(bad, `${screen.name}: malé dotykové cíle ${JSON.stringify(bad)}`).toEqual([]);
  });

  test(`${screen.name}: riziko dušení je sdělené barvou, ikonou i slovem`, async ({ page }) => {
    await acceptDisclaimer(page);
    await screen.open(page);

    const badge = page.getByTestId('riziko-duseni').first();
    await expect(badge).toBeVisible();
    // slovo
    await expect(badge).toContainText(/(Nízké|Střední|Vysoké) riziko dušení/);
    // ikona
    await expect(badge.locator('svg')).toHaveCount(1);
    // barva — barva textu odpovídá úrovni, nikdy není jediným nositelem informace
    const color = await badge.evaluate((element) => window.getComputedStyle(element).color);
    expect(['rgb(47, 125, 79)', 'rgb(154, 101, 16)', 'rgb(163, 35, 24)']).toContain(color);
  });
}

test('proklik ze suroviny na recept a zpět', async ({ page }) => {
  await acceptDisclaimer(page);
  await page.getByRole('link', { name: 'Suroviny' }).click();
  await page.getByTestId('hledat-surovinu').fill('brokolice');

  const firstIngredient = page.getByTestId('seznam-surovin').getByRole('link').first();
  await expect(firstIngredient).toContainText(/brokolice/i);
  await firstIngredient.click();
  await expect(page.getByTestId('bezpecnostni-blok')).toBeVisible();

  const ingredientId = (page.url().split('/').pop() ?? '').trim();
  expect(ingredientId.length).toBeGreaterThan(0);

  // surovina → recept
  const recipeLink = page.getByTestId('recepty-se-surovinou').getByRole('link').first();
  await recipeLink.click();
  await expect(page).toHaveURL(/#\/recepty\//);
  await expect(page.getByTestId('moment-odebrani')).toBeVisible();

  // recept → zpět na tutéž surovinu
  await page.getByTestId(`odkaz-surovina-${ingredientId}`).first().click();
  await expect(page).toHaveURL(new RegExp(`#/suroviny/${ingredientId}$`));
  await expect(page.getByTestId('bezpecnostni-blok')).toBeVisible();

  // a zpět do seznamu
  await page.getByTestId('zpet-na-suroviny').click();
  await expect(page.getByTestId('seznam-surovin')).toBeVisible();
});

test('zaškrtnutí ochutnáno se propíše do deníku', async ({ page }) => {
  await acceptDisclaimer(page);
  await page.getByRole('link', { name: 'Suroviny' }).click();
  await page.getByTestId('hledat-surovinu').fill('brokolice');

  const toggle = page.getByTestId(/^ochutnano-/).first();
  await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');

  await page.getByRole('link', { name: 'Deník' }).click();
  await expect(page.getByTestId('casova-osa')).toContainText(/brokolice/i);
  await expect(page.getByTestId('pocet-ochutnanych')).toContainText('Ochutnáno 1 z');

  // Zůstane to tam i po obnovení stránky — deník je v IndexedDB.
  await page.reload();
  await expect(page.getByTestId('casova-osa')).toContainText(/brokolice/i);
});

test('vyhledávání funguje bez diakritiky i s ní', async ({ page }) => {
  await acceptDisclaimer(page);
  await page.getByRole('link', { name: 'Suroviny' }).click();
  const search = page.getByTestId('hledat-surovinu');

  await search.fill('cocka');
  await expect(page.getByTestId('seznam-surovin')).toContainText(/čočka/i);

  await search.fill('čočka');
  await expect(page.getByTestId('seznam-surovin')).toContainText(/čočka/i);

  await search.fill('qqqq');
  await expect(page.getByTestId('prazdny-stav')).toBeVisible();
});

test('filtry v seznamu surovin zužují výběr', async ({ page }) => {
  await acceptDisclaimer(page);
  await page.getByRole('link', { name: 'Suroviny' }).click();

  const count = page.getByTestId('pocet-surovin');
  const before = ((await count.textContent()) ?? '').trim();

  await page.getByTestId('filtr-kategorii').getByTestId('chip-ovoce').click();
  await expect(count).not.toHaveText(before);
  await expect(page.getByTestId('seznam-surovin')).toBeVisible();

  await page.getByTestId('rychle-filtry').getByTestId('chip-ochutnano').click();
  await expect(page.getByTestId('prazdny-stav')).toBeVisible();
});

test('přepínač fází mění pokyn ke krájení', async ({ page }) => {
  await acceptDisclaimer(page);
  await page.getByRole('link', { name: 'Suroviny' }).click();
  await page.getByTestId('hledat-surovinu').fill('brokolice');
  await page.getByTestId('seznam-surovin').getByRole('link').first().click();

  const instruction = page.getByTestId('pokyn-faze');
  const at6 = ((await instruction.textContent()) ?? '').trim();
  await page.getByTestId('faze-12m').click();
  const at12 = ((await instruction.textContent()) ?? '').trim();

  expect(at6.length).toBeGreaterThan(0);
  expect(at12).not.toBe(at6);
  await expect(page.getByTestId('faze-12m')).toHaveAttribute('aria-pressed', 'true');
});

test('filtry receptů: jen vegetariánské a čas do 20 minut', async ({ page }) => {
  await acceptDisclaimer(page);
  await page.getByRole('link', { name: 'Recepty' }).click();

  const count = page.getByTestId('pocet-receptu');
  await expect(count).toContainText('80 z 80');

  await page.getByTestId('filtr-vegetarianske').click();
  await expect(page.getByTestId('filtr-vegetarianske')).toHaveAttribute('aria-pressed', 'true');
  await expect(count).not.toContainText('80 z 80');

  await page.getByTestId('filtr-casu').getByTestId('chip-20').click();
  await expect(page.getByTestId('seznam-receptu')).toBeVisible();
});
