import { Check, Plus } from 'lucide-react';
import type { ReactNode } from 'react';
import { useHouseholdStore } from '@/storage/householdStore';
import { todayIso } from '../lib/labels';

interface Props {
  ingredientId: string;
  ingredientName: string;
  tasted: boolean;
  /** V detailu je u tlačítka i text, v seznamu jen ikona s popiskem pro čtečku. */
  withLabel?: boolean;
}

/**
 * Zaškrtnutí „ochutnáno" jedním klepnutím (docs/SPEC.md kap. 4.1).
 * Záznamy jsou append-only, takže další klepnutí přidá další ochutnávku —
 * nic se nepřepisuje ani nemaže (docs/SPEC.md kap. 7).
 */
export function TastedToggle({ ingredientId, ingredientName, tasted, withLabel = false }: Props): ReactNode {
  const recordTasting = useHouseholdStore((store) => store.recordTasting);
  const status = useHouseholdStore((store) => store.status);
  const createdBy = status.kind === 'connected' ? status.uid : 'toto-zarizeni';

  return (
    <button
      type="button"
      aria-pressed={tasted}
      data-testid={`ochutnano-${ingredientId}`}
      aria-label={tasted ? `${ingredientName}: přidat další ochutnávku` : `${ingredientName}: označit jako ochutnáno`}
      onClick={() => {
        void recordTasting({
          ingredientId,
          date: todayIso(),
          amount: 'ochutnala',
          reaction: 'zadna',
          createdBy,
        });
      }}
      className={`flex min-h-touch min-w-touch shrink-0 items-center justify-center gap-2 rounded-xl border px-3 ${
        tasted ? 'border-safe bg-safe/10 text-safe' : 'border-muted/30 bg-surface text-muted'
      }`}
    >
      {tasted ? (
        <Check aria-hidden="true" className="h-5 w-5 shrink-0" />
      ) : (
        <Plus aria-hidden="true" className="h-5 w-5 shrink-0" />
      )}
      {withLabel && (
        <span className="text-sm font-semibold">{tasted ? 'Ochutnáno' : 'Zaznamenat ochutnávku'}</span>
      )}
    </button>
  );
}
