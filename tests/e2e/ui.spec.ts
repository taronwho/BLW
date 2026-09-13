import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { recipes } from '@/data';
import {
  acceptDisclaimer,
  horizontalOverflow,
  householdLink,
  navLink,
  SCREENS,
  tooSmallTargets,
} from './helpers';

/**
 * Barvy úrovní rizika se čtou z tailwind.config.js, ne opisují.
 *
 * Když se paleta kvůli kontrastu doladí, test se má přizpůsobit sám —
 * napsané natvrdo tady tři hodnoty už jednou zbytečně shodily celou sadu.
 */
function barvaZKonfigurace(token: string): string {
  const config = readFileSync(new URL('../../tailwind.config.js', import.meta.url), 'utf-8');
  const m = new RegExp(`^\\s*${token}: '#([0-9A-Fa-f]{6})',`, 'm').exec(config);
  if (m === null) throw new Error(`V tailwind.config.js chybí barva ${token}.`);
  const n = Number.parseInt(m[1] as string, 16);
  return `rgb(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255})`;
}

const BARVY_RIZIKA = ['safe', 'caution', 'risk'].map(barvaZKonfigurace);

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
    // barva — odpovídá úrovni, ale nikdy není jediným nositelem informace.
    // Hodnoty se berou z tailwind.config.js, aby test nepadal po úpravě palety.
    const color = await badge.evaluate((element) => window.getComputedStyle(element).color);
    expect(BARVY_RIZIKA).toContain(color);
  });
}

test('proklik ze suroviny na recept a zpět', async ({ page }) => {
  await acceptDisclaimer(page);
  await navLink(page, 'Suroviny').click();
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
  await navLink(page, 'Suroviny').click();
  await page.getByTestId('hledat-surovinu').fill('brokolice');

  // Fajfka v seznamu otevře tutéž nabídku jako detail suroviny — jedno
  // klepnutí už nic samo neuloží, rodič vybírá množství i reakci.
  const toggle = page.getByTestId(/^ochutnano-/).first();
  await expect(toggle).toHaveAttribute('aria-label', /zapsat ochutnávku/);
  await toggle.click();

  const okenko = page.getByTestId('okenko-ochutnavky');
  await expect(okenko).toBeVisible();
  await okenko.getByTestId('volba-mnozstvi-snedla-vse').click();
  await okenko.getByTestId('volba-reakce-chutnalo').click();
  await okenko.getByTestId('ochutnavka-poznamka').fill('Snědla celý stvol.');
  await okenko.getByTestId('ochutnavka-ulozit').click();

  await expect(okenko).toBeHidden();
  await expect(toggle).toHaveAttribute('aria-label', /ochutnáno, otevřít záznamy/);

  await navLink(page, 'Deník').click();
  await expect(page.getByTestId('casova-osa')).toContainText(/brokolice/i);
  await expect(page.getByTestId('pocet-ochutnanych')).toContainText('Ochutnáno 1 z');

  // Zůstane to tam i po obnovení stránky — deník je v IndexedDB.
  await page.reload();
  await expect(page.getByTestId('casova-osa')).toContainText(/brokolice/i);
});

test('vyhledávání funguje bez diakritiky i s ní', async ({ page }) => {
  await acceptDisclaimer(page);
  await navLink(page, 'Suroviny').click();
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
  await navLink(page, 'Suroviny').click();

  const count = page.getByTestId('pocet-surovin');
  const before = ((await count.textContent()) ?? '').trim();

  await page.getByTestId('filtr-kategorii').selectOption('ovoce');
  await expect(count).not.toHaveText(before);
  await expect(page.getByTestId('seznam-surovin')).toBeVisible();

  await page.getByTestId('rychle-filtry').getByTestId('chip-ochutnano').click();
  await expect(page.getByTestId('prazdny-stav')).toBeVisible();
});

test('přepínač fází mění pokyn ke krájení', async ({ page }) => {
  await acceptDisclaimer(page);
  await navLink(page, 'Suroviny').click();
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
  await navLink(page, 'Recepty').click();

  // Počet se bere z katalogu, ne z natvrdo psaného čísla — jinak test
  // zastará při každé další dávce receptů. Tvrzení zůstává stejné:
  // nefiltrovaný seznam ukazuje všechny recepty, po filtru je jich míň.
  const vsechny = `${recipes.length} z ${recipes.length}`;
  const count = page.getByTestId('pocet-receptu');
  await expect(count).toContainText(vsechny);

  await page.getByTestId('filtr-vegetarianske').click();
  await expect(page.getByTestId('filtr-vegetarianske')).toHaveAttribute('aria-pressed', 'true');
  await expect(count).not.toContainText(vsechny);

  await page.getByTestId('filtr-casu').getByTestId('chip-20').click();
  await expect(page.getByTestId('seznam-receptu')).toBeVisible();
});

test('nová obrazovka začíná nahoře', async ({ page }) => {
  await acceptDisclaimer(page);
  await navLink(page, 'Recepty').click();
  await expect(page.getByTestId('seznam-receptu')).toBeVisible();

  await page.mouse.wheel(0, 2000);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(500);

  await page.getByTestId('seznam-receptu').getByRole('link').first().click();
  await expect(page.getByTestId('moment-odebrani')).toBeVisible();
  // Detail se dřív otevíral sescrollovaný tam, kde skončil seznam.
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
});

test('značka železa otevře okénko místo detailu receptu', async ({ page }) => {
  await acceptDisclaimer(page);
  await navLink(page, 'Recepty').click();

  await page.locator('[data-testid^="zeleza-"]').first().click();

  const okenko = page.getByTestId('okenko-zivin');
  await expect(okenko).toBeVisible();
  await expect(okenko).toContainText('Železo');
  await expect(okenko).toContainText('ne měřená hodnota v miligramech');
  // Značka je uvnitř odkazu na detail — proklik se nesmí spustit.
  await expect(page.getByTestId('seznam-receptu')).toBeVisible();

  await page.getByTestId('okenko-zavrit').click();
  await expect(okenko).toBeHidden();
});

test('filtr železa a řazení přerovnají seznam receptů', async ({ page }) => {
  await acceptDisclaimer(page);
  await navLink(page, 'Recepty').click();

  const count = page.getByTestId('pocet-receptu');
  const vse = (await count.textContent()) ?? '';

  await page.getByTestId('filtr-zeleza').getByText('Hemové z masa').click();
  await expect(count).not.toHaveText(vse);

  await page.getByTestId('filtr-zeleza').getByText('Železo: vše').click();
  await expect(count).toHaveText(vse);

  const prvniAbecedne = await page
    .getByTestId('seznam-receptu')
    .getByRole('link')
    .first()
    .textContent();
  await page.getByTestId('razeni-receptu').selectOption('zelezo');
  await expect(page.getByTestId('seznam-receptu').getByRole('link').first()).not.toHaveText(
    prvniAbecedne ?? '',
  );
});

test('recept ukazuje vlastní zdroje i zdroje svých surovin', async ({ page }) => {
  await acceptDisclaimer(page);
  await navLink(page, 'Recepty').click();
  await page.getByTestId('seznam-receptu').getByRole('link').first().click();

  await page.getByTestId('zdroje-receptu').click();
  await expect(page.locator('[data-testid="seznam-zdroju"] a').first()).toBeVisible();

  await page.getByTestId('zdroje-surovin').click();
  await expect.poll(() => page.locator('[data-testid="seznam-zdroju"] a').count()).toBeGreaterThan(
    1,
  );
});

test('suroviny jdou seřadit podle obsahu železa', async ({ page }) => {
  await acceptDisclaimer(page);
  await navLink(page, 'Suroviny').click();

  const prvni = page.getByTestId('seznam-surovin').getByRole('link').first();
  const abecedne = await prvni.textContent();

  await page.getByTestId('razeni-surovin').selectOption('zelezo');
  await expect(prvni).not.toHaveText(abecedne ?? '');
  // Nahoře musí stát významný zdroj, ne první položka podle abecedy.
  await expect(page.getByTestId('seznam-surovin').locator('li').first()).toContainText('železo');
});

test('šest měsíců není pevné datum, dokud nejsou znaky připravenosti', async ({ page }) => {
  await acceptDisclaimer(page);

  // Bez odškrtnutí se u fáze 6m+ upozorňuje — to je stav před začátkem příkrmu.
  await page.goto('./#/suroviny/brokolice');
  const upozorneni = page.getByTestId('upozorneni-pripravenost');
  await expect(upozorneni).toBeVisible();
  await expect(upozorneni).toContainText('Šest měsíců není pevné datum');

  // U vyšších fází je připomínka jen šum, tam mlčí.
  await page.getByTestId('faze-12m').click();
  await expect(upozorneni).toBeHidden();

  await householdLink(page).click();
  await page.getByTestId('znak-sed').click();
  await page.getByTestId('znak-koordinace').click();
  await expect(page.getByTestId('znak-sed')).toHaveAttribute('aria-checked', 'true');

  // Dva ze tří nestačí, ale text má jmenovat ten chybějící.
  await page.goto('./#/suroviny/brokolice');
  await expect(upozorneni).toContainText('vyhasnutí vypuzovacího reflexu');

  await householdLink(page).click();
  await page.getByTestId('znak-reflex').click();
  await expect(page.getByTestId('stav-pripravenosti')).toContainText('pohromadě');

  // Po třetím znaku zmizí i u suroviny, i u receptu.
  await page.goto('./#/suroviny/brokolice');
  await expect(upozorneni).toBeHidden();
  await navLink(page, 'Recepty').click();
  await page.getByTestId('seznam-receptu').getByRole('link').first().click();
  await expect(upozorneni).toBeHidden();
});
