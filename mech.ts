import { vsechnyTexty } from './kontrola';

interface Pravidlo { jmeno: string; re: RegExp; poznamka: string }

/**
 * `\b` v JavaScriptu zná jen ASCII, takže „součást" mu vyjde jako hranice
 * mezi „sou" a „č". Česká hranice slova se musí psát přes lookaround nad
 * skutečnou abecedou, jinak jsou nálezy z devadesáti procent falešné.
 */
const P = 'a-zA-ZáčďéěíňóřšťúůýžÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ';
const H = (jadro: string): RegExp => new RegExp(`(?<![${P}])(?:${jadro})(?![${P}])`, 'gu');

const PRAVIDLA: Pravidlo[] = [
  { jmeno: 'rovné uvozovky', re: /"/g, poznamka: 'mají být „ a “' },
  { jmeno: 'tři tečky jako znaky', re: /\.\.\./g, poznamka: 'má být …' },
  { jmeno: 'dvojitá mezera', re: /  +/g, poznamka: 'jedna mezera' },
  { jmeno: 'mezera před interpunkcí', re: / [,.;:!?]/g, poznamka: 'mezera patří až za' },
  { jmeno: 'chybí mezera za čárkou', re: /,[^\s\d)"»“‘]/g, poznamka: 'za čárkou mezera' },
  { jmeno: 'spojovník místo pomlčky', re: /\s-\s/g, poznamka: 've větě patří – s mezerami' },
  { jmeno: 'rozsah se spojovníkem', re: /\d\s?-\s?\d/g, poznamka: 'rozsah je 5–7' },
  { jmeno: 'by jsi / by jste / bysme', re: H('by jsi|by jste|by jsme|bysme'), poznamka: 'bys / byste / bychom' },
  { jmeno: 'aby jsi / aby jste', re: H('aby jsi|aby jste|aby jsme|kdyby jsi|kdyby jste|kdyby jsme'), poznamka: 'abys / abyste / abychom' },
  { jmeno: 'standartní', re: /standart/gi, poznamka: 'standardní' },
  { jmeno: 'vyjímka', re: /vyjím[ke]/gi, poznamka: 'výjimka' },
  { jmeno: 'seš / sme / sou', re: H('seš|sme|sou|dyž|méno'), poznamka: 'obecná čeština' },
  { jmeno: 'na denní bázi', re: /na\s+denní\s+bázi/gi, poznamka: 'kalk z angličtiny' },
  { jmeno: 'apostrof rovný', re: /'/g, poznamka: 'má být ’' },
  { jmeno: 'zdvojená mezera před koncem', re: /\s$/g, poznamka: 'mezera na konci řetězce' },
  { jmeno: 'mezera na začátku', re: /^\s/g, poznamka: 'mezera na začátku řetězce' },
  { jmeno: 'dvojtá interpunkce', re: /([,.!?;:])\1+/g, poznamka: 'zdvojený znak' },
  { jmeno: 'opakované slovo', re: new RegExp(`(?<![${P}])([${P}]{3,})\\s+\\1(?![${P}])`, 'giu'), poznamka: 'slovo dvakrát za sebou' },
  { jmeno: 'nashledanou', re: /nashledanou/gi, poznamka: 'na shledanou' },
  { jmeno: 'jedno-li', re: H('nez|zada|nekdy|prosim|nejaky'), poznamka: 'chybí diakritika' },
  { jmeno: 'chybí tečka na konci věty', re: /[a-zážčřďťňéíóúůý]$/u, poznamka: 'věta bez tečky' },
];

const texty = vsechnyTexty();
const nalezy = new Map<string, { misto: string; ukazka: string }[]>();

for (const { misto, text } of texty) {
  for (const p of PRAVIDLA) {
    // krátké popisky (názvy, množství, tagy) nekončí tečkou záměrně
    if (p.jmeno === 'chybí tečka na konci věty') {
      const kratky = /\/(nameCz|altNamesCz|servings|frequencyLimit|amount|titleCz)|prepIdeas|keyPoints|heading/.test(misto);
      if (kratky || text.length < 45) continue;
    }
    p.re.lastIndex = 0;
    const m = p.re.exec(text);
    if (m !== null) {
      const kolem = text.slice(Math.max(0, m.index - 35), m.index + m[0].length + 35);
      const seznam = nalezy.get(p.jmeno) ?? [];
      seznam.push({ misto, ukazka: `…${kolem}…` });
      nalezy.set(p.jmeno, seznam);
    }
  }
}

console.log(`Zkontrolováno ${texty.length} řetězců.\n`);
let celkem = 0;
for (const p of PRAVIDLA) {
  const s = nalezy.get(p.jmeno);
  if (s === undefined) continue;
  celkem += s.length;
  console.log(`### ${p.jmeno} — ${s.length}× (${p.poznamka})`);
  for (const n of s.slice(0, 8)) console.log(`   ${n.misto}\n     ${n.ukazka}`);
  if (s.length > 8) console.log(`   … a dalších ${s.length - 8}`);
  console.log();
}
console.log(`NÁLEZŮ CELKEM: ${celkem}`);
