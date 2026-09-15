import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { lists } from '@/data';
import { useHouseholdStore } from '@/storage/householdStore';
import { SeznamDlazdice } from '../components/SeznamDlazdice';
import { useAktivniDiteId } from '../lib/dite';
import { tastedIds } from '../lib/tastings';

/** Všechny tematické seznamy surovin. */
export function ListsScreen(): ReactNode {
  const state = useHouseholdStore((store) => store.state);
  const diteId = useAktivniDiteId();
  const tasted = useMemo(() => tastedIds(state, diteId), [state, diteId]);

  return (
    <section className="flex flex-col gap-3" aria-labelledby="seznamy-nadpis">
      <h1 id="seznamy-nadpis" className="text-xl font-bold">
        Seznamy
      </h1>
      <p className="text-sm leading-relaxed text-muted">
        Hotové odpovědi na otázky, které katalog sám nezodpoví: čím začít, kde vzít železo, u čeho
        si dát pozor na tvar. Položky jsou tytéž suroviny jako v katalogu, se stejnými zdroji.
      </p>

      <ul className="grid grid-cols-2 items-stretch gap-2" data-testid="seznam-seznamu">
        {lists.map((seznam) => (
          <li key={seznam.id} className="flex">
            <SeznamDlazdice
              seznam={seznam}
              ochutnano={seznam.ingredientIds.filter((id) => tasted.has(id)).length}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
