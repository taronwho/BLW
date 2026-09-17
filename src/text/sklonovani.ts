/**
 * České skloňování počítaného předmětu. Jedno místo pro celou aplikaci.
 *
 * Čeština má u počtu tři tvary — 1 měsíc, 2 až 4 měsíce, 5 a víc měsíců —
 * a u desetinného čísla se chová jako u zlomku (1,5 měsíce). Anglické
 * „jednotné / množné" na to nestačí, takže `${pocet} měsíců` vyrobí
 * „1 měsíců" a „2 měsíců".
 *
 * Než tohle vzniklo, měl projekt na totéž tři různá řešení: plnou tabulku
 * tvarů pro 28 jednotek v `src/nakup/mnozstvi.ts`, ruční ternární operátor
 * v `NakupKarta.tsx` a v `age.ts` prosté `${months} měsíců`, které
 * skloňovalo špatně — a bylo vidět ve stálé hlavičce na každé obrazovce.
 */

/** Tvary pro [1, 2 až 4, 5 a víc, desetinné číslo]. */
export type Tvary = readonly [string, string, string, string];

/**
 * Vybere správný tvar podle počtu. Nula bere tvar pro pět a víc
 * („0 měsíců"), jak čeština chce.
 *
 * Záporné číslo se posuzuje podle absolutní hodnoty; do aplikace se
 * dostat nemá, ale „-2 měsíce" je pořád lepší než „-2 měsíců".
 */
export function tvarPodlePoctu(pocet: number, tvary: Tvary): string {
  if (!Number.isInteger(pocet)) return tvary[3];
  const kolik = Math.abs(pocet);
  if (kolik === 1) return tvary[0];
  if (kolik >= 2 && kolik <= 4) return tvary[1];
  return tvary[2];
}

/** Počet i s vyskloňovaným předmětem: „1 měsíc", „5 měsíců", „1,5 měsíce". */
export function sklonuj(pocet: number, tvary: Tvary): string {
  return `${cislo(pocet)} ${tvarPodlePoctu(pocet, tvary)}`;
}

/** České číslo: celé bez desetinné čárky, jinak nejvýš na jedno místo. */
export function cislo(hodnota: number): string {
  const zaokrouhlene = Math.round(hodnota * 10) / 10;
  return Number.isInteger(zaokrouhlene)
    ? String(zaokrouhlene)
    : zaokrouhlene.toFixed(1).replace('.', ',');
}

/* Tvary, které aplikace potřebuje víc než na jednom místě. */

export const MESIC: Tvary = ['měsíc', 'měsíce', 'měsíců', 'měsíce'];
export const ROK: Tvary = ['rok', 'roky', 'let', 'roku'];
export const POLOZKA: Tvary = ['položka', 'položky', 'položek', 'položky'];
export const RECEPT: Tvary = ['recept', 'recepty', 'receptů', 'receptu'];
export const SUROVINA: Tvary = ['surovina', 'suroviny', 'surovin', 'suroviny'];
export const DEN: Tvary = ['den', 'dny', 'dnů', 'dne'];
export const ZAZNAM: Tvary = ['záznam', 'záznamy', 'záznamů', 'záznamu'];
