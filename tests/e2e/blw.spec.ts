import { expect, test } from '@playwright/test';
import { ingredientById } from '@/data/ingredients';
import { acceptDisclaimer, navLink, zalozDite } from './helpers';

/**
 * Tři věci, které dělají z aplikace BLW aplikaci: dětská porce z jídla
 * rodiny, dávení v deníku a obrázkový průvodce tvarem sousta.
 */

/** Datum narození dítěte, kterému je dnes `mesicu` měsíců a pár dní. */
function narozeniPred(mesicu: number): string {
  const datum = new Date();
  datum.setDate(1);
  datum.setMonth(datum.getMonth() - mesicu);
  const iso = (n: number): string => String(n).padStart(2, '0');
  return `${datum.getFullYear()}-${iso(datum.getMonth() + 1)}-01`;
}

function pokyn(id: string, faze: '6m' | '9m' | '12m'): string {
  const text = ingredientById.get(id)?.prep[faze]?.serving;
  if (text === undefined) throw new Error(`chybí pokyn ${id} ${faze}`);
  return text;
}

test('dávení se zapíše u ochutnávky, ukáže v deníku i ve výpisu a jde odškrtnout', async ({ page }) => {
  await acceptDisclaimer(page);
  await zalozDite(page, 'Ema', narozeniPred(7));

  await page.goto('./#/suroviny/brokolice');
  await page.getByTestId('ochutnano-brokolice').click();
  const davilo = page.getByTestId('ochutnavka-davilo');
  await expect(davilo).toHaveAttribute('aria-pressed', 'false');
  await expect(page.getByTestId('ochutnavka-davilo-pozor')).toHaveCount(0);
  await davilo.click();
  await expect(davilo).toHaveAttribute('aria-pressed', 'true');
  // Rodič, který si splete dávení s dušením, dostane cestu k první pomoci.
  await expect(page.getByTestId('ochutnavka-davilo-pozor')).toContainText('155');
  await page.getByTestId('ochutnavka-ulozit').click();

  const historie = page.getByTestId('historie-ochutnavek');
  await expect(historie).toContainText('dávilo se');

  await navLink(page, 'Deník').click();
  const prehled = page.getByTestId('daveni-prehled');
  await expect(prehled.getByTestId('daveni-celkem')).toContainText('1×');
  await expect(prehled.getByTestId('daveni-tydny')).toContainText('dávilo 1× z 1 ochutnávky');
  await expect(page.getByTestId('casova-osa')).toContainText('dávilo se');

  await page.getByTestId('denik-tisk').click();
  await expect(page.getByTestId('tisk-tabulka')).toContainText('dávilo se');
  await expect(page.getByTestId('tisk-hlavicka')).toContainText('Dávení zapsáno 1×');

  // Oprava záznamu: dávení jde zase odškrtnout a zmizí všude.
  await page.goto('./#/suroviny/brokolice');
  await historie.getByRole('button', { name: /Upravit ochutnávku/ }).click();
  await page.getByTestId('ochutnavka-davilo').click();
  await page.getByTestId('ochutnavka-ulozit').click();
  await expect(historie).not.toContainText('dávilo se');
  await navLink(page, 'Deník').click();
  await expect(page.getByTestId('daveni-zadne')).toBeVisible();
});

test('opakované dávení u jedné suroviny odkáže na tvar sousta', async ({ page }) => {
  await acceptDisclaimer(page);
  await zalozDite(page, 'Ema', narozeniPred(7));

  await page.goto('./#/suroviny/mrkev');
  for (let i = 0; i < 2; i += 1) {
    await page.getByTestId('ochutnano-mrkev').click();
    await page.getByTestId('ochutnavka-davilo').click();
    await page.getByTestId('ochutnavka-ulozit').click();
  }
  await navLink(page, 'Deník').click();
  const opakovane = page.getByTestId('daveni-opakovane');
  await expect(opakovane).toContainText('mrkev');
  await expect(opakovane).toContainText('2×');
  await opakovane.getByRole('link', { name: 'Průvodce tvarem sousta' }).click();
  await expect(page.getByTestId('ukazky-tvaru')).toBeVisible();
});

test('průvodce tvarem sousta: úchop podle dítěte, obrázky a pokyn z katalogu', async ({ page }) => {
  await acceptDisclaimer(page);
  await zalozDite(page, 'Ema', narozeniPred(10));

  await navLink(page, 'Domů').click();
  await page.getByTestId('domu-tvar-sousta').click();

  // Desetiměsíční dítě bez nastaveného úchopu: odhad podle věku.
  const nuzkovy = page.getByTestId('pruvodce-uchop-nuzkovy');
  await expect(nuzkovy).toHaveAttribute('aria-pressed', 'true');
  await expect(nuzkovy).toContainText('podle věku');
  await expect(
    page.getByTestId('pruvodce-uchop').getByRole('img', { name: /Hranolky a k nim větší kousky/ }),
  ).toBeVisible();

  await page.getByTestId('pruvodce-uchop-dlanovy').click();
  await expect(page.getByTestId('pruvodce-tvar')).toContainText('čouhal z pěsti');
  await expect(page).toHaveURL(/uchop=dlanovy/);

  // Fáze podle věku je 9m+ a pokyn je doslova ten z katalogu.
  await expect(page.getByTestId('faze-9m')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByTestId('ukazka-pokyn-kulate-plody')).toHaveText(pokyn('hroznove-vino', '9m'));
  await page.getByTestId('faze-6m').click();
  await expect(page.getByTestId('ukazka-pokyn-korenova-zelenina')).toHaveText(pokyn('mrkev', '6m'));
  const ukazka = page.getByTestId('ukazka-kulate-plody');
  await expect(ukazka.getByRole('img', { name: /podélně na čtyři/ })).toBeVisible();
  await expect(ukazka.getByRole('img', { name: 'Celá kulička hroznu' })).toBeVisible();

  // Cesta z detailu suroviny.
  await page.goto('./#/suroviny/jablko');
  await page.getByTestId('odkaz-tvar-sousta').click();
  await expect(page.getByTestId('ukazky-tvaru')).toBeVisible();
});

test('co dnes jíme my: dětská porce z rodinného jídla a zápis do deníku', async ({ page }) => {
  await acceptDisclaimer(page);
  await zalozDite(page, 'Ema', narozeniPred(7));

  await page.goto('./#/recepty');
  await page.getByTestId('recepty-jime-my').click();
  await expect(page.getByTestId('jime-prazdno')).toBeVisible();

  await page.getByTestId('jime-jidlo-kure-s-bramborem').click();
  // Sůl do porce do roka nepatří a dá se odebrat dřív, než se přidá.
  const sul = page.getByTestId('jime-ne-sul');
  await expect(sul).toContainText('Až od 12 měsíců');
  await expect(sul).toContainText('odeber dřív');
  await expect(page.getByTestId('jime-pokyn-kureci-stehno')).toContainText(pokyn('kureci-stehno', '6m'));
  await expect(page.getByTestId('jime-porce-mrkev')).toContainText('Vysoké riziko dušení');

  // Výběr je v adrese: přežije znovunačtení.
  await page.reload();
  await expect(page.getByTestId('jime-ne-sul')).toBeVisible();

  // Přidat hledáním a odebrat.
  await page.getByTestId('jime-hledat').fill('avok');
  await page.getByTestId('jime-pridat-avokado').click();
  await expect(page.getByTestId('jime-porce-avokado')).toBeVisible();
  await page.getByTestId('jime-odebrat-sul').click();
  await expect(page.getByTestId('jime-ne-sul')).toHaveCount(0);

  // Surovina mimo katalog se neposuzuje.
  await page.getByTestId('jime-hledat').fill('xyzzy');
  await expect(page.getByTestId('jime-nenalezeno')).toBeVisible();
  await page.getByTestId('jime-hledat').fill('');

  // Zápis do deníku jen toho, co dítě opravdu jedlo.
  await page.getByTestId('jime-zapsat').click();
  for (const id of ['brambor', 'mrkev', 'olej-olivovy', 'rozmaryn', 'avokado']) {
    await page.getByTestId(`jime-zapsat-${id}`).uncheck();
  }
  await page.getByTestId('ochutnavka-ulozit').click();
  await expect(page.getByTestId('jime-zapsano')).toContainText('Zapsáno do deníku: 1');

  await navLink(page, 'Deník').click();
  await expect(page.getByTestId('casova-osa')).toContainText('kuřecí stehno');
  await expect(page.getByTestId('casova-osa')).not.toContainText('brambor');
});

test('co dnes jíme my: alergie dítěte a nové alergeny', async ({ page }) => {
  await acceptDisclaimer(page);
  await zalozDite(page, 'Ema', narozeniPred(7));

  await page.goto('./#/jime-my?s=vejce-slepici,kravske-mleko,mouka-psenicna-hladka');
  // Nic není zavedené: víc nových alergenů naráz se ohlásí.
  await expect(page.getByTestId('jime-vic-alergenu')).toBeVisible();
  await expect(page.getByTestId('jime-porce-vejce-slepici')).toContainText('nemá zavedený');
});
