import { Info } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useHouseholdStore } from '@/storage/householdStore';
import type { Stage } from '@/types';
import { READY_MISSING_LABELS, missingSigns, shouldWarnAboutReadiness } from '../lib/readiness';

/**
 * Upozornění u fáze 6m+, že šest měsíců není pevné datum.
 *
 * Ukazuje se, dokud rodič neodškrtne všechny tři znaky připravenosti. U vyšších
 * fází mlčí — tam už dítě dávno jí a připomínka by byla jen šum.
 */
export function ReadinessNote({ stage }: { stage: Stage }): ReactNode {
  const state = useHouseholdStore((store) => store.state);
  if (stage !== '6m' || !shouldWarnAboutReadiness(state)) return null;

  const chybi = missingSigns(state);
  const vseChybi = chybi.length === 3;

  return (
    <div
      data-testid="upozorneni-pripravenost"
      className="flex flex-col gap-2 rounded-xl border border-caution/40 bg-caution-soft px-3 py-2"
    >
      <p className="flex items-start gap-2 text-xs leading-relaxed">
        <Info aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        <span>
          Šest měsíců není pevné datum. Začít se má, až jsou pohromadě tři vývojové znaky —{' '}
          {vseChybi ? (
            <>zatím není odškrtnutý ani jeden.</>
          ) : (
            <>
              zbývá{' '}
              {chybi.map((sign, i) => (
                <span key={sign}>
                  {i > 0 ? ' a ' : ''}
                  <strong className="font-semibold">{READY_MISSING_LABELS[sign]}</strong>
                </span>
              ))}
              .
            </>
          )}
        </span>
      </p>
      {/* Odkazy stojí mimo větu — v textu by měly dotykový cíl pod 44 px. */}
      <div className="flex flex-wrap gap-2">
        <Link
          to="/domacnost"
          className="flex min-h-touch items-center rounded-lg bg-surface px-3 text-xs font-semibold text-accent"
        >
          Projít znaky v Domácnosti
        </Link>
        <Link
          to="/rady/je-dite-pripravene"
          className="flex min-h-touch items-center rounded-lg bg-surface px-3 text-xs font-semibold text-accent"
        >
          Rada: Je dítě připravené?
        </Link>
      </div>
    </div>
  );
}
