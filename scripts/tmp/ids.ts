import { ingredients, recipes } from '@/data';
const kat = process.argv[2];
const pouzitelne = ingredients.filter(
  (i) => i.chokingRisk !== 'high' && i.servingForm !== 'neresi' && i.minAgeMonths <= 12 && i.category === kat,
);
for (const i of pouzitelne) {
  const rs = recipes.filter((r) => r.ingredients.some((x) => x.ingredientId === i.id));
  const jed = rs.filter((r) => r.ingredients.length <= 4 && r.timeMinutes <= 35);
  if (jed.length > 0) continue;
  console.log(`${i.id}|${i.nameCz}|${i.minAgeMonths}m|${i.chokingRisk}|${i.allergens.join(',')}|${i.servingForm}`);
}
