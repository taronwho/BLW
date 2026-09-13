import { ingredients, recipes } from '@/data';
import { guides } from '@/data/guides';

const P = 'a-zA-ZáčďéěíňóřšťúůýžÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ';
const H = (j: string): RegExp => new RegExp(`(?<![${P}])(?:${j})(?![${P}])`, 'iu');
const nalezy: string[] = [];
const hlas = (s: string): void => { nalezy.push(s); };

// 1) Terminologie podle fáze: „batole“ je dítě od roku, do 6m a 9m textů nepatří.
for (const i of ingredients) {
  for (const faze of ['6m', '9m'] as const) {
    const t = i.prep[faze];
    for (const [pole, text] of [['serving', t.serving], ['caution', t.caution]] as const) {
      if (text !== undefined && H('batole|batolete|batoleti|batolecí').test(text)) {
        hlas(`[termín] surovina/${i.id}/prep.${faze}.${pole}: „batole“ ve fázi ${faze} — batole je dítě od 12 měsíců`);
      }
    }
  }
  // opačně: ve 12m fázi „miminko“ působí nesourodě
  const dvanact = i.prep['12m'].serving;
  if (H('miminko|miminku|miminkem').test(dvanact)) {
    hlas(`[termín] surovina/${i.id}/prep.12m.serving: „miminko“ ve fázi 12m`);
  }
}
for (const r of recipes) {
  for (const faze of ['6m', '9m'] as const) {
    if (H('batole|batoleti|batolete').test(r.babyServing[faze])) {
      hlas(`[termín] recept/${r.id}/babyServing.${faze}: „batole“ ve fázi ${faze}`);
    }
  }
}

// 2) Text zmiňuje nižší věk, než jaký surovina dovoluje.
for (const i of ingredients) {
  const vsechny = [i.chokingReason ?? '', ...i.prepIdeas, ...(['6m','9m','12m'] as const).flatMap(s => [i.prep[s].serving, i.prep[s].caution ?? ''])];
  for (const text of vsechny) {
    const m = /od\s+(\d{1,2})\s+měsíc/iu.exec(text);
    if (m !== null) {
      const uvedeny = Number(m[1]);
      if (uvedeny < i.minAgeMonths) {
        hlas(`[věk] surovina/${i.id}: text říká „od ${uvedeny} měsíců“, ale minAgeMonths je ${i.minAgeMonths} — „…${text.slice(Math.max(0,m.index-40), m.index+50)}…“`);
      }
    }
  }
}

// 3) babySplitPoint odkazuje na krok, který v baseSteps neexistuje.
for (const r of recipes) {
  const m = /po\s+kroku\s+(\d+)/iu.exec(r.babySplitPoint);
  if (m !== null) {
    const krok = Number(m[1]);
    if (krok > r.baseSteps.length) {
      hlas(`[krok] recept/${r.id}: odběr „po kroku ${krok}“, ale společný postup má jen ${r.baseSteps.length} kroků`);
    }
  } else {
    hlas(`[krok] recept/${r.id}: babySplitPoint neurčuje číslo kroku — „${r.babySplitPoint.slice(0,70)}…“`);
  }
}

// 4) Rozpor: dětská linie podává něco, co bezpečnostní text zakazuje.
for (const r of recipes) {
  const detske = [r.babySplitPoint, ...r.babySteps, ...Object.values(r.babyServing)].join(' ');
  if (H('nepodávej|nenabízej|nedávej').test(detske) && !/ani|místo|jen|zůstáv|nepatří|mimo/iu.test(detske)) {
    hlas(`[rozpor] recept/${r.id}: dětská linie obsahuje zákaz bez náhrady — zkontrolovat`);
  }
}

// 5) Čas receptu proti součtu časů v krocích.
for (const r of recipes) {
  const kroky = [...r.baseSteps, ...r.meatSteps, ...r.vegetarianSteps].join(' ');
  let soucet = 0;
  const re = /(\d{1,3})\s*(minut|hodin)/giu;
  let m: RegExpExecArray | null = re.exec(kroky);
  while (m !== null) {
    soucet += Number(m[1]) * (m[2].startsWith('hodin') ? 60 : 1);
    m = re.exec(kroky);
  }
  if (soucet > r.timeMinutes * 1.6 && soucet - r.timeMinutes > 25) {
    hlas(`[čas] recept/${r.id}: uvedeno ${r.timeMinutes} min, ale kroky jmenují dohromady ${soucet} min`);
  }
}

// 6) Rady: prázdné nebo osamocené sekce, odkaz na neexistující radu.
const ids = new Set(guides.map(g => g.id));
for (const g of guides) {
  for (const s of g.sections) {
    if (s.asList === true && s.body.length < 2) hlas(`[rada] ${g.id}: sekce „${s.heading}“ je seznam o jedné položce`);
  }
  const cely = [g.summary, ...g.keyPoints, ...g.sections.flatMap(s => s.body)].join(' ');
  for (const m of cely.matchAll(/\/rady\/([a-z0-9-]+)/g)) {
    if (!ids.has(m[1] as string)) hlas(`[rada] ${g.id}: odkaz na neexistující radu „${m[1]}“`);
  }
}

// 7) Suroviny: stejný text ve dvou fázích (fáze se má lišit).
for (const i of ingredients) {
  const s6 = i.prep['6m'].serving.trim();
  const s9 = i.prep['9m'].serving.trim();
  const s12 = i.prep['12m'].serving.trim();
  if (s6 === s9 || s9 === s12 || s6 === s12) hlas(`[fáze] surovina/${i.id}: dvě fáze mají doslova stejný pokyn`);
}

console.log(nalezy.length === 0 ? 'Bez nálezů.' : nalezy.join('\n'));
console.log(`\nNÁLEZŮ: ${nalezy.length}`);
