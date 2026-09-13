/**
 * Náhled kreslených ikon surovin: každá ve 20 a 48 px, ve světlém i tmavém
 * motivu pod sebou. Spouští se ručně:
 *   npx tsx scripts/preview-icons.tsx /cesta/nahled.html [predpona]
 *
 * Nepovinný filtr je seznam předpon oddělený čárkou; vybere ikony, jejichž
 * klíč některou z nich začíná — hodí se při kreslení další dávky. Rozhoduje malá velikost: 20 px je to, co rodič
 * v seznamu opravdu vidí. Co se tam rozpadne na skvrnu, patří překreslit.
 */
import { renderToStaticMarkup } from 'react-dom/server';
import { writeFileSync } from 'node:fs';
import { SHAPES } from '../src/app/icons/shapes';

const cil = process.argv[2];
const filtr = process.argv[3] ?? '';
if (cil === undefined) throw new Error('Chybí cesta k výstupnímu souboru.');

const predpony = filtr === '' ? [] : filtr.split(',');
const ids = Object.keys(SHAPES).filter(
  (id) => predpony.length === 0 || predpony.some((p) => id.startsWith(p)),
);

function svg(id: string, size: number): string {
  const kresba = SHAPES[id];
  if (kresba === undefined) throw new Error(`Neznámá ikona ${id}`);
  return `<svg viewBox="0 0 64 64" width="${size}" height="${size}">${renderToStaticMarkup(kresba as never)}</svg>`;
}

function panel(bg: string, fg: string): string {
  const bunky = ids
    .map(
      (id) => `<div style="width:104px;text-align:center;padding:8px 2px">
  <div style="height:52px;display:flex;align-items:center;justify-content:center;gap:8px">${svg(id, 20)}${svg(id, 48)}</div>
  <div style="font:10px system-ui;color:${fg};opacity:.8;word-break:break-word">${id}</div>
</div>`,
    )
    .join('');
  return `<div style="background:${bg};display:flex;flex-wrap:wrap;padding:8px">${bunky}</div>`;
}

writeFileSync(
  cil,
  `<!doctype html><body style="margin:0;font-family:system-ui">
${panel('#F8F8F5', '#16211D')}
${panel('#121715', '#E8EDEA')}
</body>`,
);
console.log(`ikon: ${ids.length}${filtr === '' ? '' : ` (filtr „${filtr}")`}`);
