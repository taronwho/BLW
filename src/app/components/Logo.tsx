import type { ReactNode } from 'react';
import { DUZINA, LOGO_VIEWBOX, PECKA, SLUPKA } from '../lib/logo';

/**
 * Značka aplikace: avokádo v řezu.
 *
 * Vykresluje se jako SVG přímo v dokumentu, ne jako obrázek — díky tomu se
 * barvy berou z proměnných motivu a značka se sama překlopí do tmavého
 * režimu. Tvar je společný s ikonami PWA (src/app/lib/logo.ts).
 *
 * Dekorativní prvek: název „BLW" stojí vedle jako text, takže značka sama
 * žádný přístupný název nepotřebuje.
 */
export function Logo({ className = 'h-7 w-7' }: { className?: string }): ReactNode {
  return (
    <svg viewBox={LOGO_VIEWBOX} className={`shrink-0 ${className}`} aria-hidden="true" focusable="false">
      <path d={SLUPKA} fill="var(--logo-slupka)" />
      <path d={DUZINA} fill="var(--logo-duzina)" />
      <circle cx={PECKA.cx} cy={PECKA.cy} r={PECKA.r} fill="var(--logo-pecka)" />
    </svg>
  );
}
