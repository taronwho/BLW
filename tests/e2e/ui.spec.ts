import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { ingredients, recipes } from '@/data';
import {
  acceptDisclaimer,
  horizontalOverflow,
  householdLink,
  navLink,
  otevriFiltry,
  SCREENS,
  tooSmallTargets,
} from './helpers';

/**
 * Barvy úrovní rizika se čtou ze src/index.css, ne opisují.
 *
 * Když se paleta kvůli kontrastu doladí, test se má přizpůsobit sám —
 * napsané natvrdo tady tři hodnoty už jednou zbytečně shodily celou sadu.
 * Bere se první výskyt, tedy světlý motiv; testy běží v něm.
 */
function barvaZeStylu(token: string): string {
  const css = readFileSync(new URL('../../src/index.css', import.meta.url), 'utf-8');
  const m = new RegExp(`--c-${token}: (\\d+) (\\d+) (\\d+);`).exec(css);
  if (m === null) throw new Error(`V src/index.css chybí barva --c-${token}.`);
  return `rgb(${m[1]}, ${m[2]}, ${m[3]})`;
}

const BARVY_RIZIKA = ['safe', 'caution', 'risk'].map(barvaZeStylu);

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

    // Kontroluje se každý štítek rizika na obrazovce, ne jen první. Seznam
    // i detail používají jiné komponenty a obě musí držet totéž pravidlo,
    // proto se hledá podle `data-risk`, ne podle testId jedné z nich.
    const stitky = page.locator('[data-risk]');
    const pocet = await stitky.count();
    expect(pocet, `${screen.name}: na obrazovce není žádný štítek rizika dušení`).toBeGreaterThan(0);

    // docs/SPEC.md kap. 5: barva nikdy nesmí být jediným nositelem informace,
    // proto musí každý štítek nést i slovo a ikonu.
    const vady = await stitky.evaluateAll((prvky) =>
      prvky
        .map((prvek) => ({
          text: prvek.textContent ?? '',
          slovo: /(nízké|střední|vysoké) riziko dušení/i.test(prvek.textContent ?? ''),
          ikona: prvek.querySelectorAll('svg').length === 1,
        }))
        .filter((one) => !one.slovo || !one.ikona),
    );
    expect(vady, `${screen.name}: štítek bez slova nebo bez ikony`).toEqual([]);

    // Barva odpovídá úrovni. Hodnoty se berou z tailwind.config.js, aby test
    // nepadal po úpravě palety.
    const barvy = await stitky.evaluateAll((prvky) => [
      ...new Set(prvky.map((prvek) => window.getComputedStyle(prvek).color)),
    ]);
    for (const barva of barvy) expect(BARVY_RIZIKA).toContain(barva);
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
  await otevriFiltry(page, 'surovin');

  const count = page.getByTestId('pocet-surovin');
  const before = ((await count.textContent()) ?? '').trim();

  await page.getByTestId('filtr-kategorii').selectOption('ovoce');
  await expect(count).not.toHaveText(before);
  await expect(page.getByTestId('seznam-surovin')).toBeVisible();

  await page.getByTestId('filtr-deniku').getByTestId('chip-ochutnano').click();
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
  await otevriFiltry(page, 'receptu');

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

  // První značka železa, ne první značka živiny — štítek zinku a vitaminu C
  // má v testId příponu, takže se dají odlišit. Dřív se klikalo na první
  // značku v pořadí a po doplnění naměřených hodnot to byl vitamin C.
  await page
    .locator('[data-testid^="zeleza-"]:not([data-testid$="-zinek"]):not([data-testid$="-cecko"])')
    .first()
    .click();

  const okenko = page.getByTestId('okenko-zivin');
  await expect(okenko).toBeVisible();
  await expect(okenko).toContainText('Železo');
  await expect(okenko).toContainText('naměřený obsah z potravinové tabulky');
  // Značka je uvnitř odkazu na detail — proklik se nesmí spustit.
  await expect(page.getByTestId('seznam-receptu')).toBeVisible();

  await page.getByTestId('okenko-zavrit').click();
  await expect(okenko).toBeHidden();
});

test('filtr železa a řazení přerovnají seznam receptů', async ({ page }) => {
  await acceptDisclaimer(page);
  await navLink(page, 'Recepty').click();
  await otevriFiltry(page, 'receptu');

  const count = page.getByTestId('pocet-receptu');
  const vse = (await count.textContent()) ?? '';

  // Živiny se zaškrtávají nezávisle a podmínky se sčítají.
  //
  // Druhá živina sama o sobě seznam zúžit nemusí: zinek chodí ve stejných
  // potravinách jako železo a vitamin C nese každé čerstvé ovoce i zelenina,
  // takže „železo a zinek" i „železo a vitamin C" vyberou stejné recepty jako
  // „železo". Zúžení se proto zkouší přísností zdroje a druhem železa, kde
  // se množiny opravdu liší.
  await page.getByTestId('prepinac-zelezo').click();
  const jenZelezo = (await count.textContent()) ?? '';
  expect(jenZelezo).not.toBe(vse);

  await page.getByTestId('prepinac-cecko').click();
  await page.getByTestId('filtr-sily').getByTestId('chip-vyznamny').click();
  const jenVyznamne = (await count.textContent()) ?? '';
  expect(jenVyznamne).not.toBe(jenZelezo);

  // Druh železa se nabídne, až když je železo vybrané.
  await page.getByTestId('filtr-druhu-zeleza').getByTestId('chip-hemove').click();
  await expect(count).not.toHaveText(jenVyznamne);

  await page.getByTestId('zrusit-filtry').click();
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

test('tmavý motiv se přepne a přežije obnovení stránky', async ({ page }) => {
  await acceptDisclaimer(page);
  await householdLink(page).click();

  const html = page.locator('html');
  await expect(html).toHaveAttribute('data-theme', 'light');

  await page.getByTestId('motiv-tmavy').click();
  await expect(html).toHaveAttribute('data-theme', 'dark');
  // Pozadí stránky se mění přes proměnné, ne přes třídy `dark:` — kdyby se
  // někde zapomnělo, tahle kontrola to nechytí, ale audit v a11y.spec.ts ano.
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(18, 23, 21)');

  await page.reload();
  await expect(html).toHaveAttribute('data-theme', 'dark');

  await page.getByTestId('motiv-svetly').click();
  await expect(html).toHaveAttribute('data-theme', 'light');
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(248, 248, 245)');
});

test('přepínač v hlavičce překlopí vzhled a projeví se i v nastavení', async ({ page }) => {
  await acceptDisclaimer(page);
  const html = page.locator('html');
  const prepinac = page.getByTestId('prepinac-motivu');

  await expect(html).toHaveAttribute('data-theme', 'light');
  await expect(prepinac).toHaveAttribute('aria-label', 'Přepnout na tmavý vzhled');

  await prepinac.click();
  await expect(html).toHaveAttribute('data-theme', 'dark');
  await expect(prepinac).toHaveAttribute('aria-label', 'Přepnout na světlý vzhled');

  // Přepínač v hlavičce a výběr v Domácnosti jsou dvě ovládání téhož; když si
  // každé drží vlastní stav, zůstane v nastavení zaškrtnutá stará volba.
  await householdLink(page).click();
  await expect(page.getByTestId('motiv-tmavy')).toHaveAttribute('aria-checked', 'true');

  await page.getByTestId('motiv-system').click();
  await expect(prepinac).toHaveAttribute('aria-label', 'Přepnout na tmavý vzhled');

  await prepinac.click();
  await expect(html).toHaveAttribute('data-theme', 'dark');
});

test('značka v hlavičce vede domů', async ({ page }) => {
  await acceptDisclaimer(page);
  await navLink(page, 'Suroviny').click();
  await expect(page.getByTestId('seznam-surovin')).toBeVisible();

  await page.getByRole('banner').getByRole('link', { name: 'Drobek' }).click();
  await expect(page.getByTestId('uchop-v-hlavicce')).toBeVisible();
});

test('masitá varianta je jen u receptu, který maso obsahuje', async ({ page }) => {
  await acceptDisclaimer(page);

  // Sladká snídaně: jedno dochucení pro dospělé, žádná masitá verze.
  await page.goto('./#/recepty/boruvkova-miska-konopna-seminka');
  const sladke = page.getByTestId('dochuceni-pro-dospele');
  await expect(sladke).toBeVisible();
  await expect(sladke).not.toContainText('S masem');
  await expect(sladke).not.toContainText('Bez masa');

  // Recept s kuřecím masem: dvě varianty pod stejným nadpisem.
  await page.goto('./#/recepty/kureci-stehno-korenova-zelenina');
  const sMasem = page.getByTestId('dochuceni-pro-dospele');
  await expect(sMasem).toContainText('S masem');
  await expect(sMasem).toContainText('Bez masa');
  await expect(sMasem).toContainText('Náhrada bílkoviny');
});

test('u surovin v receptu jsou vidět úrovně živin', async ({ page }) => {
  await acceptDisclaimer(page);
  await page.goto('./#/recepty/candat-koprova-omacka-brambory');

  // Brambor je zdroj vitaminu C — štítek má stejnou podobu jako v přehledu surovin.
  const ziviny = page.getByTestId('ziviny-suroviny-brambor');
  await expect(ziviny).toBeVisible();
  await expect(ziviny).toContainText('vitamin C');

  // A po klepnutí se otevře stejné okénko s podrobnostmi.
  await page.getByTestId('zeleza-recept-brambor-cecko').click();
  const okenko = page.getByTestId('okenko-zivin');
  await expect(okenko).toBeVisible();
  await expect(okenko).toContainText('Vitamin C');
});

test('dvojice rostlinné železo + vitamin C se zapne jedním klepnutím', async ({ page }) => {
  await acceptDisclaimer(page);
  await navLink(page, 'Recepty').click();
  await otevriFiltry(page, 'receptu');

  const count = page.getByTestId('pocet-receptu');
  const vse = (await count.textContent()) ?? '';

  await page.getByTestId('filtr-dvojice').click();
  await expect(page.getByTestId('filtr-dvojice')).toHaveAttribute('aria-pressed', 'true');
  await expect(count).not.toHaveText(vse);

  // Zkratka nastaví přesně ty tři volby, které by šlo naklikat i ručně.
  await expect(page.getByTestId('prepinac-zelezo')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByTestId('prepinac-cecko')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByTestId('prepinac-zinek')).toHaveAttribute('aria-pressed', 'false');
  await expect(page.getByTestId('filtr-druhu-zeleza').getByTestId('chip-nehemove')).toHaveAttribute(
    'aria-pressed',
    'true',
  );

  await page.getByTestId('filtr-dvojice').click();
  await expect(count).toHaveText(vse);
});

test('druh železa a síla zdroje se nabídnou, až když jsou k čemu', async ({ page }) => {
  await acceptDisclaimer(page);
  await navLink(page, 'Recepty').click();
  await otevriFiltry(page, 'receptu');

  await expect(page.getByTestId('filtr-druhu-zeleza')).toBeHidden();
  await expect(page.getByTestId('filtr-sily')).toBeHidden();

  // Vitamin C sám o sobě druh železa neotevře — jen sílu zdroje.
  await page.getByTestId('prepinac-cecko').click();
  await expect(page.getByTestId('filtr-sily')).toBeVisible();
  await expect(page.getByTestId('filtr-druhu-zeleza')).toBeHidden();

  await page.getByTestId('prepinac-zelezo').click();
  await expect(page.getByTestId('filtr-druhu-zeleza')).toBeVisible();
});

test('u surovin v receptu je vidět střední a vysoké riziko dušení', async ({ page }) => {
  await acceptDisclaimer(page);
  await page.goto('./#/recepty/hovezi-ragu-testoviny');

  await expect(page.getByTestId('duseni-suroviny-rajce')).toContainText('vysoké riziko dušení');
  await expect(page.getByTestId('duseni-suroviny-hovezi-mlete')).toContainText(
    'střední riziko dušení',
  );

  // Nízké riziko se nevypisuje, jinak by štítek zevšedněl a přestal varovat.
  await expect(page.getByTestId('duseni-suroviny-cibule')).toBeHidden();
  await expect(page.getByTestId('duseni-suroviny-olej-olivovy')).toBeHidden();
});

test('okénko živin nevypisuje, čeho surovina není zdrojem', async ({ page }) => {
  await acceptDisclaimer(page);
  await page.goto('./#/recepty/candat-koprova-omacka-brambory');

  // Brambor je zdroj vitaminu C, ale železa ani zinku ne — v okénku proto
  // stojí jen vitamin C. „Není zdroj" patří na detail suroviny, kde je na
  // celý obrázek místo.
  await page.getByTestId('zeleza-recept-brambor-cecko').click();
  const okenko = page.getByTestId('okenko-zivin');
  await expect(okenko).toBeVisible();
  await expect(okenko).toContainText('Vitamin C');
  await expect(okenko).not.toContainText('není zdroj');
});

test('filtry surovin se dají kombinovat', async ({ page }) => {
  await acceptDisclaimer(page);
  await navLink(page, 'Suroviny').click();
  await otevriFiltry(page, 'surovin');

  const count = page.getByTestId('pocet-surovin');
  const vse = (await count.textContent()) ?? '';

  // Sezónní a zároveň ještě neochutnané — dřív se volby vylučovaly a tohle nešlo.
  await page.getByTestId('filtr-sezonni').click();
  const sezonni = (await count.textContent()) ?? '';
  expect(sezonni).not.toBe(vse);

  await page.getByTestId('filtr-deniku').getByTestId('chip-neochutnano').click();
  await expect(page.getByTestId('filtr-sezonni')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByTestId('seznam-surovin')).toBeVisible();

  await page.getByTestId('zrusit-filtry').click();
  await expect(count).toHaveText(vse);
});

test('filtr živin u surovin upřesňuje druh železa', async ({ page }) => {
  await acceptDisclaimer(page);
  await navLink(page, 'Suroviny').click();
  await otevriFiltry(page, 'surovin');

  const count = page.getByTestId('pocet-surovin');
  const vse = (await count.textContent()) ?? '';

  await expect(page.getByTestId('filtr-druhu-zeleza')).toBeHidden();
  await page.getByTestId('prepinac-zelezo').click();
  const zelezo = (await count.textContent()) ?? '';
  expect(zelezo).not.toBe(vse);

  await page.getByTestId('filtr-druhu-zeleza').getByTestId('chip-hemove').click();
  await expect(count).not.toHaveText(zelezo);

  // Významný zdroj je podmnožina toho, co železo aspoň obsahuje.
  const hemove = (await count.textContent()) ?? '';
  await page.getByTestId('filtr-sily').getByTestId('chip-vyznamny').click();
  const vyznamne = (await count.textContent()) ?? '';
  expect(Number(vyznamne.split(' ')[0])).toBeLessThanOrEqual(Number(hemove.split(' ')[0]));
});

test('oblíbenou surovinu jde označit rovnou ze seznamu', async ({ page }) => {
  await acceptDisclaimer(page);
  await navLink(page, 'Suroviny').click();
  await otevriFiltry(page, 'surovin');
  await page.getByTestId('hledat-surovinu').fill('brokolice');

  const hvezda = page.getByTestId('oblibene-brokolice');
  await expect(hvezda).toHaveAttribute('aria-pressed', 'false');
  await hvezda.click();
  await expect(hvezda).toHaveAttribute('aria-pressed', 'true');

  // Klepnutí na hvězdičku nesmí otevřít detail suroviny.
  await expect(page.getByTestId('seznam-surovin')).toBeVisible();

  await page.getByTestId('hledat-surovinu').fill('');
  await page.getByTestId('filtr-oblibene').click();
  await expect(page.getByTestId('pocet-surovin')).toHaveText(`1 z ${ingredients.length} surovin`);

  // A objeví se v deníku mezi oblíbenými.
  await navLink(page, 'Deník').click();
  await expect(page.getByTestId('pocet-ochutnanych')).toBeVisible();
  await expect(page.getByTestId('oblibene-polozky')).toContainText('brokolice');
});

test('oblíbený recept jde označit rovnou ze seznamu', async ({ page }) => {
  await acceptDisclaimer(page);
  await navLink(page, 'Recepty').click();
  await otevriFiltry(page, 'receptu');

  const count = page.getByTestId('pocet-receptu');
  const vse = (await count.textContent()) ?? '';
  const karta = page.getByTestId('seznam-receptu').locator('li').first();
  const hvezda = karta.getByRole('button', { name: /oblíbených/ });

  await hvezda.click();
  await expect(hvezda).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByTestId('seznam-receptu')).toBeVisible();

  await page.getByTestId('filtr-oblibene').click();
  await expect(count).toHaveText(`1 z ${recipes.length} receptů`);
  await expect(count).not.toHaveText(vse);
});

test('alergen je vidět u suroviny v seznamu i uvnitř receptu', async ({ page }) => {
  await acceptDisclaimer(page);
  await navLink(page, 'Suroviny').click();
  await page.getByTestId('hledat-surovinu').fill('vejce slepici');
  await expect(page.getByTestId('alergen-vejce-slepici')).toContainText('alergen: vejce');

  // Surovina bez alergenu štítek nemá — prázdné místo by jen rozhodilo řádku.
  await page.getByTestId('hledat-surovinu').fill('mrkev');
  await expect(page.getByTestId('alergen-mrkev')).toBeHidden();

  await page.goto('./#/recepty/hovezi-ragu-testoviny');
  await expect(page.getByTestId('alergen-suroviny-testoviny-semolinove')).toContainText(
    'alergen: pšenice a lepek',
  );
});

test('v seznamu se nízké riziko dušení nevypisuje', async ({ page }) => {
  await acceptDisclaimer(page);
  await navLink(page, 'Suroviny').click();

  // Mrkev je vysoké riziko, cibule nízké — v seznamu svítí jen ta první.
  await page.getByTestId('hledat-surovinu').fill('mrkev');
  await expect(page.getByTestId('duseni-mrkev')).toContainText('vysoké riziko dušení');

  await page.getByTestId('hledat-surovinu').fill('cibule');
  await expect(page.getByTestId('duseni-cibule')).toBeHidden();

  // V detailu suroviny stupnice zůstává celá, i s nízkým rizikem.
  await page.getByTestId('surovina-cibule').click();
  await expect(page.getByTestId('riziko-duseni')).toContainText('Nízké riziko dušení');
});

test('suroviny i recepty jdou filtrovat bez konkrétního alergenu', async ({ page }) => {
  await acceptDisclaimer(page);
  await navLink(page, 'Suroviny').click();
  await otevriFiltry(page, 'surovin');

  const surovin = page.getByTestId('pocet-surovin');
  const vse = (await surovin.textContent()) ?? '';
  await page.getByTestId('filtr-bez-alergenu').getByRole('button', { name: 'mléko' }).click();
  await expect(surovin).not.toHaveText(vse);
  // Mléčné suroviny zmizí, ostatní zůstanou.
  await page.getByTestId('hledat-surovinu').fill('eidam');
  await expect(page.getByTestId('prazdny-stav')).toBeVisible();
  await page.getByTestId('hledat-surovinu').fill('mrkev');
  await expect(page.getByTestId('surovina-mrkev')).toBeVisible();

  await navLink(page, 'Recepty').click();
  await otevriFiltry(page, 'receptu');
  const receptu = page.getByTestId('pocet-receptu');
  const vsechny = (await receptu.textContent()) ?? '';
  await page.getByTestId('filtr-bez-alergenu').getByRole('button', { name: 'ryby' }).click();
  await expect(receptu).not.toHaveText(vsechny);
});

test('v kartě seznamu nesedí tlačítko uvnitř odkazu', async ({ page }) => {
  // Tlačítko uvnitř odkazu je neplatné HTML: čtečka obrazovky hlásí vnořený
  // ovládací prvek a klepnutí doprostřed karty netrefí odkaz, ale tlačítko.
  await acceptDisclaimer(page);
  const vnorene = async (): Promise<number> =>
    page.locator('a button, a a, button button').count();

  await navLink(page, 'Recepty').click();
  await expect(page.getByTestId('seznam-receptu')).toBeVisible();
  expect(await vnorene()).toBe(0);

  await navLink(page, 'Suroviny').click();
  await expect(page.getByTestId('seznam-surovin')).toBeVisible();
  expect(await vnorene()).toBe(0);
});

test('dlouhý seznam se plní po dávkách', async ({ page }) => {
  // Tři sta karet naráz znamená na mobilu dlouhé první vykreslení. Seznam
  // proto začíná první dávkou a další se načte tlačítkem nebo dorolováním.
  await acceptDisclaimer(page);
  await navLink(page, 'Recepty').click();

  const karty = page.getByTestId('seznam-receptu').locator('> li');
  const prvni = await karty.count();
  expect(prvni).toBeLessThan(recipes.length);

  await page.getByTestId('nacist-dalsi-recepty').click();
  await expect.poll(() => karty.count()).toBeGreaterThan(prvni);
});

test('filtry přežijí návrat z detailu a dají se poslat odkazem', async ({ page }) => {
  await acceptDisclaimer(page);
  await navLink(page, 'Suroviny').click();

  await page.getByTestId('hledat-surovinu').fill('brokolice');
  await expect(page.getByTestId('pocet-surovin')).toContainText('1 z');
  // Filtr je v adrese, takže se dá odkaz poslat druhému rodiči.
  expect(page.url()).toContain('q=brokolice');

  await page.getByTestId('seznam-surovin').getByRole('link').first().click();
  await expect(page.getByTestId('blok-zelezo-zinek')).toBeVisible();

  await page.goBack();
  // Dřív se seznam vrátil celý a rodič filtroval znovu.
  await expect(page.getByTestId('hledat-surovinu')).toHaveValue('brokolice');
  await expect(page.getByTestId('pocet-surovin')).toContainText('1 z');
});

test('filtry receptů se drží v adrese a dají se otevřít přímo', async ({ page }) => {
  await acceptDisclaimer(page);
  await page.goto('./#/recepty?kat=polevky&cas=40&vege=1');

  await expect(page.getByTestId('pocet-receptu')).toBeVisible();
  const filtrovane = (await page.getByTestId('pocet-receptu').textContent()) ?? '';

  await navLink(page, 'Recepty').click();
  await expect(page.getByTestId('pocet-receptu')).not.toHaveText(filtrovane);
});

test('hledání odpustí překlep a nevrací maso na dotaz ryby', async ({ page }) => {
  await acceptDisclaimer(page);
  await navLink(page, 'Suroviny').click();

  await page.getByTestId('hledat-surovinu').fill('brambury');
  await expect(page.getByTestId('seznam-surovin')).toContainText('brambor');

  await page.getByTestId('hledat-surovinu').fill('ryby');
  await expect(page.getByTestId('seznam-surovin')).not.toContainText('hovězí zadní');
});

test('první načtení nestahuje katalog ani knihovnu pro sdílení', async ({ page }) => {
  // Úvodní obrazovka musí být vidět dřív, než se stáhne tři sta surovin,
  // tři sta receptů a Firebase. Dřív se stahovalo všechno naráz.
  await page.goto('./');
  await expect(page.getByTestId('disclaimer')).toBeVisible();

  const stazeno = await page.evaluate(() =>
    performance.getEntriesByType('resource').map((r) => r.name),
  );
  expect(stazeno.some((url) => url.includes('firebase'))).toBe(false);

  const kb = await page.evaluate(() =>
    performance
      .getEntriesByType('resource')
      .filter((r) => r.name.endsWith('.js'))
      .reduce((soucet, r) => soucet + (r as PerformanceResourceTiming).encodedBodySize, 0) / 1024,
  );
  // Před rozdělením to bylo přes 570 kB v jediném souboru.
  expect(kb).toBeLessThan(200);
});

test('filtr bez alergenu bere víc alergenů a předvyplní se podle dítěte', async ({ page }) => {
  await acceptDisclaimer(page);

  // 1. Dva alergeny naráz — dřív se dal vybrat jediný.
  await page.goto('./#/suroviny?bez=mleko,vejce');
  const dva = (await page.getByTestId('pocet-surovin').textContent()) ?? '';
  await page.goto('./#/suroviny?bez=mleko');
  const jeden = (await page.getByTestId('pocet-surovin').textContent()) ?? '';
  expect(dva).not.toBe(jeden);

  // 2. Alergie zadaná u dítěte filtr předvyplní.
  await page.goto('./#/domacnost');
  await page.getByTestId('alergie-mleko').click();
  await expect(page.getByTestId('alergie-mleko')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByTestId('alergie-shrnuti')).toContainText('mléko');

  await navLink(page, 'Suroviny').click();
  await expect(page.getByTestId('pocet-surovin')).toHaveText(jeden);

  // 3. A dá se odškrtnout, aniž by se to samo vrátilo.
  await otevriFiltry(page, 'surovin');
  await page.getByTestId('filtr-bez-alergenu').getByRole('button', { name: 'mléko' }).click();
  await expect(page.getByTestId('pocet-surovin')).toContainText('301 z 301');
});
