import { ingredients, recipes } from '@/data';

const pouzitelne = ingredients.filter(
  (i) => i.chokingRisk !== 'high' && i.servingForm !== 'neresi' && i.minAgeMonths <= 12,
);
const chybi: Record<string, string[]> = {};
let ma = 0;
for (const i of pouzitelne) {
  const rs = recipes.filter((r) => r.ingredients.some((x) => x.ingredientId === i.id));
  const jednoduche = rs.filter((r) => r.ingredients.length <= 4 && r.timeMinutes <= 35);
  if (jednoduche.length > 0) { ma += 1; continue; }
  (chybi[i.category] ??= []).push(`${i.nameCz}${i.allergens.length ? ' [' + i.allergens.join(',') + ']' : ''}`);
}
console.log(`použitelných surovin ${pouzitelne.length}, s jednoduchou úpravou ${ma}, bez ní ${pouzitelne.length - ma}\n`);
for (const [kat, list] of Object.entries(chybi).sort((a, b) => b[1].length - a[1].length)) {
  console.log(`${kat} (${list.length}): ${list.join(', ')}\n`);
}
