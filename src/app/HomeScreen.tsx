import { BookOpen, Carrot, NotebookPen, Users } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ingredients } from '@/data/ingredients';
import { recipes } from '@/data/recipes';
import { DISCLAIMER_PARAGRAPHS } from './disclaimer';

/**
 * Kostra fáze 0 — název a disclaimer. Skutečné obrazovky přijdou ve fázi 4
 * podle docs/SPEC.md kapitola 4.
 */
export function HomeScreen(): ReactNode {
  const planned = [
    { label: 'Suroviny', icon: Carrot, count: ingredients.length },
    { label: 'Recepty', icon: BookOpen, count: recipes.length },
    { label: 'Deník', icon: NotebookPen, count: 0 },
    { label: 'Domácnost', icon: Users, count: 0 },
  ];

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold leading-tight">BLW — příkrmy pro celou rodinu</h1>
        <p className="text-sm text-muted">
          Katalog surovin, recepty ve třech liniích a deník ochutnávek. Zatím se staví.
        </p>
      </header>

      <section aria-labelledby="sekce-obrazovky" className="flex flex-col gap-2">
        <h2 id="sekce-obrazovky" className="text-sm font-semibold uppercase tracking-wide text-muted">
          Obrazovky
        </h2>
        <ul className="grid grid-cols-2 gap-2">
          {planned.map(({ label, icon: Icon, count }) => (
            <li
              key={label}
              className="flex min-h-touch flex-col gap-1 rounded-xl bg-surface p-3 text-sm"
            >
              <span className="flex items-center gap-2 font-medium">
                <Icon aria-hidden="true" className="h-4 w-4 shrink-0 text-accent" />
                {label}
              </span>
              <span className="text-xs text-muted">{count} položek</span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="sekce-nastaveni" className="flex flex-col gap-2">
        <h2 id="sekce-nastaveni" className="text-sm font-semibold uppercase tracking-wide text-muted">
          Nastavení
        </h2>
        <Link
          to="/domacnost"
          className="flex min-h-touch items-center gap-2 rounded-xl bg-surface p-3 text-sm font-medium"
        >
          <Users aria-hidden="true" className="h-4 w-4 shrink-0 text-accent" />
          Domácnost, párovací kód a synchronizace
        </Link>
      </section>

      <section aria-labelledby="sekce-disclaimer" className="flex flex-col gap-2">
        <h2 id="sekce-disclaimer" className="text-sm font-semibold uppercase tracking-wide text-muted">
          Důležité
        </h2>
        <div className="flex flex-col gap-2 rounded-xl bg-surface p-3">
          {DISCLAIMER_PARAGRAPHS.map((paragraph) => (
            <p key={paragraph.slice(0, 24)} className="text-xs leading-relaxed text-muted">
              {paragraph}
            </p>
          ))}
        </div>
      </section>
    </div>
  );
}
