import { Hand } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useHouseholdStore } from '@/storage/householdStore';
import type { ChokingRisk } from '@/types';
import { ageInMonths } from '../lib/age';
import {
  GRIP_LABELS,
  GRIP_SHORT,
  GRIP_VS_AGE_NOTE,
  gripForAge,
  gripShapeAdvice,
  gripVsAge,
} from '../lib/grip';

/**
 * Tvar sousta podle úchopu — u suroviny i u receptu.
 *
 * Když rodič úchop nevybral, ukáže se ten, který k věku orientačně patří, a
 * pobídka ho upřesnit. Riziko dušení má vždycky přednost: u vysokého rizika
 * pinzetový úchop nic nepovoluje.
 */
export function GripHint({ chokingRisk }: { chokingRisk: ChokingRisk }): ReactNode {
  const state = useHouseholdStore((store) => store.state);
  const months = ageInMonths(state.childBirthDate);
  const vybrany = state.childGrip;
  const grip = vybrany ?? gripForAge(months);
  const poznamka = vybrany === undefined ? null : GRIP_VS_AGE_NOTE[gripVsAge(grip, months)];

  return (
    <div
      data-testid="tvar-podle-uchopu"
      className="flex flex-col gap-1.5 rounded-xl border border-line bg-paper p-3"
    >
      <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-semibold uppercase tracking-wide text-muted">
        <Hand aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-accent" />
        Tvar podle úchopu
        <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[10px] font-medium normal-case text-accent">
          {GRIP_LABELS[grip]} — {GRIP_SHORT[grip]}
        </span>
      </p>

      <p className="text-sm leading-relaxed">{gripShapeAdvice(grip, chokingRisk)}</p>

      {poznamka !== null && <p className="text-xs leading-relaxed text-muted">{poznamka}</p>}

      {vybrany === undefined && (
        <>
          <p className="text-xs leading-relaxed text-muted">
            Odhadnuto podle věku. Když úchop nastavíte, bude se rada řídit tím, co dítě opravdu
            umí.
          </p>
          <Link
            to="/domacnost"
            className="flex min-h-touch items-center self-start rounded-lg px-2 text-xs font-semibold text-accent underline"
          >
            Nastavit úchop v Domácnosti
          </Link>
        </>
      )}
    </div>
  );
}
