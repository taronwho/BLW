import { Check, Sprout } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useHouseholdStore } from '@/storage/householdStore';
import { READY_SIGNS } from '@/types';
import { READY_HOW_TO_TELL, READY_LABELS, hasSign, isReady } from '../lib/readiness';
import type { Child } from '@/types';

/**
 * Tři znaky připravenosti k odškrtnutí.
 *
 * Stejná logika jako u úchopu: vybírá se podle toho, co je u dítěte vidět, ne
 * podle věku. Dokud nejsou všechny tři, ukazuje se u fáze 6m+ upozornění, že
 * šest měsíců není pevné datum.
 */
export function ReadinessPicker({ dite }: { dite: Child }): ReactNode {
  const toggleReadySign = useHouseholdStore((store) => store.toggleReadySign);
  const hotovo = isReady(dite);

  return (
    <fieldset className="flex flex-col gap-2" data-testid="vyber-pripravenosti">
      <legend className="flex items-center gap-2 text-sm font-semibold">
        <Sprout aria-hidden="true" className="h-4 w-4 shrink-0 text-accent" />
        Připravenost na příkrm
      </legend>
      <p className="text-xs leading-relaxed text-muted">
        Nerozhoduje datum v kalendáři, ale tyhle tři znaky. Dokud nejsou pohromadě, nemá začínat
        žádná metoda příkrmu, ani lžička.
      </p>

      <ul className="flex flex-col gap-2">
        {READY_SIGNS.map((sign) => {
          const active = hasSign(dite, sign);
          return (
            <li key={sign}>
              <button
                type="button"
                role="switch"
                aria-checked={active}
                data-testid={`znak-${sign}`}
                onClick={() => void toggleReadySign(dite.id, sign)}
                className={`flex w-full items-start gap-3 rounded-xl border px-3 py-3 text-left transition ${
                  active ? 'border-safe bg-safe-soft' : 'border-line bg-surface'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                    active ? 'border-safe bg-safe text-on-accent' : 'border-muted/50'
                  }`}
                >
                  {active && <Check className="h-3.5 w-3.5" />}
                </span>
                <span className="flex min-w-0 flex-col gap-1">
                  <span className={`text-sm font-semibold ${active ? 'text-safe' : ''}`}>
                    {READY_LABELS[sign]}
                  </span>
                  <span className="text-xs leading-relaxed text-muted">
                    {READY_HOW_TO_TELL[sign]}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <p className="text-xs leading-relaxed text-muted" data-testid="stav-pripravenosti">
        {hotovo
          ? 'Všechny tři znaky jsou pohromadě. Upozornění u fáze 6m+ se už nezobrazuje.'
          : 'Dokud nejsou všechny tři, ukazuje se u fáze 6m+ připomínka.'}
      </p>
      <Link
        to="/rady/je-dite-pripravene"
        className="flex min-h-touch items-center self-start rounded-lg px-2 text-xs font-semibold text-accent underline"
      >
        Rada: Je dítě připravené?
      </Link>
    </fieldset>
  );
}
