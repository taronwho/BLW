import { BookOpen, Carrot, NotebookPen, Users } from 'lucide-react';
import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';

const ITEMS = [
  { to: '/suroviny', label: 'Suroviny', Icon: Carrot },
  { to: '/recepty', label: 'Recepty', Icon: BookOpen },
  { to: '/denik', label: 'Deník', Icon: NotebookPen },
  { to: '/domacnost', label: 'Domácnost', Icon: Users },
];

/** Spodní navigace ze SPEC 4. Respektuje safe-area, ať ji nepřekryje gesto-bar. */
export function BottomNav(): ReactNode {
  return (
    <nav
      aria-label="Hlavní navigace"
      data-testid="spodni-navigace"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-muted/20 bg-surface pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="mx-auto flex max-w-md">
        {ITEMS.map(({ to, label, Icon }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              className={({ isActive }) =>
                `flex min-h-touch flex-col items-center justify-center gap-0.5 px-1 py-2 text-[11px] font-medium ${
                  isActive ? 'text-accent' : 'text-muted'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon aria-hidden="true" className="h-5 w-5 shrink-0" />
                  <span>{label}</span>
                  {isActive && <span className="sr-only">(aktuální)</span>}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
