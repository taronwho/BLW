import { Check, ChevronRight, SkipForward, X } from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { ingredientById, recipeById } from '@/data';
import { stavDne, type Plan, type PlanDen } from '@/plan/typy';
import { useModalFokus } from '../lib/modalFokus';
import { TYP_JIDLA_LABELS } from '../lib/plan';
import { ChokingBadge } from './ChokingBadge';
import { IngredientIcon } from './IngredientIcon';

/**
 * Nová surovina dne jako řádek s ikonou.
 *
 * Sdílí ji mřížka plánu i náhled dne, aby se v obou místech jmenovala
 * a značila stejně.
 */
export function NovinkaRadek({ id }: { id: string }): ReactNode {
  const item = ingredientById.get(id);
  if (item === undefined) return null;
  return (
    <Link
      to={`/suroviny/${item.id}`}
      className="flex min-h-touch min-w-0 items-center gap-2 rounded-lg bg-paper px-2 py-1"
    >
      <IngredientIcon ingredient={item} className="h-5 w-5 shrink-0" />
      <span className="flex min-w-0 flex-col leading-tight">
        <span className="text-[10px] uppercase tracking-wide text-muted">nová surovina</span>
        <span className="truncate text-xs font-medium">{item.nameCz}</span>
      </span>
      {/* Riziko dušení patří ke každé surovině, kterou aplikace nabízí.
          Plán nabízí nízké a střední; slovo u něj musí být i tak. */}
      <ChokingBadge risk={item.chokingRisk} />
    </Link>
  );
}

/**
 * Jídla dne pod sebou, bez postupů. Ty jsou v detailu dne.
 *
 * Když je jediné jídlo dne ta nová surovina bez receptu, vypisovat ji podruhé
 * pod řádkem s novinkou by jen zabralo místo a nic nepřidalo.
 */
export function JidlaDne({ den }: { den: PlanDen }): ReactNode {
  const jenNovinka = den.jidla.every((jidlo) => jidlo.ingredientId === den.novinka);
  if (jenNovinka) return null;
  return (
    <ul className="flex flex-col gap-1">
      {den.jidla.map((jidlo, i) => {
        const recept = recipeById.get(jidlo.recipeId ?? '');
        const surovina = ingredientById.get(jidlo.ingredientId ?? '');
        const nazev = recept?.titleCz ?? surovina?.nameCz ?? '';
        if (nazev.length === 0) return null;
        return (
          <li key={`${jidlo.typ}-${i}`} className="flex items-baseline gap-2 text-xs">
            <span className="w-14 shrink-0 text-[10px] uppercase tracking-wide text-muted">
              {TYP_JIDLA_LABELS[jidlo.typ]}
            </span>
            <span className="min-w-0 flex-1 truncate font-medium">{nazev}</span>
          </li>
        );
      })}
    </ul>
  );
}

const STAV_POPIS = {
  ceka: 'čeká',
  hotovo: 'hotovo',
  preskoceno: 'přeskočeno',
} as const;

/**
 * Náhled dne z mřížky plánu.
 *
 * Číslo v mřížce dřív vedlo rovnou na celou stránku dne, takže zvědavé
 * klepnutí („co je devátého?") znamenalo odejít z plánu a vracet se zpátky.
 * Náhled odpoví na místě a celou stránku otevře, až o ni rodič stojí.
 */
export function PlanDenNahled({
  plan,
  den,
  onZavrit,
}: {
  plan: Plan;
  den: PlanDen;
  onZavrit: () => void;
}): ReactNode {
  const okenko = useModalFokus<HTMLDivElement>(true);
  const stav = stavDne(plan, den.cislo);

  useEffect(() => {
    const naKlavesu = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') onZavrit();
    };
    window.addEventListener('keydown', naKlavesu);
    return () => window.removeEventListener('keydown', naKlavesu);
  }, [onZavrit]);

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Náhled dne ${den.cislo}`}
      data-testid="plan-den-nahled"
      className="fixed inset-0 z-50 flex items-end justify-center bg-scrim/50 p-3 sm:items-center"
      onClick={onZavrit}
    >
      <div
        ref={okenko}
        className="flex max-h-[85vh] w-full max-w-md animate-vyskoceni flex-col gap-3 overflow-y-auto rounded-2xl bg-surface p-4 shadow-lift"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-2">
          <h2 className="flex items-center gap-2 text-base font-bold">
            Den {den.cislo}
            <span
              data-testid="nahled-stav"
              className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                stav === 'hotovo'
                  ? 'bg-accent-soft text-accent-deep'
                  : stav === 'preskoceno'
                    ? 'bg-paper text-muted'
                    : 'bg-paper text-muted'
              }`}
            >
              {stav === 'hotovo' && <Check aria-hidden="true" className="h-3 w-3 shrink-0" />}
              {stav === 'preskoceno' && (
                <SkipForward aria-hidden="true" className="h-3 w-3 shrink-0" />
              )}
              {STAV_POPIS[stav]}
            </span>
          </h2>
          <button
            type="button"
            aria-label="Zavřít"
            data-testid="nahled-zavrit"
            onClick={onZavrit}
            className="flex min-h-touch min-w-touch shrink-0 items-center justify-center rounded-lg text-muted"
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>

        {den.novinka === undefined ? (
          <p className="text-xs leading-relaxed text-muted">
            Tenhle den je bez nové suroviny, poskládaný z osvědčeného.
          </p>
        ) : (
          <NovinkaRadek id={den.novinka} />
        )}

        <JidlaDne den={den} />

        <Link
          to={`/plan/den/${den.cislo}`}
          data-testid="nahled-cely-den"
          className="flex min-h-touch items-center justify-center gap-2 rounded-xl bg-accent px-4 text-sm font-semibold text-on-accent"
        >
          Otevřít celý den
          <ChevronRight aria-hidden="true" className="h-4 w-4 shrink-0" />
        </Link>
      </div>
    </div>,
    document.body,
  );
}
