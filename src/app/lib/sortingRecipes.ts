import type { Recipe } from '@/types';
import { levelRank } from '@/data/nutrients';
import { recipeNutrients } from '@/data/recipeNutrients';
import { collator, type SortKey } from './sorting';

/**
 * Řazení receptů. Zvlášť od řazení surovin schválně — sahá na živiny celého
 * receptu, a tím na celou kuchařku; seznam surovin ji nemá proč stahovat.
 */

export function sortRecipes(items: readonly Recipe[], key: SortKey): Recipe[] {
  const abecedne = (a: Recipe, b: Recipe): number => collator.compare(a.titleCz, b.titleCz);
  const podleUrovne = (vyber: (item: Recipe) => number) => (a: Recipe, b: Recipe) => {
    const rozdil = vyber(b) - vyber(a);
    return rozdil !== 0 ? rozdil : abecedne(a, b);
  };

  const kopie = [...items];
  switch (key) {
    case 'zelezo':
      return kopie.sort(
        podleUrovne((recipe) => {
          const profile = recipeNutrients(recipe);
          // Počet zdrojů rozhoduje až po úrovni, aby recept se třemi slabými
          // zdroji nepřeskočil ten s jedním významným.
          return (
            levelRank(profile.iron) * 100 +
            (profile.ironForm === 'hemove' ? 50 : 0) +
            Math.min(profile.ironFrom.length, 9)
          );
        }),
      );
    case 'zinek':
      return kopie.sort(podleUrovne((recipe) => levelRank(recipeNutrients(recipe).zinc)));
    case 'cas':
      return kopie.sort((a, b) =>
        a.timeMinutes !== b.timeMinutes ? a.timeMinutes - b.timeMinutes : abecedne(a, b),
      );
    default:
      return kopie.sort(abecedne);
  }
}
