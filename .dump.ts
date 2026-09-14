import { recipes, ingredientById } from '/home/user/BLW/src/data';
for (const id of process.argv.slice(2)) {
  const r = recipes.find((x) => x.id === id);
  if (!r) { console.log('??', id); continue; }
  console.log('='.repeat(70));
  console.log(r.id, '|', r.nameCz, '|', r.category, '|', r.tags.join(','));
  console.log('SLOŽKY:', r.ingredients.map((i) => `${ingredientById.get(i.ingredientId)?.nameCz ?? i.ingredientId} (${i.ingredientId}) ${i.amount}`).join(' | '));
  r.baseSteps.forEach((t, i) => console.log(`  base ${i + 1}: ${t}`));
  console.log('  odběr:', r.babySplitPoint);
  r.babySteps.forEach((t, i) => console.log(`  baby ${i + 1}: ${t}`));
  r.adultSteps.forEach((t, i) => console.log(`  dosp ${i + 1}: ${t}`));
  (r.vegetarianSteps ?? []).forEach((t, i) => console.log(`  veg  ${i + 1}: ${t}`));
  for (const [k, v] of Object.entries(r.babyServing)) console.log(`  podání ${k}: ${v}`);
}
