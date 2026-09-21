import { ingredientById } from '@/data';
import { KEY_ALLERGENS } from '@/types';
import type { AllergenGroup, Child, HouseholdState } from '@/types';
import { activeTastings, isAdverse } from './tastings';
import { ALLERGEN_LABELS, AMOUNT_LABELS, REACTION_LABELS } from './labels';

/**
 * Deník v podobě, kterou jde vytisknout a vzít k pediatrovi.
 *
 * Kvůli tomuhle se deník vede. Záloha v JSONu je pro aplikaci, ne pro
 * člověka: v ordinaci nikdo nebude scrollovat mobil a lékař potřebuje
 * vidět naráz, co dítě jedlo, kdy, kolik a jestli po tom něco bylo
 * (audit 17. 9. 2026, kapitola 10 bod 3).
 *
 * Výpis je **záznam, ne diagnóza**. Nic se v něm nevyhodnocuje a nic se
 * nedoporučuje — to by bylo proti pravidlu 6 z CLAUDE.md. Jen se seřadí,
 * co rodič sám zapsal.
 */

/** Kolik expozic bez reakce dělá alergen zavedeným — stejné číslo jako v deníku. */
export const EXPOZIC_PRO_ZAVEDENI = 3;

export interface VypisRadek {
  /** ISO datum, kvůli řazení. */
  datum: string;
  surovina: string;
  mnozstvi: string;
  reakce: string;
  poznamka: string;
  /** Kožní, trávicí nebo jiná reakce — to, kvůli čemu se k lékaři jde. */
  nezadouci: boolean;
}

export interface VypisAlergenu {
  skupina: AllergenGroup;
  nazev: string;
  expozic: number;
  /** Expozice bez nežádoucí reakce. */
  bezReakce: number;
  posledni: string | null;
  zavedeny: boolean;
}

export interface DenikVypis {
  dite: string;
  narozeni: string | null;
  odKdy: string | null;
  doKdy: string | null;
  /** Od nejstarší ochutnávky po nejnovější — pediatr čte po časové ose. */
  radky: VypisRadek[];
  nezadouci: VypisRadek[];
  alergeny: VypisAlergenu[];
  /** Kolik různých surovin dítě zkusilo. */
  surovin: number;
}

/**
 * Surovina, která v katalogu není, se nezahazuje.
 *
 * Záznam mohl vzniknout v novější verzi aplikace nebo po přejmenování
 * idčka; zahodit ho by znamenalo ukázat lékaři neúplný deník. Místo
 * jména se ukáže idčko, ať je poznat, že něco chybí.
 */
function nazevSuroviny(ingredientId: string): string {
  return ingredientById.get(ingredientId)?.nameCz ?? ingredientId;
}

export function sestavVypis(
  state: HouseholdState,
  dite: Child | null,
): DenikVypis {
  const udalosti = [...activeTastings(state, dite?.id ?? null)].sort((a, b) =>
    a.date === b.date ? a.createdAt - b.createdAt : a.date < b.date ? -1 : 1,
  );

  const radky: VypisRadek[] = udalosti.map((event) => ({
    datum: event.date,
    surovina: nazevSuroviny(event.ingredientId),
    mnozstvi: AMOUNT_LABELS[event.amount],
    reakce: REACTION_LABELS[event.reaction],
    poznamka: event.note ?? '',
    nezadouci: isAdverse(event),
  }));

  const alergeny: VypisAlergenu[] = KEY_ALLERGENS.map((skupina) => {
    const expozice = udalosti.filter((event) =>
      ingredientById.get(event.ingredientId)?.allergens.includes(skupina),
    );
    const bezReakce = expozice.filter((event) => !isAdverse(event));
    return {
      skupina,
      nazev: ALLERGEN_LABELS[skupina],
      expozic: expozice.length,
      bezReakce: bezReakce.length,
      posledni: expozice.at(-1)?.date ?? null,
      zavedeny: bezReakce.length >= EXPOZIC_PRO_ZAVEDENI,
    };
  });

  return {
    dite: dite?.name ?? 'Dítě',
    narozeni: dite?.birthDate ?? null,
    odKdy: radky[0]?.datum ?? null,
    doKdy: radky.at(-1)?.datum ?? null,
    radky,
    nezadouci: radky.filter((radek) => radek.nezadouci),
    alergeny,
    surovin: new Set(udalosti.map((event) => event.ingredientId)).size,
  };
}
