import { useHouseholdStore } from '@/storage/householdStore';
import type { AllergenGroup } from '@/types';
import { ALLERGENS_IN_CATALOGUE } from './allergenOptions';
import { useUrlText } from './urlState';

/**
 * Filtr „bez alergenu" — víc alergenů naráz a předvyplněno podle dítěte.
 *
 * Dřív se dal vybrat jediný alergen, což v rodině s víc alergiemi nestačí,
 * a rodič ho musel naklikat u každého hledání znovu. Nastavení dítěte
 * v Domácnosti teď filtr předvyplní.
 *
 * V adrese se rozlišují tři stavy, aby šlo předvyplnění i vypnout:
 *  - klíč chybí      → bere se nastavení dítěte (a mění se s ním),
 *  - klíč je „-"     → rodič vědomě nechce vyloučit nic,
 *  - klíč je seznam  → přesně tyhle alergeny.
 *
 * Bez toho rozlišení by odškrtnutí posledního alergenu vymazalo klíč z adresy
 * a předvyplnění by ho okamžitě vrátilo zpátky.
 */
const ZADNY = '-';

export interface FiltrAlergenu {
  /** Co se právě vylučuje. */
  vybrane: readonly AllergenGroup[];
  prepni: (allergen: AllergenGroup) => void;
  /** Alergeny zadané u dítěte v Domácnosti. */
  zDitete: readonly AllergenGroup[];
  /** Vybralo se to samo podle dítěte, nebo to naklikal rodič tady? */
  automaticky: boolean;
}

export function useFiltrAlergenu(): FiltrAlergenu {
  const zDitete = useHouseholdStore((store) => store.state.childAllergens) ?? PRAZDNO;
  const [syrove, nastav] = useUrlText('bez', '');

  const automaticky = syrove.length === 0;
  const vybrane: readonly AllergenGroup[] = automaticky
    ? zDitete.filter((one) => ALLERGENS_IN_CATALOGUE.includes(one))
    : syrove === ZADNY
      ? PRAZDNO
      : (syrove.split(',').filter((one) =>
          ALLERGENS_IN_CATALOGUE.includes(one as AllergenGroup),
        ) as AllergenGroup[]);

  function prepni(allergen: AllergenGroup): void {
    const dalsi = vybrane.includes(allergen)
      ? vybrane.filter((one) => one !== allergen)
      : [...vybrane, allergen];
    nastav(dalsi.length === 0 ? ZADNY : dalsi.join(','));
  }

  return { vybrane, prepni, zDitete, automaticky };
}

const PRAZDNO: readonly AllergenGroup[] = [];
