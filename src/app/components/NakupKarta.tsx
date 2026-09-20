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
  const podil = celkem === 0 ? 0 : Math.round((koupeno / celkem) * 100);

  /**
   * Věta pod názvem je jen pro prázdný seznam.
   *
   * Jakmile v něm něco je, říká všechno odznak „3 z 12 v košíku" a proužek
   * pod ním. Přidat k tomu ještě „Zbývá 9 položek" znamenalo napsat totéž
   * dvakrát a rodič to musí u regálu číst pokaždé znova.
   */
  const popis = celkem === 0 ? 'Zatím prázdný, plní se z receptů a z plánu' : '';

  /** Pro odečítač obrazovky celá věta, ať se nemusí luštit z odznaku. */
  const popisProOdecitac =
    celkem === 0
      ? popis
      : zbyva === 0
        ? 'Všechno v košíku'
        : `${sklonuj(zbyva, POLOZKA)} k nákupu z ${celkem}`;

  return (
    <Link
      to="/nakup"
      data-testid="karta-nakupu"
      aria-label={`Nákupní seznam. ${popisProOdecitac}.`}
      className="flex items-center gap-2.5 rounded-2xl bg-accent-sheen p-2.5 text-white shadow-lift"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20">
        <ShoppingBasket aria-hidden="true" className="h-5 w-5 shrink-0" />
      </span>

      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="flex items-baseline justify-between gap-2">
          <span className="text-sm font-bold leading-tight">Nákupní seznam</span>
          {celkem > 0 && (
            <span className="shrink-0 text-[11px] font-semibold tabular-nums text-white/85">
              {koupeno} z {celkem} v košíku
            </span>
          )}
        </span>
        {popis.length > 0 && (
          <span className="truncate text-[11px] leading-tight text-white/85">{popis}</span>
        )}
        {/* Proužek jen když je co měřit. Prázdná lišta u prázdného seznamu
            nic neříká a jen zabírá řádku. */}
        {celkem > 0 && (
          <span
            role="progressbar"
            aria-valuenow={koupeno}
            aria-valuemin={0}
            aria-valuemax={celkem}
            aria-label="Kolik z nákupu je v košíku"
            className="block h-1.5 w-full overflow-hidden rounded-full bg-white/25"
          >
            <span
              className="block h-full rounded-full bg-white transition-all"
              style={{ width: `${podil}%` }}
            />
          </span>
        )}
      </span>

      <ChevronRight aria-hidden="true" className="h-5 w-5 shrink-0 text-white/80" />
    </Link>
  );
}
