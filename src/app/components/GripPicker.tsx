import { Hand } from 'lucide-react';
import type { ReactNode } from 'react';
import { useHouseholdStore } from '@/storage/householdStore';
import { GRIPS } from '@/types';
import { GRIP_HOW_TO_TELL, GRIP_LABELS, GRIP_TYPICAL_MONTHS } from '../lib/grip';

/**
 * Výběr úchopu, který rodič u dítěte pozoruje.
 *
 * Záměrně se vybírá podle popisu toho, co je vidět, ne podle věku — v tom je
 * celý smysl. Věk u každé možnosti je uvedený jako orientace, aby nevypadal
 * jako podmínka.
 */
export function GripPicker(): ReactNode {
  const state = useHouseholdStore((store) => store.state);
  const setGrip = useHouseholdStore((store) => store.setGrip);
  const vybrany = state.childGrip;

  return (
    <fieldset className="flex flex-col gap-2" data-testid="vyber-uchopu">
      <legend className="flex items-center gap-2 text-sm font-semibold">
        <Hand aria-hidden="true" className="h-4 w-4 shrink-0 text-accent" />
        Jak dítě bere jídlo
      </legend>
      <p className="text-xs leading-relaxed text-muted">
        Úchop rozhoduje o tvaru sousta — co dítě z tácku vůbec zvedne. Co se smí nabízet a jak
        měkké to musí být, se dál řídí věkem.
      </p>

      <ul className="flex flex-col gap-2">
        {GRIPS.map((grip) => {
          const active = grip === vybrany;
          return (
            <li key={grip}>
              <button
                type="button"
                aria-pressed={active}
                data-testid={`uchop-${grip}`}
                onClick={() => void setGrip(active ? undefined : grip)}
                className={`flex w-full flex-col gap-1 rounded-xl border px-3 py-3 text-left transition ${
                  active ? 'border-accent bg-accent-soft' : 'border-line bg-surface'
                }`}
              >
                <span className="flex flex-wrap items-baseline gap-x-2">
                  <span className={`text-sm font-semibold ${active ? 'text-accent' : ''}`}>
                    {GRIP_LABELS[grip]} úchop
                  </span>
                  <span className="text-[11px] text-muted">{GRIP_TYPICAL_MONTHS[grip]}</span>
                </span>
                <span className="text-xs leading-relaxed text-muted">{GRIP_HOW_TO_TELL[grip]}</span>
              </button>
            </li>
          );
        })}
      </ul>

      {vybrany === undefined ? (
        <p className="text-xs text-muted">
          Nevybráno — aplikace zatím radí tvar jen podle věku. Vybrat se dá kdykoli a jde to i
          změnit zpět.
        </p>
      ) : (
        <button
          type="button"
          data-testid="uchop-zrusit"
          onClick={() => void setGrip(undefined)}
          className="min-h-touch self-start text-xs font-medium text-muted underline"
        >
          Zrušit výběr úchopu
        </button>
      )}
    </fieldset>
  );
}
