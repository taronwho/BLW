/** Sběr všech textů viditelných v aplikaci, s přesnou adresou. */
import { ingredients, recipes } from '@/data';
import { guides } from '@/data/guides';

export interface Kus { misto: string; text: string }

export function vsechnyTexty(): Kus[] {
  const out: Kus[] = [];
  const add = (misto: string, text?: string): void => {
    if (text !== undefined && text.trim().length > 0) out.push({ misto, text });
  };

  for (const i of ingredients) {
    add(`surovina/${i.id}/nameCz`, i.nameCz);
    i.altNamesCz.forEach((v, n) => add(`surovina/${i.id}/altNamesCz[${n}]`, v));
    add(`surovina/${i.id}/chokingReason`, i.chokingReason);
    add(`surovina/${i.id}/frequencyLimit`, i.frequencyLimit);
    add(`surovina/${i.id}/reviewNote`, i.reviewNote);
    i.prepIdeas.forEach((v, n) => add(`surovina/${i.id}/prepIdeas[${n}]`, v));
    (['6m', '9m', '12m'] as const).forEach((s) => {
      add(`surovina/${i.id}/prep.${s}.serving`, i.prep[s].serving);
      add(`surovina/${i.id}/prep.${s}.caution`, i.prep[s].caution);
    });
    for (const [k, v] of Object.entries(i.hazardNotes)) add(`surovina/${i.id}/hazardNotes.${k}`, v);
  }

  for (const r of recipes) {
    add(`recept/${r.id}/titleCz`, r.titleCz);
    add(`recept/${r.id}/servings`, r.servings);
    add(`recept/${r.id}/babySplitPoint`, r.babySplitPoint);
    add(`recept/${r.id}/vegetarianProteinSwap`, r.vegetarianProteinSwap);
    r.baseSteps.forEach((v, n) => add(`recept/${r.id}/baseSteps[${n}]`, v));
    r.babySteps.forEach((v, n) => add(`recept/${r.id}/babySteps[${n}]`, v));
    r.meatSteps.forEach((v, n) => add(`recept/${r.id}/meatSteps[${n}]`, v));
    r.vegetarianSteps.forEach((v, n) => add(`recept/${r.id}/vegetarianSteps[${n}]`, v));
    r.ingredients.forEach((x, n) => {
      add(`recept/${r.id}/ingredients[${n}].amount`, x.amount);
      add(`recept/${r.id}/ingredients[${n}].note`, x.note);
    });
    (['6m', '9m', '12m'] as const).forEach((s) =>
      add(`recept/${r.id}/babyServing.${s}`, r.babyServing[s]),
    );
  }

  for (const g of guides) {
    add(`rada/${g.id}/titleCz`, g.titleCz);
    add(`rada/${g.id}/summary`, g.summary);
    g.keyPoints.forEach((v, n) => add(`rada/${g.id}/keyPoints[${n}]`, v));
    g.sections.forEach((s, n) => {
      add(`rada/${g.id}/sections[${n}].heading`, s.heading);
      s.body.forEach((v, m) => add(`rada/${g.id}/sections[${n}].body[${m}]`, v));
    });
  }

  return out;
}
