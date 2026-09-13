import type { HouseholdState, ReadySign } from '@/types';
import { READY_SIGNS } from '@/types';

/**
 * Připravenost dítěte na příkrm.
 *
 * Metoda nestojí na datu v kalendáři, ale na trojici vývojových znaků, které
 * se u zdravého dítěte scházejí kolem šestého měsíce — u někoho dřív, u někoho
 * později. Fáze 6m+ je proto pojmenovaná podle věku, ale podmínkou je tohle,
 * ne dovršený půlrok. Dokud znaky pohromadě nejsou, nemá začínat ani metoda
 * vedená dítětem, ani lžička.
 *
 * Podrobně to rozebírá rada `je-dite-pripravene`; tenhle modul jen drží
 * popisky a odvozuje, jestli má aplikace upozorňovat.
 */

export const READY_LABELS: Record<ReadySign, string> = {
  sed: 'Samostatný stabilní sed',
  koordinace: 'Trefí si jídlo do pusy',
  reflex: 'Vyhasl vypuzovací reflex jazyka',
};

/**
 * Tytéž znaky jako jméno, ne jako věta.
 *
 * `READY_LABELS` jsou tvrzení („Vyhasl vypuzovací reflex jazyka“) a do věty
 * „zbývá …“ se nedají vložit, aniž by drhla.
 */
export const READY_MISSING_LABELS: Record<ReadySign, string> = {
  sed: 'samostatný stabilní sed',
  koordinace: 'trefování jídla do pusy',
  reflex: 'vyhasnutí vypuzovacího reflexu',
};

/** Podle čeho rodič znak pozná — pozorovatelné, ne odvozené z věku. */
export const READY_HOW_TO_TELL: Record<ReadySign, string> = {
  sed: 'Dítě udrží trup i hlavu vzpřímeně bez opírání rukama. V židličce nepadá na stranu ani se nesesouvá dopředu.',
  koordinace:
    'Dítě po jídle cíleně sáhne, uchopí ho a dopraví si ho do úst. Ne náhodou, ale když chce.',
  reflex:
    'Co skončí v ústech, jazyk už automaticky nevytlačuje ven. Dokud reflex trvá, dítě vypudí i to, co by rádo snědlo.',
};

export function readySigns(state: HouseholdState): ReadySign[] {
  return state.readySigns ?? [];
}

export function hasSign(state: HouseholdState, sign: ReadySign): boolean {
  return readySigns(state).includes(sign);
}

/** Jsou všechny tři znaky odškrtnuté? */
export function isReady(state: HouseholdState): boolean {
  return READY_SIGNS.every((sign) => hasSign(state, sign));
}

/** Znaky, které rodič zatím neodškrtl. */
export function missingSigns(state: HouseholdState): ReadySign[] {
  return READY_SIGNS.filter((sign) => !hasSign(state, sign));
}

/**
 * Má se u fáze 6m+ ukázat upozornění?
 *
 * Ukazuje se, dokud nejsou všechny tři znaky odškrtnuté — tedy i tehdy, když
 * rodič zatím neodškrtl nic. Právě to je nejčastější stav u někoho, kdo si
 * aplikaci otevřel před začátkem příkrmu.
 */
export function shouldWarnAboutReadiness(state: HouseholdState): boolean {
  return !isReady(state);
}
