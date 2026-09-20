import { ChevronRight, ShoppingBasket } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useHouseholdStore } from '@/storage/householdStore';
import { nakupPocty } from '@/nakup/pocty';
import { POLOZKA, sklonuj } from '@/text/sklonovani';

/**
 * Nákupní seznam na úvodní obrazovce.
 *
 * Ze všech řádek rozcestníku je tahle jediná, kterou rodič otevírá venku
 * u regálu, ne doma u sporáku — a hledá ji přitom ve spěchu a jednou rukou.
 * Proto má vlastní podobu: barevný rám, plnou ikonu v rámečku a proužek
 * postupu, kolik z nákupu je už v košíku. Ostatní řádky jsou tiché.
 *
 * Od karty plánu ji odlišuje směr: plán je světlý s plnou zelenou na
 * číslici dne, tohle je plná zelená plocha s bílým textem. Dvě zelené
 * karty ve stejném provedení by splynuly v jednu.
 *
 * Schválně bez jediného importu katalogu: čísla se dají spočítat z uloženého
 * stavu, takže kvůli kartě nemusí rodič stahovat celou kuchařku. Názvy
 * surovin se dotáhnou až na obrazovce seznamu.
 */
export function NakupKarta(): ReactNode {
  const state = useHouseholdStore((store) => store.state);
  const { celkem, koupeno } = nakupPocty(state);
  const zbyva = celkem - koupeno;

  /**
   * Jedno číslo: kolik věcí ještě není v košíku.
   *
   * Žádný proužek ani poměr „0 ze 7". Proužek měří postup k pevnému cíli —
   * u Ochutnáno jím je 301 surovin katalogu a cíl se nemění. V nákupu si
   * ale celek určuje rodič: přidá recept a ze sedmi je dvanáct, takže
   * plný proužek neznamená hotovo a prázdný neznamená nic. Jediné, co ho
   * u regálu zajímá, je kolik toho ještě nemá v košíku.
   */
  const popis =
    celkem === 0
      ? 'Zatím prázdný, plní se z receptů a z plánu'
      : zbyva === 0
        ? 'Všechno v košíku'
        : `${sklonuj(zbyva, POLOZKA)} k nákupu`;

  return (
    <Link
      to="/nakup"
      data-testid="karta-nakupu"
      aria-label={`Nákupní seznam. ${popis}.`}
      className="flex items-center gap-2.5 rounded-2xl bg-accent-sheen p-2.5 text-white shadow-lift"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20">
        <ShoppingBasket aria-hidden="true" className="h-5 w-5 shrink-0" />
      </span>

      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-sm font-bold leading-tight">Nákupní seznam</span>
        <span className="truncate text-[11px] leading-tight text-white/85">{popis}</span>
      </span>

      {/* Počet velkými číslicemi vpravo. U regálu je to to jediné, na co se
          rodič kouká, a z rozcestníku to má přečíst na jeden pohled. */}
      {zbyva > 0 && (
        <span
          aria-hidden="true"
          data-testid="karta-nakupu-zbyva"
          className="shrink-0 text-2xl font-bold tabular-nums leading-none"
        >
          {zbyva}
        </span>
      )}
        <ChevronRight aria-hidden="true" className="h-5 w-5 shrink-0 text-white/80" />
    </Link>
  );
}
