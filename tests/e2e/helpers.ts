import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';

/** Obrazovky z docs/SPEC.md kapitola 4, v pořadí, v jakém je testy procházejí. */
export interface ScreenDef {
  id: string;
  name: string;
  /** Dostane se na obrazovku z čisté aplikace po odklepnutí disclaimeru. */
  open: (page: Page) => Promise<void>;
}

export async function acceptDisclaimer(page: Page): Promise<void> {
  await page.goto('./');
  const accept = page.getByTestId('disclaimer-accept');
  await accept.click();
  await expect(page.getByTestId('disclaimer')).toBeHidden();
}

/**
 * Rozbalí panel s podrobnými filtry.
 *
 * Kategorie a řazení jsou na obrazovce pořád, zbytek filtrů je schovaný pod
 * tlačítkem, aby rodič viděl na první obrazovce i karty, ne jen ovládání.
 * Opakované volání panel nezavírá.
 */
export async function otevriFiltry(page: Page, seznam: 'receptu' | 'surovin'): Promise<void> {
  const prepinac = page.getByTestId(`filtry-${seznam}-prepinac`);
  if ((await prepinac.getAttribute('aria-expanded')) !== 'true') await prepinac.click();
}

/**
 * Odkaz ve spodní navigaci. Rozcestník na úvodní obrazovce nabízí stejné
 * názvy, takže samotné `getByRole('link')` trefí dva prvky naráz.
 */
export function navLink(page: Page, name: string): ReturnType<Page['getByRole']> {
  return page.getByRole('navigation', { name: 'Hlavní navigace' }).getByRole('link', { name });
}

/** Domácnost visí v hlavičce u jména dítěte, ve spodní navigaci není. */
export function householdLink(page: Page): ReturnType<Page['getByTestId']> {
  return page.getByTestId('dite-v-hlavicce');
}

/**
 * Přejde do Domácnosti a otevře daný okruh.
 *
 * Obrazovka je rozdělená na Děti / Sdílení / Aplikace, aby se na ní nemuselo
 * scrollovat přes celé nastavení kvůli párovacímu kódu.
 */
export async function otevriDomacnost(page: Page, sekce: 'deti' | 'sdileni' | 'aplikace'): Promise<void> {
  await page.goto(`./#/domacnost?sekce=${sekce}`);
  await expect(page.getByTestId(`sekce-${sekce}`)).toHaveAttribute('aria-current', 'page');
}

export const SCREENS: readonly ScreenDef[] = [
  {
    id: 'suroviny',
    name: 'Suroviny',
    open: async (page) => {
      await navLink(page, 'Suroviny').click();
      await expect(page.getByTestId('seznam-surovin')).toBeVisible();
    },
  },
  {
    id: 'detail-suroviny',
    name: 'Detail suroviny',
    open: async (page) => {
      await navLink(page, 'Suroviny').click();
      await page.getByTestId('hledat-surovinu').fill('brokolice');
      await page.getByTestId('seznam-surovin').getByRole('link').first().click();
      await expect(page.getByTestId('bezpecnostni-blok')).toBeVisible();
    },
  },
  {
    id: 'recepty',
    name: 'Recepty',
    open: async (page) => {
      await navLink(page, 'Recepty').click();
      await expect(page.getByTestId('seznam-receptu')).toBeVisible();
    },
  },
  {
    id: 'detail-receptu',
    name: 'Detail receptu',
    open: async (page) => {
      await navLink(page, 'Recepty').click();
      await page.getByTestId('seznam-receptu').getByRole('link').first().click();
      await expect(page.getByTestId('moment-odebrani')).toBeVisible();
    },
  },
  {
    id: 'denik',
    name: 'Deník',
    open: async (page) => {
      await navLink(page, 'Deník').click();
      await expect(page.getByTestId('pocet-ochutnanych')).toBeVisible();
    },
  },
  {
    id: 'domacnost-deti',
    // Domácnost je rozdělená na tři okruhy a každý se kontroluje zvlášť 
    // jinak by přetečení nebo malý dotykový cíl v jednom z nich prošel.
    name: 'Domácnost, děti',
    open: async (page) => {
      await otevriDomacnost(page, 'deti');
      await expect(page.getByTestId('jmeno-ditete')).toBeVisible();
    },
  },
  {
    id: 'domacnost-sdileni',
    name: 'Domácnost, sdílení',
    open: async (page) => {
      await otevriDomacnost(page, 'sdileni');
      await expect(page.getByTestId('stav-synchronizace')).toBeVisible();
    },
  },
  {
    id: 'domacnost-aplikace',
    name: 'Domácnost, aplikace',
    open: async (page) => {
      await otevriDomacnost(page, 'aplikace');
      await expect(page.getByTestId('pocet-k-revizi')).toBeVisible();
    },
  },
];

/**
 * Založí dítě, aby šlo nastavovat, co k němu patří.
 *
 * Připravenost, úchop ani alergie nejdou zadat, dokud žádné dítě není 
 * a to je správně, patří dítěti, ne domácnosti.
 */
export async function zalozDite(page: Page, jmeno: string, narozeni: string): Promise<void> {
  await otevriDomacnost(page, 'deti');
  await page.getByTestId('jmeno-ditete').fill(jmeno);
  await page.getByTestId('datum-narozeni').fill(narozeni);
  await page.getByTestId('ulozit-dite').first().click();
  await expect(page.getByTestId('seznam-deti')).toContainText(jmeno);
}

export interface TooSmallTarget {
  tag: string;
  text: string;
  width: number;
  height: number;
}

/**
 * Dotykové cíle < 44 px (docs/SPEC.md kap. 6). Prvky schované jen pro čtečku
 * obrazovky (`.sr-info`, `.sr-only`) se neměří, prstem se na ně nemíří.
 */
export async function tooSmallTargets(page: Page): Promise<TooSmallTarget[]> {
  return page.evaluate(() => {
    const selector = 'a[href], button, input:not([type="hidden"]), select, textarea, [role="button"]';
    const bad: { tag: string; text: string; width: number; height: number }[] = [];
    for (const element of Array.from(document.querySelectorAll(selector))) {
      if (element.classList.contains('sr-only') || element.closest('.sr-only') !== null) continue;
      const style = window.getComputedStyle(element);
      if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') continue;
      const rect = element.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) continue;
      if (rect.width < 44 || rect.height < 44) {
        bad.push({
          tag: element.tagName.toLowerCase(),
          text: (element.textContent ?? '').trim().slice(0, 40),
          width: Math.round(rect.width * 10) / 10,
          height: Math.round(rect.height * 10) / 10,
        });
      }
    }
    return bad;
  });
}

/** Šířka dokumentu proti šířce viewportu, jakýkoli přesah je chyba. */
export async function horizontalOverflow(page: Page): Promise<number> {
  return page.evaluate(() =>
    Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
  );
}
