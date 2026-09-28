import { ChevronRight, Hand } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useHouseholdStore } from '@/storage/householdStore';
import { GRIPS } from '@/types';
import { GRIP_HOW_TO_TELL, GRIP_LABELS, GRIP_SHAPE, GRIP_TYPICAL_MONTHS } from '../lib/grip';
import { maObrazek } from '../lib/obrazkySousta';
import { ObrazekUchopu } from './ObrazkySousta';
import type { Child } from '@/types';

/**
 * Výběr úchopu, který rodič u dítěte pozoruje.
 *
 * Záměrně se vybírá podle popisu toho, co je vidět, ne podle věku — v tom je
 * celý smysl. Věk u každé možnosti je uvedený jako orientace, aby nevypadal
 * jako podmínka.
 *
 * U každé možnosti je obrázek ruky, aby šlo úchop poznat na první pohled,
 * a u vybrané i tvar sousta, který z něj plyne — stejný text jako
 * v průvodci tvarem sousta a u každé suroviny.
 */
export function GripPicker({ dite }: { dite: Child }): ReactNode {
  const setGrip = useHouseholdStore((store) => store.setGrip);
  const vybrany = dite.grip;

  return (
    <fieldset className="flex flex-col gap-2" data-testid="vyber-uchopu">
      <legend className="flex items-center gap-2 text-sm font-semibold">
        <Hand aria-hidden="true" className="h-4 w-4 shrink-0 text-accent" />
        Jak dítě bere jídlo
      </legend>
      <p className="text-xs leading-relaxed text-muted">
        Úchop rozhoduje o tvaru sousta: co dítě z tácku vůbec zvedne. Co se smí nabízet a jak
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
                onClick={() => void setGrip(dite.id, active ? undefined : grip)}
                className={`flex w-full items-start gap-3 rounded-xl border px-3 py-3 text-left transition ${
                  active ? 'border-accent bg-accent-soft' : 'border-line bg-surface'
                }`}
              >
                {maObrazek(`uchop-${grip}`) && (
                  <span aria-hidden="true" className="block w-20 shrink-0 overflow-hidden rounded-lg">
                    <ObrazekUchopu grip={grip} />
                  </span>
                )}
                <span className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="flex flex-wrap items-baseline gap-x-2">
                    <span className={`text-sm font-semibold ${active ? 'text-accent' : ''}`}>
                      {GRIP_LABELS[grip]} úchop
                    </span>
                    <span className="text-[11px] text-muted">{GRIP_TYPICAL_MONTHS[grip]}</span>
                  </span>
                  <span className="text-xs leading-relaxed text-muted">{GRIP_HOW_TO_TELL[grip]}</span>
                  {active && (
                    <span className="text-xs leading-relaxed" data-testid="uchop-tvar">
                      <strong className="font-semibold">Tvar sousta: </strong>
                      {GRIP_SHAPE[grip]}
                    </span>
                  )}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <Link
        to={vybrany === undefined ? '/tvar-sousta' : `/tvar-sousta?uchop=${vybrany}`}
        data-testid="uchop-pruvodce"
        className="flex min-h-touch items-center gap-1 self-start text-sm font-medium text-accent"
      >
        Průvodce tvarem sousta s obrázky
        <ChevronRight aria-hidden="true" className="h-4 w-4 shrink-0" />
      </Link>

      {vybrany === undefined ? (
        <p className="text-xs text-muted">
          Nevybráno. Aplikace zatím radí tvar jen podle věku. Vybrat se dá kdykoli a jde to i
          změnit zpět.
        </p>
      ) : (
        <button
          type="button"
          data-testid="uchop-zrusit"
          onClick={() => void setGrip(dite.id, undefined)}
          className="min-h-touch self-start text-xs font-medium text-muted underline"
        >
          Zrušit výběr úchopu
        </button>
      )}
    </fieldset>
  );
}
