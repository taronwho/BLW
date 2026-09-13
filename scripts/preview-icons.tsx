/**
 * Náhled kreslených ikon surovin: každá ve 20, 32 a 64 px, ve světlém
 * i tmavém motivu vedle sebe. Spouští se ručně:
 *   npx tsx scripts/preview-icons.tsx /cesta/nahled.html
 *
 * Rozhoduje první sloupec — 20 px je velikost, ve které ikonu rodič v seznamu
 * opravdu vidí. Co se tam rozpadne na skvrnu, je potřeba překreslit.
 */
import { renderToStaticMarkup } from 'react-dom/server';
import { writeFileSync } from 'node:fs';
import { SHAPES } from '../src/app/icons/shapes';

const ids = Object.keys(SHAPES);
const svg = (id: string, size: number) =>
  `<svg viewBox="0 0 64 64" width="${size}" height="${size}">${renderToStaticMarkup(SHAPES[id] as never)}</svg>`;

const rows = ids
  .map(
    (id) => `<tr>
  <td style="font:12px system-ui;padding:6px 10px">${id}</td>
  <td style="padding:6px">${svg(id, 20)}</td>
  <td style="padding:6px">${svg(id, 32)}</td>
  <td style="padding:6px">${svg(id, 64)}</td>
</tr>`,
  )
  .join('');

const table = (bg: string, fg: string) =>
  `<table style="background:${bg};color:${fg};border-collapse:collapse">${rows}</table>`;

writeFileSync(
  process.argv[2] as string,
  `<!doctype html><body style="margin:0;display:flex;gap:0;font-family:system-ui">
  ${table('#F8F8F5', '#16211D')}${table('#121715', '#E8EDEA')}
  </body>`,
);
console.log('ikon: ' + ids.length);
