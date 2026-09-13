/**
 * Světlý a tmavý motiv.
 *
 * Volba je záležitost zařízení, ne domácnosti — každý telefon má jiný displej
 * i jiné zvyky, a kdyby se nastavení synchronizovalo, přepínal by ho jeden
 * rodič druhému. Proto localStorage, ne stav domácnosti.
 *
 * Barvy samotné jsou proměnné v src/index.css; tady se jen přepíná atribut
 * `data-theme` na <html>.
 */

export type Theme = 'system' | 'svetly' | 'tmavy';

export const THEMES: readonly Theme[] = ['system', 'svetly', 'tmavy'];

export const THEME_LABELS: Record<Theme, string> = {
  system: 'Podle systému',
  svetly: 'Světlý',
  tmavy: 'Tmavý',
};

const KEY = 'blw-motiv';

/** Barva lišty prohlížeče; odpovídá hlavičce v daném motivu. */
const THEME_COLOR: Record<'svetly' | 'tmavy', string> = {
  svetly: '#1F6F5C',
  tmavy: '#121715',
};

function isTheme(value: string | null): value is Theme {
  return value === 'system' || value === 'svetly' || value === 'tmavy';
}

/** Uložená volba. Když úložiště není k dispozici (soukromé okno), platí systém. */
export function readTheme(): Theme {
  try {
    const stored = window.localStorage.getItem(KEY);
    return isTheme(stored) ? stored : 'system';
  } catch {
    return 'system';
  }
}

export function writeTheme(theme: Theme): void {
  try {
    window.localStorage.setItem(KEY, theme);
  } catch {
    // Bez úložiště volba nepřežije obnovení stránky, ale aplikace běží dál.
  }
}

export function prefersDark(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function resolveTheme(theme: Theme): 'svetly' | 'tmavy' {
  if (theme === 'system') return prefersDark() ? 'tmavy' : 'svetly';
  return theme;
}

/** Překlopí <html> i barvu lišty prohlížeče. */
export function applyTheme(theme: Theme): void {
  const resolved = resolveTheme(theme);
  document.documentElement.dataset.theme = resolved === 'tmavy' ? 'dark' : 'light';
  const meta = document.querySelector('meta[name="theme-color"]');
  meta?.setAttribute('content', THEME_COLOR[resolved]);
}

/** Sleduje systémové nastavení; vrací odhlášení. Volá se jen u volby „podle systému". */
export function watchSystem(onChange: () => void): () => void {
  const query = window.matchMedia('(prefers-color-scheme: dark)');
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}
