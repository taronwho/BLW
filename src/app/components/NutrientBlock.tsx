import { Droplet, Info, Sparkles } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { recipes } from '@/data';
import { nutrientProfile, vitaminCSources } from '@/data/nutrients';
import { vitaminCPartners } from '@/data/recipeNutrients';
import type { NutrientLevel } from '@/data/nutrients';
import { COMPOSITION } from '@/data/composition';
import type { Ingredient, SourceRef } from '@/types';
import { LEVEL_CHIP, LEVEL_LABELS } from '../lib/nutrientLabels';
import { IngredientIcon } from './IngredientIcon';
import { SourceDisclosure } from './SourceList';

/** Miligramy česky: desetinná čárka, nejvýš dvě místa, bez zbytečných nul. */
function mg(hodnota: number): string {
  const zaokrouhleno = Math.round(hodnota * 100) / 100;
  return `${zaokrouhleno.toString().replace('.', ',')} mg`;
}

function Pill({
  label,
  level,
  obsah,
}: {
  label: string;
  level: NutrientLevel;
  /** Naměřený obsah ve 100 g jedlého podílu, když ho pro surovinu máme. */
  obsah?: number;
}): ReactNode {
  return (
    <div className={`flex-1 rounded-xl border px-3 py-2 ${LEVEL_CHIP[level]}`}>
      <p className="text-[11px] font-semibold uppercase tracking-wide">{label}</p>
      <p className="text-sm font-semibold">{LEVEL_LABELS[level]}</p>
      {/* Bez ztlumení průhledností — na barevném štítku by kontrast spadl
          pod přístupnostní minimum, což hlídá test v tests/e2e/a11y.spec.ts. */}
      {obsah !== undefined && <p className="text-[11px] font-medium">{mg(obsah)} ve 100 g</p>}
    </div>
  );
}

/**
 * Živiny u konkrétní suroviny: železo, zinek a vitamin C.
 *
 * Kde máme naměřený obsah z potravinové tabulky, ukazuje se vedle stupnice
 * i v miligramech na 100 g a pod blokem stojí odkaz na řádek tabulky, ze
 * kterého je. Kde číslo nemáme, zůstává jen zařazení podle skupiny potravin
 * a text to říká nahlas, ať si to nikdo neplete s měřením.
 *
 * Blok se ukazuje i tehdy, když žádná ze tří živin prahu nedosáhne, ale číslo
 * pro ni máme: „železo 1,04 mg, není zdroj" je u kuřecího prsa poctivější
 * odpověď než nezobrazit nic.
 */
export function NutrientBlock({ ingredient }: { ingredient: Ingredient }): ReactNode {
  const profile = nutrientProfile(ingredient);
  const slozeni = COMPOSITION[ingredient.id];
  const zajimave =
    profile.iron !== 'nevyznamny' ||
    profile.zinc !== 'nevyznamny' ||
    profile.vitaminC !== 'nevyznamny' ||
    slozeni !== undefined;
  if (!zajimave) return null;

  const zdrojeObsahu: SourceRef[] = [];
  for (const zivina of ['iron', 'zinc', 'vitaminC'] as const) {
    const zdroj = slozeni?.[zivina]?.zdroj;
    if (zdroj !== undefined && !zdrojeObsahu.some((one) => one.url === zdroj.url)) {
      zdrojeObsahu.push(zdroj);
    }
  }

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
        Živiny
      </h2>

      {/* Vypisuje se to, co surovina nese, a navíc to, u čeho máme číslo —
          „železo 1,04 mg, není zdroj" je informace, prázdná řádka ne. */}
      <div className="flex flex-wrap gap-2">
        {(profile.iron !== 'nevyznamny' || slozeni?.iron !== undefined) && (
          <Pill label="Železo" level={profile.iron} obsah={slozeni?.iron?.mg} />
        )}
        {(profile.zinc !== 'nevyznamny' || slozeni?.zinc !== undefined) && (
          <Pill label="Zinek" level={profile.zinc} obsah={slozeni?.zinc?.mg} />
        )}
        {(profile.vitaminC !== 'nevyznamny' || slozeni?.vitaminC !== undefined) && (
          <Pill label="Vitamin C" level={profile.vitaminC} obsah={slozeni?.vitaminC?.mg} />
        )}
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
            Železo v téhle surovině je rostlinné, tedy nehemové. Vstřebává se hůř než železo
            z masa, ale výrazně mu pomáhá vitamin C ve stejném jídle. Podávej proto tuhle surovinu
            spolu s ovocem nebo zeleninou bohatou na vitamin C.
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
                      <IngredientIcon ingredient={item} className="h-4 w-4" />
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
                Recepty, kde se tahle surovina potkává s vitaminem C
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

      {profile.zinc !== 'nevyznamny' && (
        <p className="text-sm leading-relaxed">
          Zinek se v jídelníčku drží stejných potravin jako železo — masa, luštěnin, semínek
          a celozrnných obilovin. Jedno takové jídlo proto obvykle dodá obojí najednou.
        </p>
      )}

      {profile.vitaminC !== 'nevyznamny' && (
        <p className="text-sm leading-relaxed">
          {profile.vitaminC === 'vyznamny'
            ? 'Vitamin C pomáhá tělu vstřebat železo z rostlin. Podávej tuhle surovinu spolu s luštěninami, obilovinami nebo semínky a dítě z nich získá víc železa, než by získalo ze samotné porce.'
            : 'Vitamin C tahle surovina obsahuje, i když k jeho nejbohatším zdrojům nepatří. I tak ve stejném jídle podporuje vstřebávání železa z luštěnin, obilovin a semínek.'}
        </p>
      )}

      <p className="flex items-start gap-2 rounded-xl bg-paper px-3 py-2 text-xs leading-relaxed text-muted">
        <Info aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        <span data-testid="poznamka-k-zivinam">
          {slozeni === undefined ? (
            <>
              Pro tuhle surovinu žádná z použitých potravinových tabulek obsah neuvádí, takže
              zařazení stojí na skupině potravin, kterou jako zdroj jmenují NHS a odborná
              literatura. Je to hrubší odhad než miligramy.
            </>
          ) : (
            <>
              Obsah je naměřený a platí pro 100 g jedlého podílu.
              {slozeni.poznamka !== undefined && ` ${slozeni.poznamka}`} Stupnice „obsahuje"
              a „významný zdroj" odpovídá 15 % a 30 % denní potřeby dospělého, tedy hranicím,
              které platí i pro etiketu potraviny. Aplikace nedávkuje dítě.
            </>
          )}
        </span>
      </p>

      {zdrojeObsahu.length > 0 && (
        <SourceDisclosure
          sources={zdrojeObsahu}
          label="Zdroje naměřených hodnot"
          testId="zdroje-obsahu-suroviny"
        />
      )}
    </section>
  );
}
