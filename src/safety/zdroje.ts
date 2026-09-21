import type { Catalog, SourceRef } from '@/types';
import { rozdilVMesicich, rozeberIsoDatum } from '@/text/datum';
import type { Severity } from './types';

/**
 * Zdroje jako celek — co jednotlivá pravidla vidět nemůžou.
 *
 * `source-required` a `source-url-shape` kontrolují jednu položku: má
 * dost odkazů a vedou na povolenou doménu. Ani jedno neodpoví na otázku,
 * kterou položil audit ze 17. 9. 2026: jestli celý katalog nestojí na
 * hrstce obecných stránek a jestli je někdo od té doby otevřel.
 *
 * Proto tahle vrstva počítá napříč katalogem. Nálezy jsou **varování**,
 * ne chyby: stav se nedá spravit jedním commitem — je to práce se
 * skutečným čtením desítek stránek — a build kvůli němu nemá padat.
 * Zato je vidět v každém `npm run validate:data`, takže se na něj
 * nezapomene.
 */

/** Strop z auditu 1.2: obecná stránka nemá dokládat třetinu katalogu. */
export const STROP_POLOZEK_NA_URL = 50;

/** Po roce už „ověřeno" znamená jen „někdy jsme to otevřeli". */
export const MAX_STARI_MESICU = 12;

export interface PouzitiUrl {
  url: string;
  org: string;
  title: string;
  /** Kolik položek katalogu (surovin + receptů) odkaz cituje. */
  polozek: number;
  /** Nejstarší `accessedAt` mezi všemi výskyty odkazu. */
  overeno: string;
}

export interface PouzitiDomeny {
  domena: string;
  polozek: number;
  url: number;
}

export interface KatalogovyNalez {
  ruleId: string;
  severity: Severity;
  message: string;
}

function vsechnyPolozky(catalog: Catalog): Array<{ sources: readonly SourceRef[] }> {
  return [...catalog.ingredients, ...catalog.recipes];
}

/**
 * Kolik položek stojí na kterém odkazu.
 *
 * Počítají se položky, ne výskyty: když jedna surovina uvede tentýž odkaz
 * dvakrát, je to pořád jedna doložená surovina.
 */
export function pouzitiUrl(catalog: Catalog): PouzitiUrl[] {
  const podleUrl = new Map<string, PouzitiUrl>();
  for (const polozka of vsechnyPolozky(catalog)) {
    const videne = new Set<string>();
    for (const source of polozka.sources) {
      if (videne.has(source.url)) continue;
      videne.add(source.url);
      const zaznam = podleUrl.get(source.url);
      if (zaznam === undefined) {
        podleUrl.set(source.url, {
          url: source.url,
          org: source.org,
          title: source.title,
          polozek: 1,
          overeno: source.accessedAt,
        });
      } else {
        zaznam.polozek += 1;
        if (source.accessedAt < zaznam.overeno) zaznam.overeno = source.accessedAt;
      }
    }
  }
  return [...podleUrl.values()].sort((a, b) => b.polozek - a.polozek || a.url.localeCompare(b.url));
}

/** Totéž po doménách — z toho je vidět monokultura. */
export function pouzitiDomen(catalog: Catalog): PouzitiDomeny[] {
  const podleDomeny = new Map<string, { polozek: number; url: Set<string> }>();
  for (const polozka of vsechnyPolozky(catalog)) {
    const videne = new Set<string>();
    for (const source of polozka.sources) {
      let domena: string;
      try {
        domena = new URL(source.url).hostname.replace(/^www\./, '');
      } catch {
        continue;
      }
      const zaznam = podleDomeny.get(domena) ?? { polozek: 0, url: new Set<string>() };
      zaznam.url.add(source.url);
      if (!videne.has(domena)) {
        videne.add(domena);
        zaznam.polozek += 1;
      }
      podleDomeny.set(domena, zaznam);
    }
  }
  return [...podleDomeny.entries()]
    .map(([domena, z]) => ({ domena, polozek: z.polozek, url: z.url.size }))
    .sort((a, b) => b.polozek - a.polozek || a.domena.localeCompare(b.domena));
}

/**
 * Rozdíl dvou ISO dat v celých měsících.
 *
 * Schválně bez `Date`: `accessedAt` je kalendářní datum bez času a převod
 * přes `Date` by u půlnoci na konci měsíce záležel na pásmu prohlížeče.
 * Rozebrání i počítání bydlí v `src/text/datum.ts`, ať v repozitáři není
 * druhý parser ISO data (audit 17. 9. 2026, nález 5.2).
 */
export function stariVMesicich(overeno: string, dnes: string): number {
  const a = rozeberIsoDatum(overeno);
  const b = rozeberIsoDatum(dnes);
  if (a === null || b === null) return 0;
  return rozdilVMesicich(a, b);
}

/**
 * Varování o zdrojích napříč katalogem.
 *
 * `dnes` se předává, aby šlo pravidlo testovat — jinak by test na stáří
 * odkazů začal padat sám od sebe někdy za rok.
 */
export function zkontrolujZdroje(catalog: Catalog, dnes: string): KatalogovyNalez[] {
  const nalezy: KatalogovyNalez[] = [];

  for (const zaznam of pouzitiUrl(catalog)) {
    if (zaznam.polozek > STROP_POLOZEK_NA_URL) {
      nalezy.push({
        ruleId: 'source-url-cap',
        severity: 'warning',
        message:
          `Odkaz „${zaznam.title}" (${zaznam.org}) dokládá ${zaznam.polozek} položek, ` +
          `strop je ${STROP_POLOZEK_NA_URL}. Obecná stránka nedokládá konkrétní tvrzení: ${zaznam.url}`,
      });
    }
  }

  for (const zaznam of pouzitiUrl(catalog)) {
    const stari = stariVMesicich(zaznam.overeno, dnes);
    if (stari > MAX_STARI_MESICU) {
      nalezy.push({
        ruleId: 'source-freshness',
        severity: 'warning',
        message:
          `Odkaz „${zaznam.title}" (${zaznam.org}) je ověřený ${zaznam.overeno}, ` +
          `tedy před ${stari} měsíci, a drží ${zaznam.polozek} položek. Přečíst znovu: ${zaznam.url}`,
      });
    }
  }

  return nalezy;
}
