import { ArrowLeft, Baby, Beef, ChefHat, Clock, Leaf, Scissors, Star, Users } from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ingredientById, recipeById } from '@/data';
import { nutrientProfile } from '@/data/nutrients';
import { useHouseholdStore } from '@/storage/householdStore';
import type { Ingredient, Recipe, RecipeIngredientRef, Stage } from '@/types';
import { ChokingBadge } from '../components/ChokingBadge';
import { AllergenChip, ChokingChip } from '../components/SafetyChips';
import { GripHint } from '../components/GripHint';
import { COMPOSITION } from '@/data/composition';
import { NutrientBadge } from '../components/NutrientBadge';
import { ReadinessNote } from '../components/ReadinessNote';
import { SourceDisclosure, SourceLinks } from '../components/SourceList';
import { StageSwitch } from '../components/StageSwitch';
import { ageInMonths, stageForAge } from '../lib/age';
import { recipeAllergens, recipeChokingRisk, recipeIsVegetarian, recipeServingForm } from '../lib/deriveRecipes';
import { dedupeSources } from '../lib/sources';
import { ALLERGEN_LABELS, RECIPE_CATEGORY_LABELS } from '../lib/labels';

const TRACK_LABELS: Record<RecipeIngredientRef['track'], string> = {
  all: 'Společné',
  meat: 'S masem',
  vegetarian: 'Bez masa',
};

/** Detail receptu (docs/SPEC.md kap. 4.4). */
export function RecipeDetailScreen(): ReactNode {
  const { id = '' } = useParams();
  const recipe = recipeById.get(id);
  const state = useHouseholdStore((store) => store.state);
  const setRecipeNote = useHouseholdStore((store) => store.setRecipeNote);
  const toggleFavorite = useHouseholdStore((store) => store.toggleFavorite);

  const months = ageInMonths(state.childBirthDate);
  const currentStage = stageForAge(months);
  const [stage, setStage] = useState<Stage>(currentStage);
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => setStage(currentStage), [currentStage]);
  useEffect(() => setNote(state.recipeNotes[id] ?? ''), [state.recipeNotes, id]);

  const allergens = useMemo(() => (recipe === undefined ? [] : recipeAllergens(recipe)), [recipe]);

  if (recipe === undefined) return <Navigate to="/recepty" replace />;


  // Dvě varianty dochucení dávají smysl jen tam, kde v jídle maso opravdu je.
  const bezmasy = recipeIsVegetarian(recipe);
  const favorite = state.favorites.includes(recipe.id);

  return (
    <article className="flex flex-col gap-5">
      <Link
        to="/recepty"
        data-testid="zpet-na-recepty"
        className="flex min-h-touch w-fit items-center gap-2 rounded-xl px-2 text-sm font-medium text-accent"
      >
        <ArrowLeft aria-hidden="true" className="h-5 w-5 shrink-0" />
        Zpět na recepty
      </Link>

      <header className="flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <h1 className="min-w-0 text-xl font-bold">{recipe.titleCz}</h1>
          <button
            type="button"
            aria-pressed={favorite}
            aria-label={favorite ? 'Odebrat z oblíbených' : 'Přidat do oblíbených'}
            onClick={() => void toggleFavorite(recipe.id)}
            className={`flex min-h-touch min-w-touch shrink-0 items-center justify-center rounded-xl border ${
              favorite ? 'border-caution bg-caution/10 text-caution' : 'border-muted/30 text-muted'
            }`}
          >
            <Star aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-muted">
          <span className="flex items-center gap-1 rounded-lg bg-surface px-2 py-1 font-medium">
            <Clock aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
            {recipe.timeMinutes} min
          </span>
          <span className="flex items-center gap-1 rounded-lg bg-surface px-2 py-1 font-medium">
            <Users aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
            {recipe.servings}
          </span>
          <span className="rounded-lg bg-surface px-2 py-1 font-medium">
            {RECIPE_CATEGORY_LABELS[recipe.category]}
          </span>
          <span className="rounded-lg bg-surface px-2 py-1 font-medium">
            vhodné od {recipe.minAgeMonths} měsíců
          </span>
          {bezmasy && (
            <span className="rounded-lg bg-accent/10 px-2 py-1 font-medium text-accent">bezmasý základ</span>
          )}
          {allergens.map((allergen) => (
            <span key={allergen} className="rounded-lg bg-caution/10 px-2 py-1 font-medium text-caution">
              alergen: {ALLERGEN_LABELS[allergen as keyof typeof ALLERGEN_LABELS] ?? allergen}
            </span>
          ))}
        </div>
        <ChokingBadge risk={recipeChokingRisk(recipe)} />
        <p className="text-xs text-muted">
          Štítek ukazuje nejvyšší riziko ze surovin receptu. Krájení řeš u konkrétní suroviny.
        </p>
      </header>

      <SourceDisclosure
        sources={recipe.sources}
        label="Zdroje receptu"
        testId="zdroje-receptu"
      />

      <IngredientsBlock recipe={recipe} />

      <section aria-labelledby="postup-nadpis" className="flex flex-col gap-2 rounded-xl bg-surface p-4">
        <h2 id="postup-nadpis" className="text-sm font-semibold uppercase tracking-wide text-muted">
          Společný postup
        </h2>
        <ol className="flex list-decimal flex-col gap-2 pl-5 text-sm leading-relaxed" data-testid="spolecny-postup">
          {recipe.baseSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>

      <section
        aria-labelledby="odber-nadpis"
        data-testid="moment-odebrani"
        className="flex flex-col gap-2 rounded-2xl border-2 border-accent bg-accent/10 p-4"
      >
        <h2 id="odber-nadpis" className="flex items-center gap-2 text-base font-bold text-accent">
          <Scissors aria-hidden="true" className="h-5 w-5 shrink-0" />
          Tady odeber porci pro miminko
        </h2>
        <p className="text-sm font-medium leading-relaxed">{recipe.babySplitPoint}</p>
      </section>

      <section aria-labelledby="miminko-nadpis" className="flex flex-col gap-3 rounded-xl bg-surface p-4">
        <h2 id="miminko-nadpis" className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted">
          <Baby aria-hidden="true" className="h-4 w-4 shrink-0" />
          Pro miminko
        </h2>
        <ol className="flex list-decimal flex-col gap-2 pl-5 text-sm leading-relaxed">
          {recipe.babySteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <StageSwitch value={stage} onChange={setStage} currentStage={currentStage} label="Podání podle fáze" />
        <p className="rounded-lg bg-paper p-3 text-sm leading-relaxed" data-testid="podani-miminko">
          {recipe.babyServing[stage]}
        </p>
        <ReadinessNote stage={stage} />
        <GripHint chokingRisk={recipeChokingRisk(recipe)} servingForm={recipeServingForm(recipe)} />
      </section>

      <section
        aria-labelledby="dospeli-nadpis"
        className="flex flex-col gap-3 rounded-xl bg-surface p-4"
        data-testid="dochuceni-pro-dospele"
      >
        <h2
          id="dospeli-nadpis"
          className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted"
        >
          <ChefHat aria-hidden="true" className="h-4 w-4 shrink-0" />
          Dochucení pro dospělé
        </h2>
        <p className="text-sm leading-relaxed text-muted">
          Dětská porce je v tuhle chvíli hotová a stranou, takže sem už patří sůl i ostřejší
          koření.
        </p>

        {bezmasy ? (
          <ol className="flex list-decimal flex-col gap-2 pl-5 text-sm leading-relaxed">
            {recipe.adultSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        ) : (
          <>
            <div className="flex flex-col gap-2 rounded-xl border border-line bg-paper p-3">
              <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted">
                <Beef aria-hidden="true" className="h-4 w-4 shrink-0" />
                S masem
              </h3>
              <ol className="flex list-decimal flex-col gap-2 pl-5 text-sm leading-relaxed">
                {recipe.adultSteps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </div>

            <div className="flex flex-col gap-2 rounded-xl border border-line bg-paper p-3">
              <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted">
                <Leaf aria-hidden="true" className="h-4 w-4 shrink-0" />
                Bez masa
              </h3>
              <ol className="flex list-decimal flex-col gap-2 pl-5 text-sm leading-relaxed">
                {(recipe.vegetarianSteps ?? []).map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              {recipe.vegetarianProteinSwap !== undefined && (
                <p className="rounded-lg bg-accent/10 p-3 text-sm leading-relaxed text-accent">
                  Náhrada bílkoviny: {recipe.vegetarianProteinSwap}
                </p>
              )}
            </div>
          </>
        )}
      </section>

      <section aria-labelledby="poznamka-nadpis" className="flex flex-col gap-2 rounded-xl bg-surface p-4">
        <h2 id="poznamka-nadpis" className="text-sm font-semibold uppercase tracking-wide text-muted">
          Poznámka rodiny
        </h2>
        <textarea
          value={note}
          rows={3}
          data-testid="poznamka-receptu"
          onChange={(event) => {
            setNote(event.target.value);
            setSaved(false);
          }}
          placeholder="Co příště jinak? Kolik toho dítě snědlo?"
          className="rounded-lg border border-muted/30 p-2 text-sm"
        />
        <button
          type="button"
          onClick={() => {
            void setRecipeNote(recipe.id, note);
            setSaved(true);
          }}
          className="min-h-touch rounded-xl bg-accent px-4 py-2 font-semibold text-on-accent"
        >
          Uložit poznámku
        </button>
        {saved && (
          <p role="status" className="text-sm text-accent">
            Uloženo a sdíleno s druhým rodičem.
          </p>
        )}
      </section>
    </article>
  );
}

function IngredientsBlock({ recipe }: { recipe: Recipe }): ReactNode {
  const tracks: RecipeIngredientRef['track'][] = ['all', 'meat', 'vegetarian'];

  // Doklady k surovinám patří k receptu stejně jako k detailu suroviny —
  // rodič, který stojí u sporáku, se kvůli nim nemá proklikávat jinam.
  const podleSuroviny = [
    ...new Map(recipe.ingredients.map((ref) => [ref.ingredientId, ref])).values(),
  ]
    .map((ref) => ingredientById.get(ref.ingredientId))
    .filter((one): one is Ingredient => one !== undefined && one.sources.length > 0)
    .map((one) => ({ ingredient: one, sources: dedupeSources(one.sources) }));
  return (
    <section aria-labelledby="suroviny-nadpis" className="flex flex-col gap-3">
      <h2 id="suroviny-nadpis" className="text-sm font-semibold uppercase tracking-wide text-muted">
        Suroviny
      </h2>
      {tracks.map((track) => {
        const refs = recipe.ingredients.filter((ref) => ref.track === track);
        if (refs.length === 0) return null;
        return (
          <div key={track} className="flex flex-col gap-2 rounded-xl bg-surface p-3">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">
              {TRACK_LABELS[track]}
            </h3>
            <ul className="flex flex-col gap-1">
              {refs.map((ref) => {
                const ingredient = ingredientById.get(ref.ingredientId);
                const profil = ingredient === undefined ? undefined : nutrientProfile(ingredient);
                const maZiviny =
                  profil !== undefined &&
                  (profil.iron !== 'nevyznamny' ||
                    profil.zinc !== 'nevyznamny' ||
                    profil.vitaminC !== 'nevyznamny');
                const riziko = ingredient?.chokingRisk;
                const rizikoVidet = riziko === 'medium' || riziko === 'high';
                const alergen = ingredient?.allergens[0];
                const maStitky = maZiviny || rizikoVidet || alergen !== undefined;
                return (
                  <li key={`${ref.ingredientId}-${ref.track}`}>
                    <Link
                      to={`/suroviny/${ref.ingredientId}`}
                      data-testid={`odkaz-surovina-${ref.ingredientId}`}
                      className="flex min-h-touch items-center justify-between gap-3 rounded-lg px-2 text-sm"
                    >
                      <span className="min-w-0 font-medium text-accent">
                        {ingredient?.nameCz ?? ref.ingredientId}
                      </span>
                      <span className="shrink-0 text-xs text-muted">{ref.amount}</span>
                    </Link>
                    {/* Stejné štítky jako v přehledu surovin: na co pozor
                        (dušení, alergen) a co surovina přináší (živiny). */}
                    {maStitky && (
                      <span
                        className="flex flex-wrap items-center gap-x-1.5 px-2"
                        data-testid={`ziviny-suroviny-${ref.ingredientId}`}
                      >
                        {riziko !== undefined && (
                          <ChokingChip risk={riziko} testId={`duseni-suroviny-${ref.ingredientId}`} />
                        )}
                        {alergen !== undefined && (
                          <AllergenChip
                            allergen={alergen}
                            testId={`alergen-suroviny-${ref.ingredientId}`}
                          />
                        )}
                        {maZiviny && profil !== undefined && ingredient !== undefined && (
                          <NutrientBadge
                            profile={profil}
                            title={ingredient.nameCz}
                            slozeni={COMPOSITION[ref.ingredientId]}
                            testId={`zeleza-recept-${ref.ingredientId}`}
                          />
                        )}
                      </span>
                    )}
                    {ref.note !== undefined && (
                      <p className="px-2 text-xs leading-relaxed text-muted">{ref.note}</p>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}

      <SourceDisclosure
        sources={[]}
        label={`Zdroje u surovin (${podleSuroviny.length})`}
        testId="zdroje-surovin"
      >
        <ul className="flex flex-col gap-3">
          {podleSuroviny.map(({ ingredient, sources }) => (
            <li key={ingredient.id} className="flex flex-col gap-1.5">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                {ingredient.nameCz}
              </p>
              <SourceLinks sources={sources} />
            </li>
          ))}
        </ul>
      </SourceDisclosure>
    </section>
  );
}
