import { catalog } from '../../src/data/index';
const r = catalog.recipes.find((x) => x.id === 'krupicova-kase-maliny');
console.log(r?.titleCz, '|', r?.ingredients.map((i) => i.ingredientId).join(', '));
