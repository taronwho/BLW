import { BookOpen, Carrot, Home, LifeBuoy, NotebookPen } from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useHouseholdStore } from '@/storage/householdStore';
import { ageInMonths, formatAge } from '../lib/age';

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
  const state = useHouseholdStore((store) => store.state);

  useEffect(() => {
    void init();
  }, [init]);

  const months = ageInMonths(state.childBirthDate);
  const childLabel =
    state.childName.trim().length === 0
      ? 'Nastavte dítě v Domácnosti'
      : `${state.childName} · ${formatAge(months)}`;

  return (
    <div className="flex min-h-full flex-col">
      <header className="sticky top-0 z-10 border-b border-line bg-paper/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-md items-center justify-between gap-3 px-4 py-2.5">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-sheen text-[11px] font-bold text-white">
              B
            </span>
            <span className="text-sm font-bold tracking-tight">BLW</span>
          </Link>
          <Link
            to="/domacnost"
            className="truncate rounded-full bg-surface px-3 py-1 text-xs text-muted shadow-soft"
            data-testid="dite-v-hlavicce"
          >
            {childLabel}
          </Link>
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
