import { CalendarX2 } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ingredientById } from '@/data/ingredients';
import { useHouseholdStore } from '@/storage/householdStore';
import type { Child } from '@/types';

/**
 * Suroviny, které rodič vyřadil z plánu dítěte.
 *
 * Vyřazuje se v detailu suroviny; tady je přehled na jednom místě a cesta
 * zpátky. Stahuje se zvlášť a jen když je co ukázat, protože kvůli názvům
 * sahá do katalogu, který obrazovka Domácnosti jinak nepotřebuje.
 */
export default function VyrazeneSuroviny({ dite }: { dite: Child }): ReactNode {
  const prepni = useHouseholdStore((store) => store.prepniVyrazeni);
  const vyrazene = dite.vyrazene ?? [];

  return (
    <section aria-labelledby="vyrazene-nadpis" className="flex flex-col gap-3">
      <h2
        id="vyrazene-nadpis"
        className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted"
      >
        <CalendarX2 aria-hidden="true" className="h-4 w-4 text-accent" />
        Vyřazeno z plánu: {dite.name.trim().length > 0 ? dite.name : 'dítě'}
      </h2>
      <p className="text-sm leading-relaxed">
        Tyhle suroviny plán nenabídne jako novinku ani v receptu. Suroviny s reakcí v deníku
        plán vynechává sám, ty tu nejsou.
      </p>
      <ul className="flex flex-col gap-2" data-testid="vyrazene-suroviny">
        {vyrazene.map((id) => (
          <li key={id} className="flex items-center justify-between gap-2">
            <Link to={`/suroviny/${id}`} className="min-w-0 text-sm font-medium underline underline-offset-2">
              {ingredientById.get(id)?.nameCz ?? id}
            </Link>
            <button
              type="button"
              onClick={() => void prepni(dite.id, id)}
              className="min-h-touch shrink-0 rounded-xl border border-line px-3 text-sm font-semibold text-accent"
            >
              Vrátit do plánu
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
