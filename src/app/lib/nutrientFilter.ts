import { Citrus, Droplet, ShieldCheck } from 'lucide-react';
import type { NutrientProfile } from '@/data/nutrients';
import type { ChipOption } from '../components/FilterChips';
import type { ToggleOption } from '../components/FilterToggles';

/**
 * Filtr živin, společný pro suroviny i recepty.
 *
 * Živiny se zaškrtávají nezávisle a podmínky se sčítají: zaškrtnuté „železo"
 * a „vitamin C" znamená položku, která má obojí. Stupnice je stejná jako
 * u značek v seznamu, takže filtr i výpis mluví jedním jazykem.
 */
export type ZivinaKlic = 'zelezo' | 'zinek' | 'cecko';

export const ZIVINY_OPTIONS: readonly ToggleOption[] = [
  { id: 'zelezo', label: 'železo', Icon: Droplet },
  { id: 'zinek', label: 'zinek', Icon: ShieldCheck },
  { id: 'cecko', label: 'vitamin C', Icon: Citrus },
];

export const DRUH_ZELEZA_OPTIONS: readonly ChipOption[] = [
  { id: 'vse', label: 'jakékoli' },
  { id: 'nehemove', label: 'rostlinné' },
  { id: 'hemove', label: 'z masa a ryb' },
];

export const UROVEN_OPTIONS: readonly ChipOption[] = [
  { id: 'aspon', label: 'aspoň nějaké' },
  { id: 'vyznamny', label: 'jen významný zdroj' },
];

/** Rozhodne, jestli položka projde zaškrtnutými živinami. */
export function vyhovujeZivinam(
  profil: NutrientProfile,
  ziviny: readonly string[],
  druhZeleza: string,
  sila: string,
): boolean {
  if (ziviny.length === 0) return true;
  for (const klic of ziviny) {
    const level =
      klic === 'zelezo' ? profil.iron : klic === 'zinek' ? profil.zinc : profil.vitaminC;
    if (level === 'nevyznamny') return false;
    if (sila === 'vyznamny' && level !== 'vyznamny') return false;
  }
  if (ziviny.includes('zelezo') && druhZeleza !== 'vse' && profil.ironForm !== druhZeleza) {
    return false;
  }
  return true;
}
