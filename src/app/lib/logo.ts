/**
 * Značka aplikace — avokádo v řezu.
 *
 * Tvar je popsaný jednou a používají ho obě místa: komponenta Logo v hlavičce
 * a skript scripts/generate-icons.ts, který z něj vykresluje ikony PWA. Kdyby
 * měl každý svoje křivky, ikona na ploše telefonu by se časem rozešla s tím,
 * co je vidět v aplikaci.
 *
 * Symetrické podle osy x = 32 na plátně 64 × 64.
 */

export const LOGO_VIEWBOX = '0 0 64 64';

/** Slupka: hruškovitý obrys s užším krčkem nahoře. */
export const SLUPKA =
  'M32 5.5c6.8 0 11.2 6.2 11.2 13.7 0 6.2 6.3 8.9 6.3 20.6C49.5 51.4 41.6 59.5 32 59.5S14.5 51.4 14.5 39.8c0-11.7 6.3-14.4 6.3-20.6C20.8 11.7 25.2 5.5 32 5.5Z';

/** Dužina: stejný tvar zmenšený dovnitř, aby zůstal rovnoměrný lem. */
export const DUZINA =
  'M32 10.3c4.7 0 7.5 4.2 7.5 9 0 6.8 6 9.6 6 20.5 0 8.9-6 14.7-13.5 14.7S18.5 48.7 18.5 39.8c0-10.9 6-13.7 6-20.5 0-4.8 2.8-9 7.5-9Z';

/** Pecka sedí ve spodní, širší části — jako na opravdovém řezu. */
export const PECKA = { cx: 32, cy: 41.5, r: 8.8 } as const;

export interface LogoColors {
  slupka: string;
  duzina: string;
  pecka: string;
}

/** Barvy pro ikony PWA. V aplikaci se berou z proměnných v src/index.css. */
export const LOGO_COLORS: LogoColors = {
  slupka: '#1C5F49',
  duzina: '#D6E8A8',
  pecka: '#A9682F',
};

/** Podklad ikon PWA — krémová, aby avokádo drželo klasické barvy. */
export const LOGO_BACKGROUND = '#F2F6E9';

/**
 * Opsaný obdélník samotného avokáda uvnitř plátna 64 × 64.
 *
 * Plátno je širší, než kolik tvar zabírá, takže „polovina plátna" není
 * polovina značky. Generátor ikon podle toho počítá velikost, aby motiv
 * v ikoně opravdu seděl v bezpečné zóně a nebyl zbytečně drobný.
 */
export const LOGO_BBOX = { width: 35, height: 54 } as const;

/** Značka jako samostatné SVG; používá ji generátor ikon. */
export function logoSvg(colors: LogoColors = LOGO_COLORS, size?: number): string {
  const rozmer = size === undefined ? '' : ` width="${size}" height="${size}"`;
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${LOGO_VIEWBOX}"${rozmer}>`,
    `<path d="${SLUPKA}" fill="${colors.slupka}"/>`,
    `<path d="${DUZINA}" fill="${colors.duzina}"/>`,
    `<circle cx="${PECKA.cx}" cy="${PECKA.cy}" r="${PECKA.r}" fill="${colors.pecka}"/>`,
    '</svg>',
  ].join('');
}
