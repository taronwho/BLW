/**
 * Validátor datové vrstvy — `npm run validate:data`.
 *
 * Projde katalog všemi pravidly z src/safety/, vypíše tabulku po kategoriích,
 * souhrn ve tvaru z CLAUDE.md a skončí s exit kódem 1 při jakékoli chybě.
 */
import { lists } from '../src/data/lists';
import { catalog } from '../src/data/index';
import { checkGuides } from '../src/safety/guides';
import { errorsOf, runSafetyRules, warningsOf } from '../src/safety/run';
import { safetyRules } from '../src/safety/rules';
import type { Finding } from '../src/safety/types';
import {
  dolozeniPodleTemat,
  nedolozenaTvrzeni,
  pouzitiDomen,
  pouzitiUrl,
  STROP_NEDOLOZENYCH,
  zkontrolujZdroje,
} from '../src/safety/zdroje';
import { recipeIsVegetarian } from '../src/app/lib/deriveRecipes';
import { jeJednoduchaUprava, JEDNODUCHA_MINUT, JEDNODUCHA_SLOZEK } from '../src/data/jednoduche';
import type { Recipe } from '../src/types';
import { GUIDE_CATEGORIES, INGREDIENT_CATEGORIES, RECIPE_CATEGORIES } from '../src/types';

const MIN_INGREDIENTS = 190;
const MIN_RECIPES = 80;
const MIN_VEGETARIAN_RECIPES = 40;

function pad(text: string, width: number): string {
  return text.length >= width ? text : text + ' '.repeat(width - text.length);
}

function padLeft(text: string, width: number): string {
  return text.length >= width ? text : ' '.repeat(width - text.length) + text;
}

/**
 * Sní tenhle recept vegetarián?
 *
 * Bere `recipeIsVegetarian`, tedy tutéž funkci jako filtr „jen
 * vegetariánské" v aplikaci. Dřív se tady ptalo jen na kategorii
 * `maso-ryby`, takže souhrn hlásil 374, kdežto rodič ve filtru viděl 370 —
 * čtyři recepty s parmazánem, pecorinem a granou padano maso neobsahují,
 * ale vyrábějí se se živočišným syřidlem a vegetariánce u stolu nepomůžou.
 * Dvě definice téhož znamenají, že se jedna z nich mýlí.
 */
function isVegetarianRecipe(recipe: Recipe): boolean {
  return recipeIsVegetarian(recipe);
}

function printIngredientTable(findings: readonly Finding[]): void {
  console.log('\nSUROVINY PO KATEGORIÍCH');
  console.log(
    `${pad('kategorie', 22)}${padLeft('počet', 7)}${padLeft('ověřeno', 9)}${padLeft('k revizi', 10)}${padLeft('chyb', 6)}${padLeft('varování', 10)}`,
  );
  console.log('-'.repeat(64));
  for (const category of INGREDIENT_CATEGORIES) {
    const items = catalog.ingredients.filter((i) => i.category === category);
    const ids = new Set(items.map((i) => i.id));
    const relevant = findings.filter((f) => f.itemKind === 'ingredient' && ids.has(f.itemId));
    console.log(
      pad(category, 22) +
        padLeft(String(items.length), 7) +
        padLeft(String(items.filter((i) => i.reviewStatus === 'verified').length), 9) +
        padLeft(String(items.filter((i) => i.reviewStatus === 'needs-review').length), 10) +
        padLeft(String(relevant.filter((f) => f.severity === 'error').length), 6) +
        padLeft(String(relevant.filter((f) => f.severity === 'warning').length), 10),
    );
  }
}

function printRecipeTable(findings: readonly Finding[]): void {
  console.log('\nRECEPTY PO KATEGORIÍCH');
  console.log(
    `${pad('kategorie', 22)}${padLeft('počet', 7)}${padLeft('chyb', 6)}${padLeft('varování', 10)}`,
  );
  console.log('-'.repeat(45));
  for (const category of RECIPE_CATEGORIES) {
    const items = catalog.recipes.filter((r) => r.category === category);
    const ids = new Set(items.map((r) => r.id));
    const relevant = findings.filter((f) => f.itemKind === 'recipe' && ids.has(f.itemId));
    console.log(
      pad(category, 22) +
        padLeft(String(items.length), 7) +
        padLeft(String(relevant.filter((f) => f.severity === 'error').length), 6) +
        padLeft(String(relevant.filter((f) => f.severity === 'warning').length), 10),
    );
  }
}

function printFindings(title: string, findings: readonly Finding[]): void {
  if (findings.length === 0) return;
  console.log(`\n${title}`);
  for (const finding of findings) {
    console.log(
      `  [${finding.ruleId}] ${finding.itemKind}/${finding.itemId} (${finding.itemName}): ${finding.message}`,
    );
  }
}

function printGuideTable(): void {
  console.log('\nRADY PO KATEGORIÍCH');
  console.log(`${pad('kategorie', 22)}${padLeft('počet', 7)}${padLeft('naléhavých', 12)}`);
  console.log('-'.repeat(41));
  for (const category of GUIDE_CATEGORIES) {
    const items = catalog.guides.filter((g) => g.category === category);
    console.log(
      pad(category, 22) +
        padLeft(String(items.length), 7) +
        padLeft(String(items.filter((g) => g.urgent === true).length), 12),
    );
  }
}

/**
 * Přehled zdrojů — odkud katalog bere jistotu.
 *
 * Audit 17. 9. 2026 (nález 1.2) našel 91 % odkazů na jediné britské
 * doméně a 34 unikátních URL na 795 položek. Dokud to tahle tabulka
 * nevypisuje, není ten stav v ničem vidět a při každé další dávce se
 * tiše zhoršuje.
 */
function printSourceTable(): void {
  const domeny = pouzitiDomen(catalog);
  const polozek = catalog.ingredients.length + catalog.recipes.length;
  console.log('\nZDROJE PODLE DOMÉN');
  console.log(pad('doména', 28) + padLeft('položek', 9) + padLeft('podíl', 8) + padLeft('URL', 6));
  for (const radek of domeny) {
    const podil = polozek === 0 ? 0 : Math.round((radek.polozek / polozek) * 100);
    console.log(
      pad(radek.domena, 28) +
        padLeft(String(radek.polozek), 9) +
        padLeft(`${podil} %`, 8) +
        padLeft(String(radek.url), 6),
    );
  }
  const nejcastejsi = pouzitiUrl(catalog).slice(0, 3);
  for (const radek of nejcastejsi) {
    console.log(`  nejvytíženější: ${radek.polozek}× ${radek.url}`);
  }
}

/**
 * Doložení rizikových tvrzení (docs/BEZPECNOST.md kap. 1).
 *
 * U každého tématu — hazard, alergen, dušení — kolik surovin ho nese a
 * u kolika z nich má surovina zdroj, který o tom tématu opravdu mluví.
 * Nahoře to, kde chybí nejvíc, protože tam se má pokračovat.
 */
function printClaimSources(): void {
  const radky = dolozeniPodleTemat(catalog);
  const chybi = nedolozenaTvrzeni(catalog).length;
  const celkem = radky.reduce((soucet, r) => soucet + r.surovin, 0);
  console.log('\nDOLOŽENÍ RIZIKOVÝCH TVRZENÍ');
  console.log(pad('téma', 20) + padLeft('surovin', 9) + padLeft('doloženo', 10) + padLeft('chybí', 7));
  for (const r of radky) {
    console.log(
      pad(r.tema, 20) +
        padLeft(String(r.surovin), 9) +
        padLeft(String(r.dolozeno), 10) +
        padLeft(String(r.surovin - r.dolozeno), 7),
    );
  }
  console.log(`  doloženo ${celkem - chybi} z ${celkem}, strop nedoložených ${STROP_NEDOLOZENYCH}`);
}

/**
 * Kolik z kuchařky jsou plnohodnotné recepty a kolik rychlé úpravy.
 *
 * Audit 17. 9. 2026 (nález 2.3): číslo 494 nese dvě různé věci. „Dušená
 * mrkev na dva prsty" i „Čočka na kyselo pro celou rodinu" se počítají
 * stejně, takže kritérium „≥ 80 receptů" měří něco jiného, než měřit
 * chtělo. V aplikaci se obojí rozliší filtrem „jednoduché", ve výpisu se
 * to dosud nerozlišilo nijak.
 *
 * Řádek o krocích je otevřený úkol: cíl fáze 3 v docs/GOALS.md žádal u
 * každého receptu aspoň čtyři kroky v `baseSteps` a u části plnohodnotných
 * receptů to zatím neplatí.
 */
function printRecipeComplexity(): void {
  const jednoduche = catalog.recipes.filter(jeJednoduchaUprava);
  const plne = catalog.recipes.filter((r) => !jeJednoduchaUprava(r));
  const malokroku = plne.filter((r) => r.baseSteps.length < 4).length;
  const nejmene = catalog.recipes.reduce(
    (min, r) => Math.min(min, r.baseSteps.length),
    Number.POSITIVE_INFINITY,
  );
  console.log('\nSLOŽITOST RECEPTŮ');
  console.log(
    `  jednoduchých úprav (do ${JEDNODUCHA_SLOZEK} složek a ${JEDNODUCHA_MINUT} minut): ${jednoduche.length}`,
  );
  console.log(`  plnohodnotných receptů: ${plne.length}`);
  console.log(`  z toho s méně než 4 kroky v baseSteps: ${malokroku}`);
  console.log(`  nejmenší počet kroků v kuchařce: ${nejmene}`);
}

function main(): void {
  const findings = runSafetyRules(catalog);
  const errors = errorsOf(findings);
  // Dnešek se bere jednou: kdyby si každé pravidlo sahalo pro datum samo,
  // lišil by se výpis běhu, který přeteče půlnoc.
  const dnes = new Date().toISOString().slice(0, 10);
  const zdrojoveNalezy = zkontrolujZdroje(catalog, dnes);
  const warnings = warningsOf(findings);

  console.log(`Pravidel v src/safety/rules.ts: ${safetyRules.length}`);
  printIngredientTable(findings);
  printRecipeTable(findings);
  printRecipeComplexity();
  printGuideTable();
  printFindings('CHYBY', errors);
  printSourceTable();
  printClaimSources();
  printFindings('VAROVÁNÍ', warnings);
  const zdrojoveChyby = zdrojoveNalezy.filter((n) => n.severity === 'error');
  const zdrojovaVarovani = zdrojoveNalezy.filter((n) => n.severity === 'warning');
  if (zdrojoveChyby.length > 0) {
    console.log('\nCHYBY VE ZDROJÍCH');
    for (const nalez of zdrojoveChyby) console.log(`  ${nalez.ruleId}: ${nalez.message}`);
  }
  if (zdrojovaVarovani.length > 0) {
    console.log('\nVAROVÁNÍ O ZDROJÍCH');
    for (const nalez of zdrojovaVarovani) console.log(`  ${nalez.ruleId}: ${nalez.message}`);
  }

  const verified = catalog.ingredients.filter((i) => i.reviewStatus === 'verified').length;
  const needsReview = catalog.ingredients.filter((i) => i.reviewStatus === 'needs-review').length;
  const vegetarian = catalog.recipes.filter(isVegetarianRecipe).length;
  // Dvě varianty dochucení. Ne nutně kvůli masu: čtyři recepty je mají
  // kvůli syřidlovému sýru, takže popisek „s masem" by na ně nesedl.
  // Množiny jsou disjunktní, aby se čísla dala sečíst a vyšel počet
  // receptů — dřív dávala dohromady 498 ze 494.
  const withBothTracks = catalog.recipes.filter(
    (r) =>
      !isVegetarianRecipe(r) && r.adultSteps.length > 0 && (r.vegetarianSteps ?? []).length > 0,
  ).length;

  console.log('');
  console.log(`SUROVIN: ${catalog.ingredients.length}  (ověřeno: ${verified}, k revizi: ${needsReview})`);
  console.log(
    `RECEPTŮ: ${catalog.recipes.length}   (vegetariánských: ${vegetarian}, se dvěma variantami dochucení: ${withBothTracks})`,
  );
  const guideFindings = checkGuides(catalog.guides);
  if (guideFindings.length > 0) {
    console.log('\nCHYBY V RADÁCH');
    for (const f of guideFindings) console.log(`  guide/${f.guideId}: ${f.message}`);
  }
  const urgent = catalog.guides.filter((g) => g.urgent === true).length;
  console.log(`RAD: ${catalog.guides.length}     (naléhavých: ${urgent})`);
  const polozekVSeznamech = lists.reduce((soucet, one) => soucet + one.polozky.length, 0);
  console.log(`SEZNAMŮ: ${lists.length}   (položek: ${polozekVSeznamech})`);
  console.log(`CHYB: ${errors.length + guideFindings.length + zdrojoveChyby.length}`);
  console.log(`VAROVÁNÍ: ${warnings.length + zdrojovaVarovani.length}`);

  // Cílové počty z docs/SPEC.md kapitola 9. Dokud se katalog plní, jsou to
  // informativní řádky — ne chyba, jinak by nešlo commitnout ani první dávku.
  const belowTarget: string[] = [];
  if (catalog.ingredients.length < MIN_INGREDIENTS) {
    belowTarget.push(`surovin ${catalog.ingredients.length}/${MIN_INGREDIENTS}`);
  }
  if (catalog.recipes.length < MIN_RECIPES) {
    belowTarget.push(`receptů ${catalog.recipes.length}/${MIN_RECIPES}`);
  }
  if (vegetarian < MIN_VEGETARIAN_RECIPES) {
    belowTarget.push(`vegetariánských receptů ${vegetarian}/${MIN_VEGETARIAN_RECIPES}`);
  }
  if (belowTarget.length > 0) {
    console.log(`ROZPRACOVÁNO: ${belowTarget.join(', ')}`);
  }

  if (errors.length + guideFindings.length + zdrojoveChyby.length > 0) {
    console.error('\nValidace selhala — oprav data, ne pravidla.');
    process.exit(1);
  }
}

main();
