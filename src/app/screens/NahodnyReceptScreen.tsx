import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useHouseholdStore } from '@/storage/householdStore';
import { ageInMonths } from '../lib/age';
import { useAktivniDite } from '../lib/dite';
import { nahodnyRecept } from '../lib/nahodnyRecept';
import { NotFoundScreen } from './NotFoundScreen';

/**
 * Adresa `/recepty/nahoda` — vylosuje recept a hned na něj přesměruje.
 *
 * Existuje kvůli úvodní obrazovce. Ta si schválně nestahuje kuchařku, takže
 * si tlačítko „náhodný recept" nemůže recept vybrat samo; je to prostý
 * odkaz a losuje se až tady, na obrazovce, která se stahuje zvlášť.
 *
 * Statická část adresy vyhraje nad `/recepty/:id`, takže recept s idčkem
 * „nahoda" by se sem nedostal. Žádný takový v kuchařce není a ani by se
 * jmenovat nemohl — idčka jsou slugy z názvů jídel.
 *
 * `replace` je podstatné: bez něj by zpětné tlačítko vrátilo rodiče sem,
 * odsud by se hned vylosovalo znovu a ven by se nedostal.
 */
export function NahodnyReceptScreen(): ReactNode {
  const ready = useHouseholdStore((store) => store.ready);
  const dite = useAktivniDite();

  // Než se načte domácnost, nevíme věk ani alergie. Losovat naslepo by
  // znamenalo občas nabídnout jídlo od dvanácti měsíců šestiměsíčnímu.
  if (!ready) {
    return (
      <p role="status" className="px-2 py-8 text-sm text-muted">
        Vybírám recept…
      </p>
    );
  }

  const recept = nahodnyRecept(ageInMonths(dite?.birthDate ?? ''), dite?.allergens ?? []);
  if (recept === null) return <NotFoundScreen />;
  return <Navigate replace to={`/recepty/${recept.id}`} />;
}
