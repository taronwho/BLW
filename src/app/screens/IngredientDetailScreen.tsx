import { ArrowLeft, BookOpen, Star } from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ingredientById } from '@/data/ingredients';
import { useHouseholdStore } from '@/storage/householdStore';
import type { Stage } from '@/types';
import { ChokingBadge } from '../components/ChokingBadge';
import { GripHint } from '../components/GripHint';
import { ReadinessNote } from '../components/ReadinessNote';
import { NutrientBlock } from '../components/NutrientBlock';
import { SourceDisclosure } from '../components/SourceList';
import { StageSwitch } from '../components/StageSwitch';
import { TastingLog } from '../components/TastingLog';
import { ageInMonths, stageForAge, STAGE_LABELS } from '../lib/age';
import { CHOKING_PRESENTATION } from '../lib/choking';
import { tastingsByIngredient } from '../lib/derive';
import { favoriteIds } from '../lib/tastings';
import { recipesWithIngredient } from '../lib/deriveRecipes';
import { ALLERGEN_LABELS, CATEGORY_LABELS, formatSeason, HAZARD_LABELS } from '../lib/labels';
import { readReviewAcks, writeReviewAck } from '../lib/reviewAcks';
import { IngredientIcon } from '../components/IngredientIcon';
import { NakupTlacitko } from '../components/NakupTlacitko';
import { NotFoundScreen } from './NotFoundScreen';
import { useAktivniDiteId, useNarozeniAktivniho } from '../lib/dite';

/** Detail suroviny — pořadí odshora podle docs/SPEC.md kap. 4.2: bezpečnost první. */
export function IngredientDetailScreen(): ReactNode {
  const { id = '' } = useParams();
  const ingredient = ingredientById.get(id);
  const state = useHouseholdStore((store) => store.state);
  const toggleFavorite = useHouseholdStore((store) => store.toggleFavorite);

  const months = ageInMonths(useNarozeniAktivniho());
  const currentStage = stageForAge(months);
  const [stage, setStage] = useState<Stage>(currentStage);
  const [acks, setAcks] = useState<Set<string>>(() => new Set<string>());

  useEffect(() => setStage(currentStage), [currentStage]);
  useEffect(() => setAcks(readReviewAcks()), []);

  const diteId = useAktivniDiteId();
  const history = useMemo(
    () => tastingsByIngredient(state, diteId).get(id) ?? [],
    [state, diteId, id],
  );
  const linkedRecipes = useMemo(() => recipesWithIngredient(id), [id]);

  // Přejmenovaná surovina ze staré záložky nesmí skončit tichým skokem na
  // seznam — vypadá to jako rozbitá aplikace.
  if (ingredient === undefined) return <NotFoundScreen />;

  const prep = ingredient.prep[stage];
  const presentation = CHOKING_PRESENTATION[ingredient.chokingRisk];
  const favorite = favoriteIds(state).has(ingredient.id);
  const acknowledged = acks.has(ingredient.id);

  return (
    <article className="flex flex-col gap-5">
      <Link
        to="/suroviny"
        data-testid="zpet-na-suroviny"
        className="flex min-h-touch w-fit items-center gap-2 rounded-xl px-2 text-sm font-medium text-accent"
      >
        <ArrowLeft aria-hidden="true" className="h-5 w-5 shrink-0" />
        Zpět na suroviny
      </Link>

      <header className="flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <h1 className="min-w-0 text-xl font-bold">
            <IngredientIcon ingredient={ingredient} className="mr-1 inline-block h-7 w-7 align-[-0.15em]" />
            {ingredient.nameCz}
          </h1>
          <button
            type="button"
            aria-pressed={favorite}
            aria-label={favorite ? 'Odebrat z oblíbených' : 'Přidat do oblíbených'}
            onClick={() => void toggleFavorite(ingredient.id)}
            className={`flex min-h-touch min-w-touch shrink-0 items-center justify-center rounded-xl border ${
              favorite ? 'border-caution bg-caution/10 text-caution' : 'border-muted/30 text-muted'
            }`}
          >
            <Star aria-hidden="true" className="h-5 w-5" />
          </button>
          {/* Surovina do nákupu bez množství: kolik jí vzít, ví rodič sám,
              a recept, který by množství určil, tu žádný není. */}
          <NakupTlacitko
            ikona
            davky={[{ ingredientId: ingredient.id }]}
            popis={`${ingredient.nameCz} do nákupu`}
            testId="surovina-do-nakupu"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          <span className="rounded-lg bg-surface px-2 py-1 text-xs font-medium text-muted">
            {CATEGORY_LABELS[ingredient.category]}
          </span>
          <span className="rounded-lg bg-surface px-2 py-1 text-xs font-medium text-muted">
            od {ingredient.minAgeMonths} měsíců
          </span>
          <span className="rounded-lg bg-surface px-2 py-1 text-xs font-medium text-muted">
            {formatSeason(ingredient.seasonCz)}
          </span>
          {ingredient.allergens.map((allergen) => (
            <span key={allergen} className="rounded-lg bg-caution/10 px-2 py-1 text-xs font-medium text-caution">
              alergen: {ALLERGEN_LABELS[allergen]}
            </span>
          ))}
          {ingredient.hazards.map((hazard) => (
            <span key={hazard} className="rounded-lg bg-risk/10 px-2 py-1 text-xs font-medium text-risk">
              {HAZARD_LABELS[hazard]}
            </span>
          ))}
        </div>
      </header>

      <section
        aria-labelledby="bezpecnost-nadpis"
        data-testid="bezpecnostni-blok"
        className={`flex flex-col gap-3 rounded-xl border bg-surface p-4 ${presentation.chip}`}
      >
        <h2 id="bezpecnost-nadpis" className="text-sm font-semibold uppercase tracking-wide">
          Bezpečnost
        </h2>
        <ChokingBadge risk={ingredient.chokingRisk} />
        <p className="text-sm leading-relaxed">
          {ingredient.chokingReason ?? presentation.meaning}
        </p>
        {ingredient.hazards.length > 0 && (
          <ul className="flex flex-col gap-2">
            {ingredient.hazards.map((hazard) => (
              <li key={hazard} className="text-sm leading-relaxed">
                <strong className="font-semibold">{HAZARD_LABELS[hazard]}: </strong>
                {ingredient.hazardNotes[hazard] ?? 'Viz zdroje u této suroviny.'}
              </li>
            ))}
          </ul>
        )}
        {ingredient.frequencyLimit !== undefined && (
          <p className="text-sm font-medium">Četnost: {ingredient.frequencyLimit}</p>
        )}
        {ingredient.reviewStatus === 'needs-review' && (
          <div className="flex flex-col gap-2 rounded-lg bg-risk/10 p-3">
            <p className="text-sm font-semibold text-risk">Neověřeno, zkontroluj s pediatrem</p>
            {ingredient.reviewNote !== undefined && (
              <p className="text-sm leading-relaxed">{ingredient.reviewNote}</p>
            )}
            {acknowledged ? (
              <p className="text-sm font-medium">Označeno jako probrané s pediatrem (jen na tomhle zařízení).</p>
            ) : (
              <button
                type="button"
                onClick={() => setAcks(writeReviewAck(ingredient.id))}
                className="min-h-touch rounded-xl border border-risk px-4 py-2 text-sm font-semibold text-risk"
              >
                Označit jako ověřené
              </button>
            )}
          </div>
        )}
      </section>

      <section aria-labelledby="faze-nadpis" className="flex flex-col gap-3 rounded-xl bg-surface p-4">
        <h2 id="faze-nadpis" className="text-sm font-semibold uppercase tracking-wide text-muted">
          Krájení a servírování
        </h2>
        <StageSwitch value={stage} onChange={setStage} currentStage={currentStage} />
        <p className="text-sm leading-relaxed" data-testid="pokyn-faze">
          {prep?.serving ?? 'Pokyn pro tuto fázi není vyplněný.'}
        </p>
        {prep?.caution !== undefined && (
          <p className="rounded-lg bg-caution/10 p-3 text-sm leading-relaxed text-caution">
            Pozor ve fázi {STAGE_LABELS[stage]}: {prep.caution}
          </p>
        )}
        <ReadinessNote stage={stage} />
        <GripHint chokingRisk={ingredient.chokingRisk} servingForm={ingredient.servingForm} />
      </section>

      <section aria-labelledby="napady-nadpis" className="flex flex-col gap-2 rounded-xl bg-surface p-4">
        <h2 id="napady-nadpis" className="text-sm font-semibold uppercase tracking-wide text-muted">
          Nápady na úpravu
        </h2>
        <ul className="flex list-disc flex-col gap-1 pl-5 text-sm leading-relaxed">
          {ingredient.prepIdeas.map((idea) => (
            <li key={idea}>{idea}</li>
          ))}
        </ul>
      </section>

      <NutrientBlock ingredient={ingredient} />

      <section aria-labelledby="recepty-nadpis" className="flex flex-col gap-2">
        <h2 id="recepty-nadpis" className="text-sm font-semibold uppercase tracking-wide text-muted">
          Recepty s touto surovinou ({linkedRecipes.length})
        </h2>
        {linkedRecipes.length === 0 ? (
          <p className="rounded-xl bg-surface p-4 text-sm text-muted">
            Zatím žádný recept v kuchařce tuhle surovinu nepoužívá.
          </p>
        ) : (
          <ul className="flex flex-col gap-2" data-testid="recepty-se-surovinou">
            {linkedRecipes.map((recipe) => (
              <li key={recipe.id}>
                <Link
                  to={`/recepty/${recipe.id}`}
                  data-testid={`odkaz-recept-${recipe.id}`}
                  className="flex min-h-touch items-center gap-2 rounded-xl bg-surface p-3 text-sm font-medium"
                >
                  <BookOpen aria-hidden="true" className="h-4 w-4 shrink-0 text-accent" />
                  <span className="min-w-0">{recipe.titleCz}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="ochutnavky-nadpis" className="flex flex-col gap-3 rounded-xl bg-surface p-4">
        <h2 id="ochutnavky-nadpis" className="text-sm font-semibold uppercase tracking-wide text-muted">
          Ochutnávky ({history.length})
        </h2>
        <TastingLog
          ingredientId={ingredient.id}
          ingredientName={ingredient.nameCz}
          history={history}
        />
      </section>

      <SourceDisclosure sources={ingredient.sources} testId="prepinac-zdroju" />

    </article>
  );
}
