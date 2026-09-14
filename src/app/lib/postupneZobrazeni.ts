import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

/**
 * Postupné vykreslování dlouhého seznamu.
 *
 * Kuchařka i katalog mají přes tři sta položek a každá karta nese několik
 * chlebíčků, ikon a tlačítek. Vykreslit je na mobilu všechny naráz znamená
 * desítky tisíc uzlů v DOM, dlouhé první vykreslení a klepnutí, které se
 * chvíli nic nedělá. Seznam se proto plní po dávkách: první dávka hned,
 * další jakmile rodič doroluje na konec.
 *
 * Další dávka se načte sama, jakmile se konec seznamu objeví na obrazovce.
 * Tlačítko se ukáže jen tam, kde `IntersectionObserver` není — bez něj by
 * se zbytek seznamu stal nedostupným.
 */
const DAVKA = 24;

export interface PostupneZobrazeni<T> {
  /** Položky, které se mají právě vykreslit. */
  zobrazene: readonly T[];
  /** Kolik položek ještě čeká. */
  zbyva: number;
  /** Přidá další dávku. */
  nacistDalsi: () => void;
  /** Prvek na konci seznamu, po jehož zobrazení se načte další dávka. */
  konecSeznamu: (uzel: HTMLElement | null) => void;
}

export function usePostupneZobrazeni<T>(polozky: readonly T[]): PostupneZobrazeni<T> {
  const [limit, setLimit] = useState(DAVKA);
  const sledovany = useRef<HTMLElement | null>(null);
  const pozorovatel = useRef<IntersectionObserver | null>(null);

  // Změna filtru nebo řazení znamená jiný seznam; rodič se dívá na jeho
  // začátek, takže se vrací i limit.
  //
  // Porovnává se obsah, ne odkaz na pole. Stačilo, aby volající při každém
  // vykreslení vyrobil nové pole se stejným obsahem, a limit se resetoval
  // pořád dokola — seznam se při rolování vracel na první dávku a tlačítko
  // „Načíst další" vypadalo jako rozbité.
  //
  // Vzorek stačí: položky jsou pořád tytéž objekty z katalogu, takže se
  // porovnávají odkazem. Jiný filtr prakticky vždycky změní délku nebo
  // některou ze tří sledovaných pozic.
  const vzorek = [
    polozky.length,
    polozky[0],
    polozky[polozky.length >> 1],
    polozky[polozky.length - 1],
  ] as const;
  const predchozi = useRef(vzorek);
  useEffect(() => {
    const stejny = vzorek.every((hodnota, index) => hodnota === predchozi.current[index]);
    if (stejny) return;
    predchozi.current = vzorek;
    setLimit(DAVKA);
    // Vzorek je nové pole při každém vykreslení, proto se do závislostí
    // rozepisuje po prvcích.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vzorek[0], vzorek[1], vzorek[2], vzorek[3]]);

  const zobrazene = useMemo(() => polozky.slice(0, limit), [polozky, limit]);
  const zbyva = Math.max(0, polozky.length - zobrazene.length);

  const nacistDalsi = useCallback(() => {
    setLimit((stav) => stav + DAVKA);
  }, []);

  const konecSeznamu = useCallback(
    (uzel: HTMLElement | null) => {
      pozorovatel.current?.disconnect();
      sledovany.current = uzel;
      if (uzel === null || typeof IntersectionObserver === 'undefined') return;
      const observer = new IntersectionObserver(
        (zaznamy) => {
          if (zaznamy.some((zaznam) => zaznam.isIntersecting)) nacistDalsi();
        },
        // Načítat až u samého okraje znamená prázdno pod prstem; půl obrazovky
        // dopředu stačí, aby rodič o čekání nevěděl.
        { rootMargin: '400px' },
      );
      observer.observe(uzel);
      pozorovatel.current = observer;
    },
    [nacistDalsi],
  );

  useEffect(() => () => pozorovatel.current?.disconnect(), []);

  return { zobrazene, zbyva, nacistDalsi, konecSeznamu };
}
