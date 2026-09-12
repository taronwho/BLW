import { catalog } from '../../src/data/index';
const R = catalog.recipes;
console.log('RECEPTU:', R.length);
// duplicitni tituly
const titles = new Map<string, string[]>();
for (const r of R) {
  const k = r.titleCz.trim().toLowerCase();
  titles.set(k, [...(titles.get(k) ?? []), r.id]);
}
for (const [k, ids] of titles) if (ids.length > 1) console.log('DUPLICITNI TITUL:', k, ids.join(', '));
// duplicitni id
const ids = new Map<string, number>();
for (const r of R) ids.set(r.id, (ids.get(r.id) ?? 0) + 1);
for (const [k, n] of ids) if (n > 1) console.log('DUPLICITNI ID:', k, n);
// prekryv ingredienci
let worst = 0;
for (let a = 0; a < R.length; a++) {
  for (let b = a + 1; b < R.length; b++) {
    const A = new Set(R[a]!.ingredients.map((i) => i.ingredientId));
    const B = new Set(R[b]!.ingredients.map((i) => i.ingredientId));
    const inter = [...A].filter((x) => B.has(x)).length;
    const ratio = inter / Math.min(A.size, B.size);
    if (ratio > worst) worst = ratio;
    if (ratio > 0.7) console.log(`PREKRYV ${(ratio * 100).toFixed(0)}%: ${R[a]!.id} <-> ${R[b]!.id}`);
  }
}
console.log('NEJVYSSI PREKRYV:', (worst * 100).toFixed(0) + '%');
// cetnost surovin
const cnt = new Map<string, number>();
for (const r of R) for (const i of new Set(r.ingredients.map((x) => x.ingredientId))) cnt.set(i, (cnt.get(i) ?? 0) + 1);
const over = [...cnt.entries()].filter(([, n]) => n > 18).sort((a, b) => b[1] - a[1]);
for (const [k, n] of over) console.log(`NAD LIMIT 18: ${k} = ${n}`);
console.log('TOP 12:', [...cnt.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12).map(([k, n]) => `${k}:${n}`).join(' '));
// vegetarianske
const byId = new Map(catalog.ingredients.map((i) => [i.id, i]));
const veg = R.filter((r) => !r.ingredients.some((x) => byId.get(x.ingredientId)?.category === 'maso-ryby'));
console.log('VEGETARIANSKYCH:', veg.length);
