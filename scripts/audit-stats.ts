/**
 * Statistiky kvality datové vrstvy pro závěrečný audit — `npm run audit:stats`.
 *
 * Vypíše čtyři přehledy z docs/AUDIT.md kroku 3:
 *   1. histogram počtu receptů na surovinu (nejčastějších 15 + všechny s nulou),
 *   2. histogram délek textů `prep[*].serving`,
 *   3. počet dvojic receptů sdílejících víc než 60 % ingredientId,
 *   4. deset nejdelších shodných textových úseků napříč různými položkami
 *      (odhalí generování ze šablony).
 *
 * Skript nic nemění a nic nevaliduje — je to měřicí nástroj, ne pravidlo.
 */
import { catalog } from '../src/data/index';

function pad(text: string, width: number): string {
  return text.length >= width ? text : text + ' '.repeat(width - text.length);
}

function padLeft(text: string, width: number): string {
  return text.length >= width ? text : ' '.repeat(width - text.length) + text;
}

/* --- 1. Recepty na surovinu ---------------------------------------------- */

function recipesPerIngredient(): void {
  const counts = new Map<string, number>();
  for (const ingredient of catalog.ingredients) counts.set(ingredient.id, 0);
  for (const recipe of catalog.recipes) {
    const unique = new Set(recipe.ingredients.map((ref) => ref.ingredientId));
    for (const id of unique) counts.set(id, (counts.get(id) ?? 0) + 1);
  }
  const nameOf = new Map(catalog.ingredients.map((i) => [i.id, i.nameCz]));
  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));

  console.log('\n1. POČET RECEPTŮ NA SUROVINU — nejčastějších 15');
  console.log(`${pad('surovina', 30)}${padLeft('receptů', 9)}`);
  console.log('-'.repeat(39));
  for (const [id, count] of sorted.slice(0, 15)) {
    console.log(pad(`${nameOf.get(id) ?? id}`, 30) + padLeft(String(count), 9));
  }

  const zero = sorted.filter(([, count]) => count === 0);
  console.log(`\n   Suroviny s nulovým počtem receptů: ${zero.length}`);
  for (const [id] of zero) console.log(`     ${id} (${nameOf.get(id) ?? '?'})`);

  const values = [...counts.values()];
  const total = values.reduce((a, b) => a + b, 0);
  console.log(
    `\n   Rozdělení: min ${Math.min(...values)}, max ${Math.max(...values)}, průměr ${(total / values.length).toFixed(2)}`,
  );
  const buckets = new Map<string, number>();
  const label = (n: number): string =>
    n === 0 ? '0' : n <= 2 ? '1–2' : n <= 5 ? '3–5' : n <= 10 ? '6–10' : n <= 20 ? '11–20' : '21+';
  for (const value of values) buckets.set(label(value), (buckets.get(label(value)) ?? 0) + 1);
  for (const key of ['0', '1–2', '3–5', '6–10', '11–20', '21+']) {
    const count = buckets.get(key) ?? 0;
    console.log(`   ${pad(key, 7)}${padLeft(String(count), 5)}  ${'#'.repeat(Math.round(count / 2))}`);
  }
}

/* --- 2. Délky prep textů -------------------------------------------------- */

function prepLengthHistogram(): void {
  const lengths: number[] = [];
  for (const ingredient of catalog.ingredients) {
    for (const stage of ['6m', '9m', '12m'] as const) {
      lengths.push(ingredient.prep[stage].serving.trim().length);
    }
  }
  lengths.sort((a, b) => a - b);
  const sum = lengths.reduce((a, b) => a + b, 0);
  const at = (q: number): number => lengths[Math.min(lengths.length - 1, Math.floor(q * lengths.length))] ?? 0;

  console.log('\n2. DÉLKY TEXTŮ prep[*].serving (znaků)');
  console.log(`   vzorků ${lengths.length}, min ${lengths[0]}, max ${lengths[lengths.length - 1]}, průměr ${(sum / lengths.length).toFixed(1)}`);
  console.log(`   medián ${at(0.5)}, p10 ${at(0.1)}, p90 ${at(0.9)}`);
  const buckets = new Map<string, number>();
  for (const length of lengths) {
    const lower = Math.floor(length / 20) * 20;
    const key = `${lower}–${lower + 19}`;
    buckets.set(key, (buckets.get(key) ?? 0) + 1);
  }
  const keys = [...buckets.keys()].sort((a, b) => Number(a.split('–')[0]) - Number(b.split('–')[0]));
  for (const key of keys) {
    const count = buckets.get(key) ?? 0;
    console.log(`   ${pad(key, 10)}${padLeft(String(count), 5)}  ${'#'.repeat(Math.round(count / 4))}`);
  }
}

/* --- 3. Dvojice receptů se shodnými složkami ------------------------------ */

const OVERLAP_THRESHOLD = 0.6;

function recipeIngredientOverlap(): void {
  const sets = catalog.recipes.map((r) => ({
    id: r.id,
    title: r.titleCz,
    ids: new Set(r.ingredients.map((ref) => ref.ingredientId)),
  }));
  const pairs: Array<{ a: string; b: string; share: number; common: number }> = [];
  for (let i = 0; i < sets.length; i++) {
    for (let j = i + 1; j < sets.length; j++) {
      const a = sets[i]!;
      const b = sets[j]!;
      let common = 0;
      for (const id of a.ids) if (b.ids.has(id)) common++;
      // Jaccard: společné složky vůči sjednocení, ať se krátký recept
      // nepočítá jako podmnožina dlouhého.
      const share = common / (a.ids.size + b.ids.size - common);
      if (share > OVERLAP_THRESHOLD) {
        pairs.push({ a: `${a.id} (${a.title})`, b: `${b.id} (${b.title})`, share, common });
      }
    }
  }
  pairs.sort((x, y) => y.share - x.share);

  console.log(`\n3. DVOJICE RECEPTŮ SDÍLEJÍCÍ VÍC NEŽ ${OVERLAP_THRESHOLD * 100} % ingredientId`);
  console.log(`   porovnaných dvojic: ${(sets.length * (sets.length - 1)) / 2}`);
  console.log(`   nad prahem: ${pairs.length}`);
  for (const pair of pairs.slice(0, 20)) {
    console.log(`     ${(pair.share * 100).toFixed(0)} % (${pair.common} společných): ${pair.a}  ×  ${pair.b}`);
  }
}

/* --- 4. Nejdelší shodné úseky napříč položkami ---------------------------- */

interface TextRef {
  owner: string;
  field: string;
  text: string;
}

function collectTexts(): TextRef[] {
  const out: TextRef[] = [];
  for (const i of catalog.ingredients) {
    const owner = `ingredient/${i.id}`;
    for (const stage of ['6m', '9m', '12m'] as const) {
      out.push({ owner, field: `prep.${stage}.serving`, text: i.prep[stage].serving });
      const caution = i.prep[stage].caution;
      if (caution !== undefined) out.push({ owner, field: `prep.${stage}.caution`, text: caution });
    }
    if (i.chokingReason !== undefined) out.push({ owner, field: 'chokingReason', text: i.chokingReason });
    for (const [hazard, note] of Object.entries(i.hazardNotes)) {
      out.push({ owner, field: `hazardNotes.${hazard}`, text: note });
    }
    i.prepIdeas.forEach((v, n) => out.push({ owner, field: `prepIdeas[${n}]`, text: v }));
  }
  for (const r of catalog.recipes) {
    const owner = `recipe/${r.id}`;
    r.baseSteps.forEach((v, n) => out.push({ owner, field: `baseSteps[${n}]`, text: v }));
    r.babySteps.forEach((v, n) => out.push({ owner, field: `babySteps[${n}]`, text: v }));
    r.adultSteps.forEach((v, n) => out.push({ owner, field: `adultSteps[${n}]`, text: v }));
    (r.vegetarianSteps ?? []).forEach((v, n) =>
      out.push({ owner, field: `vegetarianSteps[${n}]`, text: v }),
    );
    out.push({ owner, field: 'babySplitPoint', text: r.babySplitPoint });
    for (const stage of ['6m', '9m', '12m'] as const) {
      out.push({ owner, field: `babyServing.${stage}`, text: r.babyServing[stage] });
    }
    if (r.vegetarianProteinSwap !== undefined) {
      out.push({ owner, field: 'vegetarianProteinSwap', text: r.vegetarianProteinSwap });
    }
  }
  return out;
}

/** Nejdelší úsek délky `length`, který se vyskytne u dvou různých položek. */
function matchesOfLength(texts: readonly TextRef[], length: number): Map<string, TextRef[]> {
  const seen = new Map<string, TextRef[]>();
  for (const ref of texts) {
    const text = ref.text;
    if (text.length < length) continue;
    const localSeen = new Set<string>();
    for (let start = 0; start + length <= text.length; start++) {
      const slice = text.slice(start, start + length);
      if (localSeen.has(slice)) continue;
      localSeen.add(slice);
      const owners = seen.get(slice) ?? [];
      owners.push(ref);
      seen.set(slice, owners);
    }
  }
  const result = new Map<string, TextRef[]>();
  for (const [slice, refs] of seen) {
    const owners = new Set(refs.map((r) => r.owner));
    if (owners.size >= 2) result.set(slice, refs);
  }
  return result;
}

function longestSharedSegments(): void {
  const texts = collectTexts();
  const maxLength = Math.max(...texts.map((t) => t.text.length));
  console.log('\n4. NEJDELŠÍ SHODNÉ TEXTOVÉ ÚSEKY NAPŘÍČ RŮZNÝMI POLOŽKAMI');
  console.log(`   porovnáno ${texts.length} textových polí, nejdelší má ${maxLength} znaků`);

  const found: Array<{ slice: string; refs: TextRef[] }> = [];
  for (let length = maxLength; length >= 12 && found.length < 10; length--) {
    const matches = matchesOfLength(texts, length);
    if (matches.size === 0) continue;
    const sorted = [...matches.entries()].sort((a, b) => b[1].length - a[1].length);
    for (const [slice, refs] of sorted) {
      if (found.length >= 10) break;
      // Přeskoč úsek, který je jen kratším výřezem už nalezeného.
      if (found.some((f) => f.slice.includes(slice))) continue;
      found.push({ slice, refs });
    }
  }

  found.forEach((entry, n) => {
    const owners = [...new Set(entry.refs.map((r) => r.owner))];
    console.log(`\n   [${n + 1}] ${entry.slice.length} znaků, ${owners.length} položek`);
    console.log(`       „${entry.slice}"`);
    for (const ref of entry.refs.slice(0, 8)) console.log(`       – ${ref.owner} · ${ref.field}`);
    if (entry.refs.length > 8) console.log(`       – … a dalších ${entry.refs.length - 8} výskytů`);
  });
}

console.log(`STATISTIKY KVALITY — ${catalog.ingredients.length} surovin, ${catalog.recipes.length} receptů`);
recipesPerIngredient();
prepLengthHistogram();
recipeIngredientOverlap();
longestSharedSegments();
