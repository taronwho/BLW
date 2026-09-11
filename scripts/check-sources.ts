/**
 * Kontrola odkazů — `npm run check:sources`.
 *
 * CLAUDE.md pravidlo 1 a 2 říkají, že URL se nesmí vyplňovat z paměti a že
 * se nesmí uvést zdroj, který nebyl načten. To je ale tvrzení, ne fakt.
 * Tenhle skript z toho dělá fakt: každý `SourceRef` v katalogu skutečně
 * zavolá a ohlásí, co se vrátilo.
 *
 * Schválně NENÍ součástí `npm run validate` — validace musí běžet offline
 * (v CI i při vývoji bez sítě). Tohle se pouští zvlášť a vědomě.
 *
 * Použití:
 *   npm run check:sources                 # projde všechny zdroje v katalogu
 *   npm run check:sources -- <url> [url]  # ad-hoc kontrola konkrétních URL
 */
import { catalog } from '../src/data/index';
import { DENIED_DOMAINS, TIER1_DOMAINS, TIER2_DOMAINS } from '../src/safety/domains';
import { hostMatches } from '../src/safety/text';
import type { SourceRef } from '../src/types';

const TIMEOUT_MS = 20_000;

interface CheckResult {
  url: string;
  /** Kdo zdroj používá — abys věděl, co opravit. */
  usedBy: string[];
  status: number | null;
  redirectedTo: string | null;
  error: string | null;
  domainOk: boolean;
  tierOk: boolean;
}

function collectSources(): Map<string, { source: SourceRef; usedBy: string[] }> {
  const byUrl = new Map<string, { source: SourceRef; usedBy: string[] }>();
  const add = (source: SourceRef, owner: string): void => {
    const existing = byUrl.get(source.url);
    if (existing === undefined) byUrl.set(source.url, { source, usedBy: [owner] });
    else existing.usedBy.push(owner);
  };
  for (const ingredient of catalog.ingredients) {
    for (const source of ingredient.sources) add(source, `surovina/${ingredient.id}`);
  }
  for (const recipe of catalog.recipes) {
    for (const source of recipe.sources) add(source, `recept/${recipe.id}`);
  }
  return byUrl;
}

function checkDomain(source: SourceRef): { domainOk: boolean; tierOk: boolean } {
  let host: string;
  try {
    host = new URL(source.url).hostname;
  } catch {
    return { domainOk: false, tierOk: false };
  }
  if (DENIED_DOMAINS.some((d) => hostMatches(host, d))) return { domainOk: false, tierOk: false };
  const isTier1 = TIER1_DOMAINS.some((d) => hostMatches(host, d));
  const isTier2 = TIER2_DOMAINS.some((d) => hostMatches(host, d));
  return {
    domainOk: isTier1 || isTier2,
    tierOk: source.tier === 1 ? isTier1 : isTier1 || isTier2,
  };
}

async function fetchStatus(
  url: string,
): Promise<{ status: number | null; redirectedTo: string | null; error: string | null }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    // GET, ne HEAD — část institucí na HEAD odpovídá 405, i když stránka žije.
    const response = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal,
      headers: { 'user-agent': 'blw-app source checker' },
    });
    return {
      status: response.status,
      redirectedTo: response.url !== url ? response.url : null,
      error: null,
    };
  } catch (error) {
    return {
      status: null,
      redirectedTo: null,
      error: error instanceof Error ? error.message : String(error),
    };
  } finally {
    clearTimeout(timer);
  }
}

function verdict(result: CheckResult): { ok: boolean; label: string } {
  if (!result.domainOk) return { ok: false, label: 'DOMÉNA NENÍ POVOLENÁ' };
  if (!result.tierOk) return { ok: false, label: 'TIER NEODPOVÍDÁ DOMÉNĚ' };
  if (result.error !== null) return { ok: false, label: `NEDOSTUPNÉ (${result.error})` };
  if (result.status === null) return { ok: false, label: 'NEDOSTUPNÉ' };
  if (result.status >= 400) return { ok: false, label: `HTTP ${result.status}` };
  if (result.redirectedTo !== null) {
    return { ok: true, label: `HTTP ${result.status} — přesměrováno na ${result.redirectedTo}` };
  }
  return { ok: true, label: `HTTP ${result.status}` };
}

async function main(): Promise<void> {
  const adHoc = process.argv.slice(2).filter((arg) => arg.startsWith('http'));

  const targets: Array<{ source: SourceRef; usedBy: string[] }> =
    adHoc.length > 0
      ? adHoc.map((url) => ({
          source: { org: 'ad-hoc', title: 'ad-hoc', url, accessedAt: '', tier: 1 as const },
          usedBy: ['příkazová řádka'],
        }))
      : [...collectSources().values()];

  if (targets.length === 0) {
    console.log('Katalog zatím neobsahuje žádný zdroj — není co kontrolovat.');
    console.log('ZDROJŮ: 0');
    console.log('NEDOSTUPNÝCH: 0');
    return;
  }

  console.log(`Kontroluji ${targets.length} odkazů…\n`);

  const results: CheckResult[] = [];
  for (const { source, usedBy } of targets) {
    const domain = checkDomain(source);
    const response = await fetchStatus(source.url);
    const result: CheckResult = { url: source.url, usedBy, ...domain, ...response };
    results.push(result);
    const { ok, label } = verdict(result);
    console.log(`${ok ? 'OK  ' : 'CHYBA'}  ${label}\n        ${source.url}`);
    if (!ok) console.log(`        používá: ${usedBy.join(', ')}`);
  }

  const broken = results.filter((r) => !verdict(r).ok);
  console.log('');
  console.log(`ZDROJŮ: ${results.length}`);
  console.log(`NEDOSTUPNÝCH: ${broken.length}`);

  if (broken.length > 0) {
    console.error('\nNěkteré odkazy nevedou tam, kam mají. Oprav data, nebo položku označ needs-review.');
    process.exit(1);
  }
}

void main();
