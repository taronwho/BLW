/**
 * Vygeneruje ikony PWA do public/icons/. Spouští se ručně: `npx tsx scripts/generate-icons.ts`.
 *
 * Ikony kreslíme kódem, ne grafickým editorem — jsou jednoduché, mají být
 * čitelné na malém displeji a reprodukovatelné bez dalšího nástroje.
 * Motiv: miska (bílý oblouk) na barvě `--accent`.
 */
import { deflateSync } from 'node:zlib';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ACCENT: [number, number, number] = [0x1f, 0x6f, 0x5c];
const PAPER: [number, number, number] = [0xf8, 0xf8, 0xf5];

interface IconSpec {
  file: string;
  size: number;
  /** Maskable ikona musí mít motiv uvnitř bezpečné zóny (80 % plochy). */
  maskable: boolean;
}

const ICONS: IconSpec[] = [
  { file: 'icon-192.png', size: 192, maskable: false },
  { file: 'icon-512.png', size: 512, maskable: false },
  { file: 'icon-maskable-512.png', size: 512, maskable: true },
  { file: 'apple-touch-icon.png', size: 180, maskable: true },
];

function crc32(buffer: Buffer): number {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = crc & 1 ? (crc >>> 1) ^ 0xedb88320 : crc >>> 1;
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type: string, data: Buffer): Buffer {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const typeAndData = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(typeAndData));
  return Buffer.concat([length, typeAndData, crc]);
}

function encodePng(size: number, pixels: Uint8Array): Buffer {
  const header = Buffer.alloc(13);
  header.writeUInt32BE(size, 0);
  header.writeUInt32BE(size, 4);
  header[8] = 8; // bit depth
  header[9] = 6; // RGBA
  const raw = Buffer.alloc(size * (size * 4 + 1));
  for (let y = 0; y < size; y += 1) {
    raw[y * (size * 4 + 1)] = 0; // filtr None
    for (let x = 0; x < size * 4; x += 1) {
      raw[y * (size * 4 + 1) + 1 + x] = pixels[y * size * 4 + x] ?? 0;
    }
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', header),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

/** Vyhlazení hrany: vrací 0–1 podle vzdálenosti od hranice tvaru. */
function coverage(distance: number, edge: number): number {
  return Math.min(1, Math.max(0, 0.5 - (distance - edge)));
}

function blend(
  target: Uint8Array,
  index: number,
  color: [number, number, number],
  alpha: number,
): void {
  for (let c = 0; c < 3; c += 1) {
    const existing = target[index + c] ?? 0;
    const channel = color[c] ?? 0;
    target[index + c] = Math.round(existing * (1 - alpha) + channel * alpha);
  }
  target[index + 3] = 255;
}

function drawIcon(spec: IconSpec): Buffer {
  const { size, maskable } = spec;
  const pixels = new Uint8Array(size * size * 4);
  const center = size / 2;
  // Maskable ikona se ořezává do kruhu — motiv proto zmenšíme do bezpečné zóny.
  const scale = maskable ? 0.62 : 0.78;
  const bowlRadius = (size / 2) * scale;
  const rimThickness = bowlRadius * 0.16;
  const cornerRadius = size * 0.22;
  // Půlkruh misky zabírá jen spodní polovinu mezikruží, proto jeho střed
  // posuneme nahoru — jinak by ikona seděla opticky u dolní hrany.
  const bowlCenterY = center - bowlRadius / 2;

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const index = (y * size + x) * 4;

      // Podklad: zaoblený čtverec v barvě accent (u maskable celá plocha).
      const dx = Math.max(Math.abs(x + 0.5 - center) - (size / 2 - cornerRadius), 0);
      const dy = Math.max(Math.abs(y + 0.5 - center) - (size / 2 - cornerRadius), 0);
      const cornerDistance = Math.hypot(dx, dy);
      const backgroundAlpha = maskable ? 1 : coverage(cornerDistance, cornerRadius);
      if (backgroundAlpha <= 0) continue;
      blend(pixels, index, ACCENT, backgroundAlpha);

      // Miska: spodní polovina mezikruží.
      const distance = Math.hypot(x + 0.5 - center, y + 0.5 - bowlCenterY);
      const isLowerHalf = y + 0.5 >= bowlCenterY;
      if (isLowerHalf) {
        const outer = coverage(distance, bowlRadius);
        const inner = 1 - coverage(distance, bowlRadius - rimThickness);
        blend(pixels, index, PAPER, Math.min(outer, inner) * backgroundAlpha);
      }

      // Hladina v misce — vodorovný pruh uvnitř.
      const barHalfWidth = bowlRadius - rimThickness * 1.9;
      const barTop = bowlCenterY + rimThickness * 0.3;
      const barHeight = rimThickness * 0.9;
      const insideBar =
        Math.abs(x + 0.5 - center) <= barHalfWidth &&
        y + 0.5 >= barTop &&
        y + 0.5 <= barTop + barHeight;
      if (insideBar) blend(pixels, index, PAPER, backgroundAlpha);
    }
  }

  return encodePng(size, pixels);
}

const here = dirname(fileURLToPath(import.meta.url));
const outputDir = resolve(here, '..', 'public', 'icons');
mkdirSync(outputDir, { recursive: true });

for (const spec of ICONS) {
  const png = drawIcon(spec);
  writeFileSync(resolve(outputDir, spec.file), png);
  console.log(`${spec.file}  ${spec.size}×${spec.size}  ${png.length} B`);
}
