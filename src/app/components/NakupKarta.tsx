import { ShoppingBasket } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useHouseholdStore } from '@/storage/householdStore';
import { nakupPocty } from '@/nakup/pocty';

/**
 * Nákupní seznam na úvodní obrazovce.
 *
 * Stojí v řádce vedle deníku jako dlaždice, ne přes celou šířku: hlavní
 * kartou zůstává plán, tohle jsou dvě čísla, na která se rodič kouká cestou.
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
      ? 'Zatím prázdný'
      : zbyva === 0
        ? `Hotovo, ${celkem} v košíku`
        : `Zbývá ${zbyva} z ${celkem}`;

  return (
    <Link
      to="/nakup"
      data-testid="karta-nakupu"
      aria-label={`Nákupní seznam. ${popis}.`}
      className="flex flex-col gap-0.5 rounded-xl border border-line bg-surface p-2 shadow-soft"
    >
      <span className="flex items-center gap-1.5">
        <ShoppingBasket aria-hidden="true" className="h-4 w-4 shrink-0 text-accent" />
        <span className="text-[13px] font-bold leading-tight">Nákupní seznam</span>
      </span>
      <span className="text-[11px] leading-tight text-ink/75">{popis}</span>
      {celkem > 0 && (
        <span className="mt-0.5 flex items-center gap-1.5">
          <span className="block h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-accent/20">
            <span
              className="block h-full rounded-full bg-accent transition-all"
              style={{ width: `${(koupeno / celkem) * 100}%` }}
            />
          </span>
          <span className="shrink-0 text-[10px] font-semibold tabular-nums text-ink/75">
            {koupeno}/{celkem}
          </span>
        </span>
      )}
    </Link>
  );
}
