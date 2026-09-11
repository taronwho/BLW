import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Baby, ChevronLeft, Leaf, Scissors, Utensils } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { recipes as catalogRecipes } from '@/data/recipes';
import { ingredients as catalogIngredients } from '@/data/ingredients';
import { useHouseholdStore } from '@/storage/householdStore';
import { useHousehold } from './useHousehold';
import { StageSwitcher } from './components/StageSwitcher';
import type { Stage } from '@/types';

const TRACK_LABELS = {
  all: 'společné',
  meat: 'masitá',
  vegetarian: 'bezmasá',
} as const;

export function RecipeDetail(): ReactNode {
  const { id } = useParams<{ id: string }>();
  const { suggestedStage } = useHousehold();
  const { state, setRecipeNote } = useHouseholdStore();
  const [stage, setStage] = useState<Stage | null>(null);

  const recipe = useMemo(() => catalogRecipes.find((item) => item.id === id), [id]);
  const ingredientById = useMemo(
    () => new Map(catalogIngredients.map((item) => [item.id, item])),
    [],
  );

  if (recipe === undefined) {
    return (
      <section className="flex flex-col gap-3">
        <Link to="/recepty" className="inline-flex min-h-touch items-center gap-1 text-sm text-accent">
          <ChevronLeft aria-hidden="true" className="h-4 w-4" />
          Zpět na recepty
        </Link>
        <h1 className="text-lg font-semibold">Recept nenalezen</h1>
        <p className="text-sm text-muted">Tenhle recept v kuchařce není.</p>
      </section>
    );
  }

  const activeStage = stage ?? suggestedStage;
  const note = state.recipeNotes[recipe.id] ?? '';

  return (
    <section className="flex flex-col gap-5">
      <Link to="/recepty" className="inline-flex min-h-touch items-center gap-1 text-sm text-accent">
        <ChevronLeft aria-hidden="true" className="h-4 w-4" />
        Zpět na recepty
      </Link>

      <header className="flex flex-col gap-1">
        <h1 className="break-words text-2xl font-bold leading-tight">{recipe.titleCz}</h1>
        <p className="text-sm text-muted">
          {recipe.timeMinutes} min · {recipe.servings} · vhodné od {recipe.minAgeMonths} měsíců
        </p>
      </header>

      <div className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Suroviny</h2>
        <ul className="flex flex-col divide-y divide-muted/15 rounded-xl bg-surface">
          {recipe.ingredients.map((ref, index) => {
            const ingredient = ingredientById.get(ref.ingredientId);
            return (
              <li key={`${ref.ingredientId}-${index}`} className="flex items-center gap-2 p-3 text-sm">
                <Link
                  to={`/suroviny/${ref.ingredientId}`}
                  className="min-w-0 flex-1 break-words underline decoration-muted/40"
                >
                  {ingredient?.nameCz ?? ref.ingredientId}
                </Link>
                <span className="shrink-0 text-muted">{ref.amount}</span>
                <span className="shrink-0 rounded-full bg-paper px-2 py-0.5 text-[11px] text-muted">
                  {TRACK_LABELS[ref.track]}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Společný postup</h2>
        <ol className="flex list-decimal flex-col gap-2 rounded-xl bg-surface p-4 pl-8 text-sm">
          {recipe.baseSteps.map((step, index) => (
            <li key={index} className="leading-relaxed">
              {step}
            </li>
          ))}
        </ol>
      </div>

      {/* Moment odebrání porce pro miminko — vizuálně nejsilnější prvek obrazovky
          (docs/SPEC.md kap. 4.4), ne poznámka pod čarou. */}
      <div
        data-testid="odebrani-porce"
        className="flex gap-3 rounded-xl border-2 border-accent bg-accent/5 p-4"
      >
        <Scissors aria-hidden="true" className="mt-0.5 h-6 w-6 shrink-0 text-accent" />
        <div className="flex flex-col gap-1">
          <h2 className="font-bold text-accent">Teď odeber porci pro miminko</h2>
          <p className="text-sm leading-relaxed">{recipe.babySplitPoint}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-xl bg-surface p-4">
        <h2 className="flex items-center gap-2 font-semibold">
          <Baby aria-hidden="true" className="h-5 w-5 shrink-0 text-accent" />
          Pro miminko
        </h2>
        <StageSwitcher value={activeStage} onChange={setStage} suggested={suggestedStage} />
        <p className="text-sm leading-relaxed" data-testid="baby-serving">
          {recipe.babyServing[activeStage]}
        </p>
        {recipe.babySteps.length > 0 && (
          <ol className="flex list-decimal flex-col gap-1 pl-5 text-sm">
            {recipe.babySteps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        )}
      </div>

      <div className="grid gap-3">
        <div className="flex flex-col gap-2 rounded-xl bg-surface p-4">
          <h2 className="flex items-center gap-2 font-semibold">
            <Utensils aria-hidden="true" className="h-5 w-5 shrink-0 text-muted" />
            Masitá verze
          </h2>
          <ol className="flex list-decimal flex-col gap-1 pl-5 text-sm">
            {recipe.meatSteps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </div>

        <div className="flex flex-col gap-2 rounded-xl bg-surface p-4">
          <h2 className="flex items-center gap-2 font-semibold">
            <Leaf aria-hidden="true" className="h-5 w-5 shrink-0 text-safe" />
            Bezmasá verze
          </h2>
          {recipe.vegetarianProteinSwap !== undefined && (
            <p className="rounded-lg bg-safe/10 p-2 text-sm text-safe">
              <strong>Náhrada bílkoviny: </strong>
              {recipe.vegetarianProteinSwap}
            </p>
          )}
          <ol className="flex list-decimal flex-col gap-1 pl-5 text-sm">
            {recipe.vegetarianSteps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </div>
      </div>

      <label className="flex flex-col gap-2 rounded-xl bg-surface p-4">
        <span className="text-sm font-semibold">Poznámka rodiny</span>
        <textarea
          value={note}
          onChange={(event) => void setRecipeNote(recipe.id, event.target.value)}
          rows={3}
          placeholder="Co příště udělat jinak"
          className="rounded-lg border border-muted/30 p-2 text-sm"
        />
      </label>
    </section>
  );
}
