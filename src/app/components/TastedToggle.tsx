import { Check, Plus } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useHouseholdStore } from '@/storage/householdStore';
import { todayIso } from '../lib/labels';

interface Props {
  ingredientId: string;
  ingredientName: string;
  tasted: boolean;
}

/**
 * Rychlý zápis ochutnávky ze seznamu.
 *
 * Jakmile je u suroviny aspoň jeden záznam, tlačítko se mění v odkaz do
 * detailu. Dřív každé další klepnutí přidalo další ochutnávku a nešlo to
 * vzít zpět — omylem přidaný záznam se teď maže i upravuje v detailu.
 */
export function TastedToggle({ ingredientId, ingredientName, tasted }: Props): ReactNode {
  const recordTasting = useHouseholdStore((store) => store.recordTasting);
  const status = useHouseholdStore((store) => store.status);
  const createdBy = status.kind === 'connected' ? status.uid : 'toto-zarizeni';

  if (tasted) {
    return (
      <Link
        to={`/suroviny/${ingredientId}`}
        data-testid={`ochutnano-${ingredientId}`}
        aria-label={`${ingredientName}: ochutnáno, otevřít záznamy`}
        className="flex min-h-touch min-w-touch shrink-0 items-center justify-center rounded-xl border border-safe bg-safe/10 px-3 text-safe"
      >
        <Check aria-hidden="true" className="h-5 w-5 shrink-0" />
      </Link>
    );
  }

  return (
    <button
      type="button"
      aria-pressed={false}
      data-testid={`ochutnano-${ingredientId}`}
      aria-label={`${ingredientName}: označit jako ochutnáno`}
      onClick={() => {
        void recordTasting({
          ingredientId,
          date: todayIso(),
          amount: 'ochutnala',
          reaction: 'zadna',
          createdBy,
        });
      }}
      className="flex min-h-touch min-w-touch shrink-0 items-center justify-center rounded-xl border border-line bg-surface px-3 text-muted transition hover:border-accent hover:text-accent"
    >
      <Plus aria-hidden="true" className="h-5 w-5 shrink-0" />
    </button>
  );
}
