import { guides } from '@/data/guides';
const jen = process.argv.slice(2);
for (const g of guides) {
  if (jen.length > 0 && !jen.includes(g.id)) continue;
  console.log(`\n${'='.repeat(70)}\n### ${g.id} — ${g.titleCz}  [${g.category}]`);
  console.log(`SHRNUTÍ: ${g.summary}`);
  g.keyPoints.forEach((k, i) => console.log(`  K${i}: ${k}`));
  g.sections.forEach((s, i) => {
    console.log(`\n-- ${i}. ${s.heading}${s.asList ? '  (seznam)' : ''}`);
    s.body.forEach((b, j) => console.log(`  [${j}] ${b}`));
  });
}
