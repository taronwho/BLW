import { catalog } from '../../src/data/index';
for (const id of ['rybi-polevka-treska-tmava','hraskova-polevka-mata']) {
  const r = catalog.recipes.find((x) => x.id === id);
  console.log(id, '|', r?.ingredients.map((i) => i.ingredientId).join(', '));
}
