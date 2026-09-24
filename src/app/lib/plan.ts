import { useCallback, useMemo } from 'react';
import { useHouseholdStore } from '@/storage/householdStore';
import { ingredientById } from '@/data';
import { sestavPlan, type VstupPlanu } from '@/plan/generator';
import type { DuvodJidla, Plan, PlanDen, TypJidla } from '@/plan/typy';
import type { AllergenGroup, HouseholdState, Ingredient } from '@/types';
import { ageInMonths } from './age';
import { todayIso } from './labels';
import {
  surovinySReakci,
  tastedIds,
  tastingsByIngredient,
  vyrazeneZPlanu,
} from './tastings';
import { useAktivniDite } from './dite';

/**
 * Napojení plánu na stav domácnosti.
 *
 * Generátor sahá do celého katalogu, takže se sem smí importovat jen
 * z obrazovek, které se stahují až při otevření. Úložiště o něm neví
 * schválně: kdyby ho znalo, stáhl by si katalog i rodič, který plán nikdy
 * neotevřel.
 */

export const TYP_JIDLA_LABELS: Record<TypJidla, string> = {
  snidane: 'Snídaně',
  obed: 'Oběd',
  svacina: 'Svačina',
  vecere: 'Večeře',
};

export const DUVOD_LABELS: Record<DuvodJidla, string> = {
  'prvni-ochutnavka': 'první ochutnávka',
  'nova-surovina': 'nová surovina',
  alergen: 'opakovaný alergen',
  zelezo: 'železo',
  osvedcene: 'osvědčené',
};

/** Plán vybraného dítěte, nebo `null`, když si ho rodič ještě nesestavil. */
export function useAktivniPlan(): Plan | null {
  const dite = useAktivniDite();
  const plans = useHouseholdStore((store) => store.state.plans);
  return dite === null ? null : (plans?.[dite.id]?.hodnota ?? null);
}

export interface PlanNastroje {
  /** Sestaví blok. Jedna pro první, vyšší číslo pro pokračování. */
  sestav(blok: number, navic?: Iterable<string>, varianta?: number): Plan | null;
  /** Vstup generátoru, aby si obrazovka mohla přepočítat jediný den. */
  vstup(blok: number, navic?: Iterable<string>): VstupPlanu | null;
}

/**
 * Sestavení plánu z toho, co aplikace o dítěti ví.
 *
 * Deník rozhoduje, co je novinka: co už dítě ochutnalo, se jako nová
 * surovina znovu nenabídne. Proto se každý další blok počítá až ve chvíli,
 * kdy si o něj rodič řekne, ne dopředu.
 */
export function usePlanNastroje(): PlanNastroje {
  const dite = useAktivniDite();
  const state = useHouseholdStore((store) => store.state);
  const ochutnane = useMemo(() => tastedIds(state, dite?.id ?? null), [state, dite]);
  const vyrazene = useMemo(
    () => vyrazeneZPlanu(state, dite?.id ?? null, dite?.vyrazene ?? []),
    [state, dite],
  );
  // Alergen suroviny, po které dítě zareagovalo, plán dál sám nenabízí —
  // ani přes jinou surovinu téže skupiny. Reakce patří pediatrovi a plán
  // do té doby netlačí nic, co by s ní mohlo souviset.
  const pozastaveneAlergeny = useMemo(() => {
    const out = new Set<AllergenGroup>();
    for (const id of surovinySReakci(state, dite?.id ?? null).keys()) {
      for (const skupina of ingredientById.get(id)?.allergens ?? []) out.add(skupina);
    }
    return out;
  }, [state, dite]);

  const vstup = useCallback(
    (blok: number, navic?: Iterable<string>): VstupPlanu | null =>
      dite === null
        ? null
        : {
            dite,
            blok,
            // Dny odškrtnuté bez zápisu do deníku se počítají taky. Kdo
            // odškrtává bez zapisování, by jinak v dalším bloku dostal
            // tytéž novinky znovu.
            ochutnane: navic === undefined ? ochutnane : new Set([...ochutnane, ...navic]),
            mesice: ageInMonths(dite.birthDate),
            mesicVRoce: new Date().getMonth() + 1,
            dnes: todayIso(),
            vyrazene,
            pozastaveneAlergeny,
          },
    [dite, ochutnane, vyrazene, pozastaveneAlergeny],
  );

  const sestav = useCallback(
    (blok: number, navic?: Iterable<string>, varianta?: number): Plan | null => {
      const zadani = vstup(blok, navic);
      return zadani === null ? null : sestavPlan({ ...zadani, varianta: varianta ?? 0 });
    },
    [vstup],
  );

  return { sestav, vstup };
}

/** Kolik známých surovin se nabídne vedle dnešní novinky. */
export const ZNAMYCH_NA_TALIR = 6;

/**
 * Co může ležet na talíři vedle dnešní novinky.
 *
 * Metoda stojí na tom, že si dítě z talíře vybírá, a k tomu potřebuje víc
 * než jedno sousto. Novinka zůstává jedna kvůli přiřazení reakce, vedle ní
 * ale může ležet cokoli osvědčeného.
 *
 * Bere se celá historie dítěte, ne jen probíhající blok. Ukládá se vždycky
 * jen poslední plán, takže druhý blok sám o sobě o prvním nic neví; bez
 * uloženého seznamu a bez deníku by nabídka ve druhém bloku vypadala, jako
 * by aplikace na první měsíc příkrmu zapomněla.
 *
 * Pořadí je od nejčerstvějšího: co dítě jedlo včera, si vybaví spíš než
 * surovinu z prvního týdne. Po nežádoucí reakci se surovina nenabízí, ta
 * patří k pediatrovi, ne zpátky na talíř. Totéž platí pro suroviny, které
 * rodič z plánu vyřadil. Hlídá se to u všech tří zdrojů, ne jen u deníku:
 * dřív se surovina s reakcí vrátila přes novinku z dřívějšího dne nebo
 * přes seznam známých surovin uložený v plánu.
 */
export function znameNaTalir(
  plan: Plan,
  den: PlanDen,
  state: HouseholdState,
  childId: string | null,
  alergie: readonly AllergenGroup[] = [],
  vyrazeneRucne: readonly string[] = [],
): Ingredient[] {
  const vyloucene = new Set(alergie);
  const vyrazene = vyrazeneZPlanu(state, childId, vyrazeneRucne);
  const videne = new Set<string>(den.novinka === undefined ? [] : [den.novinka]);
  const out: Ingredient[] = [];

  const pridej = (id: string | undefined): void => {
    if (id === undefined || videne.has(id) || vyrazene.has(id)) return;
    videne.add(id);
    const item = ingredientById.get(id);
    if (item === undefined) return;
    if (item.allergens.some((skupina) => vyloucene.has(skupina))) return;
    out.push(item);
  };

  // 1. Novinky z dřívějších dnů tohoto bloku, od té nejčerstvější.
  for (const jiny of [...plan.dny].reverse()) {
    if (jiny.cislo < den.cislo) pridej(jiny.novinka);
  }

  // 2. Deník: co dítě opravdu ochutnalo, od poslední ochutnávky.
  const podleSuroviny = [...tastingsByIngredient(state, childId).entries()]
    .sort((a, b) => (a[1][0]?.date ?? '').localeCompare(b[1][0]?.date ?? '') * -1);
  for (const [id] of podleSuroviny) pridej(id);

  // 3. Co dítě znalo, když blok vznikl. Sem spadnou dny odškrtnuté bez
  //    zápisu do deníku i celý předchozí blok, který už uložený není.
  for (const id of plan.zname ?? []) pridej(id);

  return out.slice(0, ZNAMYCH_NA_TALIR);
}
