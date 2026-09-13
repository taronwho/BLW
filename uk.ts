import { recipes } from '@/data';
for (const id of ['sunkovy-bramborovy-salat-teply','kakaove-kulicky-pro-batolata','mozzarella-a-rajce-na-spejli','chia-pudink-mango','cottage-dip-s-redkvickami','zapeceny-lilek-mozzarella']) {
  const r = recipes.find(x => x.id === id);
  if (!r) continue;
  console.log(`\n##### ${r.id} — ${r.titleCz} (minAgeMonths ${r.minAgeMonths})`);
  console.log('  dělení:', r.babySplitPoint);
  r.babySteps.forEach(s => console.log('  krok:', s));
  (['6m','9m','12m'] as const).forEach(s => console.log(`  ${s}: ${r.babyServing[s]}`));
}
