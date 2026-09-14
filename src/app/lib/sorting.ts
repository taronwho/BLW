import { levelRank, nutrientProfile } from '@/data/nutrients';
import type { Ingredient } from '@/types';

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
export const collator = new Intl.Collator('cs', { sensitivity: 'base' });

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
