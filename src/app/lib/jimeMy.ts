import { nutrientProfile } from '@/data/nutrients';
import { KEY_ALLERGENS } from '@/types';
import type { AllergenGroup, Ingredient, TastingEvent } from '@/types';
import { isAdverse } from './tastings';

/**
 * „Co dnes jíme my" — dětská porce z jídla, které rodina vaří.
 *
 * To je samotný princip BLW: dítě jí totéž co rodina, jen upravené. Rodič
 * vybere suroviny svého jídla a aplikace ke každé řekne, jestli ji dítě
 * může, jak ji pro něj upravit a na co si dát pozor.
 *
 * Modul **nepřidává žádné vlastní zdravotní tvrzení**. Rozhoduje jen podle
 * toho, co už je v katalogu doložené (`minAgeMonths`, `chokingRisk`,
 * `reviewStatus`, alergeny) a co rodič sám zapsal (alergie dítěte, vyřazené
 * suroviny, reakce v deníku). Pokyny k úpravě se čtou z katalogu.
 */

export type Verdikt = 'ano' | 'pozor' | 'ne';

/** Proč surovina do dětské porce nepatří. */
export type DuvodNe = 'vek' | 'alergie' | 'reakce' | 'vyrazena';

/** Proč se u suroviny zastavit, i když ji dítě může. */
export type DuvodPozor = 'duseni' | 'novy-alergen' | 'k-revizi';

export interface PosudekSuroviny {
  ingredient: Ingredient;
  verdikt: Verdikt;
  ne: DuvodNe[];
  pozor: DuvodPozor[];
  /** Klíčové alergeny suroviny, které dítě ještě nemá zavedené. */
  noveAlergeny: AllergenGroup[];
  /** Alergeny suroviny, které rodič zapsal u dítěte. */
  alergieDitete: AllergenGroup[];
}

export interface VstupPosudku {
  /** Věk v měsících; `null`, když datum narození chybí. */
  months: number | null;
  alergieDitete: readonly AllergenGroup[];
  vyrazene: readonly string[];
  /** Suroviny, po kterých je v deníku naposledy reakce. */
  sReakci: ReadonlySet<string>;
  /** Kolik expozic bez reakce má dítě u každé alergenové skupiny. */
  expozice: ReadonlyMap<AllergenGroup, number>;
}

/** Kolik expozic bez reakce dělá alergen zavedeným — stejné číslo jako v deníku. */
export const EXPOZIC_PRO_ZAVEDENI = 3;

const KLICOVE: ReadonlySet<AllergenGroup> = new Set(KEY_ALLERGENS);

/**
 * Expozice bez reakce po alergenových skupinách.
 *
 * Počítají se jen ochutnávky bez nežádoucí reakce, stejně jako „zavedený"
 * v deníku: po reakci alergen zavedený není, ať se ho dítě dotklo kolikrát.
 */
export function expoziceBezReakce(
  udalosti: readonly TastingEvent[],
  surovina: (id: string) => Ingredient | undefined,
): Map<AllergenGroup, number> {
  const out = new Map<AllergenGroup, number>();
  for (const udalost of udalosti) {
    if (udalost.deleted === true || isAdverse(udalost)) continue;
    for (const skupina of surovina(udalost.ingredientId)?.allergens ?? []) {
      out.set(skupina, (out.get(skupina) ?? 0) + 1);
    }
  }
  return out;
}

export function posudSurovinu(item: Ingredient, vstup: VstupPosudku): PosudekSuroviny {
  const ne: DuvodNe[] = [];
  const pozor: DuvodPozor[] = [];

  // Bez data narození se počítá s nejmladším dítětem, které příkrm dostává
  // (stejně jako filtr „Vhodné teď"). Opačná volba by bez věku pustila do
  // porce med i sůl.
  if ((vstup.months ?? 6) < item.minAgeMonths) ne.push('vek');

  const alergieDitete = item.allergens.filter((skupina) => vstup.alergieDitete.includes(skupina));
  if (alergieDitete.length > 0) ne.push('alergie');
  if (vstup.sReakci.has(item.id)) ne.push('reakce');
  if (vstup.vyrazene.includes(item.id)) ne.push('vyrazena');

  const noveAlergeny = item.allergens.filter(
    (skupina) => KLICOVE.has(skupina) && (vstup.expozice.get(skupina) ?? 0) < EXPOZIC_PRO_ZAVEDENI,
  );
  if (noveAlergeny.length > 0) pozor.push('novy-alergen');
  if (item.chokingRisk === 'high') pozor.push('duseni');
  if (item.reviewStatus === 'needs-review') pozor.push('k-revizi');

  const verdikt: Verdikt = ne.length > 0 ? 'ne' : pozor.length > 0 ? 'pozor' : 'ano';
  return { ingredient: item, verdikt, ne, pozor, noveAlergeny, alergieDitete };
}

export interface SouhrnJidla {
  ano: PosudekSuroviny[];
  pozor: PosudekSuroviny[];
  ne: PosudekSuroviny[];
  /**
   * Nové klíčové alergeny v tom, co dítě z jídla dostane. Víc než jeden
   * naráz znamená, že se při reakci nepozná, co ji způsobilo (rada
   * „Zavádění alergenů": po jednom, s odstupem).
   */
  noveAlergeny: AllergenGroup[];
  /** V dětské porci není žádný zdroj železa (rada „Tři pravidla každého jídla"). */
  chybiZelezo: boolean;
  /**
   * Železo je v porci jen rostlinné a chybí k němu vitamin C (rada „Jedno
   * vaření pro celou rodinu", oddíl Bezmasá domácnost).
   */
  rostlinneZelezoBezC: boolean;
}

/**
 * Souhrn celého jídla. Počítá se jen z toho, co dítě opravdu dostane —
 * surovina, která do porce nepatří, železo do ní nepřinese.
 */
export function souhrnJidla(posudky: readonly PosudekSuroviny[]): SouhrnJidla {
  const ano = posudky.filter((p) => p.verdikt === 'ano');
  const pozor = posudky.filter((p) => p.verdikt === 'pozor');
  const ne = posudky.filter((p) => p.verdikt === 'ne');
  const doPorce = [...ano, ...pozor];

  const noveAlergeny = [...new Set(doPorce.flatMap((p) => p.noveAlergeny))];

  const profily = doPorce.map((p) => nutrientProfile(p.ingredient));
  const zelezo = profily.filter((profil) => profil.iron !== 'nevyznamny');
  const hemove = zelezo.some((profil) => profil.ironForm === 'hemove');
  const vitaminC = profily.some((profil) => profil.vitaminC === 'vyznamny');

  return {
    ano,
    pozor,
    ne,
    noveAlergeny,
    chybiZelezo: doPorce.length > 0 && zelezo.length === 0,
    rostlinneZelezoBezC: zelezo.length > 0 && !hemove && !vitaminC,
  };
}

/** Pořadí v seznamu: nejdřív co vynechat, pak na co pozor, pak zbytek. */
const PORADI: Record<Verdikt, number> = { ne: 0, pozor: 1, ano: 2 };

export function seradPosudky(posudky: readonly PosudekSuroviny[]): PosudekSuroviny[] {
  return [...posudky].sort(
    (a, b) =>
      PORADI[a.verdikt] - PORADI[b.verdikt] ||
      a.ingredient.nameCz.localeCompare(b.ingredient.nameCz, 'cs'),
  );
}

/** Oddělovač idček v adrese: čárka se v idčku surovin nevyskytuje. */
export function rozeberVyber(syrovy: string, zname: (id: string) => boolean): string[] {
  const out: string[] = [];
  for (const id of syrovy.split(',')) {
    const cisty = id.trim();
    if (cisty.length > 0 && zname(cisty) && !out.includes(cisty)) out.push(cisty);
  }
  return out;
}

export function zapisVyber(ids: readonly string[]): string {
  return ids.join(',');
}
