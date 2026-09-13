import { create } from 'zustand';
import { applyTheme, readTheme, resolveTheme, writeTheme } from './theme';
import type { Theme } from './theme';

/**
 * Motiv jako sdílený stav.
 *
 * Sdílený schválně: přepínač v hlavičce a výběr v Domácnosti jsou dvě
 * ovládání téhož. Kdyby měl každý vlastní `useState`, klepnutí v hlavičce by
 * v Domácnosti nechalo zaškrtnutou starou volbu.
 *
 * Atribut na <html> nastavuje ještě před vykreslením skript v index.html, aby
 * aplikace neproblikla světlá; tenhle store ho jen drží dál v souladu.
 */
interface ThemeStore {
  /** Uložená volba včetně „podle systému". */
  theme: Theme;
  /** Co je opravdu vidět — „podle systému" už rozhodnuté. */
  resolved: 'svetly' | 'tmavy';
  setTheme: (theme: Theme) => void;
  /** Telefon si sám přepnul na noc; volba „podle systému" to má následovat. */
  syncFromSystem: () => void;
}

export const useThemeStore = create<ThemeStore>((set) => {
  const theme = readTheme();
  return {
    theme,
    resolved: resolveTheme(theme),
    setTheme: (next) => {
      writeTheme(next);
      applyTheme(next);
      set({ theme: next, resolved: resolveTheme(next) });
    },
    syncFromSystem: () => {
      const current = readTheme();
      applyTheme(current);
      set({ theme: current, resolved: resolveTheme(current) });
    },
  };
});
