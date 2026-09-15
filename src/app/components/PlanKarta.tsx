import { CalendarCheck, ChevronRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useHouseholdStore } from '@/storage/householdStore';
import { DNU_V_BLOKU, blokDokoncen, dalsiDen, vyrizenoDnu } from '@/plan/typy';
import { useAktivniDite } from '../lib/dite';

/**
 * Plán na úvodní obrazovce.
 *
 * Schválně bez jediného importu katalogu: úvodní obrazovka je v prvním balíku
 * aplikace a stačí jí číslo dne a postup. Názvy surovin a recepty se dotahují
 * až na obrazovce plánu, kterou si stáhne jen ten, kdo ji otevře.
 */
export function PlanKarta(): ReactNode {
  const dite = useAktivniDite();
  const plans = useHouseholdStore((store) => store.state.plans);
  const plan = dite === null ? null : (plans?.[dite.id]?.hodnota ?? null);

  const popis =
    plan === null
      ? 'Třicet dnů dopředu: každý den jedna nová surovina a k ní celá jídla s recepty.'
      : blokDokoncen(plan)
        ? `Blok ${plan.blok} je hotový. Dalších třicet dní se sestaví z toho, co zbývá.`
        : `Na řadě je den ${dalsiDen(plan)?.cislo ?? 1} z ${DNU_V_BLOKU}.`;

  return (
    <Link
      to="/plan"
      data-testid="karta-planu"
      className="flex items-center gap-3 rounded-xl border border-accent/30 bg-accent-sheen p-3 text-white shadow-soft"
    >
      <CalendarCheck aria-hidden="true" className="h-6 w-6 shrink-0" />
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5">
          <span className="text-sm font-bold">30denní plán</span>
          {plan !== null && (
            <span className="rounded-full bg-white/25 px-2 py-0.5 text-[10px] font-semibold">
              {plan.blok}. blok
            </span>
          )}
        </span>
        <span className="block text-[11px] leading-snug">{popis}</span>
        {plan !== null && (
          <span
            role="progressbar"
            aria-valuenow={vyrizenoDnu(plan)}
            aria-valuemin={0}
            aria-valuemax={DNU_V_BLOKU}
            aria-label="Postup v plánu"
            className="mt-1.5 block h-1.5 overflow-hidden rounded-full bg-white/25"
          >
            <span
              className="block h-full rounded-full bg-white"
              style={{ width: `${(vyrizenoDnu(plan) / DNU_V_BLOKU) * 100}%` }}
            />
          </span>
        )}
      </span>
      <ChevronRight aria-hidden="true" className="h-4 w-4 shrink-0" />
    </Link>
  );
}
