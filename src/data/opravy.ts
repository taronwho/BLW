import { catalog } from '@/data';
import { safetyRules } from '@/safety/rules';
import { STAGES } from '@/types';
import type { Ingredient, Recipe } from '@/types';
import type { OpravaReceptu, OpravaSuroviny, Opravy, PouziteOpravy } from './opravyTvar';

/**
 * Použití oprav na katalog — těžká půlka.
 *
 * Tenhle soubor sahá na celý katalog i na bezpečnostní pravidla, takže se
 * načítá **dynamicky** a jen tehdy, když nějaká oprava opravdu přišla.
 * Úvodní obrazovka se kvůli opravám nesmí zdržet stahováním tří set
 * surovin — to je totéž pravidlo, kvůli kterému si ani ona sama katalog
 * netahá (viz `src/nakup/pocty.ts`).
 *
 * Tvar, typy a rozebrání staženého souboru bydlí v `opravyTvar.ts`, který
 * je lehký a smí se importovat odkudkoli.
 */

function jeText(hodnota: unknown): hodnota is string {
  return typeof hodnota === 'string' && hodnota.trim().length > 0;
}

function opravenaSurovina(puvodni: Ingredient, oprava: OpravaSuroviny): Ingredient {
  const prep = { ...puvodni.prep };
  for (const stage of STAGES) {
    const zmena = oprava.prep?.[stage];
    if (zmena === undefined) continue;
    prep[stage] = {
      ...prep[stage],
      ...(jeText(zmena.serving) ? { serving: zmena.serving } : {}),
      ...(jeText(zmena.caution) ? { caution: zmena.caution } : {}),
    };
  }
  return {
    ...puvodni,
    prep,
    ...(jeText(oprava.chokingReason) ? { chokingReason: oprava.chokingReason } : {}),
    ...(jeText(oprava.frequencyLimit) ? { frequencyLimit: oprava.frequencyLimit } : {}),
    ...(oprava.hazardNotes === undefined
      ? {}
      : { hazardNotes: { ...puvodni.hazardNotes, ...oprava.hazardNotes } }),
    ...(oprava.reviewStatus === undefined ? {} : { reviewStatus: oprava.reviewStatus }),
    ...(jeText(oprava.reviewNote) ? { reviewNote: oprava.reviewNote } : {}),
  };
}

function opravenyRecept(puvodni: Recipe, oprava: OpravaReceptu): Recipe {
  return {
    ...puvodni,
    ...(jeText(oprava.babySplitPoint) ? { babySplitPoint: oprava.babySplitPoint } : {}),
    ...(Array.isArray(oprava.babySteps) && oprava.babySteps.every(jeText)
      ? { babySteps: oprava.babySteps }
      : {}),
    ...(oprava.babyServing === undefined
      ? {}
      : { babyServing: { ...puvodni.babyServing, ...oprava.babyServing } }),
  };
}

/**
 * Projde opravenou položku pravidly z `src/safety/`.
 *
 * Vrací seznam porušených pravidel se severitou `error`. Varování se
 * propouštějí: ta jsou k zamyšlení, ne důvod opravu zahodit.
 */
export function porusenaPravidla(polozka: Ingredient | Recipe): string[] {
  const jeSurovina = 'nameCz' in polozka;
  const nalezy: string[] = [];
  for (const pravidlo of safetyRules) {
    if (pravidlo.severity !== 'error') continue;
    const platiNaTohle =
      pravidlo.appliesTo === 'both' ||
      (jeSurovina ? pravidlo.appliesTo === 'ingredient' : pravidlo.appliesTo === 'recipe');
    if (!platiNaTohle) continue;
    const zprava = pravidlo.check(polozka, catalog);
    if (zprava !== null) nalezy.push(`${pravidlo.id}: ${zprava}`);
  }
  return nalezy;
}

/**
 * Použije opravy na katalog.
 *
 * Co neprojde bezpečnostními pravidly nebo míří na neznámé idčko, se
 * zahodí a zapíše do `zahozeno`. Zbytek aplikace pak sahá jen do map,
 * které tahle funkce vrátí — katalog v balíku se nikdy nemění.
 */
export function pouzijOpravy(vstup: Opravy): PouziteOpravy {
  const suroviny = new Map<string, Ingredient>();
  const recepty = new Map<string, Recipe>();
  const duvody = new Map<string, string>();
  const zahozeno: string[] = [];

  const podleIdSurovin = new Map(catalog.ingredients.map((one) => [one.id, one]));
  const podleIdReceptu = new Map(catalog.recipes.map((one) => [one.id, one]));

  for (const oprava of vstup.opravy) {
    const puvodni =
      oprava.druh === 'surovina' ? podleIdSurovin.get(oprava.id) : podleIdReceptu.get(oprava.id);
    if (puvodni === undefined) {
      zahozeno.push(`${oprava.druh} „${oprava.id}" v katalogu není`);
      continue;
    }
    const opravena =
      oprava.druh === 'surovina'
        ? opravenaSurovina(puvodni as Ingredient, oprava)
        : opravenyRecept(puvodni as Recipe, oprava);

    const porusena = porusenaPravidla(opravena);
    if (porusena.length > 0) {
      zahozeno.push(`${oprava.druh} „${oprava.id}": ${porusena.join('; ')}`);
      continue;
    }

    if (oprava.druh === 'surovina') suroviny.set(oprava.id, opravena as Ingredient);
    else recepty.set(oprava.id, opravena as Recipe);
    duvody.set(oprava.id, oprava.duvod);
  }

  return { verze: vstup.verze, vydano: vstup.vydano, suroviny, recepty, duvody, zahozeno };
}
