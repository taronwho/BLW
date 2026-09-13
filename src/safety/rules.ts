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

function ingredientsOf(recipe: Recipe, catalog: Catalog): Ingredient[] {
  const byId = new Map(catalog.ingredients.map((i) => [i.id, i]));
  return recipe.ingredients
    .map((ref) => byId.get(ref.ingredientId))
    .filter((i): i is Ingredient => i !== undefined);
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
    'vegetarianSteps jsou vyplněné a recept s masem má náhradu bílkoviny, ne pouhé vynechání.',
  check(item, catalog) {
    if (!isRecipe(item)) return null;
    if (item.vegetarianSteps.length === 0 || item.vegetarianSteps.every((s) => s.trim() === '')) {
      return 'vegetarianSteps jsou prázdné — bezmasá varianta musí být vždy popsaná.';
    }
    const hasMeat = ingredientsOf(item, catalog).some((i) => i.category === 'maso-ryby');
    if (!hasMeat) return null;

    const swap = item.vegetarianProteinSwap?.trim() ?? '';
    if (swap.length === 0) {
      return 'Recept obsahuje maso nebo rybu, ale vegetarianProteinSwap je prázdný.';
    }
    if (!containsPattern(swap, PROTEIN_SWAP_SOURCES)) {
      return `vegetarianProteinSwap neuvádí konkrétní zdroj bílkoviny (jen „${swap.slice(0, 80)}").`;
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
    const hit = firstHit(item.vegetarianSteps, HIDDEN_ANIMAL_PATTERNS);
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
    item.meatSteps.forEach((v, i) => push(`meatSteps[${i}]`, v));
    item.vegetarianSteps.forEach((v, i) => push(`vegetarianSteps[${i}]`, v));
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
  description: 'minAgeMonths receptu je ≥ maximum z jeho složek.',
  check(item, catalog) {
    if (!isRecipe(item)) return null;
    const used = ingredientsOf(item, catalog);
    if (used.length === 0) return null;
    const max = Math.max(...used.map((i) => i.minAgeMonths));
    if (item.minAgeMonths >= max) return null;
    const blocking = used.filter((i) => i.minAgeMonths === max).map((i) => i.nameCz);
    return `minAgeMonths receptu je ${item.minAgeMonths}, ale složka vyžaduje ${max} (${blocking.join(', ')}).`;
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

const duplicateDetection: SafetyRule = {
  id: 'duplicate-detection',
  severity: 'warning',
  appliesTo: 'ingredient',
  description: 'Žádné dvě suroviny nemají shodný nameCz ani překrývající se altNamesCz.',
  check(item, catalog) {
    if (!isIngredient(item)) return null;
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
        return `Chybný tvar „${nalez.pattern}" v poli ${field} — viz KNOWN_TYPO_PATTERNS.`;
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
  description: 'Texty rodiči tykají — vykání se mezi ně nemíchá.',
  check(item) {
    for (const { field, value } of collectStrings(item)) {
      const nalez = najdiVykani(value);
      if (nalez !== null) return `${nalez.problem}, pole ${field}: „${nalez.ukazka}“.`;
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
  vegTrackComplete,
  hiddenAnimalIngredients,
  sourceRequired,
  sourceUrlShape,
  noPlaceholder,
  ingredientRefsResolve,
  stagePrepComplete,
  allergenConsistency,
  minAgeConsistency,
  mercuryLimit,
  nitrateNote,
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
