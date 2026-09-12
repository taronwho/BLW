import { levelRank, nutrientProfile, recipeNutrients } from '@/data/nutrients';
import type { Ingredient, Recipe } from '@/types';

/**
 * Řazení seznamů.
 *
 * Živinové řazení jde od nejvýznamnějšího zdroje dolů a při shodě padá zpátky
 * na abecedu — bez toho by položky se stejnou úrovní přeskakovaly pokaždé,
 * když se seznam přefiltruje, a nedalo by se v něm nic najít.
 */

export type SortKey = 'abeceda' | 'zelezo' | 'zinek' | 'vitamin-c' | 'vek' | 'cas';

export const INGREDIENT_SORTS: readonly { id: SortKey; label: string }[] = [
  { id: 'abeceda', label: 'Podle abecedy' },
  { id: 'zelezo', label: 'Nejvíc železa' },
  { id: 'zinek', label: 'Nejvíc zinku' },
  { id: 'vitamin-c', label: 'Nejvíc vitaminu C' },
  { id: 'vek', label: 'Od nejnižšího věku' },
];

export const RECIPE_SORTS: readonly { id: SortKey; label: string }[] = [
  { id: 'abeceda', label: 'Podle abecedy' },
  { id: 'zelezo', label: 'Nejvíc železa' },
  { id: 'zinek', label: 'Nejvíc zinku' },
  { id: 'cas', label: 'Nejrychlejší' },
];

/** České řazení — „č" patří za „c", ne až za „z". */
const collator = new Intl.Collator('cs', { sensitivity: 'base' });

export function sortIngredients(items: readonly Ingredient[], key: SortKey): Ingredient[] {
  const abecedne = (a: Ingredient, b: Ingredient): number => collator.compare(a.nameCz, b.nameCz);
  const podleUrovne = (vyber: (item: Ingredient) => number) => (a: Ingredient, b: Ingredient) => {
    const rozdil = vyber(b) - vyber(a);
    return rozdil !== 0 ? rozdil : abecedne(a, b);
  };

  const kopie = [...items];
  switch (key) {
    case 'zelezo':
      // Při shodné úrovni jde napřed hemové železo — vstřebá se líp.
      return kopie.sort(
        podleUrovne((item) => {
          const profile = nutrientProfile(item);
          return levelRank(profile.iron) * 2 + (profile.ironForm === 'hemove' ? 1 : 0);
        }),
      );
    case 'zinek':
      return kopie.sort(podleUrovne((item) => levelRank(nutrientProfile(item).zinc)));
    case 'vitamin-c':
      return kopie.sort(podleUrovne((item) => levelRank(nutrientProfile(item).vitaminC)));
    case 'vek':
      return kopie.sort((a, b) =>
        a.minAgeMonths !== b.minAgeMonths ? a.minAgeMonths - b.minAgeMonths : abecedne(a, b),
      );
    default:
      return kopie.sort(abecedne);
  }
}

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
