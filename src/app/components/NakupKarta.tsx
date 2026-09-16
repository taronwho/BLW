import { ChevronRight, ShoppingBasket } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useHouseholdStore } from '@/storage/householdStore';
import { nakupPocty } from '@/nakup/pocty';

/**
 * Nákupní seznam na úvodní obrazovce.
 *
 * Schválně bez jediného importu katalogu: čísla se dají spočítat z uloženého
 * stavu, takže kvůli kartě nemusí rodič stahovat celou kuchařku. Názvy
 * surovin se dotáhnou až na obrazovce seznamu.
 */
export function NakupKarta(): ReactNode {
  const state = useHouseholdStore((store) => store.state);
  const { celkem, koupeno } = nakupPocty(state);
  const zbyva = celkem - koupeno;

  const popis =
    celkem === 0
      ? 'Přidej recept nebo surovinu a množství se sečtou dohromady.'
      : zbyva === 0
        ? 'Všechno odškrtnuté. Seznam je hotový.'
        : `Zbývá koupit ${zbyva} ${zbyva === 1 ? 'položku' : zbyva <= 4 ? 'položky' : 'položek'}.`;

  return (
    <Link
      to="/nakup"
      data-testid="karta-nakupu"
      aria-label={`Nákupní seznam. ${popis}`}
      className="flex items-stretch gap-3 rounded-2xl border border-line bg-surface p-2.5 shadow-soft"
    >
      <span className="flex w-12 shrink-0 flex-col items-center justify-center gap-0.5 rounded-xl bg-accent-soft leading-none text-accent">
        {celkem === 0 ? (
          <ShoppingBasket aria-hidden="true" className="h-6 w-6" />
        ) : (
          <>
            <span className="text-xl font-bold tabular-nums">{zbyva}</span>
            <span className="text-[9px] uppercase tracking-wider opacity-90">
              {koupeno > 0 ? `z ${celkem}` : 'k nákupu'}
            </span>
          </>
        )}
      </span>

      <span className="flex min-w-0 flex-1 flex-col justify-center gap-0.5">
        <span className="text-base font-bold leading-tight">Nákupní seznam</span>
        <span className="block text-[11px] leading-snug text-ink/75">{popis}</span>
      </span>

      <span className="flex shrink-0 items-center text-accent">
        <ChevronRight aria-hidden="true" className="h-5 w-5" />
      </span>
    </Link>
  );
}
