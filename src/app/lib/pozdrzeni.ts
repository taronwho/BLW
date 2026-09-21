import { useEffect, useState } from 'react';

/** Kolik se čeká, než se z psaní stane hledání. */
export const POZDRZENI_MS = 150;

/**
 * Hodnota, která se mění až chvíli po tom, co rodič dopsal.
 *
 * Pole hledání se překresluje při každém stisku — to musí zůstat, jinak
 * by písmena naskakovala se zpožděním. Filtrovat katalog při každém stisku
 * ale netřeba: kdo píše „brambory", projde cestou sedm mezistavů, ze
 * kterých ho žádný nezajímá.
 *
 * Sto padesát milisekund je pod prahem, kdy si člověk všimne prodlevy, a
 * přitom pokryje běžné tempo psaní na mobilu.
 */
export function usePozdrzeno(hodnota: string, ms: number = POZDRZENI_MS): string {
  const [pozdrzena, setPozdrzena] = useState(hodnota);

  useEffect(() => {
    // Prázdné pole se propíše hned. Když rodič smaže dotaz křížkem, čeká
    // na celý seznam, ne na to, až doběhne časovač.
    if (hodnota === '') {
      setPozdrzena(hodnota);
      return;
    }
    const casovac = setTimeout(() => setPozdrzena(hodnota), ms);
    return () => clearTimeout(casovac);
  }, [hodnota, ms]);

  return pozdrzena;
}
