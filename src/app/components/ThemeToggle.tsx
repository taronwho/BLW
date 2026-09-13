import { Moon, Sun } from 'lucide-react';
import type { ReactNode } from 'react';
import { useThemeStore } from '../lib/themeStore';

/**
 * Přepínač vzhledu v hlavičce.
 *
 * Přepíná natvrdo mezi světlým a tmavým — to je to, co člověk jedním
 * klepnutím čeká. Volba „podle systému" zůstává v Domácnosti; klepnutí tady
 * ji vědomě přebije, protože rodič zrovna chce jedno z toho dvou.
 */
export function ThemeToggle(): ReactNode {
  const resolved = useThemeStore((store) => store.resolved);
  const setTheme = useThemeStore((store) => store.setTheme);
  const tmavy = resolved === 'tmavy';

  return (
    <button
      type="button"
      data-testid="prepinac-motivu"
      aria-label={tmavy ? 'Přepnout na světlý vzhled' : 'Přepnout na tmavý vzhled'}
      onClick={() => setTheme(tmavy ? 'svetly' : 'tmavy')}
      className="flex min-h-touch min-w-touch shrink-0 items-center justify-center rounded-full text-muted transition hover:text-accent"
    >
      {tmavy ? (
        <Sun aria-hidden="true" className="h-5 w-5 shrink-0" />
      ) : (
        <Moon aria-hidden="true" className="h-5 w-5 shrink-0" />
      )}
    </button>
  );
}
