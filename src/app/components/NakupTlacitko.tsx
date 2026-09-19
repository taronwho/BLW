import { Check, ShoppingBasket } from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { useHouseholdStore } from '@/storage/householdStore';
import { pocetPridani } from '@/nakup/pocty';

/**
 * Počet opakování slovy, pro odečítač obrazovky.
 *
 * Značku „2×" přečte odečítač jako „dva" nebo „dva krát krát", podle toho,
 * jak si poradí s křížkem. Násobné číslovky do čtyř mají vlastní slovo, od
 * pěti se v češtině píšou číslicí a příponou („5krát").
 */
const NASOBNE: readonly string[] = ['nula', 'jednou', 'dvakrát', 'třikrát', 'čtyřikrát'];

function kolikratSlovy(pocet: number): string {
  return NASOBNE[pocet] ?? `${pocet}krát`;
}

/** Jak dlouho tlačítko po klepnutí drží potvrzení. */
const POTVRZENI_MS = 1600;

/**
 * Tlačítko „do nákupu".
 *
 * Stojí u receptu, u suroviny i na kartě v přehledu receptů, takže má dvě
 * podoby: celou s popiskem a úspornou jen s ikonou. Chová se v obou stejně,
 * včetně potvrzení po klepnutí — bez něj rodič neví, jestli se něco stalo,
 * protože seznam je na jiné obrazovce.
 *
 * Když už tohle v seznamu je, nese tlačítko počet („2×"). Bez něj rodič po
 * druhém klepnutí nepozná, jestli má v seznamu jedno balení nebo tři:
 * množství se sice sčítají, ale ze součtu „450 g" se zpátky nedopočítá,
 * kolikrát se recept přidal.
 */
export function NakupTlacitko({
  davky,
  popis,
  potvrzeni = 'Přidáno do nákupu',
  ikona = false,
  testId,
}: {
  /** Co se má přidat. Recept dává celý svůj seznam složek. */
  davky: readonly { ingredientId: string; mnozstvi?: string; recipeId?: string }[];
  /** Popisek tlačítka, třeba „Suroviny do nákupu". */
  popis: string;
  potvrzeni?: string;
  /** Úsporná podoba jen s ikonou, do řádky v přehledu. */
  ikona?: boolean;
  testId?: string;
}): ReactNode {
  const pridejDoNakupu = useHouseholdStore((store) => store.pridejDoNakupu);
  const state = useHouseholdStore((store) => store.state);
  const kolikrat = pocetPridani(state, davky);
  const [hotovo, setHotovo] = useState(false);

  useEffect(() => {
    if (!hotovo) return undefined;
    const casovac = window.setTimeout(() => setHotovo(false), POTVRZENI_MS);
    return () => window.clearTimeout(casovac);
  }, [hotovo]);

  const klepnuti = (event: { preventDefault(): void; stopPropagation(): void }): void => {
    // Tlačítko sedí uvnitř odkazu na kartě receptu; bez zastavení události
    // by klepnutí zároveň otevřelo recept a seznam by rodič nikdy neviděl.
    event.preventDefault();
    event.stopPropagation();
    void pridejDoNakupu(davky);
    setHotovo(true);
  };

  const Icon = hotovo ? Check : ShoppingBasket;
  const barva = hotovo
    ? 'border-accent bg-accent text-on-accent'
    : 'border-accent bg-accent/10 text-accent';

  // Odečítač obrazovky dostane počet větou, ne značkou — „2×" by přečetl
  // jako „dvakrát krát" nebo vůbec.
  const kolikratVetou = kolikrat === 0 ? '' : ` (v seznamu už ${kolikratSlovy(kolikrat)})`;

  if (ikona) {
    return (
      <button
        type="button"
        data-testid={testId}
        aria-label={(hotovo ? potvrzeni : popis) + kolikratVetou}
        onClick={klepnuti}
        className={`relative flex min-h-touch min-w-touch shrink-0 items-center justify-center rounded-xl border-2 transition-colors duration-300 ${barva}`}
      >
        <Icon
          aria-hidden="true"
          className={`h-5 w-5 shrink-0 ${hotovo ? 'animate-odskrtnuto' : ''}`}
        />
        {kolikrat > 0 && (
          <span
            aria-hidden="true"
            data-testid={testId === undefined ? undefined : `${testId}-pocet`}
            className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold leading-none text-on-accent"
          >
            {kolikrat}×
          </span>
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      data-testid={testId}
      aria-label={(hotovo ? potvrzeni : popis) + kolikratVetou}
      onClick={klepnuti}
      className={`flex min-h-touch items-center justify-center gap-2 rounded-xl border-2 px-4 text-sm font-semibold transition-colors duration-300 ${barva}`}
    >
      <Icon
        aria-hidden="true"
        className={`h-4 w-4 shrink-0 ${hotovo ? 'animate-odskrtnuto' : ''}`}
      />
      <span aria-hidden="true">{hotovo ? potvrzeni : popis}</span>
      {kolikrat > 0 && (
        <span
          aria-hidden="true"
          data-testid={testId === undefined ? undefined : `${testId}-pocet`}
          className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-bold leading-none ${
            hotovo ? 'bg-on-accent/20 text-on-accent' : 'bg-accent text-on-accent'
          }`}
        >
          {kolikrat}×
        </span>
      )}
    </button>
  );
}
