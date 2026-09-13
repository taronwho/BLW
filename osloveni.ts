import { vsechnyTexty } from './kontrola';
const P = 'a-zA-ZáčďéěíňóřšťúůýžÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ';
// Rozkazovací způsob: 2. os. j. č. (tykání) vs. 2. os. mn. č. (vykání).
const VYKANI = new RegExp(`(?<![${P}])(podávejte|nabídněte|zkontrolujte|nakrájejte|krájejte|dejte|nechte|vmíchejte|proberte|volejte|kombinujte|nastavte|počkejte|sledujte|držte|vyhněte|začněte|udělejte|přidejte|odeberte|vyzkoušejte|používejte|nepodávejte|nedávejte|nenabízejte|nesahejte|zůstaňte)(?![${P}])`, 'giu');
const TYKANI = new RegExp(`(?<![${P}])(podávej|nabídni|zkontroluj|nakrájej|krájej|dej|nech|vmíchej|prober|volej|kombinuj|nastav|počkej|sleduj|drž|vyhni|začni|udělej|přidej|odeber|vyzkoušej|používej|nepodávej|nedávej|nenabízej|nesahej|zůstaň)(?![${P}])`, 'giu');

let tyk = 0, vyk = 0;
const vykaMista: { misto: string; slovo: string; ukazka: string }[] = [];
for (const { misto, text } of vsechnyTexty()) {
  tyk += (text.match(TYKANI) ?? []).length;
  for (const m of text.matchAll(VYKANI)) {
    vyk += 1;
    vykaMista.push({ misto, slovo: m[0], ukazka: text.slice(Math.max(0, m.index - 45), m.index + 55) });
  }
}
console.log(`DATA — tykání: ${tyk}× | vykání: ${vyk}×`);
for (const v of vykaMista) console.log(`   ${v.misto}  [${v.slovo}]\n     …${v.ukazka}…`);
