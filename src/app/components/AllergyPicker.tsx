import { ShieldAlert } from 'lucide-react';
import type { ReactNode } from 'react';
import { useHouseholdStore } from '@/storage/householdStore';
import type { AllergenGroup } from '@/types';
import { ALLERGENS_IN_CATALOGUE } from '../lib/allergenOptions';
import { ALLERGEN_LABELS } from '../lib/labels';

/**
 * Na co dítě reaguje.
 *
 * Zadává to rodič, ne aplikace — a aplikace to taky nijak nevyhodnocuje.
 * Slouží k jedinému: filtr „bez alergenu" v surovinách i receptech se podle
 * toho předvyplní, aby ho rodič nemusel naklikat u každého hledání.
 *
 * Text pod tím musí zůstat: potvrzená alergie patří pediatrovi a vyloučení
 * potraviny z jídelníčku není něco, co si rodina nastaví podle aplikace.
 */
export function AllergyPicker(): ReactNode {
  const vybrane = useHouseholdStore((store) => store.state.childAllergens) ?? [];
  const prepni = useHouseholdStore((store) => store.toggleChildAllergen);

  return (
    <section aria-labelledby="alergie-nadpis" className="flex flex-col gap-3">
      <h2
        id="alergie-nadpis"
        className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted"
      >
        <ShieldAlert aria-hidden="true" className="h-4 w-4 text-accent" />
        Alergie dítěte
      </h2>

      <p className="text-sm leading-relaxed">
        Označ, na co dítě reaguje. Filtr „bez alergenu" v surovinách i v receptech se pak
        předvyplní sám — a dá se v něm kdykoli odškrtnout.
      </p>

      <div
        role="group"
        aria-label="Alergeny, na které dítě reaguje"
        data-testid="alergie-ditete"
        className="flex flex-wrap gap-x-2"
      >
        {ALLERGENS_IN_CATALOGUE.map((allergen: AllergenGroup) => {
          const active = vybrane.includes(allergen);
          return (
            <button
              key={allergen}
              type="button"
              aria-pressed={active}
              data-testid={`alergie-${allergen}`}
              onClick={() => void prepni(allergen)}
              className="flex min-h-touch items-center"
            >
              <span
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition ${
                  active
                    ? 'border-accent bg-accent text-on-accent shadow-soft'
                    : 'border-line bg-surface text-ink'
                }`}
              >
                {ALLERGEN_LABELS[allergen]}
              </span>
            </button>
          );
        })}
      </div>

      {vybrane.length > 0 && (
        <p className="text-xs leading-relaxed text-muted" data-testid="alergie-shrnuti">
          Vylučuje se {vybrane.map((one) => ALLERGEN_LABELS[one]).join(', ')}. Recept, který
          alergen obsahuje jen v dochucení pro dospělé, se vynechá taky — aplikace nerozlišuje,
          v které části jídla alergen je.
        </p>
      )}

      <p className="text-xs leading-relaxed text-muted">
        Tohle je jen tvoje poznámka pro filtrování. Aplikace alergii nediagnostikuje ani
        nepotvrzuje; podezření na alergii i vyřazení potraviny z jídelníčku patří pediatrovi.
      </p>
    </section>
  );
}
