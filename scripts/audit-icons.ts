/**
 * Kontrola ikon u surovin. Spouští se ručně: `npx tsx scripts/audit-icons.ts`.
 *
 * Katalog používá emoji. Emoji ale pokrývá jen běžné světové potraviny —
 * na českou spíž nestačí. Řada položek proto sdílí jednu ikonu s něčím
 * jiným (fazole za čočku i za sušené brusinky, muchomůrka za žampiony,
 * oliva za červenou řepu) a u některých ikona ukazuje rovnou jinou věc.
 *
 * Tenhle skript je seznam verdiktů pro všech 216 surovin. Trvá na tom, že
 * verdikt má každá položka a že žádný verdikt nezůstal po smazané surovině —
 * jinak by se seznam tiše rozešel s katalogem.
 *
 * Verdikty:
 *   ok      — ikona ukazuje přesně tuhle surovinu
 *   blizko  — ukazuje správnou věc nepřesně (broskev za meruňku) nebo ji
 *             sdílí s příbuznou položkou, takže se v seznamu nerozliší
 *   spatne  — ukazuje něco jiného
 */
import { ingredients } from '../src/data';

type Verdikt = 'ok' | 'blizko' | 'spatne';

const VERDIKTY: Record<string, [Verdikt, string]> = {
  // ── ovoce ──────────────────────────────────────────────────────────────
  'jablko': ['ok', ''],
  'hruška': ['ok', ''],
  'banán': ['ok', ''],
  'avokádo': ['ok', ''],
  'švestka': ['spatne', 'borůvky'],
  'meruňka': ['blizko', 'broskev'],
  'broskev': ['ok', ''],
  'nektarinka': ['blizko', 'broskev'],
  'nektarinka bílá': ['blizko', 'broskev'],
  'třešně': ['ok', ''],
  'višně': ['blizko', 'sdílí ikonu s třešněmi'],
  'jahody': ['ok', ''],
  'borůvky': ['ok', ''],
  'maliny': ['spatne', 'borůvky'],
  'ostružiny': ['spatne', 'borůvky'],
  'rybíz červený': ['spatne', 'borůvky'],
  'rybíz černý': ['spatne', 'borůvky'],
  'angrešt': ['spatne', 'borůvky'],
  'hroznové víno': ['ok', ''],
  'meloun vodní': ['ok', ''],
  'meloun cantaloupe': ['ok', ''],
  'papája': ['spatne', 'meloun'],
  'mango': ['ok', ''],
  'ananas': ['ok', ''],
  'kiwi': ['ok', ''],
  'pomeranč': ['ok', ''],
  'mandarinka': ['blizko', 'sdílí ikonu s pomerančem'],
  'citron': ['ok', ''],
  'limetka': ['spatne', 'žlutý citron'],
  'fík čerstvý': ['spatne', 'oliva'],
  'datle': ['spatne', 'fazole'],
  'rozinky': ['spatne', 'fazole'],
  'sušené meruňky': ['spatne', 'fazole'],
  'sušené švestky': ['spatne', 'fazole'],
  'brusinky sušené': ['spatne', 'fazole'],
  'jablečné pyré bez cukru': ['spatne', 'celé jablko'],

  // ── obiloviny ──────────────────────────────────────────────────────────
  'ovesné vločky jemné': ['spatne', 'miska s lžící'],
  'ovesné vločky velké': ['spatne', 'miska s lžící'],
  'oves bezlepkový': ['blizko', 'obilný klas'],
  'mouka pšeničná hladká': ['spatne', 'obilný klas'],
  'mouka pšeničná celozrnná': ['spatne', 'obilný klas'],
  'mouka špaldová': ['spatne', 'obilný klas'],
  'mouka žitná': ['spatne', 'obilný klas'],
  'chléb kváskový žitno-pšeničný': ['ok', ''],
  'chléb toustový': ['blizko', 'sdílí ikonu s kváskovým chlebem'],
  'rohlík / houska': ['blizko', 'bageta'],
  'těstoviny semolinové': ['blizko', 'špagety s omáčkou'],
  'těstoviny celozrnné': ['blizko', 'špagety s omáčkou'],
  'kuskus': ['spatne', 'vařená rýže'],
  'bulgur': ['spatne', 'vařená rýže'],
  'rýže basmati': ['ok', ''],
  'rýže kulatozrnná': ['blizko', 'sdílí ikonu s basmati'],
  'rýže natural': ['blizko', 'bílá rýže'],
  'rýžové chlebíčky': ['ok', ''],
  'jáhly': ['spatne', 'obilný klas'],
  'pohanka lámanka': ['spatne', 'obilný klas'],
  'pohanka kroupy': ['spatne', 'obilný klas'],
  'quinoa': ['spatne', 'obilný klas'],
  'amarant': ['spatne', 'obilný klas'],
  'polenta': ['blizko', 'kukuřičný klas'],
  'krupice pšeničná': ['spatne', 'miska s lžící'],
  'kroupy ječné': ['spatne', 'obilný klas'],

  // ── maso a ryby ────────────────────────────────────────────────────────
  'kuřecí prsa': ['spatne', 'stehno'],
  'kuřecí stehno': ['ok', ''],
  'krůtí prsa': ['spatne', 'živý krocan'],
  'krůtí stehno': ['spatne', 'živý krocan'],
  'hovězí zadní': ['ok', ''],
  'hovězí mleté': ['spatne', 'steak'],
  'telecí': ['blizko', 'steak, sdílí s hovězím'],
  'vepřová panenka': ['blizko', 'steak, sdílí s hovězím'],
  'vepřová kýta': ['blizko', 'steak, sdílí s hovězím'],
  'králík': ['spatne', 'maso na kosti'],
  'kachní prsa': ['spatne', 'živá kachna'],
  'jehněčí': ['blizko', 'maso na kosti'],
  'kuřecí játra': ['spatne', 'maso na kosti'],
  'telecí játra': ['spatne', 'maso na kosti'],
  'šunka od kosti': ['blizko', 'maso na kosti'],
  'losos': ['blizko', 'obecná ryba'],
  'pstruh duhový': ['blizko', 'obecná ryba'],
  'treska obecná': ['blizko', 'obecná ryba'],
  'treska tmavá': ['blizko', 'obecná ryba'],
  'candát': ['blizko', 'obecná ryba'],
  'štika': ['blizko', 'obecná ryba'],
  'kapr': ['blizko', 'obecná ryba'],
  'makrela': ['blizko', 'obecná ryba'],
  'tuňák': ['blizko', 'obecná ryba'],
  'sardinky v oleji': ['spatne', 'živá ryba místo konzervy'],
  'krevety': ['ok', ''],

  // ── luštěniny ──────────────────────────────────────────────────────────
  'čočka červená loupaná': ['spatne', 'fazole'],
  'čočka hnědá': ['spatne', 'fazole'],
  'čočka beluga': ['spatne', 'fazole'],
  'cizrna': ['spatne', 'fazole'],
  'fazole bílé': ['blizko', 'červená fazole'],
  'fazole červené kidney': ['ok', ''],
  'fazole adzuki': ['blizko', 'sdílí ikonu s kidney'],
  'fazolky mungo': ['blizko', 'sdílí ikonu s kidney'],
  'hrách žlutý půlený': ['spatne', 'fazole'],
  'hrách zelený sušený': ['spatne', 'fazole'],
  'sója edamame': ['ok', ''],
  'tofu natural': ['spatne', 'kostka ledu'],
  'tofu uzené': ['spatne', 'kostka ledu'],
  'tempeh': ['spatne', 'kostka ledu'],
  'mouka cizrnová': ['spatne', 'obilný klas'],
  'hummus domácí bez soli': ['spatne', 'miska s lžící'],

  // ── mléčné a vejce ─────────────────────────────────────────────────────
  'jogurt bílý plnotučný': ['blizko', 'sklenice mléka'],
  'jogurt řecký': ['blizko', 'sklenice mléka'],
  'kefír': ['blizko', 'sklenice mléka'],
  'tvaroh měkký': ['spatne', 'žlutý sýr s dírami'],
  'tvaroh polotučný': ['spatne', 'žlutý sýr s dírami'],
  'ricotta': ['spatne', 'žlutý sýr s dírami'],
  'mascarpone': ['spatne', 'žlutý sýr s dírami'],
  'cottage': ['spatne', 'žlutý sýr s dírami'],
  'mozzarella': ['spatne', 'žlutý sýr s dírami'],
  'žervé': ['spatne', 'žlutý sýr s dírami'],
  'eidam': ['ok', ''],
  'gouda': ['blizko', 'sdílí ikonu s eidamem'],
  'ementál': ['ok', ''],
  'parmazán': ['blizko', 'sýr s dírami místo tvrdého bloku'],
  'pecorino': ['blizko', 'sýr s dírami místo tvrdého bloku'],
  'grana padano': ['blizko', 'sýr s dírami místo tvrdého bloku'],
  'máslo': ['ok', ''],
  'ghí': ['blizko', 'sdílí ikonu s máslem'],
  'smetana ke šlehání': ['blizko', 'sklenice mléka'],
  'zakysaná smetana': ['blizko', 'sklenice mléka'],
  'kravské mléko': ['ok', ''],
  'vejce slepičí': ['ok', ''],

  // ── ořechy, semínka, tuky ──────────────────────────────────────────────
  'arašídové máslo 100% hladké': ['blizko', 'arašídy místo másla'],
  'mandlové máslo': ['spatne', 'arašídy'],
  'kešu máslo': ['spatne', 'arašídy'],
  'lískooříškové máslo': ['spatne', 'arašídy'],
  'tahini': ['spatne', 'miska s lžící'],
  'semínka lněná mletá': ['spatne', 'snítka bylinky'],
  'semínka chia': ['spatne', 'snítka bylinky'],
  'semínka konopná loupaná': ['spatne', 'snítka bylinky'],
  'semínka dýňová mletá': ['spatne', 'celá dýně'],
  'semínka slunečnicová mletá': ['spatne', 'květ slunečnice'],
  'sezam mletý': ['spatne', 'snítka bylinky'],
  'mák mletý': ['spatne', 'snítka bylinky'],
  'vlašské ořechy mleté': ['spatne', 'kaštan'],
  'mandle mleté': ['spatne', 'kaštan'],
  'olej olivový extra panenský': ['blizko', 'oliva místo oleje'],
  'olej řepkový lisovaný za studena': ['spatne', 'květ'],
  'olej dýňový': ['spatne', 'celá dýně'],
  'olej lněný': ['spatne', 'snítka bylinky'],
  'olej kokosový': ['blizko', 'kokos místo oleje'],
  'mléko kokosové': ['blizko', 'kokos místo mléka'],

  // ── bylinky a koření ───────────────────────────────────────────────────
  'petrželka hladkolistá': ['blizko', 'obecná snítka, stejná u všech bylinek'],
  'pažitka': ['blizko', 'obecná snítka, stejná u všech bylinek'],
  'kopr': ['blizko', 'obecná snítka, stejná u všech bylinek'],
  'bazalka': ['blizko', 'obecná snítka, stejná u všech bylinek'],
  'oregano': ['blizko', 'obecná snítka, stejná u všech bylinek'],
  'tymián': ['blizko', 'obecná snítka, stejná u všech bylinek'],
  'majoránka': ['blizko', 'obecná snítka, stejná u všech bylinek'],
  'rozmarýn': ['blizko', 'obecná snítka, stejná u všech bylinek'],
  'šalvěj': ['blizko', 'obecná snítka, stejná u všech bylinek'],
  'máta': ['blizko', 'obecná snítka, stejná u všech bylinek'],
  'libeček': ['blizko', 'obecná snítka, stejná u všech bylinek'],
  'bobkový list': ['blizko', 'obecný list'],
  'kmín mletý': ['spatne', 'obilný klas'],
  'kmín celý': ['spatne', 'obilný klas'],
  'koriandr mletý': ['spatne', 'obilný klas'],
  'skořice cejlonská': ['spatne', 'snítka bylinky'],
  'kurkuma': ['spatne', 'snítka bylinky'],
  'vanilka': ['spatne', 'snítka bylinky'],
  'zázvor': ['ok', ''],
  'paprika sladká mletá': ['spatne', 'pálivá chilli paprička'],

  // ── ostatní ────────────────────────────────────────────────────────────
  'voda': ['ok', ''],
  'dětský čaj bez cukru': ['ok', ''],
  'kokosový jogurt': ['spatne', 'celý kokos'],
  'kvasnice droždí': ['spatne', 'bochník chleba'],
  'prášek do pečiva': ['spatne', 'slánka — v aplikaci, která sůl zakazuje'],
  'jedlá soda': ['spatne', 'slánka — v aplikaci, která sůl zakazuje'],
  'kakao 100%': ['spatne', 'tabulka čokolády'],
  'karob': ['spatne', 'fazole'],
  'ocet jablečný': ['spatne', 'celé jablko'],
  'škrob kukuřičný': ['spatne', 'kukuřičný klas'],

  // ── zelenina ───────────────────────────────────────────────────────────
  'mrkev': ['ok', ''],
  'pastinák': ['spatne', 'oranžová mrkev'],
  'petržel kořen': ['spatne', 'oranžová mrkev'],
  'celer bulva': ['spatne', 'listová zelenina'],
  'červená řepa': ['spatne', 'oliva'],
  'batát': ['ok', ''],
  'brambor': ['ok', ''],
  'tuřín': ['spatne', 'brambor'],
  'dýně hokaido': ['blizko', 'halloweenská dýně'],
  'dýně máslová': ['blizko', 'halloweenská dýně'],
  'dýně špagetová': ['blizko', 'halloweenská dýně'],
  'cuketa': ['blizko', 'okurka'],
  'patizon': ['spatne', 'okurka'],
  'lilek': ['ok', ''],
  'brokolice': ['ok', ''],
  'květák': ['spatne', 'listová zelenina'],
  'kedlubna': ['spatne', 'listová zelenina'],
  'zelí bílé': ['blizko', 'listová zelenina'],
  'kapusta hlávková': ['blizko', 'listová zelenina'],
  'kapusta kadeřavá': ['blizko', 'listová zelenina'],
  'růžičková kapusta': ['spatne', 'listová zelenina'],
  'hrášek zelený': ['ok', ''],
  'fazolky zelené': ['blizko', 'lusk hrášku'],
  'kukuřice cukrová': ['ok', ''],
  'špenát': ['blizko', 'obecná listová zelenina'],
  'mangold': ['blizko', 'obecná listová zelenina'],
  'rukola': ['blizko', 'obecná listová zelenina'],
  'hlávkový salát': ['ok', ''],
  'okurka salátová': ['ok', ''],
  'rajče': ['ok', ''],
  'paprika sladká': ['ok', ''],
  'pórek': ['spatne', 'listová zelenina'],
  'cibule': ['ok', ''],
  'česnek': ['ok', ''],
  'fenykl hlíza': ['spatne', 'listová zelenina'],
  'chřest': ['spatne', 'klíček'],
  'žampiony': ['spatne', 'červená muchomůrka'],
  'hlíva ústřičná': ['spatne', 'červená muchomůrka'],
  'ředkvička': ['spatne', 'mísa salátu'],
  'artyčok': ['spatne', 'snítka bylinky'],
};

const jmena = new Set(ingredients.map((i) => i.nameCz));
const chybi = ingredients.filter((i) => VERDIKTY[i.nameCz] === undefined).map((i) => i.nameCz);
const navic = Object.keys(VERDIKTY).filter((n) => !jmena.has(n));

if (chybi.length > 0) {
  console.error('Bez verdiktu zůstalo ' + chybi.length + ' surovin:\n  ' + chybi.join('\n  '));
}
if (navic.length > 0) {
  console.error('Verdikt bez suroviny (' + navic.length + '):\n  ' + navic.join('\n  '));
}
if (chybi.length > 0 || navic.length > 0) process.exit(1);

const pocty: Record<Verdikt, number> = { ok: 0, blizko: 0, spatne: 0 };
const poKategoriich = new Map<string, Record<Verdikt, number>>();
for (const item of ingredients) {
  const [verdikt] = VERDIKTY[item.nameCz] as [Verdikt, string];
  pocty[verdikt] += 1;
  const radek = poKategoriich.get(item.category) ?? { ok: 0, blizko: 0, spatne: 0 };
  radek[verdikt] += 1;
  poKategoriich.set(item.category, radek);
}

console.log('KONTROLA IKON U SUROVIN\n');
console.log('kategorie               celkem   ok  blízko  špatně');
console.log('-----------------------------------------------------');
for (const [kategorie, radek] of poKategoriich) {
  const celkem = radek.ok + radek.blizko + radek.spatne;
  console.log(
    kategorie.padEnd(22) +
      String(celkem).padStart(7) +
      String(radek.ok).padStart(5) +
      String(radek.blizko).padStart(8) +
      String(radek.spatne).padStart(8),
  );
}
console.log('-----------------------------------------------------');
console.log(
  'CELKEM'.padEnd(22) +
    String(ingredients.length).padStart(7) +
    String(pocty.ok).padStart(5) +
    String(pocty.blizko).padStart(8) +
    String(pocty.spatne).padStart(8),
);
console.log('\nK PŘEKRESLENÍ: ' + (pocty.blizko + pocty.spatne) + ' z ' + ingredients.length);
