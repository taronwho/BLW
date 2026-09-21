/**
 * Předvyplněné hlášení nepřesnosti na GitHubu.
 *
 * Aplikace tvrdí zdravotní věci o třech stech surovinách a rodič, který
 * v některé najde chybu, ji dosud neměl kam napsat. Odkaz na předvyplněné
 * issue stojí pár řádků a pro důvěryhodnost udělá víc než další stovka
 * receptů (audit 17. 9. 2026, kapitola 10 bod 4).
 *
 * Repozitář se jmenuje `BLW` — je to zkratka metody v adrese, ne název
 * aplikace (viz CLAUDE.md).
 */
const REPO = 'https://github.com/taronwho/BLW/issues/new';

export interface Hlaseni {
  /** Čeho se hlášení týká: „Surovina", „Recept", „Rada". */
  druh: string;
  nazev: string;
  id: string;
}

/**
 * Název i idčko projdou `encodeURIComponent`, aby česká jména se
 * závorkami, čárkami a ampersandem neroztrhla dotaz v adrese.
 */
export function odkazNaHlaseni({ druh, nazev, id }: Hlaseni): string {
  const nadpis = `Nepřesnost: ${nazev}`;
  const telo = [
    `**${druh}:** ${nazev} (\`${id}\`)`,
    '',
    '**Co je podle mě špatně:**',
    '',
    '',
    '**Zdroj, ze kterého vycházím (odkaz):**',
    '',
    '',
    '_Díky. Každé hlášení projde ověřením proti zdroji, než se data změní._',
  ].join('\n');
  return `${REPO}?title=${encodeURIComponent(nadpis)}&body=${encodeURIComponent(telo)}`;
}
