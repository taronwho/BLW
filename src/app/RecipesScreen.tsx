import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Clock, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { recipes as catalogRecipes } from '@/data/recipes';
import { ingredients as catalogIngredients } from '@/data/ingredients';
import { RECIPE_CATEGORIES, type RecipeCategory } from '@/types';
import { RECIPE_CATEGORY_LABELS as CATEGORY_LABELS } from '@/lib/labels';
import { byCzechName, searchRecipes } from '@/lib/search';
import { Chip, ChipRow } from './components/Chips';
import { EmptyState } from './components/EmptyState';

type TimeFilter = 'vse' | 'do20' | 'do40';

export function RecipesScreen(): ReactNode {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<RecipeCategory | null>(null);
  const [time, setTime] = useState<TimeFilter>('vse');
  const [onlyVegetarian, setOnlyVegetarian] = useState(false);

  const meatIngredientIds = useMemo(
    () => new Set(catalogIngredients.filter((i) => i.category === 'maso-ryby').map((i) => i.id)),
    [],
  );

  const visible = useMemo(() => {
    let list = searchRecipes(catalogRecipes, query);
    if (category !== null) list = list.filter((r) => r.category === category);
    if (time === 'do20') list = list.filter((r) => r.timeMinutes <= 20);
    if (time === 'do40') list = list.filter((r) => r.timeMinutes <= 40);
    if (onlyVegetarian) {
      list = list.filter(
        (r) => !r.ingredients.some((ref) => meatIngredientIds.has(ref.ingredientId)),
      );
    }
    return byCzechName(list, (r) => r.titleCz);
  }, [query, category, time, onlyVegetarian, meatIngredientIds]);

  return (
    <section aria-labelledby="recepty-nadpis" className="flex flex-col gap-3">
      <h1 id="recepty-nadpis" className="text-lg font-semibold">
        Recepty
      </h1>

      <label className="relative block">
        <span className="sr-only">Hledat recept</span>
        <Search aria-hidden="true" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Hledat recept"
          className="min-h-touch w-full rounded-xl border border-muted/30 bg-surface py-2 pl-9 pr-3"
        />
      </label>

      <ChipRow label="Kategorie receptů">
        <Chip label="Všechny" active={category === null} onClick={() => setCategory(null)} />
        {RECIPE_CATEGORIES.map((id) => (
          <Chip
            key={id}
            label={CATEGORY_LABELS[id]}
            active={category === id}
            onClick={() => setCategory(id)}
          />
        ))}
      </ChipRow>

      <ChipRow label="Další filtry">
        <Chip label="Do 20 minut" active={time === 'do20'} onClick={() => setTime(time === 'do20' ? 'vse' : 'do20')} />
        <Chip label="Do 40 minut" active={time === 'do40'} onClick={() => setTime(time === 'do40' ? 'vse' : 'do40')} />
        <Chip
          label="Jen vegetariánské"
          active={onlyVegetarian}
          onClick={() => setOnlyVegetarian(!onlyVegetarian)}
        />
      </ChipRow>

      {visible.length === 0 ? (
        <EmptyState
          hint={
            catalogRecipes.length === 0
              ? 'Kuchařka se zatím plní. Recepty přibudou ve fázi 3.'
              : 'Žádný recept neodpovídá. Zkus uvolnit filtry.'
          }
        />
      ) : (
        <ul className="flex flex-col gap-2">
          {visible.map((recipe) => (
            <li key={recipe.id}>
              <Link to={`/recepty/${recipe.id}`} className="flex flex-col gap-2 rounded-xl bg-surface p-3">
                <span className="break-words font-medium">{recipe.titleCz}</span>
                <span className="flex flex-wrap items-center gap-1.5 text-xs text-muted">
                  <span className="inline-flex items-center gap-1">
                    <Clock aria-hidden="true" className="h-3.5 w-3.5" />
                    {recipe.timeMinutes} min
                  </span>
                  <span>· {CATEGORY_LABELS[recipe.category]}</span>
                  <span>· vhodné od {recipe.minAgeMonths} měsíců</span>
                </span>
                {recipe.tags.length > 0 && (
                  <span className="flex flex-wrap gap-1">
                    {recipe.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-paper px-2 py-0.5 text-[11px] text-muted">
                        {tag}
                      </span>
                    ))}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
