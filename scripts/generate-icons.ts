/**
 * Z jedné předlohy značky vyrobí všechno, co aplikace potřebuje. Spouští se
 * ručně: `npx tsx scripts/generate-icons.ts`.
 *
 * Vstup: assets/drobek.png — ořezaná předloha v plné velikosti, jediný zdroj
 * pravdy. Do buildu se nedostane, je mimo src/ i public/.
 *
 * Výstup:
 *  - src/assets/drobek.png — zmenšenina pro hlavičku. V hlavičce je značka
 *    vysoká 40 px, takže plná předloha by byla zbytečných několik set kB
 *    v balíčku, který si PWA navíc celý ukládá do offline cache.
 *  - public/icons/*.png — ikony PWA na krémovém podkladu; průhledná ikona na
 *    ploše telefonu vypadá rozbitě.
 *
 * Zmenšuje a rastruje Chromium z Playwrightu, který je v projektu stejně
 * kvůli e2e testům; jiný nástroj na obrázky by byl další závislost navíc.
 */
import { chromium } from '@playwright/test';
import type { Page } from '@playwright/test';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/** Podklad ikon. Teplá krémová, aby krémové manžety na rukávech nesplynuly. */
const PODKLAD = '#EEF2E6';

/** Šířka zmenšeniny pro hlavičku: zhruba pětinásobek toho, co je vidět. */
const SIRKA_V_APLIKACI = 240;

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

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const predloha = readFileSync(resolve(root, 'assets', 'drobek.png'));
const dataUrl = `data:image/png;base64,${predloha.toString('base64')}`;

/** Zmenšení přes canvas; vrací PNG s průhledností. */
async function zmensit(page: Page, width: number): Promise<Buffer> {
  const url = await page.evaluate(
    async ({ src, width: sirka }) => {
      const img = new Image();
      img.src = src;
      await img.decode();
      const canvas = document.createElement('canvas');
      canvas.width = sirka;
      canvas.height = Math.round((sirka * img.height) / img.width);
      const context = canvas.getContext('2d');
      if (context === null) throw new Error('Canvas nedal 2D kontext.');
      context.imageSmoothingQuality = 'high';
      context.drawImage(img, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL('image/png');
    },
    { src: dataUrl, width },
  );
  return Buffer.from(url.split(',')[1] ?? '', 'base64');
}

/** Stránka o rozměru ikony: krémový podklad a značka uprostřed. */
function stranka(spec: IconSpec): string {
  // U maskable ikony je podklad přes celou plochu a značka menší, u ostatních
  // se kreslí zaoblený čtverec, jak ikonu čekají prohlížeče na ploše.
  const radius = spec.maskable ? 0 : Math.round(spec.size * 0.22);
  const podil = spec.maskable ? 0.62 : 0.78;
  return `<!doctype html><html><body style="margin:0">
<div style="width:${spec.size}px;height:${spec.size}px;border-radius:${radius}px;background:${PODKLAD};display:flex;align-items:center;justify-content:center">
<img src="${dataUrl}" style="width:${Math.round(spec.size * podil)}px;height:auto">
</div></body></html>`;
}

const browser = await chromium.launch();
try {
  const tab = await browser.newPage();
  await tab.setContent('<!doctype html><html><body></body></html>');

  const zmensena = await zmensit(tab, SIRKA_V_APLIKACI);
  const vAplikaci = resolve(root, 'src', 'assets', 'drobek.png');
  mkdirSync(dirname(vAplikaci), { recursive: true });
  writeFileSync(vAplikaci, zmensena);
  console.log(`src/assets/drobek.png  ${SIRKA_V_APLIKACI} px  ${zmensena.length} B`);
  await tab.close();

  const outputDir = resolve(root, 'public', 'icons');
  mkdirSync(outputDir, { recursive: true });
  for (const spec of ICONS) {
    const page = await browser.newPage({
      viewport: { width: spec.size, height: spec.size },
      deviceScaleFactor: 1,
    });
    await page.setContent(stranka(spec));
    const png = await page.screenshot({ omitBackground: true });
    await page.close();
    writeFileSync(resolve(outputDir, spec.file), png);
    console.log(`${spec.file}  ${spec.size}×${spec.size}  ${png.length} B`);
  }
} finally {
  await browser.close();
}
