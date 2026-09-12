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
    id: 'domacnost',
    name: 'Domácnost',
    open: async (page) => {
      await householdLink(page).click();
      await expect(page.getByTestId('stav-synchronizace')).toBeVisible();
    },
  },
];

export interface TooSmallTarget {
  tag: string;
  text: string;
  width: number;
  height: number;
}

/**
 * Dotykové cíle < 44 px (docs/SPEC.md kap. 6). Prvky schované jen pro čtečku
 * obrazovky (`.sr-info`, `.sr-only`) se neměří — prstem se na ně nemíří.
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

/** Šířka dokumentu proti šířce viewportu — jakýkoli přesah je chyba. */
export async function horizontalOverflow(page: Page): Promise<number> {
  return page.evaluate(() =>
    Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
  );
}
