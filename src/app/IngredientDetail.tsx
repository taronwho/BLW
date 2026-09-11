import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { ChevronLeft, ExternalLink, Heart, Plus, TriangleAlert } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { ingredients as catalogIngredients } from '@/data/ingredients';
import { recipes as catalogRecipes } from '@/data/recipes';
import { recipesWithIngredient } from '@/lib/filters';
import { useHouseholdStore } from '@/storage/householdStore';
import { useHousehold } from './useHousehold';
import { RiskBadge } from './components/RiskBadge';
import { StageSwitcher } from './components/StageSwitcher';
import type { Stage } from '@/types';
import { ALLERGEN_LABELS, AMOUNT_LABELS, HAZARD_LABELS, REACTION_LABELS } from '@/lib/labels';

/**
 * Pořadí odshora podle docs/SPEC.md kapitola 4.2 — bezpečnost první,
 * protože kvůli ní se sem chodí.
 */
export function IngredientDetail(): ReactNode {
  const { id } = useParams<{ id: string }>();
  const { suggestedStage } = useHousehold();
  const { state, toggleFavorite, recordTasting } = useHouseholdStore();
  const [stage, setStage] = useState<Stage | null>(null);

  const ingredient = useMemo(
    () => catalogIngredients.find((item) => item.id === id),
    [id],
  );
  const relatedRecipes = useMemo(
    () => (ingredient === undefined ? [] : recipesWithIngredient(catalogRecipes, ingredient.id)),
    [ingredient],
  );
  const tastings = state.tastings.filter((event) => event.ingredientId === id);

  if (ingredient === undefined) {
    return (
      <section className="flex flex-col gap-3">
        <Link to="/suroviny" className="inline-flex min-h-touch items-center gap-1 text-sm text-accent">
          <ChevronLeft aria-hidden="true" className="h-4 w-4" />
          Zpět na suroviny
        </Link>
        <h1 className="text-lg font-semibold">Surovina nenalezena</h1>
        <p className="text-sm text-muted">
          Tahle položka v katalogu není. Možná se změnil odkaz, nebo se katalog teprve plní.
        </p>
      </section>
    );
  }

  const activeStage = stage ?? suggestedStage;
  const prep = ingredient.prep[activeStage];
  const isFavorite = state.favorites.includes(ingredient.id);

  return (
    <section className="flex flex-col gap-5">
      <Link to="/suroviny" className="inline-flex min-h-touch items-center gap-1 text-sm text-accent">
        <ChevronLeft aria-hidden="true" className="h-4 w-4" />
        Zpět na suroviny
      </Link>

      {/* 1. Název a štítky */}
      <header className="flex flex-col gap-2">
        <div className="flex items-start gap-2">
          <h1 className="flex-1 break-words text-2xl font-bold leading-tight">
            {ingredient.emoji !== undefined && <span aria-hidden="true">{ingredient.emoji} </span>}
            {ingredient.nameCz}
          </h1>
          <button
            type="button"
            aria-label={isFavorite ? 'Odebrat z oblíbených' : 'Přidat do oblíbených'}
            aria-pressed={isFavorite}
            onClick={() => void toggleFavorite(ingredient.id)}
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${
              isFavorite ? 'border-accent bg-accent/10 text-accent' : 'border-muted/30 text-muted'
            }`}
          >
            <Heart aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <RiskBadge risk={ingredient.chokingRisk} />
          {ingredient.allergens.map((allergen) => (
            <span key={allergen} className="rounded-full bg-paper px-2 py-0.5 text-sm text-muted">
              alergen: {ALLERGEN_LABELS[allergen]}
            </span>
          ))}
          {ingredient.hazards.map((hazard) => (
            <span key={hazard} className="rounded-full bg-caution/10 px-2 py-0.5 text-sm text-caution">
              {HAZARD_LABELS[hazard]}
            </span>
          ))}
        </div>
      </header>

      {/* 2. Bezpečnostní blok */}
      <div className="flex flex-col gap-3 rounded-xl border border-muted/20 bg-surface p-4" data-testid="bezpecnostni-blok">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Bezpečnost</h2>
        <RiskBadge risk={ingredient.chokingRisk} />
        {ingredient.chokingReason !== undefined && (
          <p className="text-sm leading-relaxed">{ingredient.chokingReason}</p>
        )}
        {ingredient.hazards.map((hazard) => (
          <div key={hazard} className="flex gap-2 text-sm">
            <TriangleAlert aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-caution" />
            <p className="leading-relaxed">
              <strong>{HAZARD_LABELS[hazard]}: </strong>
              {ingredient.hazardNotes[hazard] ?? 'Bez bližšího vysvětlení.'}
            </p>
          </div>
        ))}
        {ingredient.frequencyLimit !== undefined && (
          <p className="text-sm">
            <strong>Jak často: </strong>
            {ingredient.frequencyLimit}
          </p>
        )}
        <p className="text-xs text-muted">Nabízená od {ingredient.minAgeMonths} měsíců.</p>
      </div>

      {/* 3. Přepínač fází s pokynem ke krájení */}
      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
          Jak nakrájet a podat
        </h2>
        <StageSwitcher value={activeStage} onChange={setStage} suggested={suggestedStage} />
        <div className="rounded-xl bg-surface p-4">
          <p className="text-sm leading-relaxed" data-testid="pokyn-serving">
            {prep.serving}
          </p>
          {prep.caution !== undefined && (
            <p className="mt-2 flex gap-2 text-sm text-caution">
              <TriangleAlert aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{prep.caution}</span>
            </p>
          )}
        </div>
      </div>

      {/* 4. Nápady na úpravu */}
      <div className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Nápady na úpravu</h2>
        <ul className="flex flex-col gap-1 rounded-xl bg-surface p-4 text-sm">
          {ingredient.prepIdeas.map((idea) => (
            <li key={idea} className="list-inside list-disc">
              {idea}
            </li>
          ))}
        </ul>
      </div>

      {/* 5. Recepty s touto surovinou */}
      <div className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Recepty</h2>
        {relatedRecipes.length === 0 ? (
          <p className="rounded-xl bg-surface p-4 text-sm text-muted">
            Zatím žádný recept s touhle surovinou.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {relatedRecipes.map((recipe) => (
              <li key={recipe.id}>
                <Link
                  to={`/recepty/${recipe.id}`}
                  className="flex min-h-touch items-center justify-between gap-2 rounded-xl bg-surface p-3 text-sm font-medium"
                >
                  <span className="min-w-0 break-words">{recipe.titleCz}</span>
                  <span className="shrink-0 text-xs text-muted">{recipe.timeMinutes} min</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 6. Historie ochutnávek */}
      <div className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Ochutnávky</h2>
        <div className="flex flex-col gap-2 rounded-xl bg-surface p-4">
          {tastings.length === 0 ? (
            <p className="text-sm text-muted">Zatím neochutnáno.</p>
          ) : (
            <ul className="flex flex-col gap-1 text-sm">
              {tastings.map((event) => (
                <li key={event.id} className="flex justify-between gap-2">
                  <span>{event.date}</span>
                  <span className="text-muted">
                    {AMOUNT_LABELS[event.amount]} · {REACTION_LABELS[event.reaction]}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <button
            type="button"
            onClick={() =>
              void recordTasting({
                ingredientId: ingredient.id,
                date: new Date().toISOString().slice(0, 10),
                amount: 'ochutnala',
                reaction: 'zadna',
                createdBy: 'toto-zarizeni',
              })
            }
            className="flex min-h-touch items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white"
          >
            <Plus aria-hidden="true" className="h-4 w-4" />
            Zaznamenat ochutnávku
          </button>
        </div>
      </div>

      {/* 7. Zdroje */}
      <details className="rounded-xl bg-surface p-4">
        <summary className="min-h-touch cursor-pointer text-sm font-semibold">
          Zdroje ({ingredient.sources.length})
        </summary>
        {ingredient.reviewStatus === 'needs-review' && (
          <p className="mt-2 rounded-lg bg-caution/10 p-2 text-sm text-caution">
            <strong>Neověřeno — zkontroluj s pediatričkou.</strong>{' '}
            {ingredient.reviewNote ?? ''}
          </p>
        )}
        <ul className="mt-2 flex flex-col gap-2 text-sm">
          {ingredient.sources.map((source) => (
            <li key={source.url}>
              <a
                href={source.url}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex min-h-touch items-center gap-1 text-accent underline"
              >
                <ExternalLink aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                <span className="break-words">
                  {source.org} — {source.title}
                </span>
              </a>
              <span className="block text-xs text-muted">
                tier {source.tier} · ověřeno {source.accessedAt}
              </span>
            </li>
          ))}
        </ul>
      </details>
    </section>
  );
}
