/**
 * Kontrola zdrojů — `npm run check:sources`.
 *
 * Posbírá všechny unikátní URL z polí `sources` napříč surovinami i recepty,
 * každé skutečně stáhne (HEAD, při chybě nebo ne-2xx odpovědi GET, timeout
 * 15 s, nejvýš 3 souběžně) a vypíše tabulku:
 *
 *     URL | HTTP status | doména povolená | počet položek
 *
 * Skončí s exit kódem 1, když je aspoň jedno URL mimo 2xx nebo na nepovolené
 * doméně. Pravidla domén čte z src/safety/domains.ts — tenhle skript je
 * nesmí obcházet ani zmírňovat.
 */
import { catalog } from '../src/data/index';
import { DENIED_DOMAINS, TIER1_DOMAINS, TIER2_DOMAINS } from '../src/safety/domains';
import { hostMatches } from '../src/safety/text';

const TIMEOUT_MS = 15_000;
const CONCURRENCY = 3;

interface UrlUsage {
  url: string;
  /** `ingredient/mrkev`, `recipe/dýňová-polévka`, … */
  items: string[];
}

interface UrlResult extends UrlUsage {
  /** HTTP status, nebo 0 když se spojení vůbec nepovedlo. */
  status: number;
  /** Metoda, která nakonec odpověděla. */
  method: 'HEAD' | 'GET' | '-';
  /** Text chyby, když status === 0. */
  error?: string;
  domainAllowed: boolean;
  /** Důvod, proč doména povolená není. */
  domainNote: string;
}

function domainVerdict(rawUrl: string): { allowed: boolean; note: string } {
  let host: string;
  try {
    host = new URL(rawUrl).hostname;
  } catch {
    return { allowed: false, note: 'nevalidní URL' };
  }
  if (DENIED_DOMAINS.some((d) => hostMatches(host, d))) {
    return { allowed: false, note: `${host} — výslovně odmítnutá doména` };
  }
  if (TIER1_DOMAINS.some((d) => hostMatches(host, d))) return { allowed: true, note: 'tier 1' };
  if (TIER2_DOMAINS.some((d) => hostMatches(host, d))) return { allowed: true, note: 'tier 2' };
  return { allowed: false, note: `${host} — mimo povolený seznam` };
}

function collectUrls(): UrlUsage[] {
  const byUrl = new Map<string, Set<string>>();
  const add = (url: string, item: string): void => {
    const set = byUrl.get(url) ?? new Set<string>();
    set.add(item);
    byUrl.set(url, set);
  };
  for (const ingredient of catalog.ingredients) {
    for (const source of ingredient.sources) add(source.url, `ingredient/${ingredient.id}`);
  }
  for (const recipe of catalog.recipes) {
    for (const source of recipe.sources) add(source.url, `recipe/${recipe.id}`);
  }
  return [...byUrl.entries()]
    .map(([url, items]) => ({ url, items: [...items].sort() }))
    .sort((a, b) => a.url.localeCompare(b.url));
}

async function request(url: string, method: 'HEAD' | 'GET'): Promise<number> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      method,
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        // Bez běžné hlavičky User-Agent vrací část webů 403 i na existující
        // stránce; kontrolujeme dostupnost dokumentu, ne chování robota.
        'user-agent':
          'Mozilla/5.0 (compatible; BLW-source-check/1.0; +https://github.com/taronwho/BLW)',
        accept: 'text/html,application/xhtml+xml,application/pdf;q=0.9,*/*;q=0.8',
      },
    });
    return response.status;
  } finally {
    clearTimeout(timer);
  }
}

async function checkOne(usage: UrlUsage): Promise<UrlResult> {
  const verdict = domainVerdict(usage.url);
  const base = {
    ...usage,
    domainAllowed: verdict.allowed,
    domainNote: verdict.note,
  };

  let headError: string | undefined;
  try {
    const status = await request(usage.url, 'HEAD');
    if (status >= 200 && status < 300) return { ...base, status, method: 'HEAD' };
    headError = `HEAD ${status}`;
  } catch (error) {
    headError = error instanceof Error ? error.message : String(error);
  }

  try {
    const status = await request(usage.url, 'GET');
    return {
      ...base,
      status,
      method: 'GET',
      error: status >= 200 && status < 300 ? undefined : `${headError}; GET ${status}`,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { ...base, status: 0, method: '-', error: `${headError}; GET ${message}` };
  }
}

async function checkAll(usages: readonly UrlUsage[]): Promise<UrlResult[]> {
  const results: UrlResult[] = new Array<UrlResult>(usages.length);
  let next = 0;
  async function worker(): Promise<void> {
    for (;;) {
      const index = next++;
      const usage = usages[index];
      if (usage === undefined) return;
      results[index] = await checkOne(usage);
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));
  return results;
}

function pad(text: string, width: number): string {
  return text.length >= width ? text : text + ' '.repeat(width - text.length);
}

function padLeft(text: string, width: number): string {
  return text.length >= width ? text : ' '.repeat(width - text.length) + text;
}

function isOk(result: UrlResult): boolean {
  return result.status >= 200 && result.status < 300;
}

async function main(): Promise<void> {
  const usages = collectUrls();
  console.log(
    `Kontroluji ${usages.length} unikátních URL ze ${catalog.ingredients.length} surovin a ${catalog.recipes.length} receptů.`,
  );
  console.log(`Timeout ${TIMEOUT_MS / 1000} s, souběžně nejvýš ${CONCURRENCY} požadavky.\n`);

  const results = await checkAll(usages);

  const urlWidth = Math.max(3, ...results.map((r) => r.url.length));
  console.log(
    `${pad('URL', urlWidth)}  ${padLeft('status', 6)}  ${pad('doména povolená', 16)}  ${padLeft('položek', 8)}`,
  );
  console.log('-'.repeat(urlWidth + 2 + 6 + 2 + 16 + 2 + 8));
  for (const result of results) {
    const status = result.status === 0 ? 'ERR' : String(result.status);
    console.log(
      `${pad(result.url, urlWidth)}  ${padLeft(status, 6)}  ${pad(result.domainAllowed ? `ano (${result.domainNote})` : 'NE', 16)}  ${padLeft(String(result.items.length), 8)}`,
    );
  }

  const bad = results.filter((r) => !isOk(r));
  const disallowed = results.filter((r) => !r.domainAllowed);

  if (bad.length > 0) {
    console.log('\nURL MIMO 2xx');
    for (const result of bad) {
      console.log(`  ${result.url}`);
      console.log(`    status: ${result.status === 0 ? `ERR (${result.error ?? '—'})` : result.status}`);
      console.log(`    používají: ${result.items.join(', ')}`);
    }
  }

  if (disallowed.length > 0) {
    console.log('\nNEPOVOLENÉ DOMÉNY');
    for (const result of disallowed) {
      console.log(`  ${result.url} — ${result.domainNote}`);
      console.log(`    používají: ${result.items.join(', ')}`);
    }
  }

  console.log('');
  console.log(`UNIKÁTNÍCH URL: ${results.length}`);
  console.log(`MIMO 2xx: ${bad.length}`);
  console.log(`NEPOVOLENÝCH DOMÉN: ${disallowed.length}`);

  if (bad.length > 0 || disallowed.length > 0) {
    console.error('\nKontrola zdrojů selhala — oprav URL, nebo položku označ needs-review.');
    process.exit(1);
  }
}

await main();
