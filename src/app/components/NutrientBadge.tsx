import { Citrus, Droplet, Info, ShieldCheck, Sparkles, X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { NUTRIENT_SOURCES, type NutrientLevel, type NutrientProfile } from '@/data/nutrients';
import type { Slozeni, Zivina } from '@/data/composition';
import type { Ingredient, SourceRef } from '@/types';
import { IRON_FORM_LABELS, LEVEL_CHIP, LEVEL_DOTS, LEVEL_LABELS } from '../lib/nutrientLabels';
import { IngredientIcon } from './IngredientIcon';
import { SourceDisclosure } from './SourceList';

export interface NutrientBadgeProps {
  profile: NutrientProfile;
  /** Název položky do hlavičky okénka. */
  title: string;
  /** Zdroje železa v receptu; u suroviny zůstává prázdné. */
  ironFrom?: readonly Ingredient[];
  /** Zdroje vitaminu C ve stejném receptu. */
  vitaminCFrom?: readonly Ingredient[];
  /**
   * Naměřený obsah z potravinové tabulky, pokud ho pro surovinu máme.
   *
   * U receptu se nepředává: sčítat miligramy přes suroviny by předstíralo
   * přesnost, kterou složení hotového jídla nemá.
   */
  slozeni?: Slozeni;
  testId?: string;
}

interface ChipSpec {
  /** Klíč do profilu živin. */
  key: 'iron' | 'zinc' | 'vitaminC';
  label: string;
  /** Do aria-label, kde věta začíná velkým písmenem. */
  aria: string;
  Icon: LucideIcon;
  /** Přípona testId; železo ji nemá, aby staré `zeleza-…` zůstalo beze změny. */
  suffix: string;
}

/**
 * Tři živiny v pořadí, v jakém se čtou.
 *
 * Železo je první, protože kvůli němu se po šestém měsíci příkrm zavádí.
 * Zinek s ním chodí ve stejných potravinách a vitamin C je tu proto, že
 * zlepšuje vstřebávání rostlinného železa — dohromady to dává smysl jako
 * jedna řádka.
 */
const CHIPS: readonly ChipSpec[] = [
  { key: 'iron', label: 'železo', aria: 'Železo', Icon: Droplet, suffix: '' },
  { key: 'zinc', label: 'zinek', aria: 'Zinek', Icon: ShieldCheck, suffix: '-zinek' },
  { key: 'vitaminC', label: 'vitamin C', aria: 'Vitamin C', Icon: Citrus, suffix: '-cecko' },
];

/** Miligramy česky: desetinná čárka, nejvýš dvě místa, bez zbytečných nul. */
function mg(hodnota: number): string {
  const zaokrouhleno = Math.round(hodnota * 100) / 100;
  return `${zaokrouhleno.toString().replace('.', ',')} mg`;
}

/**
 * Věta o tom, co položka obsahuje. Čím není, se nevypisuje — rodič v kuchyni
 * hledá, co použít, ne seznam toho, co v surovině chybí. Věta musí dávat
 * smysl sama o sobě: okénko se otevírá i nad surovinou, která má jen
 * vitamin C. Když není co dodat, vrací null a odstavec se vůbec nevykreslí.
 */
function popisZivin(profile: NutrientProfile): string | null {
  if (profile.ironForm === 'hemove') {
    return 'Železo z masa a ryb je hemové a vstřebává se lépe než železo z rostlin. Rozhoduje ale podoba sousta — kostka dušená doměkka se rozpadá, tuhý plátek skončí ocucaný.';
  }
  if (profile.ironForm === 'nehemove') {
    return 'Rostlinné, tedy nehemové železo se vstřebává hůř než železo z masa. Výrazně mu ale pomáhá vitamin C ve stejném jídle.';
  }
  if (profile.zinc !== 'nevyznamny') {
    return 'Zinek se v jídelníčku drží stejných potravin jako železo — masa, luštěnin, semínek a celozrnných obilovin. Jedno takové jídlo proto obvykle dodá obojí.';
  }
  // Zbývá jen vitamin C a o tom mluví další odstavec; opakovat se nemá smysl.
  return null;
}

function Row({
  label,
  level,
  obsah,
}: {
  label: string;
  level: NutrientLevel;
  /** Naměřený obsah ve 100 g, když ho pro surovinu máme. */
  obsah?: number;
}): ReactNode {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-line bg-paper px-3 py-2">
      <span className="flex min-w-0 flex-col">
        <span className="text-sm font-medium">{label}</span>
        {obsah !== undefined && (
          <span className="text-xs text-muted">{mg(obsah)} ve 100 g</span>
        )}
      </span>
      <span className="flex items-center gap-2">
        <span aria-hidden="true" className="font-mono text-[11px] tracking-tight">
          {LEVEL_DOTS[level]}
        </span>
        <span className="text-sm text-muted">{LEVEL_LABELS[level]}</span>
      </span>
    </div>
  );
}

/**
 * Značky obsahu živin v náhledu, po klepnutí s podrobnostmi.
 *
 * V seznamu je vidět jen jméno živiny a stupnice teček — na víc na řádku
 * není místo. Vysvětlení, proč zrovna tahle položka a s čím ji kombinovat,
 * se otevře až na vyžádání, aby seznam zůstal čitelný. Živina, která tu
 * není významná, se nevypisuje vůbec; prázdná řádka nikomu nepomůže.
 */
export function NutrientBadge({
  profile,
  title,
  ironFrom = [],
  vitaminCFrom = [],
  slozeni,
  testId,
}: NutrientBadgeProps): ReactNode {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const base = testId ?? 'znacka-zeleza';
  const videt = CHIPS.filter((chip) => profile[chip.key] !== 'nevyznamny');
  if (videt.length === 0) return null;
  const popis = popisZivin(profile);

  // Okénko vypisuje jen to, co surovina nese; „není zdroj" patří na detail
  // suroviny, kde je na to místo. Ke každé vypsané živině se ale přidá
  // naměřený obsah, pokud ho máme — tečky samy neřeknou, o kolik jde.
  const zmereneZdroje: SourceRef[] = [];
  for (const chip of videt) {
    const zdroj = slozeni?.[chip.key as Zivina]?.zdroj;
    if (zdroj !== undefined && !zmereneZdroje.some((one) => one.url === zdroj.url)) {
      zmereneZdroje.push(zdroj);
    }
  }

  return (
    <>
      {videt.map(({ key, label, aria, Icon, suffix }) => {
        const level = profile[key];
        return (
          <button
            key={key}
            type="button"
            data-testid={`${base}${suffix}`}
            aria-haspopup="dialog"
            aria-expanded={open}
            aria-label={`${aria}: ${LEVEL_LABELS[level]}. Otevřít podrobnosti.`}
            onClick={(event) => {
              // Značka bývá uvnitř odkazu na detail — proklik nesmí přebít okénko.
              event.preventDefault();
              event.stopPropagation();
              setOpen(true);
            }}
            // Vizuálně drobný štítek, ale dotykový cíl musí mít 44 px (docs/SPEC.md
            // kap. 6) — proto je plocha na tlačítku a vzhled na vnitřním štítku.
            className="flex min-h-touch items-center"
          >
            <span
              className={`flex items-center gap-1 rounded-lg border px-2 py-0.5 text-[11px] font-medium ${LEVEL_CHIP[level]}`}
            >
              <Icon aria-hidden="true" className="h-3 w-3 shrink-0" />
              {label}
              <span aria-hidden="true" className="font-mono tracking-tight">
                {LEVEL_DOTS[level]}
              </span>
            </span>
          </button>
        );
      })}

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Živiny — ${title}`}
          data-testid="okenko-zivin"
          className="fixed inset-0 z-50 flex items-end justify-center bg-scrim/50 p-3 sm:items-center"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            setOpen(false);
          }}
        >
          <div
            className="flex max-h-[80vh] w-full max-w-md flex-col gap-3 overflow-y-auto rounded-2xl bg-surface p-4 shadow-lift"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
            }}
          >
            <div className="flex items-start justify-between gap-2">
              <h2 className="min-w-0 text-base font-bold">{title}</h2>
              <button
                type="button"
                data-testid="okenko-zavrit"
                aria-label="Zavřít"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setOpen(false);
                }}
                className="flex min-h-touch min-w-touch shrink-0 items-center justify-center rounded-lg text-muted"
              >
                <X aria-hidden="true" className="h-5 w-5" />
              </button>
            </div>

            {videt.map(({ key, aria }) => (
              <Row key={key} label={aria} level={profile[key]} obsah={slozeni?.[key]?.mg} />
            ))}

            {slozeni !== undefined && (
              <p className="text-xs leading-relaxed text-muted" data-testid="okenko-obsah">
                Obsah je naměřený, ne odhadnutý: hodnoty jsou z národní potravinové tabulky
                a platí pro 100 g jedlého podílu.
                {slozeni.poznamka !== undefined && ` ${slozeni.poznamka}`}
              </p>
            )}

            {popis !== null && <p className="text-sm leading-relaxed">{popis}</p>}

            {profile.vitaminC !== 'nevyznamny' && (
              <p className="text-sm leading-relaxed" data-testid="okenko-k-cemu-cecko">
                Vitamin C se tu nepočítá kvůli imunitě, ale kvůli železu: ve stejném jídle zvyšuje
                vstřebávání toho rostlinného. Proto se vyplatí dát luštěninu nebo obilninu dohromady
                s paprikou, brokolicí či ovocem.
              </p>
            )}

            {zmereneZdroje.length > 0 && (
              <SourceDisclosure
                sources={zmereneZdroje}
                label="Zdroje naměřených hodnot"
                testId="zdroje-obsahu"
              />
            )}

            <SourceDisclosure sources={NUTRIENT_SOURCES} label="Zdroje zařazení" testId="zdroje-zivin" />

            {ironFrom.length > 0 && (
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                  Železo nesou
                </p>
                <ul className="mt-1.5 flex flex-wrap gap-1.5" data-testid="okenko-zdroje-zeleza">
                  {ironFrom.map((item) => (
                    <li key={item.id}>
                      <Link
                        to={`/suroviny/${item.id}`}
                        className="flex min-h-touch items-center gap-1 rounded-full border border-line bg-paper px-3 text-sm"
                      >
                        <IngredientIcon ingredient={item} className="h-4 w-4" />
                        {item.nameCz}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {vitaminCFrom.length > 0 && (
              <div>
                <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted">
                  <Sparkles aria-hidden="true" className="h-3 w-3" />
                  Vstřebávání zlepšuje
                </p>
                <ul className="mt-1.5 flex flex-wrap gap-1.5" data-testid="okenko-zdroje-cecka">
                  {vitaminCFrom.map((item) => (
                    <li key={item.id}>
                      <Link
                        to={`/suroviny/${item.id}`}
                        className="flex min-h-touch items-center gap-1 rounded-full border border-accent/30 bg-accent-soft px-3 text-sm text-accent"
                      >
                        <IngredientIcon ingredient={item} className="h-4 w-4" />
                        {item.nameCz}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <p className="flex items-start gap-2 rounded-xl bg-paper px-3 py-2 text-xs leading-relaxed text-muted">
              <Info aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>
                Kde má aplikace naměřený obsah z potravinové tabulky, počítá stupnici z něj.
                Jinde stojí zařazení na skupině potravin, kterou jako zdroj jmenují NHS a odborná
                literatura — a to je hrubší odhad než miligramy.
              </span>
            </p>

            {profile.ironForm !== 'zadne' && (
              <p className="text-xs text-muted">{IRON_FORM_LABELS[profile.ironForm]}.</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
