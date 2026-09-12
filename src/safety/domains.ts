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
