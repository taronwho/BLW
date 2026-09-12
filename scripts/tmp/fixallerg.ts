import { ingredients } from '../../src/data/ingredients';
import { lunchesDinners2 } from '../../src/data/recipes/lunches_dinners_2';
import { breakfast2 } from '../../src/data/recipes/breakfast_2';
import { soups2 } from '../../src/data/recipes/soups_2';
const byId = new Map(ingredients.map((i) => [i.id, i]));
for (const r of [...lunchesDinners2, ...breakfast2, ...soups2]) {
  const exp = new Set<string>();
  for (const ref of r.ingredients) {
    const ing = byId.get(ref.ingredientId);
    if (!ing) { console.log(`NEZNAMA SUROVINA ${r.id}: ${ref.ingredientId}`); continue; }
    for (const a of ing.allergens) exp.add(a);
  }
  const act = new Set<string>(r.allergens);
  const miss = [...exp].filter((a) => !act.has(a));
  const extra = [...act].filter((a) => !exp.has(a));
  if (miss.length || extra.length) {
    console.log(`${r.id}\tOCEKAVANO: [${[...exp].join(', ')}]\tchybi:${miss.join(',')}\tnavic:${extra.join(',')}`);
  }
  const maxAge = Math.max(...r.ingredients.map((x) => byId.get(x.ingredientId)?.minAgeMonths ?? 0));
  if (r.minAgeMonths < maxAge) console.log(`${r.id}\tMINAGE ma byt ${maxAge}, je ${r.minAgeMonths}`);
}
