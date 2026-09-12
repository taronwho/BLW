import type { ReactNode } from 'react';
import { CHOKING_PRESENTATION } from '../lib/choking';
import { ChokingBadge } from './ChokingBadge';

/**
 * Vysvětlivka stupnice rizika dušení. Je na obrazovkách, kde se nevypisuje
 * konkrétní surovina (Deník, Domácnost), aby riziko bylo sdělené barvou,
 * ikonou i slovem úplně všude.
 */
export function ChokingLegend(): ReactNode {
  return (
    <section aria-labelledby="legenda-riziko" className="flex flex-col gap-2 rounded-xl bg-surface p-4">
      <h2 id="legenda-riziko" className="text-sm font-semibold">
        Stupnice rizika dušení
      </h2>
      <ul className="flex flex-col gap-2">
        {(['low', 'medium', 'high'] as const).map((risk) => (
          <li key={risk} className="flex flex-col gap-1">
            <ChokingBadge risk={risk} />
            <p className="text-xs leading-relaxed text-muted">{CHOKING_PRESENTATION[risk].meaning}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
