import type { ReactNode } from 'react';
import type { ChokingRisk } from '@/types';
import { CHOKING_PRESENTATION } from '../lib/choking';

interface Props {
  risk: ChokingRisk;
  /** Konkrétní důvod z katalogu — v detailu se ukazuje, v seznamu ne. */
  reason?: string | undefined;
}

/**
 * Štítek rizika dušení: barva + ikona + slovo zároveň (docs/SPEC.md kap. 5).
 * Samotná barva by v kuchyňském světle ani při daltonismu nestačila, proto
 * je slovo „Nízké/Střední/Vysoké riziko dušení" součástí štítku vždycky.
 */
export function ChokingBadge({ risk, reason }: Props): ReactNode {
  const { word, Icon, text, chip } = CHOKING_PRESENTATION[risk];
  return (
    <span
      data-testid="riziko-duseni"
      data-risk={risk}
      className={`inline-flex max-w-full items-center gap-1.5 rounded-lg border px-2 py-1 text-xs font-semibold ${chip} ${text}`}
    >
      <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />
      <span>
        {word} riziko dušení{reason === undefined ? '' : `. ${reason}`}
      </span>
    </span>
  );
}
