import { BookOpen, Carrot, Home, LifeBuoy, NotebookPen } from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useHouseholdStore } from '@/storage/householdStore';
import drobek from '@/assets/drobek.png';
import { ChildSwitcher } from './ChildSwitcher';
import { ThemeToggle } from './ThemeToggle';
import { watchSystem } from '../lib/theme';
import { useThemeStore } from '../lib/themeStore';

const NAV = [
  { to: '/', label: 'Domů', Icon: Home, end: true },
  { to: '/suroviny', label: 'Suroviny', Icon: Carrot, end: false },
  { to: '/recepty', label: 'Recepty', Icon: BookOpen, end: false },
  { to: '/rady', label: 'Rady', Icon: LifeBuoy, end: false },
  { to: '/denik', label: 'Deník', Icon: NotebookPen, end: false },
] as const;

/** Spodní navigace s pěti položkami a jediný landmark `main` na stránku. */
export function AppShell({ children }: { children: ReactNode }): ReactNode {
  const init = useHouseholdStore((store) => store.init);
  const syncFromSystem = useThemeStore((store) => store.syncFromSystem);

  useEffect(() => {
    void init();
  }, [init]);

  // Jediný posluchač systémového nastavení v celé aplikaci: když si telefon
  // sám přepne na noc, volba „podle systému" to má následovat.
  useEffect(() => watchSystem(syncFromSystem), [syncFromSystem]);

  return (
    <div className="flex min-h-full flex-col">
      <header className="sticky top-0 z-10 border-b border-line bg-paper/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-md items-center gap-2 px-4 py-1.5">
          <Link to="/" className="flex min-h-touch shrink-0 items-center">
            {/* Značka nese i nápis „Drobek", takže vedle ní žádný text nestojí.
                Žádné zaoblení ani podklad: rohy by ořízly samotnou kresbu —
                nápis sedí až dole a přišel by o patky „D" a „k". */}
            <img src={drobek} alt="Drobek" className="h-11 w-auto" />
          </Link>
          {/* Jmenovka s věkem; u dvou a víc dětí je z ní přepínač. */}
          <ChildSwitcher />
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto w-full max-w-md flex-1 px-4 pb-28 pt-4">{children}</main>

      <nav
        aria-label="Hlavní navigace"
        className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-surface/95 pb-safe-b backdrop-blur"
      >
        <ul className="mx-auto flex w-full max-w-md">
          {NAV.map(({ to, label, Icon, end }) => (
            <li key={to} className="flex-1">
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex min-h-touch min-w-touch flex-col items-center justify-center gap-1 px-1 py-2 text-[10px] font-semibold ${
                    isActive ? 'text-accent' : 'text-muted'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`flex h-7 w-10 items-center justify-center rounded-full transition ${
                        isActive ? 'bg-accent-soft' : ''
                      }`}
                    >
                      <Icon aria-hidden="true" className="h-5 w-5 shrink-0" />
                    </span>
                    <span>{label}</span>
                    <span className="sr-only">{isActive ? '(aktivní obrazovka)' : ''}</span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
