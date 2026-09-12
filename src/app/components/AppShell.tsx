import { BookOpen, Carrot, NotebookPen, Users } from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useHouseholdStore } from '@/storage/householdStore';
import { ageInMonths, formatAge } from '../lib/age';

const NAV = [
  { to: '/suroviny', label: 'Suroviny', Icon: Carrot },
  { to: '/recepty', label: 'Recepty', Icon: BookOpen },
  { to: '/denik', label: 'Deník', Icon: NotebookPen },
  { to: '/domacnost', label: 'Domácnost', Icon: Users },
] as const;

/** Spodní navigace se čtyřmi položkami a jediný landmark `main` na stránku. */
export function AppShell({ children }: { children: ReactNode }): ReactNode {
  const init = useHouseholdStore((store) => store.init);
  const state = useHouseholdStore((store) => store.state);

  useEffect(() => {
    void init();
  }, [init]);

  const months = ageInMonths(state.childBirthDate);
  const childLabel =
    state.childName.trim().length === 0 ? 'Nastav dceru v Domácnosti' : `${state.childName} · ${formatAge(months)}`;

  return (
    <div className="flex min-h-full flex-col">
      <header className="sticky top-0 z-10 border-b border-muted/15 bg-paper/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-md items-center justify-between gap-3 px-4 py-2">
          <p className="text-sm font-bold tracking-tight">BLW</p>
          <p className="truncate text-xs text-muted" data-testid="dite-v-hlavicce">
            {childLabel}
          </p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-md flex-1 px-4 pb-28 pt-4">{children}</main>

      <nav
        aria-label="Hlavní navigace"
        className="fixed inset-x-0 bottom-0 z-20 border-t border-muted/15 bg-surface pb-safe-b"
      >
        <ul className="mx-auto flex w-full max-w-md">
          {NAV.map(({ to, label, Icon }) => (
            <li key={to} className="flex-1">
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `flex min-h-touch min-w-touch flex-col items-center justify-center gap-0.5 px-1 py-2 text-[11px] font-medium ${
                    isActive ? 'text-accent' : 'text-muted'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon aria-hidden="true" className="h-5 w-5 shrink-0" />
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
