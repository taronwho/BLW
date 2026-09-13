import { vsechnyTexty } from './kontrola';

const P = 'a-zA-ZáčďéěíňóřšťúůýžÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ';
const H = (jadro: string): RegExp => new RegExp(`(?<![${P}])(?:${jadro})(?![${P}])`, 'giu');

interface Pravidlo { jmeno: string; re: RegExp; poznamka: string }

const PRAVIDLA: Pravidlo[] = [
  // shoda se středním rodem
  { jmeno: 'dítě + mužský/ženský tvar', re: new RegExp(`(?<![${P}])(dítě|batole|miminko)(?![${P}])[^.!?]{0,60}(?<![${P}])(spokojený|spokojená|unavený|unavená|zvyklý|zvyklá|schopný|schopná|hotový|hotová|připravený|připravená|sám|sama)(?![${P}])`, 'giu'), poznamka: 'střední rod: spokojené, zvyklé, samo' },
  { jmeno: 'dítě + příčestí v -l/-la', re: new RegExp(`(?<![${P}])(dítě|batole|miminko)(?![${P}])\\s+(?:si\\s+|se\\s+)?(?:už\\s+|ještě\\s+|zatím\\s+)?(?<![${P}])([${P}]{3,}(?:al|il|el|ěl|ul|yl|la|ila|ala))(?![${P}])`, 'gu'), poznamka: 'střední rod: -lo' },
  // spřežky
  { jmeno: 'vtom / v tom', re: H('vtom'), poznamka: 'vtom = náhle; jinak „v tom“' },
  { jmeno: 'přitom / při tom', re: H('přitom'), poznamka: 'zkontrolovat význam' },
  { jmeno: 'zatím / za tím', re: H('za tím'), poznamka: 'zkontrolovat význam' },
  // vazby sloves
  { jmeno: 'zabránit + 4. pád', re: new RegExp(`zabrán[ií][${P}]*\\s+(?:tomu\\s+)?(?<![${P}])(to|ho|je|ji)(?![${P}])`, 'giu'), poznamka: 'zabránit něčemu (3. pád)' },
  { jmeno: 'vyhnout se + 4. pád', re: new RegExp(`vyhn[ěu][${P}]*\\s+se\\s+(?<![${P}])[${P}]*(?:u|a)(?![${P}])`, 'giu'), poznamka: 'vyhnout se něčemu (3. pád)' },
  { jmeno: 'diskutovat něco', re: H('diskutovat [a-zž]+'), poznamka: 'diskutovat o něčem' },
  // kalky
  { jmeno: 'kalk: adresovat problém', re: H('adresovat'), poznamka: 'kalk z angličtiny' },
  { jmeno: 'kalk: v neposlední řadě', re: /v\s+neposlední\s+řadě/giu, poznamka: 'klišé' },
  { jmeno: 'kalk: dává to smysl', re: /dává\s+(to\s+)?smysl/giu, poznamka: 'kalk — zvážit' },
  { jmeno: 'kalk: jeden z nejvíce', re: /jeden\s+z\s+nejvíce/giu, poznamka: 'jeden z nej…ejších' },
  { jmeno: 'kalk: být schopen + inf.', re: /(?:je|jsou|byl[aoi]?)\s+schop[ne][${P}]*\s/giu, poznamka: 'čeština řekne „zvládne“' },
  // pravopis
  { jmeno: 'mě / mně', re: H('mně|mě'), poznamka: 'zkontrolovat pád' },
  { jmeno: 's sebou / sebou', re: H('sebou'), poznamka: 'zkontrolovat vazbu' },
  { jmeno: 'zpráva / správa', re: H('zpráv[ay]|správ[ay]'), poznamka: 'zkontrolovat význam' },
  // číslovky
  { jmeno: 'číslovka 2–4 + 2. pád', re: /(?:dva|dvě|tři|čtyři)\s+(?:lžic|kousk|minut|dílk|hodin)[yů]\b/giu, poznamka: 'dvě lžíce, tři kousky' },
  { jmeno: 'číslovka 5+ s 1. pádem', re: /(?:pět|šest|sedm|osm|devět|deset)\s+(?:lžíce|kousky|minuty|hodiny|dílky)(?![${P}])/giu, poznamka: '5 lžic, 5 minut' },
  // opakování ve stejném řetězci
  { jmeno: 'stejné slovo 3× v jedné větě', re: new RegExp(`(?<![${P}])([${P}]{5,})(?![${P}])(?:[^.!?]*?(?<![${P}])\\1(?![${P}])){2}`, 'giu'), poznamka: 'opakování' },
];

const texty = vsechnyTexty();
const nalezy = new Map<string, { misto: string; ukazka: string }[]>();
for (const { misto, text } of texty) {
  for (const p of PRAVIDLA) {
    p.re.lastIndex = 0;
    let m: RegExpExecArray | null = p.re.exec(text);
    while (m !== null) {
      const kolem = text.slice(Math.max(0, m.index - 40), m.index + m[0].length + 40);
      const s = nalezy.get(p.jmeno) ?? [];
      s.push({ misto, ukazka: `…${kolem}…` });
      nalezy.set(p.jmeno, s);
      if (!p.re.global) break;
      m = p.re.exec(text);
    }
  }
}
let celkem = 0;
for (const p of PRAVIDLA) {
  const s = nalezy.get(p.jmeno);
  if (s === undefined) continue;
  celkem += s.length;
  console.log(`### ${p.jmeno} — ${s.length}× (${p.poznamka})`);
  for (const n of s.slice(0, 6)) console.log(`   ${n.misto}\n     ${n.ukazka}`);
  if (s.length > 6) console.log(`   … a dalších ${s.length - 6}`);
  console.log();
}
console.log(`KANDIDÁTŮ CELKEM: ${celkem} (nutno posoudit ručně)`);
