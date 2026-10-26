import type { AllergenGroup, Child, Plan, PlanDen, StavDne } from '@/types';

/**
 * Práce s třicetidenním plánem.
 *
 * Datový tvar bydlí v `@/types` spolu se zbytkem stavu domácnosti, protože
 * se ukládá i synchronizuje jako všechno ostatní. Tady jsou funkce nad ním.
 */

export type { Plan, PlanDen, PlanJidlo, TypJidla, DuvodJidla, StavDne } from '@/types';

/** Kolik dní má jeden blok plánu. */
export const DNU_V_BLOKU = 30;

/**
 * Sedí plán na dnešní alergie dítěte?
 *
 * Porovnává jen dva seznamy, žádný katalog. Díky tomu se na neshodu dá
 * upozornit i na úvodní obrazovce, která si katalog nestahuje.
 *
 * Plán uložený starší verzí seznam nemá. Ten se nepovažuje za neshodu:
 * tvrdit rodiči, že plán neplatí, protože o něm aplikace něco neví, by
 * ho jen posílalo přesestavovat plán, se kterým nic není.
 */
export function planSediSAlergiemi(plan: Plan, dite: Child | null): boolean {
  if (plan.alergie === undefined) return true;
  const dnesni = [...(dite?.allergens ?? [])].sort().join(',');
  return plan.alergie.join(',') === dnesni;
}

/** Alergeny, které dítě nesmí, ale plán je sestavený bez nich. */
export function pribyleAlergie(plan: Plan, dite: Child | null): AllergenGroup[] {
  const znal = new Set(plan.alergie ?? []);
  return (dite?.allergens ?? []).filter((skupina) => !znal.has(skupina));
}

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
    ...prohodSnezene(plan, cislo, kam.cislo),
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

/** Klíč jednoho jídla v `Plan.snezeno`: číslo dne a pořadí jídla v něm. */
export function klicJidla(cislo: number, poradi: number): string {
  return `${cislo}:${poradi}`;
}

/**
 * Je jídlo snědené?
 *
 * Rozhoduje výslovné odškrtnutí jídla. Kde žádné není, platí stav dne:
 * odškrtnutý den znamená snědená všechna jeho jídla, aby hotový den
 * nevypadal, jako by v něm dítě nic nejedlo.
 */
export function jeSnezeno(plan: Plan, cislo: number, poradi: number): boolean {
  return plan.snezeno?.[klicJidla(cislo, poradi)]?.hodnota ?? stavDne(plan, cislo) === 'hotovo';
}

/** Kolik jídel dne je snědených. */
export function snezenoJidel(plan: Plan, den: PlanDen): number {
  return den.jidla.filter((_, poradi) => jeSnezeno(plan, den.cislo, poradi)).length;
}

/** Zapíše snědení jednoho jídla se značkou času. */
export function sSnezenym(
  plan: Plan,
  cislo: number,
  poradi: number,
  snedeno: boolean,
  kdy: number,
): Plan {
  return {
    ...plan,
    snezeno: { ...plan.snezeno, [klicJidla(cislo, poradi)]: { hodnota: snedeno, kdy } },
  };
}

function cisloZKlice(klic: string): number {
  return Number(klic.slice(0, klic.indexOf(':')));
}

/**
 * Zapomene snědená jídla dne.
 *
 * Patří k výměně obsahu dne: odškrtnutá snídaně se týkala jídla, které
 * v dni už není.
 */
export function bezSnezenehoDne(plan: Plan, cislo: number): Plan {
  if (plan.snezeno === undefined) return plan;
  const snezeno = Object.fromEntries(
    Object.entries(plan.snezeno).filter(([klic]) => cisloZKlice(klic) !== cislo),
  );
  return { ...plan, snezeno };
}

/** Odškrtnutá jídla jdou s obsahem dne, když se dny prohodí. */
function prohodSnezene(plan: Plan, a: number, b: number): Plan {
  if (plan.snezeno === undefined) return plan;
  const snezeno = Object.fromEntries(
    Object.entries(plan.snezeno).map(([klic, hodnota]) => {
      const cislo = cisloZKlice(klic);
      const poradi = klic.slice(klic.indexOf(':') + 1);
      if (cislo === a) return [`${b}:${poradi}`, hodnota];
      if (cislo === b) return [`${a}:${poradi}`, hodnota];
      return [klic, hodnota];
    }),
  );
  return { ...plan, snezeno };
}
