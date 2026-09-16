import { Check, ShoppingBasket } from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { useHouseholdStore } from '@/storage/householdStore';

/** Jak dlouho tlačítko po klepnutí drží potvrzení. */
const POTVRZENI_MS = 1600;

/**
 * Tlačítko „do nákupu".
 *
 * Stojí u receptu, u suroviny i na kartě v přehledu receptů, takže má dvě
 * podoby: celou s popiskem a úspornou jen s ikonou. Chová se v obou stejně,
 * včetně potvrzení po klepnutí — bez něj rodič neví, jestli se něco stalo,
 * protože seznam je na jiné obrazovce.
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

  if (ikona) {
    return (
      <button
        type="button"
        data-testid={testId}
        aria-label={hotovo ? potvrzeni : popis}
        onClick={klepnuti}
        className={`flex min-h-touch min-w-touch shrink-0 items-center justify-center rounded-xl border-2 transition-colors duration-300 ${barva}`}
      >
        <Icon
          aria-hidden="true"
          className={`h-5 w-5 shrink-0 ${hotovo ? 'animate-odskrtnuto' : ''}`}
        />
      </button>
    );
  }

  return (
    <button
      type="button"
      data-testid={testId}
      onClick={klepnuti}
      className={`flex min-h-touch items-center justify-center gap-2 rounded-xl border-2 px-4 text-sm font-semibold transition-colors duration-300 ${barva}`}
    >
      <Icon
        aria-hidden="true"
        className={`h-4 w-4 shrink-0 ${hotovo ? 'animate-odskrtnuto' : ''}`}
      />
      {hotovo ? potvrzeni : popis}
    </button>
  );
}
