import { Moon, Smartphone, Sun } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { THEMES, THEME_LABELS } from '../lib/theme';
import type { Theme } from '../lib/theme';
import { useThemeStore } from '../lib/themeStore';

const ICONS: Record<Theme, LucideIcon> = {
  system: Smartphone,
  svetly: Sun,
  tmavy: Moon,
};

/** Přepínač motivu. Výchozí je „podle systému", aby se večer ztmavil sám. */
export function ThemePicker(): ReactNode {
  const theme = useThemeStore((store) => store.theme);
  const setTheme = useThemeStore((store) => store.setTheme);

  return (
    <fieldset className="flex flex-col gap-2" data-testid="vyber-motivu">
      <legend className="flex items-center gap-2 text-sm font-semibold">
        <Moon aria-hidden="true" className="h-4 w-4 shrink-0 text-accent" />
        Vzhled
      </legend>
      <p className="text-xs leading-relaxed text-muted">
        Nastavení platí jen pro tenhle telefon. Ostatním v domácnosti se nic nemění.
      </p>
      <div className="flex gap-2">
        {THEMES.map((one) => {
          const Icon = ICONS[one];
          const active = one === theme;
          return (
            <button
              key={one}
              type="button"
              role="radio"
              aria-checked={active}
              data-testid={`motiv-${one}`}
              onClick={() => setTheme(one)}
              className={`flex min-h-touch flex-1 flex-col items-center justify-center gap-1 rounded-xl border px-2 py-2 text-[11px] font-semibold transition ${
                active
                  ? 'border-accent bg-accent text-on-accent'
                  : 'border-line bg-surface text-muted'
              }`}
            >
              <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />
              {THEME_LABELS[one]}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
