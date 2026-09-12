import { recipes } from '@/data';
const ids = process.argv.slice(2);
for (const id of ids) {
  const r = recipes.find(x => x.id === id);
  if (!r) { console.log(`!! ${id} nenalezen`); continue; }
  console.log(`\n##### ${r.id} — ${r.titleCz}`);
  console.log('babySteps:'); r.babySteps.forEach(s => console.log('   -', s));
  console.log('babyServing:');
  (['6m','9m','12m'] as const).forEach(st => console.log(`   ${st}: ${r.babyServing[st]}`));
}
