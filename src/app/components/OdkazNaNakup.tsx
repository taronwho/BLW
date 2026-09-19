import { ShoppingBasket } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useHouseholdStore } from '@/storage/householdStore';
import { nakupPocty } from '@/nakup/pocty';
import { POLOZKA, sklonuj } from '@/text/sklonovani';

/**
 * Cesta do nákupního seznamu ze seznamu surovin i z kuchařky.
 *
 * Přidat do nákupu šlo z obou obrazovek odjakživa, ale podívat se na něj ne:
 * rodič musel zpátky na úvodní obrazovku. Přitom právě tady se seznam plní
 * a právě tady chce vidět, kolik už toho v něm je — jinak přidá potřetí
 * něco, co tam dvakrát je.
 *
 * Číslo je počet položek, ne dávek. Kolikrát se přidal konkrétní recept,
 * říká značka na samotném tlačítku „do nákupu" (`NakupTlacitko`).
 */
export function OdkazNaNakup({ testId }: { testId?: string }): ReactNode {
  const state = useHouseholdStore((store) => store.state);
  const { celkem, koupeno } = nakupPocty(state);
  const zbyva = celkem - koupeno;

  const popis =
    celkem === 0
      ? 'Nákupní seznam je prázdný'
      : `Nákupní seznam, ${sklonuj(zbyva, POLOZKA)} k nákupu z ${celkem}`;

  return (
    <Link
      to="/nakup"
      data-testid={testId ?? 'odkaz-na-nakup'}
      aria-label={popis}
      className="flex min-h-touch min-w-touch shrink-0 items-center gap-1.5 rounded-xl border border-accent/40 bg-accent-soft px-2.5 text-accent"
    >
      <ShoppingBasket aria-hidden="true" className="h-5 w-5 shrink-0" />
      {/* Prázdný seznam číslo neukazuje: nula vedle ikony vypadá jako
          rozbitý odznak a rodič, který seznam nepoužívá, ji nepotřebuje. */}
      {celkem > 0 && (
        <span aria-hidden="true" className="text-sm font-bold tabular-nums">
          {zbyva}
        </span>
      )}
    </Link>
  );
}
