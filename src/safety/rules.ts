import type { AllergenGroup, Catalog, Ingredient, Recipe, Stage } from '@/types';
import { STAGES } from '@/types';
import { DENIED_DOMAINS, TIER1_DOMAINS, TIER2_DOMAINS } from './domains';
import {
  containsPattern,
  findPatterns,
  hostMatches,
  normalize,
  sentences,
  similarity,
  trigrams,
} from './text';
import { coverageExceptionReason, isCoverageException } from './coverage-exceptions';
import { povinneHazardy } from './hazard-coverage';
import { najdiTypografii, najdiVykani } from './language';
import { isIngredient, isRecipe, type SafetyRule } from './types';
import {
  BANNED_GENERIC_PHRASES,
  GENDERED_ADDRESS_PATTERNS,
  HIDDEN_ANIMAL_PATTERNS,
  HONEY_PATTERNS,
  KNOWN_TYPO_PATTERNS,
  LENGTHWISE_QUARTER_MARKERS,
  NUT_SAFE_FORMS,
  GENDERED_SECOND_PERSON_REGEXPS,
  NEUTER_CHILD_REGEXPS,
  NUT_SEED_NOUNS,
  PLACEHOLDER_PATTERNS,
  PROTEIN_SWAP_SOURCES,
  QUARTER_MARKERS,
  ROUND_SHAPE_MARKERS,
  SALT_ADD_PATTERNS,
  SUGAR_PATTERNS,
} from './vocabulary';

/** Obecná slova pro maso a ryby — doplňují kmeny konkrétních názvů. */
const MEAT_WORDS: readonly string[] = [
  'maso',
  'masa',
  'masem',
  'masit*',
  'ryb*',
  'filet*',
  'vlakn*',
  'drubez*',
];

/**
 * Kmeny z názvu suroviny, na které se dá chytit i skloňovaný tvar.
 * „králík" → „kral", takže projde „králičí" i „králíka".
 */
function nameStems(nameCz: string): string[] {
  return normalize(nameCz)
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length >= 5)
    .map((word) => `${word.slice(0, word.length - 2)}*`);
}

/** Věk, do kterého platí absolutní zákazy z docs/BEZPECNOST.md kapitola 2. */
export const BABY_AGE_LIMIT_MONTHS = 12;

/** Texty dětské linie receptu — sem zákazy míří. */
function babyTexts(recipe: Recipe): string[] {
  return [recipe.babySplitPoint, ...recipe.babySteps, ...Object.values(recipe.babyServing)];
}

/** Texty suroviny, které jsou pokynem pro miminko (ne poznámka o riziku). */
function babyInstructionTexts(ingredient: Ingredient): string[] {
  if (ingredient.minAgeMonths >= BABY_AGE_LIMIT_MONTHS) return [];
  const texts: string[] = [];
  for (const stage of STAGES) {
    if (stage === '12m') continue;
    const prep = ingredient.prep[stage];
    texts.push(prep.serving);
    if (prep.caution) texts.push(prep.caution);
  }
  texts.push(...ingredient.prepIdeas);
  return texts;
}

function firstHit(texts: string[], patterns: readonly string[], honorNegation = true): string | null {
  for (const text of texts) {
    const hits = findPatterns(text, patterns, { honorNegation });
    const hit = hits[0];
    if (hit) return `„${hit.pattern}" v textu: „${text.slice(0, 120)}"`;
  }
  return null;
}

/**
 * Sní tenhle recept vegetarián?
 *
 * Ptá se na `vegetarian` u složek, ne jen na kategorii maso-ryby. Tvrdé sýry
 * se živočišným syřidlem (parmazán, pecorino, grana padano) maso nejsou, ale
 * vegetariánce u stolu je jedno, proč to nesmí — potřebuje variantu. Rodina
 * v docs/SPEC.md má vegetariánku, takže tohle není detail.
 */
function recipeSuitsVegetarians(recipe: Recipe, catalog: Catalog): boolean {
  return ingredientsOf(recipe, catalog).every((i) => i.vegetarian);
}

function ingredientsOf(recipe: Recipe, catalog: Catalog): Ingredient[] {
  const byId = new Map(catalog.ingredients.map((i) => [i.id, i]));
  return recipe.ingredients
    .map((ref) => byId.get(ref.ingredientId))
    .filter((i): i is Ingredient => i !== undefined);
}

/**
 * Suroviny, které se dostanou i do dětské porce.
 *
 * Bezmasá náhrada masa je v receptu kvůli dospělým vegetariánům a miminko
 * ji nedostane; recept se přesto tvářil jako vhodný až od jejího věku.
 * Proto se složky označené `adultOnly` do dětského výpočtu nepočítají.
 */
function babyIngredientsOf(recipe: Recipe, catalog: Catalog): Ingredient[] {
  const byId = new Map(catalog.ingredients.map((i) => [i.id, i]));
  return recipe.ingredients
    .filter((ref) => ref.adultOnly !== true)
    .map((ref) => byId.get(ref.ingredientId))
    .filter((i): i is Ingredient => i !== undefined);
}

/** Všechen text, který popisuje dětskou porci. */
function babyText(recipe: Recipe): string {
  return [recipe.babySplitPoint, ...recipe.babySteps, ...Object.values(recipe.babyServing)]
    .join(' ')
    .toLowerCase();
}

/* ------------------------------------------------------------------ */
/* Zákazy pro dětskou linii                                            */
/* ------------------------------------------------------------------ */

const noHoneyBaby: SafetyRule = {
  id: 'no-honey-baby',
  severity: 'error',
  appliesTo: 'both',
  description: 'Med se nesmí objevit v dětské linii ani u suroviny pod 12 měsíců.',
  check(item) {
    const texts = isRecipe(item) ? babyTexts(item) : babyInstructionTexts(item);
    const hit = firstHit(texts, HONEY_PATTERNS, false);
    return hit === null ? null : `Med v dětské linii: ${hit}`;
  },
};

const noSaltBaby: SafetyRule = {
  id: 'no-salt-baby',
  severity: 'error',
  appliesTo: 'both',
  description: 'Solení, bujón ani uzeniny nepatří do dětské linie; solit lze až v linii dospělých.',
  check(item) {
    const texts = isRecipe(item) ? babyTexts(item) : babyInstructionTexts(item);
    const hit = firstHit(texts, SALT_ADD_PATTERNS);
    return hit === null ? null : `Sůl v dětské linii: ${hit}`;
  },
};

const noSugarBaby: SafetyRule = {
  id: 'no-sugar-baby',
  severity: 'error',
  appliesTo: 'both',
  description: 'Přidaný cukr, sirup ani ovocná šťáva nepatří do dětské linie.',
  check(item) {
    const texts = isRecipe(item) ? babyTexts(item) : babyInstructionTexts(item);
    const hit = firstHit(texts, SUGAR_PATTERNS);
    return hit === null ? null : `Přidaný cukr v dětské linii: ${hit}`;
  },
};

const noWholeNuts: SafetyRule = {
  id: 'no-whole-nuts',
  severity: 'error',
  appliesTo: 'both',
  description: 'Ořechy a semínka smí být v dětské linii jen mleté, jako máslo nebo pasta.',
  check(item) {
    const texts = isRecipe(item) ? babyTexts(item) : babyInstructionTexts(item);
    for (const text of texts) {
      for (const sentence of sentences(text)) {
        if (!containsPattern(sentence, NUT_SEED_NOUNS)) continue;
        if (containsPattern(sentence, NUT_SAFE_FORMS)) continue;
        return `Ořechy nebo semínka bez tvaru „mleté/máslo/pasta": „${sentence.slice(0, 120)}"`;
      }
    }
    return null;
  },
};

const roundFoodShape: SafetyRule = {
  id: 'round-food-shape',
  severity: 'error',
  appliesTo: 'ingredient',
  description:
    'Kulatá surovina s vysokým rizikem dušení musí mít ve fázi 6m i 9m pokyn k podélnému rozčtvrcení.',
  check(item) {
    if (!isIngredient(item)) return null;
    if (item.chokingRisk !== 'high') return null;
    const looksRound =
      containsPattern(item.nameCz, ROUND_SHAPE_MARKERS) ||
      item.altNamesCz.some((n) => containsPattern(n, ROUND_SHAPE_MARKERS)) ||
      (item.chokingReason !== undefined && containsPattern(item.chokingReason, ['kulat*', 'bobul*']));
    if (!looksRound) return null;

    const missing: Stage[] = [];
    for (const stage of ['6m', '9m'] as const) {
      const serving = item.prep[stage].serving;
      const lengthwise = containsPattern(serving, LENGTHWISE_QUARTER_MARKERS);
      const quartered = containsPattern(serving, QUARTER_MARKERS);
      if (!(lengthwise && quartered)) missing.push(stage);
    }
    return missing.length === 0
      ? null
      : `Chybí explicitní pokyn k podélnému rozčtvrcení ve fázi: ${missing.join(', ')}`;
  },
};

/* ------------------------------------------------------------------ */
/* Struktura receptu                                                   */
/* ------------------------------------------------------------------ */

const babySplitRequired: SafetyRule = {
  id: 'baby-split-required',
  severity: 'error',
  appliesTo: 'recipe',
  description: 'babySplitPoint je neprázdný a odkazuje na konkrétní krok z baseSteps.',
  check(item) {
    if (!isRecipe(item)) return null;
    const point = item.babySplitPoint.trim();
    if (point.length === 0) return 'babySplitPoint je prázdný.';
    const matches = [...normalize(point).matchAll(/krok[a-z]*\s*(?:c\.?\s*)?(\d+)/g)];
    if (matches.length === 0) {
      return 'babySplitPoint neodkazuje na číslo kroku (očekává se např. „po kroku 3").';
    }
    for (const match of matches) {
      const stepNumber = Number(match[1]);
      if (!Number.isInteger(stepNumber) || stepNumber < 1 || stepNumber > item.baseSteps.length) {
        return `babySplitPoint odkazuje na krok ${match[1]}, ale baseSteps má ${item.baseSteps.length} kroků.`;
      }
    }
    return null;
  },
};

const vegTrackComplete: SafetyRule = {
  id: 'veg-track-complete',
  severity: 'error',
  appliesTo: 'recipe',
  description:
    'Recept se složkou, kterou vegetarián nejí, má popsanou bezmasou variantu i konkrétní náhradu bílkoviny.',
  check(item, catalog) {
    if (!isRecipe(item)) return null;
    if (recipeSuitsVegetarians(item, catalog)) return null;

    const veg = item.vegetarianSteps ?? [];
    if (veg.length === 0 || veg.every((s) => s.trim() === '')) {
      return 'Recept obsahuje složku, kterou vegetarián nejí, ale bezmasá varianta dochucení chybí.';
    }

    const swap = item.vegetarianProteinSwap?.trim() ?? '';
    if (swap.length === 0) {
      return 'Recept obsahuje složku, kterou vegetarián nejí, ale vegetarianProteinSwap je prázdný.';
    }
    if (!containsPattern(swap, PROTEIN_SWAP_SOURCES)) {
      return `vegetarianProteinSwap neuvádí konkrétní zdroj bílkoviny (jen „${swap.slice(0, 80)}").`;
    }
    return null;
  },
};

/**
 * Dělit dochucení na masité a bezmasé dává smysl jen tam, kde v jídle maso
 * opravdu je. U kaše nebo ovocné misky z toho vznikla „masitá verze", která
 * jen jinými slovy opakovala tu bezmasou — a u sladkého jídla navíc působila
 * nesmyslně.
 */
const meatTrackOnlyWithMeat: SafetyRule = {
  id: 'meat-track-only-with-meat',
  severity: 'error',
  appliesTo: 'recipe',
  description: 'Bezmasý recept nemá dělit dochucení pro dospělé na masité a bezmasé.',
  check(item, catalog) {
    if (!isRecipe(item)) return null;
    if (item.adultSteps.length === 0 || item.adultSteps.every((s) => s.trim() === '')) {
      return 'adultSteps jsou prázdné: dochucení pro dospělé musí být vždy popsané.';
    }
    if (!recipeSuitsVegetarians(item, catalog)) return null;

    if ((item.vegetarianSteps ?? []).length > 0) {
      return 'Recept je celý bezmasý, ale má vlastní bezmasou variantu: dochucení pro dospělé má být jen jedno.';
    }
    if (item.vegetarianProteinSwap !== undefined) {
      return 'Recept je celý bezmasý, takže nemá co nahrazovat: vegetarianProteinSwap je navíc.';
    }
    return null;
  },
};

const hiddenAnimalIngredients: SafetyRule = {
  id: 'hidden-animal-ingredients',
  severity: 'error',
  appliesTo: 'recipe',
  description: 'V bezmasé variantě nesmí být želatina, sádlo, masový vývar, parmazán a spol.',
  check(item, catalog) {
    if (!isRecipe(item)) return null;
    const hit = firstHit(item.vegetarianSteps ?? [], HIDDEN_ANIMAL_PATTERNS);
    if (hit !== null) return `Živočišná složka v bezmasé variantě: ${hit}`;

    const byId = new Map(catalog.ingredients.map((i) => [i.id, i]));
    for (const ref of item.ingredients) {
      if (ref.track === 'meat') continue;
      const ingredient = byId.get(ref.ingredientId);
      if (ingredient === undefined) continue;
      if (!ingredient.vegetarian) {
        return `Složka „${ingredient.nameCz}" není vegetariánská, ale je vedená v linii „${ref.track}".`;
      }
    }
    return null;
  },
};

/* ------------------------------------------------------------------ */
/* Zdroje                                                              */
/* ------------------------------------------------------------------ */

const sourceRequired: SafetyRule = {
  id: 'source-required',
  severity: 'error',
  appliesTo: 'ingredient',
  description: 'Každá surovina má alespoň jeden zdroj tier 1, nebo dva zdroje tier 2.',
  check(item) {
    if (!isIngredient(item)) return null;
    const tier1 = item.sources.filter((s) => s.tier === 1).length;
    const tier2 = item.sources.filter((s) => s.tier === 2).length;
    if (tier1 >= 1 || tier2 >= 2) return null;
    return `Nedostatečné zdroje: tier 1 = ${tier1}, tier 2 = ${tier2}.`;
  },
};

const sourceUrlShape: SafetyRule = {
  id: 'source-url-shape',
  severity: 'error',
  appliesTo: 'both',
  description: 'URL zdroje je absolutní https na povolené doméně a tier odpovídá doméně.',
  check(item) {
    const sources = item.sources;
    for (const source of sources) {
      let url: URL;
      try {
        url = new URL(source.url);
      } catch {
        return `Nevalidní URL: „${source.url}".`;
      }
      if (url.protocol !== 'https:') return `URL není https: „${source.url}".`;
      const host = url.hostname;
      if (DENIED_DOMAINS.some((d) => hostMatches(host, d))) {
        return `Doména „${host}" je v docs/BEZPECNOST.md výslovně odmítnutá.`;
      }
      const isTier1 = TIER1_DOMAINS.some((d) => hostMatches(host, d));
      const isTier2 = TIER2_DOMAINS.some((d) => hostMatches(host, d));
      if (!isTier1 && !isTier2) return `Doména „${host}" není v povoleném seznamu zdrojů.`;
      if (source.tier === 1 && !isTier1) return `Doména „${host}" nemůže být tier 1.`;
      if (source.tier === 2 && isTier1 === false && isTier2 === false) {
        return `Doména „${host}" nemůže být tier 2.`;
      }
      if (!/^\d{4}-\d{2}-\d{2}$/.test(source.accessedAt)) {
        return `accessedAt u „${source.url}" není ISO datum (YYYY-MM-DD).`;
      }
    }
    return null;
  },
};

/* ------------------------------------------------------------------ */
/* Úplnost dat                                                         */
/* ------------------------------------------------------------------ */

function collectStrings(item: Ingredient | Recipe): Array<{ field: string; value: string }> {
  const out: Array<{ field: string; value: string }> = [];
  const push = (field: string, value: string | undefined): void => {
    if (value !== undefined) out.push({ field, value });
  };
  if (isIngredient(item)) {
    push('nameCz', item.nameCz);
    push('chokingReason', item.chokingReason);
    push('frequencyLimit', item.frequencyLimit);
    push('reviewNote', item.reviewNote);
    item.altNamesCz.forEach((v, i) => push(`altNamesCz[${i}]`, v));
    item.prepIdeas.forEach((v, i) => push(`prepIdeas[${i}]`, v));
    for (const stage of STAGES) {
      push(`prep.${stage}.serving`, item.prep[stage].serving);
      push(`prep.${stage}.caution`, item.prep[stage].caution);
    }
    for (const [key, value] of Object.entries(item.hazardNotes)) push(`hazardNotes.${key}`, value);
  } else {
    push('titleCz', item.titleCz);
    push('servings', item.servings);
    push('babySplitPoint', item.babySplitPoint);
    push('vegetarianProteinSwap', item.vegetarianProteinSwap);
    item.baseSteps.forEach((v, i) => push(`baseSteps[${i}]`, v));
    item.babySteps.forEach((v, i) => push(`babySteps[${i}]`, v));
    item.adultSteps.forEach((v, i) => push(`adultSteps[${i}]`, v));
    (item.vegetarianSteps ?? []).forEach((v, i) => push(`vegetarianSteps[${i}]`, v));
    item.ingredients.forEach((ref, i) => {
      push(`ingredients[${i}].amount`, ref.amount);
      push(`ingredients[${i}].note`, ref.note);
    });
    for (const stage of STAGES) push(`babyServing.${stage}`, item.babyServing[stage]);
  }
  for (const source of item.sources) {
    push('sources.org', source.org);
    push('sources.title', source.title);
  }
  return out;
}

/**
 * Texty v aplikaci čtou rodiče, ne vývojáři.
 *
 * Odkaz na soubor v repozitáři („vede to docs/BEZPECNOST.md") jim nic
 * neřekne a působí jako nedodělek. Riziko se má popsat vlastními slovy,
 * doklad patří do pole `sources`, které aplikace ukazuje jako odkaz.
 */
const NO_INTERNAL_REFS = /\.md\b|\bdocs\/|\bsrc\/|\btests?\/|\bnpm run\b|CLAUDE\.md|package\.json/i;

const noInternalReferences: SafetyRule = {
  id: 'no-internal-references',
  severity: 'error',
  appliesTo: 'both',
  description: 'Text pro rodiče neodkazuje na soubory v repozitáři ani na příkazy projektu.',
  check(item) {
    for (const { field, value } of collectStrings(item)) {
      const hit = NO_INTERNAL_REFS.exec(value);
      if (hit !== null) {
        return `Odkaz na interní soubor v poli ${field}: „${hit[0]}" v textu „${value.slice(0, 80)}".`;
      }
    }
    return null;
  },
};

/**
 * Osamocený modifikátor nebo kombinující znaménko v textu.
 *
 * „osladˇ" místo „oslaď" projde očima i kontrolou `\p{L}`, protože samostatná
 * háčková čárka U+02C7 je v Unicode písmeno (kategorie Lm). V českých datech
 * se píšou složená písmena, takže každý modifikátor i kombinující znaménko je
 * chyba přepisu. Stejně tak neviditelné znaky: měkký spojovník U+00AD nebo
 * nezlomitelná mezera nulové šířky se do textu dostanou kopírováním a rodič
 * je nevidí, ale hledání i dělení slov se po nich chová divně. Do stejné
 * skupiny patří i cyrilice zaměněná za latinku.
 */
const STRAY_MARK = /[\p{Lm}\p{M}\p{Cf}\p{Cc}]/u;
const CYRILLIC = /\p{Script=Cyrillic}/u;

const noStrayMarks: SafetyRule = {
  id: 'no-stray-marks',
  severity: 'error',
  appliesTo: 'both',
  description: 'Text neobsahuje osamocený modifikátor, kombinující znaménko ani cyrilici.',
  check(item) {
    for (const { field, value } of collectStrings(item)) {
      const mark = STRAY_MARK.exec(value);
      if (mark !== null) {
        const kod = mark[0].codePointAt(0) ?? 0;
        return `Osamocené znaménko U+${kod.toString(16).toUpperCase().padStart(4, '0')} v poli ${field}: „${value.slice(0, 80)}".`;
      }
      const azbuka = CYRILLIC.exec(value);
      if (azbuka !== null) {
        return `Cyrilské písmeno „${azbuka[0]}" v poli ${field}: „${value.slice(0, 80)}".`;
      }
    }
    return null;
  },
};

const noPlaceholder: SafetyRule = {
  id: 'no-placeholder',
  severity: 'error',
  appliesTo: 'both',
  description: 'V datech nezůstávají zástupné texty ani prázdné povinné řetězce.',
  check(item) {
    for (const { field, value } of collectStrings(item)) {
      if (value.trim().length === 0) return `Prázdný řetězec v poli ${field}.`;
      if (containsPattern(value, PLACEHOLDER_PATTERNS, { honorNegation: false })) {
        return `Zástupný text v poli ${field}: „${value.slice(0, 80)}".`;
      }
      if (/(^|\s)\.\.\.(\s|$)/.test(value)) return `Nedopsaný text (…) v poli ${field}.`;
    }
    return null;
  },
};

const ingredientRefsResolve: SafetyRule = {
  id: 'ingredient-refs-resolve',
  severity: 'error',
  appliesTo: 'recipe',
  description: 'Každé ingredientId v receptu existuje v katalogu surovin.',
  check(item, catalog) {
    if (!isRecipe(item)) return null;
    const known = new Set(catalog.ingredients.map((i) => i.id));
    const missing = item.ingredients
      .map((ref) => ref.ingredientId)
      .filter((id) => !known.has(id));
    return missing.length === 0 ? null : `Neznámé suroviny: ${[...new Set(missing)].join(', ')}.`;
  },
};

const stagePrepComplete: SafetyRule = {
  id: 'stage-prep-complete',
  severity: 'error',
  appliesTo: 'ingredient',
  description: 'Všechny tři fáze mají serving ≥ 80 znaků a nejsou navzájem shodné.',
  check(item) {
    if (!isIngredient(item)) return null;
    for (const stage of STAGES) {
      const serving = item.prep[stage]?.serving ?? '';
      if (serving.trim().length < 80) {
        return `Fáze ${stage} má serving jen ${serving.trim().length} znaků (minimum 80).`;
      }
    }
    const normalized = STAGES.map((stage) => normalize(item.prep[stage].serving));
    for (let a = 0; a < normalized.length; a += 1) {
      for (let b = a + 1; b < normalized.length; b += 1) {
        if (normalized[a] === normalized[b]) {
          return `Fáze ${STAGES[a]} a ${STAGES[b]} mají shodný text serving.`;
        }
      }
    }
    return null;
  },
};

const allergenConsistency: SafetyRule = {
  id: 'allergen-consistency',
  severity: 'error',
  appliesTo: 'recipe',
  description: 'Alergeny receptu odpovídají sjednocení alergenů jeho složek.',
  check(item, catalog) {
    if (!isRecipe(item)) return null;
    const expected = new Set<AllergenGroup>();
    for (const ingredient of ingredientsOf(item, catalog)) {
      for (const allergen of ingredient.allergens) expected.add(allergen);
    }
    const actual = new Set(item.allergens);
    const missing = [...expected].filter((a) => !actual.has(a));
    const extra = [...actual].filter((a) => !expected.has(a));
    if (missing.length === 0 && extra.length === 0) return null;
    const parts: string[] = [];
    if (missing.length > 0) parts.push(`chybí ${missing.join(', ')}`);
    if (extra.length > 0) parts.push(`navíc ${extra.join(', ')}`);
    return `Alergeny receptu nesedí se složkami: ${parts.join('; ')}.`;
  },
};

const minAgeConsistency: SafetyRule = {
  id: 'min-age-consistency',
  severity: 'error',
  appliesTo: 'recipe',
  description: 'minAgeMonths receptu je ≥ maximum ze složek, které jí i miminko.',
  check(item, catalog) {
    if (!isRecipe(item)) return null;
    const used = babyIngredientsOf(item, catalog);
    if (used.length === 0) return null;
    const max = Math.max(...used.map((i) => i.minAgeMonths));
    if (item.minAgeMonths >= max) return null;
    const blocking = used.filter((i) => i.minAgeMonths === max).map((i) => i.nameCz);
    return `minAgeMonths receptu je ${item.minAgeMonths}, ale složka vyžaduje ${max} (${blocking.join(', ')}).`;
  },
};

/**
 * Věk receptu nesmí být vyšší, než co dětská porce opravdu potřebuje.
 *
 * Bez tohohle pravidla by šlo věk kdykoli zvednout „pro jistotu" a rodiči by
 * se recept schoval před fází, do které patří. Kdo ho chce mít vyšší, musí
 * říct proč — a to se dělá u konkrétní suroviny, ne u celého receptu.
 */
const minAgeNotInflated: SafetyRule = {
  id: 'min-age-not-inflated',
  severity: 'error',
  appliesTo: 'recipe',
  description: 'Vyšší věk, než vyžadují složky dětské porce, musí mít napsaný důvod.',
  check(item, catalog) {
    if (!isRecipe(item)) return null;
    const used = babyIngredientsOf(item, catalog);
    if (used.length === 0) return null;
    const max = Math.max(...used.map((i) => i.minAgeMonths));
    if (item.minAgeMonths <= max) {
      return item.minAgeReason === undefined
        ? null
        : `minAgeReason je vyplněný, ale věk receptu (${item.minAgeMonths}) nepřevyšuje složky (${max}): důvod nemá co vysvětlovat.`;
    }
    if ((item.minAgeReason ?? '').trim().length >= 20) return null;
    return `minAgeMonths receptu je ${item.minAgeMonths}, ale dětská porce vystačí s ${max}. Buď věk sniž, nebo do minAgeReason napiš, co konkrétně brání mladší fázi.`;
  },
};

/**
 * Složka označená jako „jen pro dospělé" nesmí být ve společném základu.
 *
 * Základ je definičně to, co se vaří pro celou rodinu a z čeho se odebírá
 * dětská porce. Kdyby z něj šlo vyjmout jednu surovinu, přestal by věk
 * receptu cokoli znamenat.
 */
const adultOnlyNotInBase: SafetyRule = {
  id: 'adult-only-not-in-base',
  severity: 'error',
  appliesTo: 'recipe',
  description: 'adultOnly nestojí u složky ze společného základu.',
  check(item) {
    if (!isRecipe(item)) return null;
    const spatne = item.ingredients.filter((ref) => ref.adultOnly === true && ref.track === 'all');
    if (spatne.length === 0) return null;
    return `Složka ve společném základu nemůže být jen pro dospělé: ${spatne
      .map((ref) => ref.ingredientId)
      .join(', ')}.`;
  },
};

/**
 * Co dětské kroky jmenují, to miminko dostane — a nesmí být „jen pro dospělé".
 *
 * Tohle je pojistka proti tomu, aby se příznakem srazil věk receptu
 * u suroviny, kterou dítě podle vlastního postupu opravdu jí.
 */
const adultOnlyNotInBabySteps: SafetyRule = {
  id: 'adult-only-not-in-baby-steps',
  severity: 'error',
  appliesTo: 'recipe',
  description: 'Složka označená adultOnly se nesmí objevit v dětských krocích.',
  check(item, catalog) {
    if (!isRecipe(item)) return null;
    const byId = new Map(catalog.ingredients.map((i) => [i.id, i]));
    const text = babyText(item);
    const spatne: string[] = [];
    for (const ref of item.ingredients) {
      if (ref.adultOnly !== true) continue;
      const ing = byId.get(ref.ingredientId);
      if (ing === undefined) continue;
      // Porovnává se první slovo názvu — „tofu uzené" i „tofu natural"
      // se v textu píšou různě, ale rod suroviny je vždycky v prvním slově.
      const slovo = ing.nameCz.toLowerCase().split(' ')[0] ?? '';
      if (slovo.length > 3 && text.includes(slovo)) spatne.push(ing.nameCz);
    }
    if (spatne.length === 0) return null;
    return `Dětské kroky jmenují složku označenou jen pro dospělé: ${spatne.join(', ')}.`;
  },
};

/* ------------------------------------------------------------------ */
/* Varování                                                            */
/* ------------------------------------------------------------------ */

const mercuryLimit: SafetyRule = {
  id: 'mercury-limit',
  severity: 'warning',
  appliesTo: 'ingredient',
  description: 'Ryby s hazardem „rtut" mají vyplněný frequencyLimit.',
  check(item) {
    if (!isIngredient(item)) return null;
    if (!item.hazards.includes('rtut')) return null;
    return (item.frequencyLimit?.trim().length ?? 0) > 0
      ? null
      : 'Surovina s rizikem rtuti nemá vyplněný frequencyLimit.';
  },
};

const nitrateNote: SafetyRule = {
  id: 'nitrate-note',
  severity: 'warning',
  appliesTo: 'ingredient',
  description: 'Suroviny s dusičnany mají pokyn neohřívat opakovaně.',
  check(item) {
    if (!isIngredient(item)) return null;
    if (!item.hazards.includes('dusicnany')) return null;
    const note = item.hazardNotes['dusicnany'] ?? '';
    const texts = [note, ...STAGES.map((s) => item.prep[s].serving), ...(item.prepIdeas ?? [])];
    const mentionsReheat = texts.some((t) =>
      containsPattern(
        t,
        // Přirozená česká formulace je záporná („znovu neohřívej"), proto
        // hledáme oba tvary — kladný i se zápornou předponou.
        ['ohriv*', 'ohrat', 'ohreje*', 'neohriv*', 'neohrat', 'neohreje*', 'opakovane ohr*'],
        { honorNegation: false },
      ),
    );
    return mentionsReheat ? null : 'Chybí pokyn k opakovanému ohřevu u suroviny s dusičnany.';
  },
};

const hazardCoverage: SafetyRule = {
  id: 'hazard-coverage',
  severity: 'error',
  appliesTo: 'ingredient',
  description:
    'Surovina zakázaná do 12 měsíců podle docs/BEZPECNOST.md kap. 2 nese odpovídající hazard.',
  check(item) {
    if (!isIngredient(item)) return null;
    const povinne = povinneHazardy(item.id);
    const chybi = povinne.filter((hazard) => !item.hazards.includes(hazard));
    if (chybi.length === 0) return null;
    // Bez hazardu se u položky neukáže štítek rizika, nejde podle něj
    // filtrovat a pravidla počítající nad `hazards` na ni nedosáhnou —
    // i když text v próze riziko popisuje správně.
    return `Chybí povinný hazard: ${chybi.join(', ')}. Vyplývá z tabulky zákazů v docs/BEZPECNOST.md kap. 2.`;
  },
};

const hazardNotesComplete: SafetyRule = {
  id: 'hazard-notes-complete',
  severity: 'error',
  appliesTo: 'ingredient',
  description: 'Ke každému hazardu je vysvětlení a žádné vysvětlení nevisí bez hazardu.',
  check(item) {
    if (!isIngredient(item)) return null;
    const klice = Object.keys(item.hazardNotes);

    const bezPoznamky = item.hazards.filter(
      (hazard) => (item.hazardNotes[hazard] ?? '').trim().length === 0,
    );
    if (bezPoznamky.length > 0) {
      return `Hazard bez vysvětlení: ${bezPoznamky.join(', ')}. Samotný štítek rodiči neřekne, co s tím.`;
    }

    // Opačný směr: poznámka k hazardu, který položka nemá, se v UI nikdy
    // nezobrazí — je to tichý mrtvý text, přesně jako byla mrtvá výjimka
    // `voda` v coverage-exceptions.ts.
    const osirele = klice.filter((klic) => !item.hazards.includes(klic as (typeof item.hazards)[number]));
    if (osirele.length > 0) {
      return `Vysvětlení bez odpovídajícího hazardu: ${osirele.join(', ')}. Nikde se nezobrazí.`;
    }

    return null;
  },
};

/**
 * Dvě položky se stejným idčkem jsou jedna položka.
 *
 * Katalog hlásil 494 receptů, ale dva páry sdílely idčko, takže dva z nich
 * byly z adresy `/recepty/:id` nedosažitelné a v seznamu se překreslovaly
 * pod stejným klíčem. `duplicate-detection` je nechytilo: to porovnává
 * nadpisy, a „Jáhlová kaše … s hruškou" a „… s jablkem" se liší.
 *
 * Tohle je chyba, ne varování — nedosažitelný recept není kosmetika.
 *
 * Počty se pro katalog spočítají jednou a schovají do `WeakMap`; bez toho
 * by se pro každou z 795 položek procházel celý katalog znovu.
 */
const pocetIdVKatalogu = new WeakMap<Catalog, Map<string, number>>();

function pocetVyskytuId(catalog: Catalog, id: string, kind: 'ingredient' | 'recipe'): number {
  let mapa = pocetIdVKatalogu.get(catalog);
  if (mapa === undefined) {
    mapa = new Map<string, number>();
    for (const i of catalog.ingredients) {
      const klic = `ingredient:${i.id}`;
      mapa.set(klic, (mapa.get(klic) ?? 0) + 1);
    }
    for (const r of catalog.recipes) {
      const klic = `recipe:${r.id}`;
      mapa.set(klic, (mapa.get(klic) ?? 0) + 1);
    }
    pocetIdVKatalogu.set(catalog, mapa);
  }
  return mapa.get(`${kind}:${id}`) ?? 0;
}

const uniqueIds: SafetyRule = {
  id: 'unique-ids',
  severity: 'error',
  appliesTo: 'both',
  description: 'Žádné dvě suroviny ani dva recepty nesdílejí idčko.',
  check(item, catalog) {
    const kind = isIngredient(item) ? 'ingredient' : 'recipe';
    const pocet = pocetVyskytuId(catalog, item.id, kind);
    if (pocet <= 1) return null;
    return `Idčko „${item.id}" má ${pocet} položky. Jedna z nich je z adresy nedosažitelná.`;
  },
};

const duplicateDetection: SafetyRule = {
  id: 'duplicate-detection',
  severity: 'warning',
  appliesTo: 'both',
  description:
    'Žádné dvě suroviny nemají shodný nameCz ani překrývající se altNamesCz a žádné dva recepty nemají shodný titleCz.',
  check(item, catalog) {
    if (!isIngredient(item)) {
      // Dva recepty se stejným nadpisem rodič v seznamu nerozliší; přesně to
      // se stalo dvěma rajčatovým polévkám s cizrnou a bazalkou.
      const dvojnik = catalog.recipes.find(
        (other) => other.id !== item.id && normalize(other.titleCz) === normalize(item.titleCz),
      );
      return dvojnik === undefined ? null : `Shodný titleCz s receptem „${dvojnik.id}".`;
    }
    const selfNames = new Set([item.nameCz, ...item.altNamesCz].map(normalize));
    for (const other of catalog.ingredients) {
      if (other.id === item.id) continue;
      if (normalize(other.nameCz) === normalize(item.nameCz)) {
        return `Shodný nameCz se surovinou „${other.id}".`;
      }
      const overlap = [other.nameCz, ...other.altNamesCz]
        .map(normalize)
        .filter((name) => selfNames.has(name));
      if (overlap.length > 0) {
        return `Překryv názvů se surovinou „${other.id}": ${overlap.join(', ')}.`;
      }
    }
    return null;
  },
};

const SIMILARITY_THRESHOLD = 0.85;

const textUniqueness: SafetyRule = {
  id: 'text-uniqueness',
  severity: 'warning',
  appliesTo: 'ingredient',
  description: 'Žádné dva popisy serving se neshodují na více než 85 % (odhalí šablonu).',
  check(item, catalog) {
    if (!isIngredient(item)) return null;
    for (const stage of STAGES) {
      const mine = trigrams(item.prep[stage].serving);
      for (const other of catalog.ingredients) {
        if (other.id === item.id) continue;
        for (const otherStage of STAGES) {
          const score = similarity(mine, trigrams(other.prep[otherStage].serving));
          if (score > SIMILARITY_THRESHOLD) {
            return `serving ${stage} je z ${(score * 100).toFixed(0)} % shodný s „${other.id}" (${otherStage}).`;
          }
        }
      }
    }
    return null;
  },
};

const SERVING_MIN = 80;
const SERVING_MAX = 400;

const lengthSanity: SafetyRule = {
  id: 'length-sanity',
  severity: 'warning',
  appliesTo: 'ingredient',
  description: 'serving má 80–400 znaků a chokingReason není obecná fráze.',
  check(item) {
    if (!isIngredient(item)) return null;
    for (const stage of STAGES) {
      const length = item.prep[stage].serving.trim().length;
      if (length < SERVING_MIN || length > SERVING_MAX) {
        return `serving fáze ${stage} má ${length} znaků, povoleno je ${SERVING_MIN}–${SERVING_MAX}.`;
      }
    }
    const reason = item.chokingReason?.trim() ?? '';
    if (item.chokingRisk !== 'low' && reason.length === 0) {
      return 'chokingReason chybí u suroviny s rizikem dušení medium/high.';
    }
    if (reason.length > 0 && containsPattern(reason, BANNED_GENERIC_PHRASES, { honorNegation: false })) {
      return `chokingReason je obecná fráze: „${reason.slice(0, 80)}".`;
    }
    return null;
  },
};

const ingredientCoverage: SafetyRule = {
  id: 'ingredient-coverage',
  severity: 'error',
  appliesTo: 'ingredient',
  description:
    'Každá surovina je složkou aspoň jednoho receptu, pokud není v src/safety/coverage-exceptions.ts.',
  check(item, catalog) {
    if (!isIngredient(item)) return null;
    if (isCoverageException(item.id)) {
      const reason = coverageExceptionReason(item.id)?.trim() ?? '';
      return reason.length > 0
        ? null
        : `Surovina „${item.id}" je ve výjimkách bez uvedeného důvodu.`;
    }
    const used = catalog.recipes.some((recipe) =>
      recipe.ingredients.some((ref) => ref.ingredientId === item.id),
    );
    return used ? null : `Surovina „${item.nameCz}" není složkou žádného receptu.`;
  },
};

const neutralAddress: SafetyRule = {
  id: 'neutral-address',
  severity: 'error',
  appliesTo: 'both',
  description:
    'Texty neoslovují rodiče jako ženu a u slova „dítě" drží střední rod.',
  check(item) {
    for (const { field, value } of collectStrings(item)) {
      const nalez = findPatterns(value, GENDERED_ADDRESS_PATTERNS, { honorNegation: false })[0];
      if (nalez !== undefined) {
        return `Oslovení v ženském rodě v poli ${field}: „${nalez.pattern}". O dítě se stará kdokoli z rodiny.`;
      }
      const bezDiakritiky = normalize(value);
      for (const re of GENDERED_SECOND_PERSON_REGEXPS) {
        const shoda = re.exec(bezDiakritiky);
        if (shoda !== null) {
          return `Ženský rod v oslovení rodiče, pole ${field}: „${shoda[0]}". O dítě se stará kdokoli z rodiny.`;
        }
      }
      for (const re of NEUTER_CHILD_REGEXPS) {
        const shoda = re.exec(bezDiakritiky);
        if (shoda !== null) {
          return `Špatná shoda po slově „dítě" v poli ${field}: „${shoda[0]}". Dítě je střední rod.`;
        }
      }
    }
    return null;
  },
};

/**
 * Když dětská linie maso připravuje, musí i říct, jak ho podat.
 *
 * Recept, kde `babySteps` maso dusí a obírá od kostí, ale `babyServing` o něm
 * v dané fázi mlčí, nechá rodiče u sporáku s hotovým masem a bez pokynu, jak
 * velký kus dítěti dát — a přitom právě tvar masa je u dušení to podstatné.
 */
const babyServingMentionsMeat: SafetyRule = {
  id: 'baby-serving-mentions-meat',
  severity: 'error',
  appliesTo: 'recipe',
  description:
    'Když dětská linie připravuje maso nebo rybu, každá fáze podávání říká, jak ji podat.',
  check(item, catalog) {
    if (!isRecipe(item)) return null;

    const masa = item.ingredients
      .map((ref) => catalog.ingredients.find((one) => one.id === ref.ingredientId))
      .filter((one): one is Ingredient => one !== undefined && one.category === 'maso-ryby');
    if (masa.length === 0) return null;

    const kmeny = [...new Set([...masa.flatMap((one) => nameStems(one.nameCz)), ...MEAT_WORDS])];
    const zminka = (text: string): boolean => containsPattern(text, kmeny, { honorNegation: false });

    // Bez zmínky v dětských krocích se maso do dětské porce nedostává vůbec.
    if (!item.babySteps.some(zminka)) return null;

    const chybi = STAGES.filter((stage) => !zminka(item.babyServing[stage]));
    if (chybi.length === 0) return null;
    return `Dětská linie připravuje maso nebo rybu, ale podání ve fázi ${chybi.join(', ')} o něm mlčí.`;
  },
};

const knownTypos: SafetyRule = {
  id: 'known-typos',
  severity: 'error',
  appliesTo: 'both',
  description: 'Texty neobsahují tvary, které už jednou prošly korekturou jako chybné.',
  check(item) {
    for (const { field, value } of collectStrings(item)) {
      const nalez = findPatterns(value, KNOWN_TYPO_PATTERNS, { honorNegation: false })[0];
      if (nalez !== undefined) {
        return `Chybný tvar „${nalez.pattern}" v poli ${field}: viz KNOWN_TYPO_PATTERNS.`;
      }
    }
    return null;
  },
};

const czechTypography: SafetyRule = {
  id: 'czech-typography',
  severity: 'error',
  appliesTo: 'both',
  description: 'Texty používají české uvozovky, výpustku … a jednoduché mezery.',
  check(item) {
    for (const { field, value } of collectStrings(item)) {
      const nalez = najdiTypografii(value);
      if (nalez !== null) return `${nalez.problem} v poli ${field}: „${nalez.ukazka}“.`;
    }
    return null;
  },
};

const consistentAddress: SafetyRule = {
  id: 'consistent-address',
  severity: 'error',
  appliesTo: 'both',
  description: 'Texty rodiči tykají: vykání se mezi ně nemíchá.',
  check(item) {
    for (const { field, value } of collectStrings(item)) {
      const nalez = najdiVykani(value);
      if (nalez !== null) return `${nalez.problem}, pole ${field}: „${nalez.ukazka}“.`;
    }
    return null;
  },
};

/**
 * Neslabičná předložka se před stejnou nebo blízkou hláskou vokalizuje:
 * „se šťávou", „ze zelí", „ve vodě", „ke kmínu". Bez toho se věta u sporáku
 * čte o vteřinu déle a vypadá jako překlep.
 *
 * Hranice slova se nehlídá přes `\b` — to v JavaScriptu počítá jen ASCII
 * písmena, takže by „Směs zvlhči" vydávalo za předložku „s".
 */
const PREPOSITION_NOT_VOCALIZED = /(?<!\p{L})(?:s [sšzž]|z [sšzž]|v [vf]|k [kg])\p{L}*/iu;

const prepositionVocalization: SafetyRule = {
  id: 'preposition-vocalization',
  severity: 'error',
  appliesTo: 'both',
  description: 'Neslabičná předložka se před stejnou hláskou vokalizuje. „se šťávou", ne „s šťávou".',
  check(item) {
    for (const { field, value } of collectStrings(item)) {
      const hit = PREPOSITION_NOT_VOCALIZED.exec(value);
      if (hit !== null) {
        return `Nevokalizovaná předložka v poli ${field}: „${hit[0]}".`;
      }
    }
    return null;
  },
};

/**
 * Složky, které pokyny jmenují jinak než seznam: voda se „zalije", olej je
 * „na pánev", prášek do pečiva se schová do „těsta". Hlásit je by utopilo
 * skutečné nálezy, tedy suroviny, které rodič koupí a pak neví, kam s nimi.
 */
const IMPLICIT_INGREDIENTS = new Set([
  'voda',
  'olej-olivovy',
  'olej-repkovy',
  'olej-slunecnicovy',
  'olej-kokosovy',
  'olej-dynovy',
  'maslo',
  'ghi',
  'prasek-do-peceni',
  'jedla-soda',
  'skrob-kukuricny',
]);

/**
 * Pádové tvary jednoho slova.
 *
 * Porovnávat zkrácený kmen podřetězcem nejde: kmen „prs" od „prsa" sedí i na
 * „prstu" a pravidlo by hlásilo nesmysl. Proto se z názvu odvodí základ (bez
 * koncové samohlásky) a k němu se přilepí české koncovky; shoda se hledá jen
 * na celé slovo. „Máta" tak najde „mátou", ale „prsa" nenajde „prstem".
 */
const PADOVE_KONCOVKY = [
  '', 'a', 'u', 'e', 'y', 'i', 'o', 'ou', 'em', 'im', 'am', 'ami', 'ach', 'um',
  'ovi', 'ove', 'mi', 'ech', 'ku', 'ce', 'ek', 'ym', 'ymi', 'ych', 'eho', 'emu',
];

function padoveTvary(slovo: string): string[] {
  if (slovo.length < 3) return [slovo];
  const zaklad = /[aeiouy]$/.test(slovo) ? slovo.slice(0, -1) : slovo;
  if (zaklad.length < 3) return [slovo];
  // Vypadavé -e-: „ocet" má v ostatních pádech „oct-", „sumec" má „sumc-".
  const zaklady = new Set([zaklad, zaklad.replace(/e([a-z])$/, '$1')]);
  return [...zaklady].flatMap((z) => PADOVE_KONCOVKY.map((koncovka) => z + koncovka));
}

const recipeIngredientsUsed: SafetyRule = {
  id: 'recipe-ingredients-used',
  severity: 'error',
  appliesTo: 'recipe',
  description: 'Každá složka receptu se objeví aspoň v jednom pokynu, ne jen v nákupním seznamu.',
  check(item, catalog) {
    if (isIngredient(item)) return null;
    const text = normalize(
      [
        ...item.baseSteps,
        ...item.babySteps,
        ...item.adultSteps,
        ...(item.vegetarianSteps ?? []),
        ...Object.values(item.babyServing),
        item.babySplitPoint,
      ].join(' '),
    );
    const slova = new Set(text.split(/[^a-z0-9]+/));
    for (const ref of item.ingredients) {
      if (IMPLICIT_INGREDIENTS.has(ref.ingredientId)) continue;
      const ingredient = catalog.ingredients.find((one) => one.id === ref.ingredientId);
      if (ingredient === undefined) continue;
      const najde = [ingredient.nameCz, ...ingredient.altNamesCz].some((jmeno) =>
        normalize(jmeno)
          .split(/[^a-z0-9]+/)
          .some((slovo) => padoveTvary(slovo).some((tvar) => slova.has(tvar))),
      );
      if (!najde) {
        return `Složka „${ingredient.nameCz}" je v seznamu, ale žádný pokyn ji nezmiňuje.`;
      }
    }
    return null;
  },
};


/**
 * Strouhat jde jen celý kus.
 *
 * Recept na cottage dip krájel ředkvičky na tenké plátky a dětská linie pak
 * chtěla ředkvičku nastrouhat. V tu chvíli už ale žádná celá nezbyla a rodič
 * stojí u prkénka s pokynem, který nejde splnit. Dětská porce musí vycházet
 * ze stavu, ve kterém jídlo v okamžiku odebrání opravdu je.
 *
 * Pravidlo je schválně úzké. Hlídá jediný, zato nevratný případ: společný
 * postup surovinu rozkrájí a dětský ji chce strouhat. Ostatní přechody
 * (rozmačkat plátek, povařit kus) jdou udělat i potom, takže se nehlásí.
 */
const REZNE_VERBY = ['nakrajej*', 'nakrajel*', 'rozkroj*', 'nasekej*', 'rozctvrt*', 'krajej*'];
const STROUHACI_VERBY = ['nastrouhej*', 'nastrouhan*', 'strouhej*'];
/** Věty, které kus schválně nechávají stranou, pravidlo neruší. */
const VYHRAZENI = ['nech*', 'ponech*', 'odeber*', 'stranou', 'celou', 'celý', 'cely', 'vcelku'];

const babyStepFeasible: SafetyRule = {
  id: 'baby-step-feasible',
  severity: 'error',
  appliesTo: 'recipe',
  description:
    'Dětský krok nechce surovinu ve tvaru, který společný postup už zlikvidoval (krájení proti strouhání).',
  check(item, catalog) {
    if (!isRecipe(item)) return null;

    for (const ref of item.ingredients) {
      const ingredient = catalog.ingredients.find((one) => one.id === ref.ingredientId);
      if (ingredient === undefined) continue;

      const kmeny = [ingredient.nameCz, ...ingredient.altNamesCz]
        .flatMap((jmeno) => normalize(jmeno).split(/[^a-z0-9]+/))
        .filter((slovo) => slovo.length > 4)
        .map((slovo) => slovo.slice(0, slovo.length - 1));
      if (kmeny.length === 0) continue;

      // Sloveso musí stát u té suroviny, ne kdekoli ve větě. Bez tohohle
      // okna hlásilo pravidlo recept, kde se krájely brambory a strouhal sýr.
      const sloveso = (veta: string, vzory: readonly string[]): boolean => {
        const text = normalize(veta);
        for (const kmen of kmeny) {
          let i = text.indexOf(kmen);
          while (i !== -1) {
            if (containsPattern(text.slice(i, i + 90), vzory, { honorNegation: false })) return true;
            i = text.indexOf(kmen, i + 1);
          }
        }
        return false;
      };

      // Když se surovina strouhá už ve společném postupu, dětský krok na ni
      // jen navazuje a nic si neprotiřečí.
      if (item.baseSteps.some((veta) => sloveso(veta, STROUHACI_VERBY))) continue;

      const kraji = item.baseSteps.some(
        (veta) =>
          sloveso(veta, REZNE_VERBY) &&
          !containsPattern(veta, VYHRAZENI, { honorNegation: false }),
      );
      if (!kraji) continue;

      const strouha = item.babySteps.find((veta) => sloveso(veta, STROUHACI_VERBY));
      if (strouha === undefined) continue;

      return `Dětský krok chce strouhat „${ingredient.nameCz}", ale společný postup ji už nakrájel: „${strouha.slice(0, 90)}".`;
    }
    return null;
  },
};

/** Všechna pravidla z docs/SPEC.md kapitola 3, v pořadí tabulky. */
export const safetyRules: readonly SafetyRule[] = [
  noHoneyBaby,
  noSaltBaby,
  noSugarBaby,
  noWholeNuts,
  roundFoodShape,
  babySplitRequired,
  babyStepFeasible,
  vegTrackComplete,
  meatTrackOnlyWithMeat,
  hiddenAnimalIngredients,
  sourceRequired,
  sourceUrlShape,
  noPlaceholder,
  noInternalReferences,
  noStrayMarks,
  prepositionVocalization,
  recipeIngredientsUsed,
  ingredientRefsResolve,
  stagePrepComplete,
  allergenConsistency,
  minAgeConsistency,
  minAgeNotInflated,
  adultOnlyNotInBase,
  adultOnlyNotInBabySteps,
  mercuryLimit,
  nitrateNote,
  hazardCoverage,
  hazardNotesComplete,
  uniqueIds,
  duplicateDetection,
  textUniqueness,
  lengthSanity,
  ingredientCoverage,
  neutralAddress,
  babyServingMentionsMeat,
  czechTypography,
  consistentAddress,
  knownTypos,
];

export const rulesById: ReadonlyMap<string, SafetyRule> = new Map(
  safetyRules.map((rule) => [rule.id, rule]),
);
