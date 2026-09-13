import { Droplet, Info, Sparkles } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { recipes } from '@/data';
import { nutrientProfile, vitaminCPartners, vitaminCSources } from '@/data/nutrients';
import type { NutrientLevel } from '@/data/nutrients';
import type { Ingredient } from '@/types';
import { LEVEL_CHIP, LEVEL_LABELS } from '../lib/nutrientLabels';

function Pill({ label, level }: { label: string; level: NutrientLevel }): ReactNode {
  return (
    <div className={`flex-1 rounded-xl border px-3 py-2 ${LEVEL_CHIP[level]}`}>
      <p className="text-[11px] font-semibold uppercase tracking-wide">{label}</p>
      <p className="text-sm font-semibold">{LEVEL_LABELS[level]}</p>
    </div>
  );
}

/**
 * Železo a zinek u konkrétní suroviny.
 *
 * Ukazuje zařazení do skupiny potravin, ne miligramy — měřené hodnoty by se
 * musely vzít z potravinové tabulky, kterou politika zdrojů nemá mezi
 * povolenými. Text to říká nahlas, ať si to nikdo neplete s tabulkou.
 */
export function NutrientBlock({ ingredient }: { ingredient: Ingredient }): ReactNode {
  const profile = nutrientProfile(ingredient);
  const zajimave =
    profile.iron !== 'nevyznamny' || profile.zinc !== 'nevyznamny' || profile.vitaminC !== 'nevyznamny';
  if (!zajimave) return null;

  const nehemove = profile.ironForm === 'nehemove' && profile.iron !== 'nevyznamny';
  const partners = nehemove ? vitaminCPartners(ingredient, 5) : [];

  // Recepty, které tuhle surovinu spojují s něčím bohatým na vitamin C —
  // přesně ta kombinace, která vstřebávání rostlinného železa zlepšuje.
  // Hledá se napříč všemi zdroji vitaminu C, ne jen mezi zobrazenými pěti.
  const vsechnyZdrojeC = new Set(vitaminCSources().map((item) => item.id));
  const kombinace = nehemove
    ? recipes
        .filter((recipe) => {
          const ids = recipe.ingredients.map((ref) => ref.ingredientId);
          return ids.includes(ingredient.id) && ids.some((id) => vsechnyZdrojeC.has(id));
        })
        .slice(0, 3)
    : [];

  return (
    <section
      aria-labelledby="zivin-nadpis"
      data-testid="blok-zelezo-zinek"
      className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-4 shadow-soft"
    >
      <h2
        id="zivin-nadpis"
        className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted"
      >
        <Droplet aria-hidden="true" className="h-4 w-4 text-accent" />
        Železo a zinek
      </h2>

      <div className="flex gap-2">
        <Pill label="Železo" level={profile.iron} />
        <Pill label="Zinek" level={profile.zinc} />
        <Pill label="Vitamin C" level={profile.vitaminC} />
      </div>

      {profile.ironForm === 'hemove' && profile.iron !== 'nevyznamny' && (
        <p className="text-sm leading-relaxed">
          Železo z masa a ryb je hemové a vstřebává se lépe než železo z rostlin. Rozhoduje ale
          podoba sousta — kostka dušená doměkka se rozpadá a dítě z ní něco získá, tuhý plátek
          skončí ocucaný a vyplivnutý.
        </p>
      )}

      {nehemove && (
        <>
          <p className="text-sm leading-relaxed">
            Tohle je rostlinné, tedy nehemové železo. Vstřebává se hůř než železo z masa, ale
            výrazně mu pomáhá vitamin C ve stejném jídle. Kombinuj proto tuhle surovinu s ovocem
            nebo zeleninou bohatou na vitamin C.
          </p>
          {partners.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                Nejlépe se vstřebá s
              </p>
              <ul className="mt-1.5 flex flex-wrap gap-2" data-testid="doporucene-kombinace">
                {partners.map((item) => (
                  <li key={item.id}>
                    <Link
                      to={`/suroviny/${item.id}`}
                      className="flex min-h-touch items-center gap-1.5 rounded-full border border-accent/30 bg-accent-soft px-3 text-sm font-medium text-accent"
                    >
                      <span aria-hidden="true">{item.emoji ?? '🍽️'}</span>
                      {item.nameCz}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {kombinace.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                Recepty, kde je ta kombinace hotová
              </p>
              <ul className="mt-1.5 flex flex-col gap-1.5" data-testid="recepty-kombinace">
                {kombinace.map((recipe) => (
                  <li key={recipe.id}>
                    <Link
                      to={`/recepty/${recipe.id}`}
                      className="flex min-h-touch items-center gap-2 rounded-xl border border-line bg-paper px-3 text-sm font-medium"
                    >
                      <Sparkles aria-hidden="true" className="h-4 w-4 shrink-0 text-accent" />
                      {recipe.titleCz}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}

      {profile.vitaminC === 'vyznamny' && (
        <p className="text-sm leading-relaxed">
          Tahle surovina je naopak tím pomocníkem: přidaná k luštěninám, obilovinám nebo semenům
          zlepší vstřebání jejich železa.
        </p>
      )}

      <p className="flex items-start gap-2 rounded-xl bg-paper px-3 py-2 text-xs leading-relaxed text-muted">
        <Info aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        <span>
          Zařazení podle skupin potravin, které jako zdroj jmenují NHS a odborná literatura — ne
          měřená hodnota v miligramech. Potravinové tabulky aplikace nepoužívá.
        </span>
      </p>
    </section>
  );
}
