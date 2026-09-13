/**
 * Suroviny, které nemusí figurovat v žádném receptu.
 *
 * Výjimka je přípustná **jen** ve třech případech:
 *
 *  1. nápoj, který se podává samostatně, ne jako složka pokrmu;
 *  2. pomocná látka, která v receptu nevystupuje jako složka pokrmu;
 *  3. položka, kterou katalog vede právě proto, aby řekl, že se do dvanácti
 *     měsíců nepoužívá. Taková věc se v dětské lince objevit nesmí a do
 *     dochucení pro dospělé se píše textem, ne jako odměřená složka —
 *     kdyby byla složkou receptu, zvedla by celému receptu věkovou hranici.
 *
 * Výjimka se nikdy nepřidává proto, aby vyšlo pokrytí; když se ze suroviny
 * vařit dá a pro dítě je vhodná, patří do receptu, ne sem.
 *
 * Klíč je `Ingredient.id`, hodnota je důvod. Pravidlo `ingredient-coverage`
 * v ./rules.ts tenhle seznam čte.
 */
export const COVERAGE_EXCEPTIONS: Readonly<Record<string, string>> = {
  'detsky-caj-bez-cukru': 'Nápoj podávaný samostatně k jídlu, ne složka pokrmu.',

  // Nápoje. Podávají se ze skleničky, ne jako odměřená složka pokrmu.
  'napoj-ryzovy': 'Nápoj, a navíc se do pěti let nepodává jako náhrada mléka.',
  'napoj-ovesny': 'Nápoj; jako složka vaření přichází v úvahu až po prvním roce.',
  'napoj-sojovy': 'Nápoj; jako složka vaření přichází v úvahu až po prvním roce.',
  'napoj-mandlovy': 'Nápoj; jako složka vaření přichází v úvahu až po prvním roce.',
  'mleko-kozi': 'Nápoj; jako hlavní mléko až po prvních narozeninách.',

  // Položky, které katalog vede proto, aby řekl, že se do roka nepoužívají.
  // V dětské lince nesmí být vůbec a do dochucení pro dospělé se píšou
  // textem, takže složkou receptu nejsou ani být nemůžou.
  med: 'Do 12 měsíců se nepodává; pro dospělé jde o dochucení popsané textem.',
  sul: 'Do dětské porce se nepřidává; dospělí si solí až po jejím odebrání.',
  'cukr-krystal': 'Do 12 měsíců se nepřidává; v receptech se nahrazuje ovocem.',
  'javorovy-sirup': 'Do 12 měsíců se nepřidává; jde o dochucení pro dospělé.',
  'bujon-kostka': 'Do dětského jídla nepatří; recepty používají vývar bez soli.',
  // `voda` tu byla také, ale audit 12. 9. 2026 ukázal, že ji osm receptů
  // odměřuje jako běžnou složku. Výjimka se tím nikdy neuplatnila a jen
  // zbytečně vyjímala surovinu z kontroly, takže je pryč — pravidlo
  // `ingredient-coverage` teď vodu skutečně kontroluje a ta projde.
};

/** Ověří, jestli je surovina z povinnosti mít recept vyjmutá. */
export function isCoverageException(ingredientId: string): boolean {
  return Object.hasOwn(COVERAGE_EXCEPTIONS, ingredientId);
}

/** Důvod výjimky, nebo undefined u suroviny, která výjimku nemá. */
export function coverageExceptionReason(ingredientId: string): string | undefined {
  return COVERAGE_EXCEPTIONS[ingredientId];
}
