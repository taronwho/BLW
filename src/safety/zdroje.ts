import type { Catalog, Ingredient, SourceRef, TemaZdroje } from '@/types';
import { rozdilVMesicich, rozeberIsoDatum } from '@/text/datum';
import { sklonuj, SUROVINA } from '@/text/sklonovani';
import type { Severity } from './types';

/**
 * Zdroje jako celek — co jednotlivá pravidla vidět nemůžou.
 *
 * `source-required` a `source-url-shape` kontrolují jednu položku: má
 * dost odkazů a vedou na povolenou doménu. Ani jedno neodpoví na otázku,
 * kterou položil audit ze 17. 9. 2026: jestli celý katalog nestojí na
 * hrstce obecných stránek a jestli je někdo od té doby otevřel.
 *
 * Proto tahle vrstva počítá napříč katalogem.
 *
 * **Od 24. 9. 2026 se neměří rozmanitost, ale doložení.** Dřív tu byl
 * strop 50 položek na jeden odkaz. Hlídal správný problém — obecná stránka
 * o příkrmech nedokládá nic konkrétního o topinamburu — jenže nepřímo:
 * tlačil ke střídání domén, a víc úřadů z víc zemí znamená víc rozporů
 * v doporučeních, ne víc bezpečí. Rozhodnutí vlastníka je doložit
 * **riziková tvrzení** stránkou, která o tom riziku opravdu mluví
 * (`claim-source-topic`), a obecná tvrzení o přípravě nechat na obecných
 * stránkách. Pořadí zdrojů a řešení rozporů je v docs/BEZPECNOST.md kap. 1.
 */

/**
 * Ode dne, kdy vzniklo pravidlo o tématech. Štítek `doklada` smí mít jen
 * zdroj přečtený tento den nebo později — štítek je tvrzení o obsahu
 * stránky a nikdo ho nesmí dopsat bez toho, aby ji znovu otevřel.
 */
export const DATUM_PRAVIDLA_TEMAT = '2026-09-24';

/**
 * Jak vážné je rizikové tvrzení bez zdroje, který o riziku mluví.
 *
 * Zatím varování, protože katalog štítky teprve dostává. Až bude
 * `nedolozenaTvrzeni` na nule, přepne se na `'error'` a build pak nové
 * nedoložené tvrzení nepustí. Přepnutí je zpřísnění, ne oslabení.
 */
export const ZAVAZNOST_TEMAT: Severity = 'warning';

/**
 * Kolik nedoložených rizikových tvrzení katalog nejvýš smí mít.
 *
 * Západka: číslo se po každé dávce práce snižuje na nový stav a nikdy
 * nezvyšuje, takže nová surovina bez doložení rizika neprojde ani teď,
 * dokud je pravidlo jen varování. Test v tests/safety/zdroje.test.ts.
 */
export const STROP_NEDOLOZENYCH = 184;

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

/** Riziková tvrzení suroviny: hazardy, alergeny a vysoké riziko dušení. */
export function temataSuroviny(surovina: Ingredient): TemaZdroje[] {
  return [
    ...surovina.hazards,
    ...surovina.allergens,
    ...(surovina.chokingRisk === 'high' ? (['duseni'] as const) : []),
  ];
}

export interface NedolozeneTvrzeni {
  surovina: string;
  tema: TemaZdroje;
}

/**
 * Riziková tvrzení, u kterých žádný zdroj suroviny nemá dané téma
 * v `doklada`.
 */
export function nedolozenaTvrzeni(catalog: Catalog): NedolozeneTvrzeni[] {
  const out: NedolozeneTvrzeni[] = [];
  for (const surovina of catalog.ingredients) {
    const dolozena = new Set<TemaZdroje>(surovina.sources.flatMap((s) => s.doklada ?? []));
    for (const tema of temataSuroviny(surovina)) {
      if (!dolozena.has(tema)) out.push({ surovina: surovina.id, tema });
    }
  }
  return out;
}

export interface DolozeniTematu {
  tema: TemaZdroje;
  /** Kolik surovin tvrzení nese. */
  surovin: number;
  /** U kolika z nich je doložené zdrojem s tímhle tématem. */
  dolozeno: number;
}

/** Přehled po tématech — pro tabulku ve `validate:data`. */
export function dolozeniPodleTemat(catalog: Catalog): DolozeniTematu[] {
  const podleTematu = new Map<TemaZdroje, DolozeniTematu>();
  const chybi = new Set(nedolozenaTvrzeni(catalog).map((n) => `${n.surovina}|${n.tema}`));
  for (const surovina of catalog.ingredients) {
    for (const tema of temataSuroviny(surovina)) {
      const radek = podleTematu.get(tema) ?? { tema, surovin: 0, dolozeno: 0 };
      radek.surovin += 1;
      if (!chybi.has(`${surovina.id}|${tema}`)) radek.dolozeno += 1;
      podleTematu.set(tema, radek);
    }
  }
  return [...podleTematu.values()].sort(
    (a, b) => b.surovin - b.dolozeno - (a.surovin - a.dolozeno) || a.tema.localeCompare(b.tema),
  );
}

function vsechnyZdroje(catalog: Catalog): SourceRef[] {
  return vsechnyPolozky(catalog).flatMap((polozka) => [...polozka.sources]);
}

/**
 * Nálezy o zdrojích napříč katalogem.
 *
 * `dnes` se předává, aby šlo pravidlo testovat — jinak by test na stáří
 * odkazů začal padat sám od sebe někdy za rok.
 */
export function zkontrolujZdroje(catalog: Catalog, dnes: string): KatalogovyNalez[] {
  const nalezy: KatalogovyNalez[] = [];

  // Rizikové tvrzení bez zdroje, který o riziku mluví. Jeden nález na
  // téma, ne na surovinu: práce se dělá po tématech (najdi stránku
  // o dusičnanech, přečti ji, přiřaď), a sto řádků by výpis zahltilo.
  const podleTematu = new Map<TemaZdroje, string[]>();
  for (const { surovina, tema } of nedolozenaTvrzeni(catalog)) {
    podleTematu.set(tema, [...(podleTematu.get(tema) ?? []), surovina]);
  }
  for (const [tema, suroviny] of [...podleTematu].sort((a, b) => b[1].length - a[1].length)) {
    const ukazka = suroviny.slice(0, 8).join(', ');
    const zbytek = suroviny.length > 8 ? ` a dalších ${suroviny.length - 8}` : '';
    nalezy.push({
      ruleId: 'claim-source-topic',
      severity: ZAVAZNOST_TEMAT,
      message:
        `Téma „${tema}": ${sklonuj(suroviny.length, SUROVINA)} bez zdroje, který o něm mluví ` +
        `(doklada). ${ukazka}${zbytek}`,
    });
  }

  // Štítek je tvrzení o obsahu stránky. Bez nového přečtení se nepřidává.
  const staraSeStitkem = new Map<string, SourceRef>();
  for (const zdroj of vsechnyZdroje(catalog)) {
    if ((zdroj.doklada ?? []).length > 0 && zdroj.accessedAt < DATUM_PRAVIDLA_TEMAT) {
      staraSeStitkem.set(zdroj.url, zdroj);
    }
  }
  for (const zdroj of staraSeStitkem.values()) {
    nalezy.push({
      ruleId: 'source-topic-reread',
      severity: 'error',
      message:
        `Odkaz „${zdroj.title}" má štítky ${JSON.stringify(zdroj.doklada)}, ale je ověřený ` +
        `${zdroj.accessedAt}. Štítek smí mít jen stránka přečtená ${DATUM_PRAVIDLA_TEMAT} nebo později: ${zdroj.url}`,
    });
  }

  // Tatáž stránka musí mít všude tytéž štítky — je to vlastnost stránky,
  // ne suroviny. Jinak by jedna surovina tvrdila o stránce něco jiného
  // než druhá.
  const stitkyUrl = new Map<string, Set<string>>();
  for (const zdroj of vsechnyZdroje(catalog)) {
    const klic = [...(zdroj.doklada ?? [])].sort().join(',');
    stitkyUrl.set(zdroj.url, (stitkyUrl.get(zdroj.url) ?? new Set<string>()).add(klic));
  }
  for (const [url, varianty] of stitkyUrl) {
    if (varianty.size > 1) {
      nalezy.push({
        ruleId: 'source-topic-consistent',
        severity: 'error',
        message: `Odkaz má na různých místech různé štítky (${[...varianty].map((v) => `[${v}]`).join(' / ')}). Zdroj definuj jednou v _sources.ts: ${url}`,
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
