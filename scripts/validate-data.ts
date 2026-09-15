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

function isVegetarianRecipe(recipeIndex: number): boolean {
  const recipe = catalog.recipes[recipeIndex];
  if (recipe === undefined) return false;
  const byId = new Map(catalog.ingredients.map((i) => [i.id, i]));
  return !recipe.ingredients.some((ref) => byId.get(ref.ingredientId)?.category === 'maso-ryby');
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

function main(): void {
  const findings = runSafetyRules(catalog);
  const errors = errorsOf(findings);
  const warnings = warningsOf(findings);

  console.log(`Pravidel v src/safety/rules.ts: ${safetyRules.length}`);
  printIngredientTable(findings);
  printRecipeTable(findings);
  printGuideTable();
  printFindings('CHYBY', errors);
  printFindings('VAROVÁNÍ', warnings);

  const verified = catalog.ingredients.filter((i) => i.reviewStatus === 'verified').length;
  const needsReview = catalog.ingredients.filter((i) => i.reviewStatus === 'needs-review').length;
  const vegetarian = catalog.recipes.filter((_, index) => isVegetarianRecipe(index)).length;
  // Dvě varianty dochucení má jen recept, který maso opravdu obsahuje.
  const withBothTracks = catalog.recipes.filter(
    (r) => r.adultSteps.length > 0 && (r.vegetarianSteps ?? []).length > 0,
  ).length;

  console.log('');
  console.log(`SUROVIN: ${catalog.ingredients.length}  (ověřeno: ${verified}, k revizi: ${needsReview})`);
  console.log(
    `RECEPTŮ: ${catalog.recipes.length}   (vegetariánských: ${vegetarian}, s masem a bezmasou variantou: ${withBothTracks})`,
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
  console.log(`CHYB: ${errors.length + guideFindings.length}`);
  console.log(`VAROVÁNÍ: ${warnings.length}`);

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

  if (errors.length + guideFindings.length > 0) {
    console.error('\nValidace selhala — oprav data, ne pravidla.');
    process.exit(1);
  }
}

main();
