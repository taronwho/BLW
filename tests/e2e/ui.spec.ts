import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { ingredients, recipes } from '@/data';
import {
  SCREENS,
  acceptDisclaimer,
  horizontalOverflow,
  navLink,
  otevriDomacnost,
  otevriFiltry,
  tooSmallTargets,
  zalozDite,
} from './helpers';

/**
 * Barvy úrovní rizika se čtou ze src/index.css, ne opisují.
 *
 * Když se paleta kvůli kontrastu doladí, test se má přizpůsobit sám 
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

    // Po odscrollování dolů se může objevit další obsah, kontrolujeme i to.
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
    // Na obrazovkách, kde se o jídle nemluví (nastavení dítěte, párování
    // telefonů), žádný štítek být nemusí. Kde ale je, musí splňovat pravidlo.
    if (pocet === 0) {
      expect(screen.id.startsWith('domacnost'), `${screen.name}: chybí štítek rizika`).toBe(true);
      return;
    }

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

  // Fajfka v seznamu otevře tutéž nabídku jako detail suroviny, jedno
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

  // Zůstane to tam i po obnovení stránky, deník je v IndexedDB.
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

  // Počet se bere z katalogu, ne z natvrdo psaného čísla, jinak test
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

  // První značka železa, ne první značka živiny, štítek zinku a vitaminu C
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
  // Značka je uvnitř odkazu na detail, proklik se nesmí spustit.
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

  // Bez odškrtnutí se u fáze 6m+ upozorňuje, to je stav před začátkem příkrmu.
  await page.goto('./#/suroviny/brokolice');
  const upozorneni = page.getByTestId('upozorneni-pripravenost');
  await expect(upozorneni).toBeVisible();
  await expect(upozorneni).toContainText('Šest měsíců není pevné datum');

  // U vyšších fází je připomínka jen šum, tam mlčí.
  await page.getByTestId('faze-12m').click();
  await expect(upozorneni).toBeHidden();

  await zalozDite(page, 'Ema', '2026-03-01');
  await page.getByTestId('znak-sed').click();
  await page.getByTestId('znak-koordinace').click();
  await expect(page.getByTestId('znak-sed')).toHaveAttribute('aria-checked', 'true');

  // Dva ze tří nestačí, ale text má jmenovat ten chybějící.
  await page.goto('./#/suroviny/brokolice');
  await expect(upozorneni).toContainText('vyhasnutí vypuzovacího reflexu');

  await otevriDomacnost(page, 'deti');
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
  await otevriDomacnost(page, 'aplikace');

  const html = page.locator('html');
  await expect(html).toHaveAttribute('data-theme', 'light');

  await page.getByTestId('motiv-tmavy').click();
  await expect(html).toHaveAttribute('data-theme', 'dark');
  // Pozadí stránky se mění přes proměnné, ne přes třídy `dark:`, kdyby se
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
  await otevriDomacnost(page, 'aplikace');
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

  // Brambor je zdroj vitaminu C, štítek má stejnou podobu jako v přehledu surovin.
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

  // Vitamin C sám o sobě druh železa neotevře, jen sílu zdroje.
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

  // Brambor je zdroj vitaminu C, ale železa ani zinku ne, v okénku proto
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

  // Sezónní a zároveň ještě neochutnané, dřív se volby vylučovaly a tohle nešlo.
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

  // Surovina bez alergenu štítek nemá, prázdné místo by jen rozhodilo řádku.
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

  // Mrkev je vysoké riziko, cibule nízké, v seznamu svítí jen ta první.
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

  // 1. Dva alergeny naráz, dřív se dal vybrat jediný.
  await page.goto('./#/suroviny?bez=mleko,vejce');
  const dva = (await page.getByTestId('pocet-surovin').textContent()) ?? '';
  await page.goto('./#/suroviny?bez=mleko');
  const jeden = (await page.getByTestId('pocet-surovin').textContent()) ?? '';
  expect(dva).not.toBe(jeden);

  // 2. Alergie zadaná u dítěte filtr předvyplní.
  await zalozDite(page, 'Ema', '2026-03-01');
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

test('domácnost unese víc dětí a přepnutí promění celou aplikaci', async ({ page }) => {
  await acceptDisclaimer(page);

  // Kojenec a batole, každý je v příkrmu jinde.
  await zalozDite(page, 'Ema', '2026-03-01');
  await page.getByTestId('pridat-dite').click();
  // Formulář pro nové dítě je nahoře u seznamu; ten dole upravuje vybrané.
  await page.getByTestId('jmeno-ditete').first().fill('Tobiáš');
  await page.getByTestId('datum-narozeni').first().fill('2024-01-15');
  await page.getByTestId('ulozit-dite').first().click();
  await expect(page.getByTestId('seznam-deti')).toContainText('Tobiáš');

  // Přidané dítě se rovnou stane vybraným a je vidět v hlavičce.
  await expect(page.getByTestId('dite-v-hlavicce')).toContainText('Tobiáš');

  // Podle vybraného dítěte se řídí fáze u suroviny.
  await page.goto('./#/suroviny/brokolice');
  await expect(page.getByTestId('faze-12m')).toHaveAttribute('aria-pressed', 'true');

  // Přepnutí zpátky na kojence přehodí fázi na 6m+.
  await page.getByTestId('dite-v-hlavicce').click();
  await expect(page.getByTestId('prepinac-deti')).toBeVisible();
  await page.locator('[data-testid^="vybrat-dite-"][aria-pressed="false"]').click();
  await expect(page.getByTestId('faze-6m')).toHaveAttribute('aria-pressed', 'true');
});

test('dlouhý seznam se donačítá sám při rolování, bez tlačítka', async ({ page }) => {
  await acceptDisclaimer(page);
  await navLink(page, 'Suroviny').click();

  const polozky = page.getByTestId('seznam-surovin').getByRole('listitem');
  const prvni = await polozky.count();
  expect(prvni).toBeLessThan(301);

  // Žádné tlačítko, jen značka konce seznamu, na kterou se doroluje.
  await expect(page.getByRole('button', { name: 'Načíst další' })).toHaveCount(0);

  await page.getByTestId('nacist-dalsi-suroviny').scrollIntoViewIfNeeded();
  await expect.poll(() => polozky.count()).toBeGreaterThan(prvni);
});

test('suroviny stojí ve dvou sloupcích a nic z dlaždice nepřetéká', async ({ page }) => {
  await acceptDisclaimer(page);
  await navLink(page, 'Suroviny').click();

  const polozky = page.getByTestId('seznam-surovin').getByRole('listitem');
  const prvni = await polozky.nth(0).boundingBox();
  const druha = await polozky.nth(1).boundingBox();
  const treti = await polozky.nth(2).boundingBox();
  if (prvni === null || druha === null || treti === null) throw new Error('dlaždice nejsou vidět');

  // Druhá dlaždice vedle první, třetí až pod nimi, tedy dva sloupce.
  expect(druha.y).toBeCloseTo(prvni.y, 0);
  expect(druha.x).toBeGreaterThan(prvni.x);
  expect(treti.y).toBeGreaterThan(prvni.y);

  // Dlaždice zabírá zhruba půl šířky, ne celou.
  const sirkaOkna = page.viewportSize()?.width ?? 0;
  expect(prvni.width).toBeLessThan(sirkaOkna * 0.6);

  // Obsah se do dlaždice vejde, stránka nikde nejede do stran.
  const preteka = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth + 1,
  );
  expect(preteka).toBe(false);
});

test('zkrácený štítek na dlaždici čte odečítač obrazovky celý', async ({ page }) => {
  await acceptDisclaimer(page);
  await navLink(page, 'Suroviny').click();
  await page.getByTestId('hledat-surovinu').fill('mrkev');

  // Vidět je jen „vysoké", ale význam zůstává dostupný celý.
  const duseni = page.getByTestId('duseni-mrkev');
  await expect(duseni).toContainText('vysoké riziko dušení');
  await expect(duseni.locator('span.sr-only')).toHaveText(/riziko dušení/);
});

test('na úvodní obrazovce je to podstatné hned nahoře', async ({ page }) => {
  await acceptDisclaimer(page);

  const okno = page.viewportSize()?.height ?? 0;
  const navigace = 64;

  // Co je metoda zač a co dělat, když se něco děje, obojí bez rolování.
  const blw = await page.getByTestId('karta-co-je-blw').boundingBox();
  const daveni = await page.getByTestId('dlazdice-daveni').boundingBox();
  const pomoc = await page.getByTestId('dlazdice-prvni-pomoc').boundingBox();
  if (blw === null || daveni === null || pomoc === null) throw new Error('karty nejsou vidět');
  expect(daveni.y + daveni.height).toBeLessThan(okno - navigace);
  expect(pomoc.y + pomoc.height).toBeLessThan(okno - navigace);

  // Dvě bezpečnostní dlaždice stojí vedle sebe, ne pod sebou.
  expect(pomoc.y).toBeCloseTo(daveni.y, 0);
  expect(pomoc.x).toBeGreaterThan(daveni.x);

  // Domácnost sedí v zelené hlavičce, nad vším ostatním.
  const odkaz = await page.getByTestId('odkaz-domacnost').boundingBox();
  if (odkaz === null) throw new Error('odkaz na Domácnost není vidět');
  expect(odkaz.y + odkaz.height).toBeLessThanOrEqual(blw.y);

  await page.getByTestId('karta-co-je-blw').click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Co je BLW');
});

test('seznamy vedou z úvodní obrazovky až k surovině', async ({ page }) => {
  await acceptDisclaimer(page);
  await zalozDite(page, 'Ema', '2026-03-15');
  await navLink(page, 'Domů').click();

  // Pás na úvodní obrazovce nese všechny seznamy, další jsou za okrajem.
  await expect(page.getByTestId('pas-seznamu').getByRole('listitem')).not.toHaveCount(0);
  await page.getByTestId('vsechny-seznamy').click();
  await expect(page.getByTestId('seznam-seznamu')).toBeVisible();

  await page.getByTestId('seznam-zelezo-na-talir').click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Železo na talíř');
  await expect(page.getByTestId('postup-seznamu')).toContainText('Ochutnáno 0 z 10');

  // Rada k seznamu je po ruce a vede do Rad.
  await expect(page.getByTestId('rada-seznamu')).toBeVisible();

  // Ochutnávka zapsaná ze seznamu posune jeho postup.
  await page.getByTestId('ochutnano-cocka-hneda').click();
  await page.getByRole('button', { name: 'Uložit ochutnávku' }).click();
  await expect(page.getByTestId('postup-seznamu')).toContainText('Ochutnáno 1 z 10');

  // A položka vede na detail suroviny.
  await page.getByTestId('seznam-surovina-spenat').click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('špenát');
});

test('bez dítěte plán nejde sestavit, protože není z čeho počítat', async ({ page }) => {
  await acceptDisclaimer(page);
  await page.getByTestId('karta-planu').click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('30denní plán');
  await expect(page.getByTestId('plan-zaloz-dite')).toBeVisible();
  await expect(page.getByTestId('sestavit-plan')).toBeHidden();

  // Pravidla plánu mají vlastní radu se zdroji, ne jen odstavec na obrazovce.
  await page.getByTestId('odkaz-rada-plan').click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Jak je postavený 30denní plán');
  await expect(page.getByRole('link', { name: /NHS/ }).first()).toBeVisible();
});

test('plán se sestaví, odškrtne a zapíše ochutnávku do deníku', async ({ page }) => {
  await acceptDisclaimer(page);
  await zalozDite(page, 'Ema', '2026-03-01');

  await page.goto('./#/plan');
  await page.getByTestId('sestavit-plan').click();

  // Třicet dnů v mřížce a první den je na řadě.
  await expect(page.getByTestId('plan-mrizka').getByRole('listitem')).toHaveCount(30);
  await expect(page.getByTestId('plan-dnes')).toContainText('den 1');
  await expect(page.getByTestId('plan-postup')).toContainText('Hotovo 0 z 30');

  // První den je samotné sousto, ne recept.
  await page.getByTestId('plan-dnes-detail').click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Den 1');
  await expect(page.getByTestId('den-novinka')).toContainText('brokolice');
  await expect(page.getByTestId('den-jidla').getByRole('listitem')).toHaveCount(1);

  // Co bude dál: pět dnů dopředu i s novou surovinou, kvůli nákupu.
  await page.goto('./#/plan');
  await page.getByRole('group').filter({ hasText: 'Co bude dál' }).getByText('Co bude dál').click();
  await expect(page.getByTestId('plan-pristi-dny').getByRole('listitem')).toHaveCount(5);
  await expect(page.getByTestId('plan-pristi-dny')).toContainText('květák');

  await page.goto('./#/plan/den/1');
  // Odškrtnutí zapíše ochutnávku do deníku a posune plán na druhý den.
  await page.getByTestId('den-hotovo').click();
  await page.getByTestId('volba-mnozstvi-snedla-vse').click();
  await page.getByRole('button', { name: 'Zapsat a odškrtnout' }).click();
  await expect(page.getByTestId('den-stav')).toContainText('hotovo');

  await page.goto('./#/plan');
  await expect(page.getByTestId('plan-postup')).toContainText('Hotovo 1 z 30');
  await expect(page.getByTestId('plan-dnes')).toContainText('den 2');

  await navLink(page, 'Deník').click();
  await expect(page.getByTestId('casova-osa')).toContainText('brokolice');
});

test('den jde odložit, přeskočit i vrátit zpátky mezi čekající', async ({ page }) => {
  await acceptDisclaimer(page);
  await zalozDite(page, 'Ema', '2026-03-01');
  await page.goto('./#/plan');
  await page.getByTestId('sestavit-plan').click();

  // Odložení prohodí obsah prvního a druhého dne, čísla zůstanou.
  await expect(page.getByTestId('plan-dnes')).toContainText('brokolice');
  await page.getByTestId('den-odlozit').click();
  await expect(page.getByTestId('plan-dnes')).toContainText('den 1');
  await expect(page.getByTestId('plan-dnes')).toContainText('květák');

  // Přeskočení posune plán dál a den zůstane přeškrtnutý.
  await page.getByTestId('den-preskocit').click();
  await expect(page.getByTestId('plan-dnes')).toContainText('den 2');
  await expect(page.getByTestId('plan-postup')).toContainText('přeskočeno 1');

  // A dá se vzít zpátky.
  await page.getByTestId('plan-den-1').click();
  await expect(page.getByTestId('den-stav')).toContainText('přeskočeno');
  await page.getByTestId('den-vratit').click();
  await expect(page.getByTestId('den-stav')).toContainText('čeká');
});

test('alergie zapsaná po sestavení plán nezmění, ale nahlásí se', async ({ page }) => {
  await acceptDisclaimer(page);
  await zalozDite(page, 'Ema', '2025-06-01');
  await page.goto('./#/plan');
  await page.getByTestId('sestavit-plan').click();
  await expect(page.getByTestId('plan-jine-alergie')).toBeHidden();

  // Rodič teprve teď zapíše alergii na mléko.
  await otevriDomacnost(page, 'deti');
  await page.getByTestId('alergie-mleko').click();

  // Plán o ní neví, tak to řekne, a to i na úvodní obrazovce.
  await navLink(page, 'Domů').click();
  await expect(page.getByTestId('karta-planu')).toContainText('Alergie se od sestavení změnily');
  await page.getByTestId('karta-planu').click();
  await expect(page.getByTestId('plan-jine-alergie')).toContainText('mléko');

  // Po přesestavení je zase ticho.
  await page.getByTestId('sestavit-po-alergii').click();
  await expect(page.getByTestId('plan-jine-alergie')).toBeHidden();
});

test('plán vynechá alergen, který má dítě zapsaný v Domácnosti', async ({ page }) => {
  await acceptDisclaimer(page);
  await zalozDite(page, 'Ema', '2025-06-01');

  // Ema nesnáší mléko, vejce ani lepek.
  for (const alergen of ['mleko', 'vejce', 'psenice-lepek']) {
    await page.getByTestId(`alergie-${alergen}`).click();
  }

  await page.goto('./#/plan');
  await page.getByTestId('sestavit-plan').click();
  await page.getByTestId('plan-dnes-detail').click();
  const jidla = page.getByTestId('den-jidla');
  await expect(jidla).toBeVisible();
  // Vyloučený alergen se nesmí objevit ani jako štítek u jídla.
  await expect(jidla).not.toContainText('mléko');
  await expect(jidla).not.toContainText('vejce');
});

test('deník se přepnutím dítěte vymění, sourozencovy ochutnávky nezůstanou', async ({ page }) => {
  await acceptDisclaimer(page);
  await zalozDite(page, 'Ema', '2026-03-01');

  // Ema ochutná brokolici.
  await page.goto('./#/suroviny/brokolice');
  await page.getByTestId('ochutnano-brokolice').click();
  await page.getByRole('button', { name: 'Uložit ochutnávku' }).click();
  await navLink(page, 'Deník').click();
  await expect(page.getByTestId('casova-osa')).toContainText('brokolice');
  await expect(page.getByTestId('pocet-ochutnanych')).toContainText('Ochutnáno 1 z');

  // Druhé dítě začíná s prázdným deníkem.
  await otevriDomacnost(page, 'deti');
  await page.getByTestId('pridat-dite').click();
  await page.getByTestId('jmeno-ditete').first().fill('Tobiáš');
  await page.getByTestId('datum-narozeni').first().fill('2024-01-15');
  await page.getByTestId('ulozit-dite').first().click();
  await expect(page.getByTestId('dite-v-hlavicce')).toContainText('Tobiáš');

  await navLink(page, 'Deník').click();
  await expect(page.getByTestId('prazdny-denik')).toBeVisible();
  await expect(page.getByTestId('pocet-ochutnanych')).toContainText('Ochutnáno 0 z');

  // Ani v katalogu se surovina netváří jako ochutnaná.
  await navLink(page, 'Suroviny').click();
  await otevriFiltry(page, 'surovin');
  await page.getByTestId('filtr-deniku').getByRole('button', { name: 'už ochutnané' }).click();
  await expect(page.getByTestId('pocet-surovin')).toContainText('0 z 301');

  // Přepnutí zpátky na Emu deník vrátí.
  await page.getByTestId('dite-v-hlavicce').click();
  await page.locator('[data-testid^="vybrat-dite-"][aria-pressed="false"]').click();
  await navLink(page, 'Deník').click();
  await expect(page.getByTestId('casova-osa')).toContainText('brokolice');
  await expect(page.getByTestId('pocet-ochutnanych')).toContainText('Ochutnáno 1 z');
});

const UA_MESSENGER =
  'Mozilla/5.0 (Linux; Android 14; SM-S911B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36 [FB_IAB/MESSENGER;FBAV/460.0.0.0;]';

test('pozvánka otevřená v Messengeru varuje, že se spáruje jeho prohlížeč', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    userAgent: UA_MESSENGER,
    viewport: { width: 375, height: 667 },
    baseURL,
  });
  const page = await context.newPage();
  await acceptDisclaimer(page);
  await page.goto('./#/domacnost/pripojit/K7M2X9QRT4');

  const upozorneni = page.getByTestId('upozorneni-prohlizec');
  await expect(upozorneni).toBeVisible();
  await expect(upozorneni).toContainText('prohlížeč uvnitř Messengeru');
  await expect(upozorneni).toContainText('dvě zařízení');

  // Kód jde přenést do nainstalované aplikace jedním klepnutím.
  await expect(page.getByTestId('kod-z-odkazu')).toHaveText('K7M2X-9QRT4');
  await expect(page.getByTestId('kopirovat-kod-z-odkazu')).toBeVisible();

  await context.close();
});

test('pozvánka s neplatným kódem se nepokouší připojit', async ({ page }) => {
  await acceptDisclaimer(page);
  await page.goto('./#/domacnost/pripojit/NENIKOD');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Neplatný kód');
  await expect(page.getByTestId('pripojit-z-odkazu')).toHaveCount(0);
});

test('párovací kód jde zkopírovat, ne jen odkaz', async ({ page }) => {
  // Firebase se v testu nikdy nevolá, párovací kód je uložený v prohlížeči
  // a obrazovka ho vykreslí i bez spojení. Skutečná domácnost by se testem
  // zakládat neměla.
  await page.route('**://*.googleapis.com/**', (route) => route.abort());
  await page.route('**://*.firebaseio.com/**', (route) => route.abort());
  await acceptDisclaimer(page);
  await page.evaluate(() => {
    window.localStorage.setItem('blw.household.code.v1', 'K7M2X9QRT4');
  });
  // Přenačtení, ne jen změna adresy: obrazovka se liší jen hashem a stav
  // aplikace by se jinak nenačetl znovu.
  await page.reload();
  await otevriDomacnost(page, 'sdileni');

  await expect(page.getByTestId('parovaci-kod')).toHaveText('K7M2X-9QRT4');
  // Kód je spolehlivější cesta než odkaz z chatu, takže musí jít zkopírovat
  // jedním klepnutím, dřív šel zkopírovat jen odkaz.
  await expect(page.getByTestId('kopirovat-kod')).toBeVisible();
  await expect(page.getByTestId('kopirovat-odkaz')).toBeVisible();
  await expect(page.getByTestId('odkaz-k-pripojeni')).toContainText(
    '#/domacnost/pripojit/K7M2X9QRT4',
  );

  // A rodič se dozví, proč poslaný odkaz nemusí spárovat to, co čeká.
  await expect(page.getByText('Nejjistější cesta:')).toBeVisible();
});

test('pozvánka do domácnosti, ve které zařízení už je, nenabízí připojení znovu', async ({
  page,
}) => {
  await page.route('**://*.googleapis.com/**', (route) => route.abort());
  await acceptDisclaimer(page);
  await page.evaluate(() => {
    window.localStorage.setItem('blw.household.code.v1', 'K7M2X9QRT4');
  });
  await page.reload();

  // Týž kód: klepnutí na odkaz podruhé nemá nic dělat.
  await page.goto('./#/domacnost/pripojit/K7M2X9QRT4');
  await expect(page.getByTestId('uz-pripojeno')).toBeVisible();
  await expect(page.getByTestId('pripojit-z-odkazu')).toBeDisabled();

  // Cizí kód naopak musí říct, že se domácnost přepne.
  await page.goto('./#/domacnost/pripojit/ABCDE12345');
  await expect(page.getByTestId('jina-domacnost')).toContainText('přepne');
  await expect(page.getByTestId('pripojit-z-odkazu')).toBeEnabled();
});

test('recepty jdou filtrovat podle věku dítěte', async ({ page }) => {
  await acceptDisclaimer(page);
  // Kojenec na začátku příkrmu: recepty pro batolata se mu nemají nabízet.
  await zalozDite(page, 'Ema', '2026-03-15');
  await navLink(page, 'Recepty').click();

  const pocet = page.getByTestId('pocet-receptu');
  await expect(pocet).toContainText('299 z 299');

  await otevriFiltry(page, 'receptu');
  await page.getByTestId('filtr-vhodne').click();
  await expect(pocet).not.toContainText('299 z 299');
  await expect(page.getByTestId('seznam-receptu')).not.toContainText('na špejli');

  // Filtr přežije odkaz, stejně jako ostatní.
  const filtrovano = await pocet.textContent();
  await page.reload();
  await expect(pocet).toHaveText(filtrovano ?? '');
  await otevriFiltry(page, 'receptu');
  await expect(page.getByTestId('filtr-vhodne')).toHaveAttribute('aria-pressed', 'true');
});

test('recept starší, než vyžadují jeho suroviny, řekne proč', async ({ page }) => {
  await acceptDisclaimer(page);

  // Špejle a syrový list, věk nevychází ze složení, ale z podoby jídla.
  await page.goto('./#/recepty/mozzarella-a-rajce-na-spejli');
  await expect(page.getByTestId('duvod-veku')).toContainText('Proč až od 12 měsíců');
  await expect(page.getByTestId('duvod-veku')).toContainText('špejli');

  // Vepřová panenka věk zvedala kvůli uzenému tofu, které je v receptu jen
  // jako bezmasá náhrada pro dospělé. Dětská porce je z masa, zelí a brambor.
  await page.goto('./#/recepty/veprova-panenka-s-dusenym-zelim');
  await expect(page.getByTestId('duvod-veku')).toHaveCount(0);
  await expect(page.getByText('vhodné od 6 měsíců')).toBeVisible();
});

test('nadpis zdrojů u surovin nese jen jedno číslo', async ({ page }) => {
  await acceptDisclaimer(page);
  await page.goto('./#/recepty/ciziny-fik-s-jogurtem-a-orechy');

  // Panel si obsah vykresluje sám, takže mu žádné zdroje nechodí. Dřív se
  // k číslu v nadpisu přilepila ještě nula z prázdného seznamu.
  const prepinac = page.getByTestId('zdroje-surovin');
  await expect(prepinac).toHaveText(/^Zdroje u surovin \(\d+\)$/);
  await expect(prepinac).not.toContainText('(0)');
});

test('zdroje seznamu stojí až pod jeho položkami', async ({ page }) => {
  await acceptDisclaimer(page);
  await page.goto('./#/seznamy/na-zoubky');

  const polozky = await page.getByTestId('polozky-seznamu').boundingBox();
  const zdroje = await page.getByTestId('zdroje-seznamu').boundingBox();
  if (polozky === null || zdroje === null) throw new Error('seznam není vidět');
  expect(zdroje.y).toBeGreaterThan(polozky.y);

  // A doklady jsou opravdu odkazy na NHS, ne jen nadpis. Testid nese
  // přepínač, odkazy se rozbalí vedle něj.
  await page.getByTestId('zdroje-seznamu').click();
  const odkazy = page.locator('a[href^="https://www.nhs.uk/"]');
  await expect(odkazy).toHaveCount(2);
});

test('přehled o používání se bez tajného odkazu neukáže vůbec', async ({ page }) => {
  await acceptDisclaimer(page);

  // Nikde v aplikaci na něj nevede odkaz.
  await expect(page.locator('a[href*="prehled"]')).toHaveCount(0);
  await expect(page.locator('a[href*="/x/"]')).toHaveCount(0);

  // Stará adresa i adresa se špatným klíčem vypadají jako překlep v odkazu.
  for (const adresa of ['./#/prehled', './#/x/tohlenenispravnyklic']) {
    await page.goto(adresa);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('stránka tu není');
    await expect(page.getByTestId('prehled-email')).toHaveCount(0);
  }
});

/**
 * Klíč v repozitáři být nesmí, ten je veřejný. Test se pustí jen tam, kde
 * je klíč v proměnné prostředí:
 *
 *   DROBEK_ADMIN_KLIC=… npm run test:e2e
 */
const ADMIN_KLIC = process.env['DROBEK_ADMIN_KLIC'] ?? '';

test('se správným klíčem se přehled otevře, ale data chce až po heslu', async ({ page }) => {
  test.skip(ADMIN_KLIC === '', 'bez DROBEK_ADMIN_KLIC není co zkoušet');
  await acceptDisclaimer(page);
  await page.goto(`./#/x/${ADMIN_KLIC}`);

  await expect(page.getByRole('heading', { level: 1 })).toContainText('Přehled o používání');
  await expect(page.getByTestId('prehled-email')).toBeVisible();
  await expect(page.getByTestId('prehled-heslo')).toHaveAttribute('type', 'password');
  // Dokud se nikdo nepřihlásí, žádná čísla tu nejsou.
  await expect(page.getByTestId('prehled-vysledek')).toHaveCount(0);
});
