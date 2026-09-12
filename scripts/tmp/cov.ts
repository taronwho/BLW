import { catalog } from '../../src/data/index';
const used = new Set<string>();
for (const r of catalog.recipes) for (const i of r.ingredients) used.add(i.ingredientId);
const missing = catalog.ingredients.filter((i) => !used.has(i.id));
console.log('SUROVIN:', catalog.ingredients.length, 'RECEPTU:', catalog.recipes.length);
console.log('BEZ RECEPTU:', missing.length);
for (const m of missing) console.log(`${m.category}\t${m.id}\t${m.nameCz}`);
