/**
 * Vygeneruje ikony PWA do public/icons/. Spouští se ručně:
 * `npx tsx scripts/generate-icons.ts`.
 *
 * Tvar značky je jediný, popsaný v src/app/lib/logo.ts — ikona na ploše
 * telefonu se tak nemůže rozejít s tím, co je vidět v hlavičce aplikace.
 * Rastrování dělá Chromium z Playwrightu, který je v projektu stejně kvůli
 * e2e testům; jiný nástroj na SVG → PNG by byl další závislost navíc.
 */
import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { LOGO_BACKGROUND, LOGO_BBOX, LOGO_COLORS, logoSvg } from '../src/app/lib/logo';

interface IconSpec {
  file: string;
  size: number;
  /** Maskable ikona se ořezává do kruhu — motiv musí být v bezpečné zóně (80 %). */
  maskable: boolean;
}

const ICONS: IconSpec[] = [
  { file: 'icon-192.png', size: 192, maskable: false },
  { file: 'icon-512.png', size: 512, maskable: false },
  { file: 'icon-maskable-512.png', size: 512, maskable: true },
  { file: 'apple-touch-icon.png', size: 180, maskable: true },
];

/** Stránka o rozměru ikony: krémový podklad a značka uprostřed. */
function page(spec: IconSpec): string {
  // U maskable ikony je podklad přes celou plochu a značka menší, u ostatních
  // se kreslí zaoblený čtverec, jak ikonu čekají prohlížeče na ploše.
  const radius = spec.maskable ? 0 : Math.round(spec.size * 0.22);
  // Poměr se počítá z výšky samotného avokáda, ne z celého plátna SVG.
  const vyskaZnacky = spec.size * (spec.maskable ? 0.54 : 0.64);
  const platno = Math.round((vyskaZnacky * 64) / LOGO_BBOX.height);
  return `<!doctype html><html><body style="margin:0">
<div style="width:${spec.size}px;height:${spec.size}px;border-radius:${radius}px;background:${LOGO_BACKGROUND};display:flex;align-items:center;justify-content:center">${logoSvg(LOGO_COLORS, platno)}</div>
</body></html>`;
}

const here = dirname(fileURLToPath(import.meta.url));
const outputDir = resolve(here, '..', 'public', 'icons');
mkdirSync(outputDir, { recursive: true });

const browser = await chromium.launch();
try {
  for (const spec of ICONS) {
    const tab = await browser.newPage({
      viewport: { width: spec.size, height: spec.size },
      deviceScaleFactor: 1,
    });
    await tab.setContent(page(spec));
    const png = await tab.screenshot({ omitBackground: true });
    await tab.close();
    writeFileSync(resolve(outputDir, spec.file), png);
    console.log(`${spec.file}  ${spec.size}×${spec.size}  ${png.length} B`);
  }
} finally {
  await browser.close();
}
