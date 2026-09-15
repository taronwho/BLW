import { ArrowLeft, BookOpen, ChevronRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { guideById, ingredientById, listById } from '@/data';
import { nutrientProfile } from '@/data/nutrients';
import { useHouseholdStore } from '@/storage/householdStore';
import { IngredientIcon } from '../components/IngredientIcon';
import { AllergenChip, ChokingChip } from '../components/SafetyChips';
import { SourceDisclosure } from '../components/SourceList';
import { TastedToggle } from '../components/TastedToggle';
import { useAktivniDiteId } from '../lib/dite';
import { tastedIds } from '../lib/tastings';
import { NotFoundScreen } from './NotFoundScreen';

/** Jeden tematický seznam i s postupem dítěte. */
export function ListDetailScreen(): ReactNode {
  const { id } = useParams<{ id: string }>();
  const state = useHouseholdStore((store) => store.state);
  const diteId = useAktivniDiteId();
  const tasted = useMemo(() => tastedIds(state, diteId), [state, diteId]);

  const seznam = id === undefined ? undefined : listById.get(id);
  if (seznam === undefined) {
    return <NotFoundScreen />;
  }

  const polozky = seznam.polozky
    .map((polozka) => ({ polozka, item: ingredientById.get(polozka.id) }))
    .filter((dvojice): dvojice is { polozka: (typeof seznam.polozky)[number]; item: NonNullable<typeof dvojice.item> } =>
      dvojice.item !== undefined,
    );
  const hotovo = polozky.filter(({ item }) => tasted.has(item.id)).length;
  const rada = seznam.guideId === undefined ? undefined : guideById.get(seznam.guideId);

  return (
    <section className="flex flex-col gap-4" aria-labelledby="seznam-nadpis">
      <Link
        to="/seznamy"
        className="flex min-h-touch items-center gap-2 self-start text-sm font-semibold text-accent"
      >
        <ArrowLeft aria-hidden="true" className="h-4 w-4 shrink-0" />
        Zpět na seznamy
      </Link>

      <header className="flex flex-col gap-2">
        <h1 id="seznam-nadpis" className="text-xl font-bold">
          {seznam.titleCz}
        </h1>
        <p className="text-sm leading-relaxed">{seznam.intro}</p>
        <p className="text-xs text-muted" data-testid="postup-seznamu">
          Ochutnáno {hotovo} z {polozky.length}
        </p>
      </header>

      {rada !== undefined && (
        <Link
          to={`/rady/${rada.id}`}
          data-testid="rada-seznamu"
          className="flex items-center gap-2.5 rounded-xl border border-line bg-surface p-3 shadow-soft"
        >
          <BookOpen aria-hidden="true" className="h-5 w-5 shrink-0 text-accent" />
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold">{rada.titleCz}</span>
            <span className="block text-[11px] leading-snug text-muted">{rada.summary}</span>
          </span>
          <ChevronRight aria-hidden="true" className="h-4 w-4 shrink-0 text-muted" />
        </Link>
      )}

      <ul className="flex flex-col gap-2" data-testid="polozky-seznamu">
        {polozky.map(({ polozka, item }) => {
          const profil = nutrientProfile(item);
          const alergen = item.allergens[0];
          return (
            <li
              key={item.id}
              className="flex items-center gap-2 rounded-xl bg-surface p-2.5"
            >
              <Link
                to={`/suroviny/${item.id}`}
                data-testid={`seznam-surovina-${item.id}`}
                className="flex min-w-0 flex-1 items-center gap-2.5"
              >
                <IngredientIcon ingredient={item} className="h-8 w-8" />
                <span className="flex min-w-0 flex-col gap-1">
                  <span className="text-sm font-semibold leading-snug">{item.nameCz}</span>
                  {/* Proč je položka zrovna v tomhle seznamu. Bez toho je
                      seznam jen jinak poskládaný katalog. */}
                  <span className="text-xs leading-snug text-muted">{polozka.note}</span>
                  <span className="flex flex-wrap items-center gap-1">
                    <span className="rounded-lg bg-paper px-2 py-0.5 text-[11px] font-medium text-muted">
                      <span aria-hidden="true">{item.minAgeMonths} m+</span>
                      <span className="sr-only">vhodné od {item.minAgeMonths} měsíců</span>
                    </span>
                    <ChokingChip risk={item.chokingRisk} testId={`duseni-${item.id}`} compact />
                    {alergen !== undefined && (
                      <AllergenChip allergen={alergen} testId={`alergen-${item.id}`} compact />
                    )}
                    {profil.iron !== 'nevyznamny' && (
                      <span className="rounded-lg border border-accent/30 bg-accent-soft px-2 py-0.5 text-[11px] font-medium text-accent">
                        železo
                      </span>
                    )}
                  </span>
                </span>
              </Link>

              {/* Zápis ochutnávky přímo ze seznamu — právě kvůli němu se
                  postup nahoře hýbe. */}
              <TastedToggle
                ingredientId={item.id}
                ingredientName={item.nameCz}
                tasted={tasted.has(item.id)}
              />
            </li>
          );
        })}
      </ul>

      {/* Doklady patří pod seznam, ne nad něj. Rodič sem jde pro suroviny;
          zdroje si otevře, když bude chtít vědět, odkud to je. */}
      {seznam.sources !== undefined && seznam.sources.length > 0 && (
        <SourceDisclosure
          sources={seznam.sources}
          label="Zdroje seznamu"
          testId="zdroje-seznamu"
        />
      )}
    </section>
  );
}
