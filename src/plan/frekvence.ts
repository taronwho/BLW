/**
 * Kolikrát denně plán nabídne jídlo.
 *
 * Opřeno o dva zdroje, které se shodují v tvaru, ale liší v podrobnosti:
 *
 *  - NHS: kolem šesti měsíců stačí malé množství jídla jednou denně; mezi
 *    sedmým a devátým měsícem se dítě postupně dostává na tři jídla denně;
 *    od desátého měsíce už na tři jídla zvyklé je; po roce k nim přibývají
 *    dvě svačiny.
 *  - WHO: dvě až tři jídla denně mezi šestým a osmým měsícem, tři až čtyři
 *    mezi devátým a dvacátým třetím, k tomu jedna až dvě svačiny podle
 *    potřeby.
 *
 * Plán z toho bere spodní, opatrnější hranici. Počet jídel proto řídí dvě
 * věci naráz: jak dlouho už dítě jí a kolik je mu měsíců. Rozběh platí jen
 * pro první blok, protože v dalších už dítě jíst umí.
 */

/** Dokud dítě jí kratší dobu než tohle, plán přidává jídla postupně. */
const ROZBEH: readonly { doDne: number; jidel: number }[] = [
  { doDne: 7, jidel: 1 },
  { doDne: 14, jidel: 2 },
];

export interface FrekvenceJidel {
  /** Hlavní jídla dne. */
  jidel: number;
  /** Svačiny navíc. */
  svacin: number;
}

/** Strop podle věku. Mladší dítě nedostane tři jídla, i kdyby už jedlo měsíc. */
function stropPodleVeku(mesice: number | null): number {
  if (mesice === null) return 2;
  if (mesice < 7) return 2;
  return 3;
}

/** Svačiny se přidávají až po prvních narozeninách. */
function svacinyPodleVeku(mesice: number | null): number {
  return mesice !== null && mesice >= 12 ? 2 : 0;
}

export function frekvence(denPlanu: number, blok: number, mesice: number | null): FrekvenceJidel {
  const strop = stropPodleVeku(mesice);
  const rozbeh =
    blok > 1 ? strop : (ROZBEH.find((krok) => denPlanu <= krok.doDne)?.jidel ?? strop);
  return { jidel: Math.min(rozbeh, strop), svacin: svacinyPodleVeku(mesice) };
}
