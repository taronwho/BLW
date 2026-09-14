/**
 * Politika zdrojů podle docs/BEZPECNOST.md kapitola 1.
 * Doména určuje i tier — jinak by šlo pojišťovnu vydávat za odbornou společnost.
 */

export const TIER1_DOMAINS: readonly string[] = [
  'who.int',
  'espghan.org',
  'efsa.europa.eu',
  'ema.europa.eu',
  'pediatrics.cz',
  // Stará i nová doména SZÚ a Ministerstva zdravotnictví — instituce se
  // nezměnily, jen přešly na `gov.cz`. Staré domény zůstávají, ať projdou
  // dříve ověřené odkazy.
  'szu.cz',
  'szu.gov.cz',
  'mzcr.cz',
  'mzd.gov.cz',
  'bezpecnostpotravin.cz',
  'nhs.uk',
  'eaaci.org',
  // Potravinové tabulky — národní databáze složení potravin vedené státními
  // ústavy a úřady. Jsou to jediné zdroje, ze kterých se smí brát obsah živin
  // v miligramech; viz docs/BEZPECNOST.md kap. 1 a 8. Vlastní tabulky a
  // přepočty z blogů sem nepatří ani omylem.
  'nutridatabaze.cz',
  'uzei.cz',
  'fdc.nal.usda.gov',
  'api.nal.usda.gov',
  'ciqual.anses.fr',
  'anses.fr',
  'fineli.fi',
  'thl.fi',
  'frida.fooddata.dk',
  'fooddata.dk',
  'matvaretabellen.no',
  'livsmedelsverket.se',
  // Právní prahy pro „zdroj" a „vysoký obsah" živiny.
  'eur-lex.europa.eu',
];

export const TIER2_DOMAINS: readonly string[] = [
  'kojeni.cz',
  'vyzivadeti.cz',
  'solidstarts.com',
  'healthychildren.org',
];

/** Domény výslovně odmítnuté v docs/BEZPECNOST.md — pojišťovny a výrobci. */
export const DENIED_DOMAINS: readonly string[] = [
  'cpzp.cz',
  'nutricia.cz',
  'hipp.cz',
  'nutriklub.cz',
  'sunar.cz',
  'pinterest.com',
];
