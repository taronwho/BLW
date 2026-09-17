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
        ? 'Všechno v košíku'
        : `${zbyva} ${zbyva === 1 ? 'položka' : zbyva <= 4 ? 'položky' : 'položek'} k nákupu`;

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
      {/* Jedna věta, žádné počitadlo navíc. Dvojí číslo („zbývá 9 z 9"
          a k tomu proužek s 0/9) říkalo totéž dvakrát a dlaždici to jen
          zaplnilo. */}
      <span className="text-[11px] leading-tight text-ink/75">{popis}</span>
    </Link>
  );
}
