import { ingredientById, ingredients, recipeById, recipes } from '@/data';
import { nutrientProfile } from '@/data/nutrients';
import { recipeNutrients } from '@/data/recipeNutrients';
import type { AllergenGroup, Child, Ingredient, Recipe, RecipeCategory } from '@/types';
import { KEY_ALLERGENS } from '@/types';
import { frekvence } from './frekvence';
import { DNU_V_BLOKU, type Plan, type PlanDen, type PlanJidlo, type TypJidla } from './typy';

/**
 * Sestavení třicetidenního plánu.
 *
 * Plán je čistá funkce: ze stejného dítěte, stejného deníku a stejného bloku
 * vyjde vždycky tentýž plán. Nic se nelosuje, pořadí rozhoduje priorita
 * a při shodě abeceda. Díky tomu se dá plán kdykoli přepočítat a otestovat.
 *
 * Pravidla, která plán drží:
 *
 *  1. Jedna nová surovina denně. Když se zavedou dvě a dítě zareaguje,
 *     nepozná se na kterou.
 *  2. Každý den aspoň jedno jídlo se železem. Kvůli němu se příkrm po
 *     šestém měsíci zavádí.
 *  3. Alergen se nabídne brzy a pak ještě dvakrát s odstupem. Odkládání
 *     riziko alergie nesnižuje.
 *  4. Co je v Domácnosti zapsané jako alergie dítěte, se do plánu nedostane
 *     vůbec, ani jako složka receptu.
 *  5. Nic s vysokým rizikem dušení. Takové suroviny v katalogu zůstávají
 *     i s pokynem ke krájení, ale plán je sám od sebe nenabízí.
 *  6. První týden jsou to samotné suroviny, ne recepty, a začíná se
 *     zeleninou, která není sladká.
 *  7. Recept nesmí přinést alergen, který dítě ještě nedostalo. Jinak by se
 *     při reakci nepoznalo, co ji způsobilo.
 */

export interface VstupPlanu {
  dite: Child;
  /** Kolikátý blok třiceti dnů se sestavuje. První má číslo jedna. */
  blok: number;
  /** Co už má dítě v deníku. */
  ochutnane: ReadonlySet<string>;
  /** Věk dítěte v měsících; `null`, když není datum narození. */
  mesice: number | null;
  /** Měsíc v roce, 1 až 12. Kvůli sezónnosti. */
  mesicVRoce: number;
  /** Datum sestavení, ISO. */
  dnes: string;
  /**
   * Která varianta se má vzít. Nula je ta výchozí; vyšší číslo vybere ze
   * stejně dobrých receptů jiný. Používá se, když si rodič řekne o jiný den.
   */
  varianta?: number;
}

/**
 * Pořadí prvního týdne.
 *
 * Není odvozené z katalogu, ale opsané z rady o prvních potravinách, která
 * stojí na doporučeních NHS a SZÚ: měkká vařená zelenina, kterou dítě udrží
 * v pěsti, a teprve za ní sladší druhy. Automatika by na tenhle seznam
 * nedosáhla, protože „vhodná zelenina“ se z dat pozná, ale „rozumné první
 * sousto“ ne.
 *
 * Mrkev, kterou SZÚ jmenuje jako první, tu schválně není. V katalogu má
 * vysoké riziko dušení kvůli syrové podobě a plán nic takového sám od sebe
 * nenabízí. Uvařená doměkka je bezpečná a v receptech dál je, jen si ji
 * rodič vybírá sám.
 */
const PRVNI_TYDEN: readonly string[] = [
  'brokolice',
  'kvetak',
  'cuketa',
  'brambor',
  'dyne-hokaido',
  'batat',
  'avokado',
];

/** Kolik dní se čeká na druhou a třetí expozici alergenu. */
const ODSTUP_EXPOZIC: readonly number[] = [3, 7];

/** Jak dlouho se recept neopakuje. */
const BEZ_OPAKOVANI_DNU = 6;

function jeVhodnaNovinka(
  item: Ingredient,
  mesice: number | null,
  vyloucene: ReadonlySet<AllergenGroup>,
): boolean {
  if (item.minAgeMonths > (mesice ?? 6)) return false;
  if (item.chokingRisk === 'high') return false;
  // Olej, sůl a koření se nezavádějí jako jídlo, sousto z nich nevznikne.
  if (item.servingForm === 'neresi') return false;
  return !item.allergens.some((skupina) => vyloucene.has(skupina));
}

/**
 * Pořadí, ve kterém se suroviny zavádějí. Nižší číslo jde dřív.
 *
 * Alergeny se tu neřeší: o ty se stará `zastupciAlergenu` a prokládání.
 * Dokud byly i tady vpředu, vyšly první dny jako řada sýrů za sebou, protože
 * alergenních surovin je v katalogu hodně a abeceda je řadila k sobě.
 */
function prioritaNovinky(item: Ingredient, mesicVRoce: number): number {
  if (nutrientProfile(item).iron !== 'nevyznamny') return 1;
  if (item.seasonCz.length > 0 && item.seasonCz.includes(mesicVRoce)) return 2;
  return 3;
}

/** První sousta v daném pořadí, bez toho, co dítě už zná nebo nesmí. */
function prvniSousta(
  mesice: number | null,
  vyloucene: ReadonlySet<AllergenGroup>,
  ochutnane: ReadonlySet<string>,
): Ingredient[] {
  return PRVNI_TYDEN.map((id) => ingredientById.get(id)).filter(
    (item): item is Ingredient =>
      item !== undefined && !ochutnane.has(item.id) && jeVhodnaNovinka(item, mesice, vyloucene),
  );
}

/**
 * Pořadí novinek.
 *
 * Nejdřív priorita (železo, sezóna, zbytek), uvnitř každé skupiny se ale
 * střídají kategorie. Bez střídání vyšly čtyři druhy čočky za sebou: luštěnin
 * je v katalogu hodně, všechny nesou železo a abeceda je naskládala k sobě.
 */
function poradiNovinek(vstup: VstupPlanu, vyloucene: ReadonlySet<AllergenGroup>): Ingredient[] {
  const vhodne = ingredients
    .filter(
      (item) => !vstup.ochutnane.has(item.id) && jeVhodnaNovinka(item, vstup.mesice, vyloucene),
    )
    .sort((a, b) => a.nameCz.localeCompare(b.nameCz, 'cs'));

  const out: Ingredient[] = [];
  for (const priorita of [1, 2, 3]) {
    const skupina = vhodne.filter((item) => prioritaNovinky(item, vstup.mesicVRoce) === priorita);
    const podleKategorii = new Map<string, Ingredient[]>();
    for (const item of skupina) {
      const rada = podleKategorii.get(item.category) ?? [];
      rada.push(item);
      podleKategorii.set(item.category, rada);
    }
    const rady = [...podleKategorii.values()];
    for (let i = 0; out.length < vhodne.length; i += 1) {
      const kolo = rady.map((rada) => rada[i]).filter((item): item is Ingredient => item !== undefined);
      if (kolo.length === 0) break;
      out.push(...kolo);
    }
  }
  return out;
}

/** Po kolika dnech přijde na řadu další nezavedený alergen. */
const KROK_ALERGENU = 3;

/**
 * Jeden zástupce od každého klíčového alergenu, který dítě ještě nedostalo.
 *
 * Doporučení mluví o zavedení alergenu, ne o zavedení každé alergenní
 * suroviny. Devět skupin proto stačí pokrýt devíti surovinami; zbytek
 * kategorie se zařadí normálně podle železa a sezóny. Bez tohohle rozdílu
 * by plán začal třiceti alergeny v abecedním pořadí.
 */
function zastupciAlergenu(
  kandidati: readonly Ingredient[],
  zavedene: ReadonlySet<AllergenGroup>,
): Ingredient[] {
  const out: Ingredient[] = [];
  const pokryte = new Set<AllergenGroup>(zavedene);
  for (const skupina of KEY_ALLERGENS) {
    if (pokryte.has(skupina)) continue;
    // Nejjednodušší zástupce: co nese jedinou alergenní skupinu, se při
    // reakci vyhodnocuje líp než směs.
    const zastupce = [...kandidati]
      .filter((item) => item.allergens.includes(skupina) && !out.includes(item))
      .sort(
        (a, b) =>
          a.allergens.length - b.allergens.length ||
          a.minAgeMonths - b.minAgeMonths ||
          a.nameCz.localeCompare(b.nameCz, 'cs'),
      )[0];
    if (zastupce === undefined) continue;
    out.push(zastupce);
    for (const dalsi of zastupce.allergens) pokryte.add(dalsi);
  }
  return out;
}

/**
 * Prolne alergeny se zbytkem, aby nešly za sebou.
 *
 * Každý třetí den je alergenní, ostatní dny se berou z běžného pořadí.
 * Tím se devět skupin stihne zavést zhruba za měsíc a mezi dvěma novými
 * alergeny zůstanou dva klidné dny na případnou reakci.
 */
function prolozeneNovinky(bezne: readonly Ingredient[], alergeny: readonly Ingredient[]): Ingredient[] {
  const zbyle = bezne.filter((item) => !alergeny.includes(item));
  const out: Ingredient[] = [];
  let a = 0;
  let b = 0;
  for (let i = 0; out.length < bezne.length + alergeny.length && i < 400; i += 1) {
    const naAlergen = i % KROK_ALERGENU === 0 && a < alergeny.length;
    const vybrany = naAlergen ? alergeny[a++] : zbyle[b++];
    if (vybrany !== undefined) out.push(vybrany);
    else if (a < alergeny.length) out.push(alergeny[a++] as Ingredient);
    else break;
  }
  return out;
}

/** Kategorie receptů, ze kterých se bere jídlo daného typu. */
const KATEGORIE: Record<TypJidla, readonly RecipeCategory[]> = {
  snidane: ['snidane'],
  obed: ['obed-vecere', 'polevky'],
  vecere: ['obed-vecere', 'polevky'],
  svacina: ['svaciny-peceni'],
};

/** Jídla dne v pořadí, v jakém se jedí. */
function typyJidel(jidel: number, svacin: number): TypJidla[] {
  const zaklad: TypJidla[] =
    jidel <= 1 ? ['obed'] : jidel === 2 ? ['snidane', 'obed'] : ['snidane', 'obed', 'vecere'];
  const out: TypJidla[] = [];
  for (const typ of zaklad) {
    out.push(typ);
    // Svačina patří mezi jídla, ne na konec dne. První jde po snídani,
    // druhá po obědě.
    if (out.filter((t) => t === 'svacina').length < svacin && typ !== 'vecere') {
      out.push('svacina');
    }
  }
  return out;
}

interface KontextVyberu {
  mesice: number | null;
  vyloucene: ReadonlySet<AllergenGroup>;
  /** Alergeny, které dítě už dostalo. Recept jiný nový alergen přinést nesmí. */
  zavedeneAlergeny: ReadonlySet<AllergenGroup>;
  /** Kolikátý den recept naposledy padl. */
  naposledy: Map<string, number>;
  /** Recepty, které už dneska padly. Dvakrát denně totéž nedává smysl. */
  dnesni: Set<string>;
  /** Suroviny, které dítě už zná z deníku nebo z dřívějších dnů plánu. */
  zname: ReadonlySet<string>;
  den: number;
  /** Posun podle bloku a varianty, aby se nevracely tytéž recepty. */
  posun: number;
}

function jeVhodnyRecept(recipe: Recipe, typ: TypJidla, ctx: KontextVyberu): boolean {
  if (!KATEGORIE[typ].includes(recipe.category)) return false;
  if (recipe.minAgeMonths > (ctx.mesice ?? 6)) return false;
  if (ctx.dnesni.has(recipe.id)) return false;
  if (recipe.allergens.some((skupina) => ctx.vyloucene.has(skupina))) return false;
  // Nový alergen smí do dne přijít jen přes novinku nebo přes plánovanou
  // expozici, ne náhodou jako složka receptu.
  if (recipe.allergens.some((skupina) => !ctx.zavedeneAlergeny.has(skupina))) return false;
  const kdy = ctx.naposledy.get(recipe.id);
  return kdy === undefined || ctx.den - kdy > BEZ_OPAKOVANI_DNU;
}

/**
 * Nižší číslo je lepší kandidát.
 *
 * Kromě novinky a železa se počítá i to, kolik surovin v receptu dítě ještě
 * nezná. Recept plný neznámých věcí sice pravidlo o alergenech neporuší, ale
 * den, který měl mít jednu novinku, promění v pět. Proto se za ně přidává
 * penalizace, ne zákaz: úplně vyhnout se jim v kuchařce nejde.
 */
function skoreReceptu(recipe: Recipe, ctx: KontextVyberu, hledana: string | undefined, chybiZelezo: boolean): number {
  const maHledanou =
    hledana !== undefined && recipe.ingredients.some((ref) => ref.ingredientId === hledana);
  const maZelezo = recipeNutrients(recipe).iron !== 'nevyznamny';
  const neznamych = recipe.ingredients.filter(
    (ref) => ref.ingredientId !== hledana && !ctx.zname.has(ref.ingredientId),
  ).length;
  return (maHledanou ? 0 : 8) + (chybiZelezo && !maZelezo ? 4 : 0) + Math.min(neznamych, 3);
}

/**
 * Výběr receptu. Pořadí rozhoduje: co obsahuje hledanou surovinu, pak co
 * doplní chybějící železo, pak abeceda. Posun podle bloku a varianty zajistí,
 * že se v dalších třiceti dnech nevrátí totéž.
 */
function vyberRecept(
  typ: TypJidla,
  ctx: KontextVyberu,
  hledana: string | undefined,
  chybiZelezo: boolean,
): Recipe | undefined {
  const vhodne = recipes.filter((recipe) => jeVhodnyRecept(recipe, typ, ctx));
  if (vhodne.length === 0) return undefined;

  const serazene = [...vhodne].sort((a, b) => {
    const rozdil =
      skoreReceptu(a, ctx, hledana, chybiZelezo) - skoreReceptu(b, ctx, hledana, chybiZelezo);
    return rozdil !== 0 ? rozdil : a.titleCz.localeCompare(b.titleCz, 'cs');
  });
  const nejlepsi = skoreReceptu(serazene[0] as Recipe, ctx, hledana, chybiZelezo);
  // Posun bere jiný recept ze stejně dobrých, ne horší z celé řady.
  const stejneDobre = serazene.filter(
    (recipe) => skoreReceptu(recipe, ctx, hledana, chybiZelezo) === nejlepsi,
  );
  return stejneDobre[(ctx.posun + ctx.den) % stejneDobre.length];
}

/** Recept, který obsahuje daný alergen. Pro plánovanou expozici. */
function receptSAlergenem(
  alergen: AllergenGroup,
  typ: TypJidla,
  ctx: KontextVyberu,
): Recipe | undefined {
  const rozsireny: KontextVyberu = {
    ...ctx,
    zavedeneAlergeny: new Set([...ctx.zavedeneAlergeny, alergen]),
  };
  const vhodne = recipes
    .filter((recipe) => jeVhodnyRecept(recipe, typ, rozsireny))
    .filter((recipe) => recipe.allergens.includes(alergen))
    .sort((a, b) => a.titleCz.localeCompare(b.titleCz, 'cs'));
  if (vhodne.length === 0) return undefined;
  return vhodne[(ctx.posun + ctx.den) % vhodne.length];
}

/** Sestaví jídla jednoho dne. */
function jidlaDne(
  den: number,
  novinka: Ingredient | undefined,
  opakovany: AllergenGroup | undefined,
  ctx: KontextVyberu,
  jidel: number,
  svacin: number,
): PlanJidlo[] {
  const jidla: PlanJidlo[] = [];
  let novinkaPouzita = false;
  let zeleznoVeDni = false;

  for (const typ of typyJidel(jidel, svacin)) {
    const hledana = novinkaPouzita ? undefined : novinka?.id;
    const jeHlavni = typ === 'obed' || typ === 'vecere';
    const recept =
      opakovany !== undefined && jeHlavni && !jidla.some((j) => j.duvod === 'alergen')
        ? (receptSAlergenem(opakovany, typ, ctx) ??
          vyberRecept(typ, ctx, hledana, !zeleznoVeDni))
        : vyberRecept(typ, ctx, hledana, !zeleznoVeDni);
    if (recept === undefined) continue;

    ctx.naposledy.set(recept.id, den);
    ctx.dnesni.add(recept.id);
    const maNovinku =
      novinka !== undefined && recept.ingredients.some((ref) => ref.ingredientId === novinka.id);
    const maZelezo = recipeNutrients(recept).iron !== 'nevyznamny';
    // Štítek expozice patří jen prvnímu jídlu, které alergen nese. Když ho
    // dostanou všechna tři, den vypadá, jako by šlo o tři různé expozice.
    const jeExpozice =
      opakovany !== undefined &&
      recept.allergens.includes(opakovany) &&
      !jidla.some((j) => j.duvod === 'alergen');
    const prvniZeleznyDne = maZelezo && !zeleznoVeDni;

    jidla.push({
      typ,
      recipeId: recept.id,
      duvod: jeExpozice
        ? 'alergen'
        : maNovinku
          ? 'nova-surovina'
          : prvniZeleznyDne
            ? 'zelezo'
            : 'osvedcene',
    });

    if (maNovinku) novinkaPouzita = true;
    if (maZelezo) zeleznoVeDni = true;
  }

  // Novinka, na kterou nevyšel recept, se nabídne samostatně vedle jídla.
  // Bez toho by den novou surovinu slíbil a nedodal ji.
  if (!novinkaPouzita && novinka !== undefined) {
    jidla.push({ typ: 'svacina', ingredientId: novinka.id, duvod: 'nova-surovina' });
  }
  return jidla;
}

export function sestavPlan(vstup: VstupPlanu): Plan {
  const vyloucene: ReadonlySet<AllergenGroup> = new Set(vstup.dite.allergens ?? []);
  const prvniBlok = vstup.blok === 1;

  const zavedeneAlergeny = new Set<AllergenGroup>();
  const zname = new Set<string>(vstup.ochutnane);
  for (const id of vstup.ochutnane) {
    for (const skupina of ingredientById.get(id)?.allergens ?? []) zavedeneAlergeny.add(skupina);
  }

  const bezne = poradiNovinek(vstup, vyloucene);
  const alergeny = zastupciAlergenu(bezne, zavedeneAlergeny);
  // První týden se nevaří a začíná se nesladkou zeleninou; alergeny jdou
  // až za ní, aby první ochutnávky byly co nejjednodušší.
  const zelenina = prvniBlok ? prvniSousta(vstup.mesice, vyloucene, vstup.ochutnane) : [];
  const fronta: Ingredient[] = [
    ...zelenina,
    ...prolozeneNovinky(
      bezne.filter((item) => !zelenina.includes(item)),
      alergeny.filter((item) => !zelenina.includes(item)),
    ),
  ];

  const naposledy = new Map<string, number>();
  const expozice = new Map<number, AllergenGroup>();
  const dny: PlanDen[] = [];

  for (let den = 1; den <= DNU_V_BLOKU; den += 1) {
    const { jidel, svacin } = frekvence(den, vstup.blok, vstup.mesice);
    const novinka = fronta[den - 1];
    const opakovany = expozice.get(den);

    // Alergen, který se zavádí dneska, smí být v dnešním receptu. Jinak by
    // novinka skončila vedle jídla jako samostatné sousto, i když na ni
    // v kuchařce recept je.
    const dnesniAlergeny = new Set<AllergenGroup>(zavedeneAlergeny);
    for (const skupina of novinka?.allergens ?? []) dnesniAlergeny.add(skupina);

    const ctx: KontextVyberu = {
      mesice: vstup.mesice,
      vyloucene,
      zavedeneAlergeny: dnesniAlergeny,
      naposledy,
      dnesni: new Set<string>(),
      zname: new Set(zname),
      den,
      posun: vstup.blok * 7 + (vstup.varianta ?? 0) * 3,
    };

    // První týden se nevaří. Samotná surovina, jednou denně, ať je při
    // reakci jasné, co ji způsobilo.
    const jidla =
      prvniBlok && den <= 7 && novinka !== undefined
        ? [{ typ: 'obed' as TypJidla, ingredientId: novinka.id, duvod: 'prvni-ochutnavka' as const }]
        : jidlaDne(den, novinka, opakovany, ctx, jidel, svacin);

    if (novinka !== undefined) {
      zname.add(novinka.id);
      for (const skupina of novinka.allergens) {
        if (!zavedeneAlergeny.has(skupina)) {
          for (const odstup of ODSTUP_EXPOZIC) {
            const cil = den + odstup;
            if (cil <= DNU_V_BLOKU && !expozice.has(cil)) expozice.set(cil, skupina);
          }
        }
        zavedeneAlergeny.add(skupina);
      }
    }
    // Co dítě snědlo v receptu, zná od zítřka taky.
    for (const jidlo of jidla) {
      for (const ref of recipeById.get(jidlo.recipeId ?? '')?.ingredients ?? []) {
        zname.add(ref.ingredientId);
      }
    }

    dny.push({
      cislo: den,
      ...(novinka === undefined ? {} : { novinka: novinka.id }),
      ...(opakovany === undefined ? {} : { opakovanyAlergen: opakovany }),
      jidla,
    });
  }

  return { childId: vstup.dite.id, blok: vstup.blok, vytvoreno: vstup.dnes, dny, stavy: {} };
}

/**
 * Přepočítá jediný den, když si rodič řekne o jiný.
 *
 * Nová surovina dne zůstává: je to ta, která je na řadě, a vyměnit ji by
 * znamenalo rozházet celý zbytek bloku. Mění se to, co se z ní uvaří.
 *
 * Náhrada se proto hledá podle novinky, ne podle čísla dne. Deník mezitím
 * povyrostl o dny, které rodič odškrtl, takže čerstvý plán má tutéž surovinu
 * posunutou dopředu a podle čísla by se trefil někam úplně jinam.
 */
export function jinyDen(plan: Plan, cislo: number, vstup: VstupPlanu, varianta: number): Plan {
  const puvodni = plan.dny.find((den) => den.cislo === cislo);
  if (puvodni === undefined) return plan;
  const cerstvy = sestavPlan({ ...vstup, varianta });
  const nahrada =
    (puvodni.novinka === undefined
      ? undefined
      : cerstvy.dny.find((den) => den.novinka === puvodni.novinka)) ??
    cerstvy.dny.find((den) => den.cislo === cislo);
  if (nahrada === undefined) return plan;
  return {
    ...plan,
    dny: plan.dny.map((den) =>
      den.cislo === cislo
        ? {
            ...nahrada,
            cislo,
            // Plánovaná expozice alergenu patří k číslu dne, ne k receptům,
            // které se právě vyměnily.
            ...(puvodni.opakovanyAlergen === undefined
              ? {}
              : { opakovanyAlergen: puvodni.opakovanyAlergen }),
          }
        : den,
    ),
  };
}

/** Suroviny, které den zavádí. Zapisují se do deníku, když se den odškrtne. */
export function noveSuroviny(den: PlanDen): string[] {
  const out = new Set<string>();
  if (den.novinka !== undefined) out.add(den.novinka);
  for (const jidlo of den.jidla) {
    if (jidlo.ingredientId !== undefined) out.add(jidlo.ingredientId);
  }
  return [...out];
}

/** Recepty dne, ve stejném pořadí jako jídla. */
export function receptyDne(den: PlanDen): Recipe[] {
  return den.jidla
    .map((jidlo) => (jidlo.recipeId === undefined ? undefined : recipeById.get(jidlo.recipeId)))
    .filter((recipe): recipe is Recipe => recipe !== undefined);
}
