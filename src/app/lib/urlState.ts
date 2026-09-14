import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * Stav filtrů žije v adrese, ne v komponentě.
 *
 * Dřív to byl obyčejný `useState`. Rodič si vyfiltroval suroviny, otevřel
 * detail, dal Zpět — a seznam byl zase celý. U tří set položek je to ta
 * nejotravnější vada aplikace, protože se opakuje při každém použití.
 *
 * Zápis je vždycky `replace`, ne `push`: každé písmeno v hledání by jinak
 * založilo záznam v historii a Zpět by procházelo písmeno po písmenu. Takhle
 * má seznam v historii jediný záznam, který si drží aktuální filtry — a Zpět
 * z detailu se na něj vrátí i s nimi. Vedlejší efekt je, že se filtrovaný
 * seznam dá poslat odkazem druhému rodiči.
 *
 * Výchozí hodnota se do adresy nepíše, aby zůstala čitelná.
 */

function zapis(
  params: URLSearchParams,
  klic: string,
  hodnota: string,
  vychozi: string,
): URLSearchParams {
  const dalsi = new URLSearchParams(params);
  if (hodnota === vychozi || hodnota.length === 0) dalsi.delete(klic);
  else dalsi.set(klic, hodnota);
  return dalsi;
}

/**
 * Textová volba (hledání, kategorie, řazení).
 *
 * `NoInfer` u výchozí hodnoty je schválně: bez něj by se `T` odvodilo
 * z literálu, takže by `useUrlText('kat', 'vse')` vrátilo setter, který umí
 * jen hodnotu `'vse'`. Takhle je `T` prostý `string`, dokud ho volající
 * neurčí sám (`useUrlText<SortKey>(…)`).
 */
export function useUrlText<T extends string = string>(
  klic: string,
  vychozi: NoInfer<T>,
  povolene?: readonly T[],
): [T, (hodnota: T) => void] {
  const [params, setParams] = useSearchParams();
  const syrova = params.get(klic);
  // Cizí hodnota v adrese (překlep, stará verze odkazu) se ignoruje, ať
  // aplikace neskončí ve stavu, který filtr neumí nabídnout.
  const hodnota =
    syrova !== null && (povolene === undefined || povolene.includes(syrova as T))
      ? (syrova as T)
      : vychozi;
  const nastav = useCallback(
    (dalsi: T) => {
      setParams((stare) => zapis(stare, klic, dalsi, vychozi), { replace: true });
    },
    [klic, setParams, vychozi],
  );
  return [hodnota, nastav];
}

/**
 * Přepínač; v adrese je jen když je zapnutý.
 *
 * Setter bere i funkci nad předchozí hodnotou, aby se choval jako `useState`
 * a šlo psát `nastav((zapnuto) => !zapnuto)`.
 */
type ZmenaPrepinace = boolean | ((predchozi: boolean) => boolean);

export function useUrlFlag(klic: string): [boolean, (hodnota: ZmenaPrepinace) => void] {
  const [params, setParams] = useSearchParams();
  const hodnota = params.get(klic) === '1';
  const nastav = useCallback(
    (dalsi: ZmenaPrepinace) => {
      setParams(
        (stare) => {
          const predchozi = stare.get(klic) === '1';
          const vysledek = typeof dalsi === 'function' ? dalsi(predchozi) : dalsi;
          return zapis(stare, klic, vysledek ? '1' : '', '');
        },
        { replace: true },
      );
    },
    [klic, setParams],
  );
  return [hodnota, nastav];
}

/**
 * Seznam voleb oddělený čárkou — živiny, spíž.
 *
 * Setter bere i funkci nad předchozí hodnotou, aby se dal použít stejně jako
 * `useState` a přepínání jedné položky se nemuselo psát dvakrát.
 */
type ZmenaSeznamu = readonly string[] | ((predchozi: readonly string[]) => readonly string[]);

export function useUrlList(klic: string): [readonly string[], (hodnota: ZmenaSeznamu) => void] {
  const [params, setParams] = useSearchParams();
  const syrova = params.get(klic);
  // Musí to být stabilní odkaz: seznam jde dál do `useMemo` filtrů a nové
  // pole při každém vykreslení by je přepočítalo pořád dokola. Dlouhý seznam
  // se kvůli tomu při rolování vracel na první dávku.
  const hodnota = useMemo(
    () =>
      syrova === null || syrova.length === 0
        ? EMPTY
        : syrova.split(',').filter((x) => x.length > 0),
    [syrova],
  );
  const nastav = useCallback(
    (dalsi: ZmenaSeznamu) => {
      setParams((stare) => {
        const predchozi = (stare.get(klic) ?? '').split(',').filter((x) => x.length > 0);
        const vysledek = typeof dalsi === 'function' ? dalsi(predchozi) : dalsi;
        return zapis(stare, klic, vysledek.join(','), '');
      }, { replace: true });
    },
    [klic, setParams],
  );
  return [hodnota, nastav];
}

/** Jedna sdílená instance, ať se `useMemo` v obrazovkách nepřepočítává zbytečně. */
const EMPTY: readonly string[] = [];

/**
 * Několik voleb jedním zápisem.
 *
 * Jednotlivé settery zapisují každý zvlášť, a když se jich v jedné obsluze
 * zavolá víc (zrušení všech filtrů, zkratka „rostlinné železo + vitamin C"),
 * přepíší se navzájem a projde jen poslední. Tohle sestaví adresu naráz.
 *
 * Prázdná hodnota, `false`, prázdné pole i `null` znamenají „odstraň z adresy",
 * tedy návrat k výchozímu stavu.
 */
export type UrlHodnota = string | boolean | readonly string[] | null;

export function useUrlBatch(): (zmeny: Record<string, UrlHodnota>) => void {
  const [, setParams] = useSearchParams();
  return useCallback(
    (zmeny: Record<string, UrlHodnota>) => {
      setParams(
        (stare) => {
          const dalsi = new URLSearchParams(stare);
          for (const [klic, hodnota] of Object.entries(zmeny)) {
            const text =
              hodnota === null || hodnota === false
                ? ''
                : hodnota === true
                  ? '1'
                  : typeof hodnota === 'string'
                    ? hodnota
                    : hodnota.join(',');
            if (text.length === 0) dalsi.delete(klic);
            else dalsi.set(klic, text);
          }
          return dalsi;
        },
        { replace: true },
      );
    },
    [setParams],
  );
}
