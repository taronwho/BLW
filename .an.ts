import { recipes, ingredientById } from './src/data';
import { recipeNutrients, nutrientProfile } from './src/data/nutrients';
import { recipeIsVegetarian } from './src/app/lib/derive';

const kat: Record<string, number> = {};
let nehemBezC = 0;
const seznamBezC: string[] = [];
for (const r of recipes) {
  kat[r.category] = (kat[r.category] ?? 0) + 1;
  const n = recipeNutrients(r);
  if (n.ironForm === 'nehemove' && n.iron !== 'nevyznamny' && n.vitaminC === 'nevyznamny') {
    nehemBezC++; seznamBezC.push(r.id);
  }
}
console.log('kategorie:', kat);
console.log('celkem receptů:', recipes.length);
console.log('rostlinné železo BEZ vitaminu C:', nehemBezC);
console.log(seznamBezC.slice(0, 20).join('\n'));
console.log('\nvěk:', recipes.reduce((a: Record<number, number>, r) => { a[r.minAgeMonths] = (a[r.minAgeMonths] ?? 0) + 1; return a; }, {}));
console.log('čas: do20 =', recipes.filter(r => r.timeMinutes <= 20).length, ' do40 =', recipes.filter(r => r.timeMinutes <= 40).length);
// suroviny použité jen v jednom receptu
const pocet = new Map<string, number>();
for (const r of recipes) for (const i of new Set(r.ingredients.map(x => x.ingredientId))) pocet.set(i, (pocet.get(i) ?? 0) + 1);
const jenJednou = [...pocet].filter(([, n]) => n === 1).map(([id]) => ingredientById.get(id)?.nameCz ?? id);
console.log('\nsurovin jen v 1 receptu:', jenJednou.length);
console.log(jenJednou.join(' · '));
