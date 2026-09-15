import type { Plan, PlanDen, StavDne } from '@/types';

/**
 * Práce s třicetidenním plánem.
 *
 * Datový tvar bydlí v `@/types` spolu se zbytkem stavu domácnosti, protože
 * se ukládá i synchronizuje jako všechno ostatní. Tady jsou funkce nad ním.
 */

export type { Plan, PlanDen, PlanJidlo, TypJidla, DuvodJidla, StavDne } from '@/types';

/** Kolik dní má jeden blok plánu. */
export const DNU_V_BLOKU = 30;

export function stavDne(plan: Plan, cislo: number): StavDne {
  return plan.stavy[String(cislo)]?.hodnota ?? 'ceka';
}

/** Kdy se stav dne naposled změnil, nebo `null` u dne, který ještě čeká. */
export function kdyStavDne(plan: Plan, cislo: number): number | null {
  return plan.stavy[String(cislo)]?.kdy ?? null;
}

/** První den, který ještě čeká. Vrací `null`, když je blok hotový. */
export function dalsiDen(plan: Plan): PlanDen | null {
  return plan.dny.find((den) => stavDne(plan, den.cislo) === 'ceka') ?? null;
}

export function hotovoDnu(plan: Plan): number {
  return plan.dny.filter((den) => stavDne(plan, den.cislo) === 'hotovo').length;
}

export function vyrizenoDnu(plan: Plan): number {
  return plan.dny.filter((den) => stavDne(plan, den.cislo) !== 'ceka').length;
}

/** Blok je dokončený, až je každý den buď hotový, nebo přeskočený. */
export function blokDokoncen(plan: Plan): boolean {
  return plan.dny.length > 0 && vyrizenoDnu(plan) === plan.dny.length;
}

export function denPodleCisla(plan: Plan, cislo: number): PlanDen | null {
  return plan.dny.find((den) => den.cislo === cislo) ?? null;
}

/**
 * Prohodí obsah dne s nejbližším dalším dnem, který ještě čeká.
 *
 * Takhle vypadá „odložit na jindy“: den se nesmaže ani nepropadne, jen se
 * posune za ten následující. Čísla dnů zůstávají na místě, mění se obsah,
 * takže postup v bloku zůstane čitelný.
 */
export function odlozDen(plan: Plan, cislo: number): Plan {
  const kam = plan.dny.find((den) => den.cislo > cislo && stavDne(plan, den.cislo) === 'ceka');
  const odkud = denPodleCisla(plan, cislo);
  if (kam === null || kam === undefined || odkud === null) return plan;
  return {
    ...plan,
    dny: plan.dny.map((den) => {
      if (den.cislo === cislo) return { ...kam, cislo };
      if (den.cislo === kam.cislo) return { ...odkud, cislo: kam.cislo };
      return den;
    }),
  };
}

/** Zapíše stav jednoho dne se značkou času. */
export function sStavemDne(plan: Plan, cislo: number, stav: StavDne, kdy: number): Plan {
  return { ...plan, stavy: { ...plan.stavy, [String(cislo)]: { hodnota: stav, kdy } } };
}
