import type { HouseholdState } from '@/types';

/**
 * Souhrn o používání aplikace.
 *
 * Počítá se ze stavů domácností, ale ven nepouští nic osobního: žádná jména
 * dětí, žádné párovací kódy, žádné poznámky ani jednotlivé ochutnávky.
 * Jsou to jen počty, protože na otázku „kolik lidí to používá“ nic jiného
 * potřeba není.
 */
export interface Prehled {
  domacnosti: number;
  /** Domácnosti, ve kterých je aspoň jedna ochutnávka. */
  aktivniDomacnosti: number;
  zarizeni: number;
  domacnostiSViceZarizenimi: number;
  deti: number;
  domacnostiBezDitete: number;
  ochutnavky: number;
  smazaneOchutnavky: number;
  oblibene: number;
  poznamkyURecepu: number;
  /** Počty podle verze datového schématu. */
  schemata: Record<string, number>;
  /** Jak se která zařízení hlásí (nainstalovaná aplikace, prohlížeč v chatu). */
  zarizeniPodleTypu: Record<string, number>;
  /** Kolik dětí je v které fázi příkrmu. */
  detiPodleFaze: Record<string, number>;
  /** Kolikrát se která surovina objevila v denících. Nejčastějších dvacet. */
  nejcastejsiSuroviny: { id: string; pocet: number }[];
  /** Domácnosti, kde se aspoň jedno zařízení hlásilo v posledních dnech. */
  aktivniZa7Dni: number;
  aktivniZa30Dni: number;
}

const DEN = 24 * 60 * 60 * 1000;

function faze(birthDate: string, ted: number): string {
  const narozeni = Date.parse(birthDate);
  if (Number.isNaN(narozeni)) return 'bez data narození';
  const mesice = Math.floor((ted - narozeni) / (30.44 * DEN));
  if (mesice < 0) return 'ještě se nenarodilo';
  if (mesice < 6) return 'do 6 měsíců';
  if (mesice < 9) return '6 až 9 měsíců';
  if (mesice < 12) return '9 až 12 měsíců';
  if (mesice < 24) return '12 až 24 měsíců';
  return 'nad 2 roky';
}

export function spocitejPrehled(stavy: readonly HouseholdState[], ted = Date.now()): Prehled {
  const prehled: Prehled = {
    domacnosti: stavy.length,
    aktivniDomacnosti: 0,
    zarizeni: 0,
    domacnostiSViceZarizenimi: 0,
    deti: 0,
    domacnostiBezDitete: 0,
    ochutnavky: 0,
    smazaneOchutnavky: 0,
    oblibene: 0,
    poznamkyURecepu: 0,
    schemata: {},
    zarizeniPodleTypu: {},
    detiPodleFaze: {},
    nejcastejsiSuroviny: [],
    aktivniZa7Dni: 0,
    aktivniZa30Dni: 0,
  };
  const podleSuroviny = new Map<string, number>();

  for (const stav of stavy) {
    const clenove = stav.members.length;
    prehled.zarizeni += clenove;
    if (clenove > 1) prehled.domacnostiSViceZarizenimi += 1;

    const verze = String(stav.schemaVersion);
    prehled.schemata[verze] = (prehled.schemata[verze] ?? 0) + 1;

    for (const uid of stav.members) {
      const popis = stav.memberLabels?.[uid] ?? 'neznámé';
      prehled.zarizeniPodleTypu[popis] = (prehled.zarizeniPodleTypu[popis] ?? 0) + 1;
    }

    const deti = Object.values(stav.children)
      .map((zaznam) => zaznam.hodnota)
      .filter((dite): dite is NonNullable<typeof dite> => dite !== null);
    prehled.deti += deti.length;
    if (deti.length === 0) prehled.domacnostiBezDitete += 1;
    for (const dite of deti) {
      const klic = faze(dite.birthDate, ted);
      prehled.detiPodleFaze[klic] = (prehled.detiPodleFaze[klic] ?? 0) + 1;
    }

    let zive = 0;
    for (const zaznam of stav.tastings) {
      if (zaznam.deleted === true) {
        prehled.smazaneOchutnavky += 1;
        continue;
      }
      zive += 1;
      podleSuroviny.set(zaznam.ingredientId, (podleSuroviny.get(zaznam.ingredientId) ?? 0) + 1);
    }
    prehled.ochutnavky += zive;
    if (zive > 0) prehled.aktivniDomacnosti += 1;

    prehled.oblibene += Object.values(stav.favorites).filter((one) => one.hodnota).length;
    prehled.poznamkyURecepu += Object.values(stav.recipeNotes).filter(
      (one) => one.hodnota.trim().length > 0,
    ).length;

    const casy = Object.values(stav.memberSeenAt ?? {});
    const naposled = casy.length === 0 ? 0 : Math.max(...casy);
    if (naposled > 0) {
      if (ted - naposled <= 7 * DEN) prehled.aktivniZa7Dni += 1;
      if (ted - naposled <= 30 * DEN) prehled.aktivniZa30Dni += 1;
    }
  }

  prehled.nejcastejsiSuroviny = [...podleSuroviny.entries()]
    .map(([id, pocet]) => ({ id, pocet }))
    .sort((a, b) => (b.pocet === a.pocet ? a.id.localeCompare(b.id) : b.pocet - a.pocet))
    .slice(0, 20);

  return prehled;
}
