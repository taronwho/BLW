import { useCallback, useEffect, useState } from 'react';
import { applyTheme, readTheme, watchSystem, writeTheme } from './theme';
import type { Theme } from './theme';

/**
 * Motiv jako stav React.
 *
 * Atribut na <html> nastavuje ještě před vykreslením skript v index.html,
 * aby aplikace neproblikla světlá. Tenhle hook drží volbu jen dál v souladu:
 * ukládá ji a u „podle systému" poslouchá, když si telefon sám přepne na noc.
 */
export function useTheme(): { theme: Theme; setTheme: (theme: Theme) => void } {
  const [theme, setThemeState] = useState<Theme>(readTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // Posluchač si volbu přečte až ve chvíli změny, ne při navěšení. Díky tomu
  // nevadí, že hook používá hlavička i přepínač v nastavení zároveň — starší
  // instance nemůže překlopit motiv zpátky.
  useEffect(() => watchSystem(() => applyTheme(readTheme())), []);

  const setTheme = useCallback((next: Theme) => {
    writeTheme(next);
    setThemeState(next);
  }, []);

  return { theme, setTheme };
}
