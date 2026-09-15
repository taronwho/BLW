import { describe, expect, it } from 'vitest';
import { ingredientById, recipeById } from '../../src/data';
import { nutrientProfile } from '../../src/data/nutrients';
import { recipeNutrients } from '../../src/data/recipeNutrients';
import { jinyDen, noveSuroviny, sestavPlan, type VstupPlanu } from '../../src/plan/generator';
import { DNU_V_BLOKU, odlozDen, type Plan, type PlanDen } from '../../src/plan/typy';
import type { AllergenGroup, Child } from '../../src/types';

/**
 * Plán je datová vrstva jako každá jiná: pravidla z docs/BEZPECNOST.md se na
 * něj vztahují stejně jako na katalog. Když některý z těchhle testů spadne,
 * opravuje se generátor, ne test.
 */

const DITE: Child = { id: 'dite-test', name: 'Testovací', birthDate: '2026-03-01' };

function vstup(patch: Partial<VstupPlanu> = {}): VstupPlanu {
  return {
    dite: DITE,
    blok: 1,
    ochutnane: new Set<string>(),
    mesice: 8,
    mesicVRoce: 9,
    dnes: '2026-09-15',
    ...patch,
  };
}

/** Všechny suroviny, které se ten den objeví, i skrz recepty. */
function surovinyDne(den: PlanDen): string[] {
  const out = new Set<string>(noveSuroviny(den));
  for (const jidlo of den.jidla) {
    for (const ref of recipeById.get(jidlo.recipeId ?? '')?.ingredients ?? []) {
      out.add(ref.ingredientId);
    }
  }
  return [...out];
}

function maZelezo(den: PlanDen): boolean {
  return den.jidla.some((jidlo) => {
    const recept = recipeById.get(jidlo.recipeId ?? '');
    if (recept !== undefined) return recipeNutrients(recept).iron !== 'nevyznamny';
    const surovina = ingredientById.get(jidlo.ingredientId ?? '');
    return surovina !== undefined && nutrientProfile(surovina).iron !== 'nevyznamny';
  });
}

describe('sestavení třicetidenního plánu', () => {
  const plan = sestavPlan(vstup());

  it('má třicet dnů a každý z nich nabízí aspoň jedno jídlo', () => {
    expect(plan.dny).toHaveLength(DNU_V_BLOKU);
    expect(plan.dny.map((den) => den.cislo)).toEqual(
      Array.from({ length: DNU_V_BLOKU }, (_, i) => i + 1),
    );
    for (const den of plan.dny) expect(den.jidla.length).toBeGreaterThan(0);
  });

  it('zavádí právě jednu novou surovinu denně a nikdy ji neopakuje', () => {
    const novinky = plan.dny.map((den) => den.novinka);
    expect(novinky.every((id) => typeof id === 'string')).toBe(true);
    expect(new Set(novinky).size).toBe(DNU_V_BLOKU);
  });

  it('první týden jsou samotná sousta z rady o prvních potravinách', () => {
    const prvni = plan.dny.slice(0, 7);
    for (const den of prvni) {
      expect(den.jidla).toHaveLength(1);
      expect(den.jidla[0]?.recipeId).toBeUndefined();
      expect(den.jidla[0]?.duvod).toBe('prvni-ochutnavka');
    }
    expect(prvni.map((den) => den.novinka)).toEqual([
      'brokolice',
      'kvetak',
      'cuketa',
      'brambor',
      'dyne-hokaido',
      'batat',
      'avokado',
    ]);
  });

  it('od chvíle, kdy se začne vařit, je v každém dni železo', () => {
    for (const den of plan.dny.slice(7)) {
      expect(maZelezo(den), `den ${den.cislo} je bez železa`).toBe(true);
    }
  });

  it('nenabídne nic s vysokým rizikem dušení jako novinku', () => {
    for (const den of plan.dny) {
      const novinka = ingredientById.get(den.novinka ?? '');
      expect(novinka?.chokingRisk).not.toBe('high');
    }
  });

  it('klíčové alergeny zavede brzy a každý pak ještě dvakrát zopakuje', () => {
    const zavedene = new Map<AllergenGroup, number>();
    for (const den of plan.dny) {
      for (const skupina of ingredientById.get(den.novinka ?? '')?.allergens ?? []) {
        if (!zavedene.has(skupina)) zavedene.set(skupina, den.cislo);
      }
    }
    expect(zavedene.has('vejce')).toBe(true);
    expect(zavedene.get('vejce')).toBeLessThanOrEqual(10);

    const expozice = plan.dny
      .filter((den) => den.opakovanyAlergen !== undefined)
      .map((den) => den.cislo);
    expect(expozice.length).toBeGreaterThanOrEqual(6);
    // Expozice se plánují tři a sedm dnů po zavedení, takže dvě po sobě
    // nikdy nepadnou na týž den.
    expect(new Set(expozice).size).toBe(expozice.length);
  });

  it('dva nové alergeny nepřijdou dva dny po sobě', () => {
    const zavedene = new Set<AllergenGroup>();
    let predchoziNovy = false;
    for (const den of plan.dny) {
      const skupiny = ingredientById.get(den.novinka ?? '')?.allergens ?? [];
      const novy = skupiny.some((skupina) => !zavedene.has(skupina));
      expect(novy && predchoziNovy, `dny ${den.cislo - 1} a ${den.cislo}`).toBe(false);
      for (const skupina of skupiny) zavedene.add(skupina);
      predchoziNovy = novy;
    }
  });

  it('ze stejného vstupu vyjde vždycky stejný plán', () => {
    expect(sestavPlan(vstup())).toEqual(sestavPlan(vstup()));
  });

  it('další blok nabídne jiné suroviny než ten předchozí', () => {
    const prvni = sestavPlan(vstup());
    const ochutnane = new Set(prvni.dny.flatMap((den) => noveSuroviny(den)));
    const druhy = sestavPlan(vstup({ blok: 2, ochutnane, mesice: 9 }));
    for (const den of druhy.dny) {
      expect(ochutnane.has(den.novinka ?? '')).toBe(false);
    }
    expect(druhy.dny.every((den) => den.jidla.every((jidlo) => jidlo.duvod !== 'prvni-ochutnavka'))).toBe(
      true,
    );
  });

  it('jeden recept nepadne dvakrát za sebou ani dvakrát v týdnu', () => {
    const naposledy = new Map<string, number>();
    for (const den of plan.dny) {
      const dnesni = den.jidla.map((jidlo) => jidlo.recipeId).filter((id) => id !== undefined);
      expect(new Set(dnesni).size).toBe(dnesni.length);
      for (const id of dnesni) {
        const kdy = naposledy.get(id as string);
        if (kdy !== undefined) expect(den.cislo - kdy).toBeGreaterThan(6);
        naposledy.set(id as string, den.cislo);
      }
    }
  });
});

describe('alergie dítěte', () => {
  const alergik: Child = { ...DITE, allergens: ['mleko', 'vejce', 'psenice-lepek'] };
  const plan = sestavPlan(vstup({ dite: alergik, mesice: 10 }));

  it('vyloučený alergen se neobjeví ani jako složka receptu', () => {
    for (const den of plan.dny) {
      for (const id of surovinyDne(den)) {
        const surovina = ingredientById.get(id);
        for (const skupina of surovina?.allergens ?? []) {
          expect(
            ['mleko', 'vejce', 'psenice-lepek'].includes(skupina),
            `den ${den.cislo}: ${id} nese ${skupina}`,
          ).toBe(false);
        }
      }
    }
  });

  it('plán zůstane plnohodnotný i s vyloučenými alergeny', () => {
    expect(plan.dny).toHaveLength(DNU_V_BLOKU);
    for (const den of plan.dny) expect(den.jidla.length).toBeGreaterThanOrEqual(1);
  });
});

describe('zásahy rodiče do hotového plánu', () => {
  const plan = sestavPlan(vstup({ mesice: 10 }));

  it('jiný den nechá novinku i po tom, co se deník mezitím rozrostl', () => {
    // Rodič odškrtl prvních deset dnů i se zápisem do deníku. Čerstvý plán
    // proto začíná až jedenáctou surovinou a náhrada dne 15 se nesmí hledat
    // podle čísla, jinak se trefí do úplně jiného jídla.
    const puvodni = plan.dny[14] as PlanDen;
    const posunute = new Set(plan.dny.slice(0, 10).flatMap((den) => noveSuroviny(den)));
    const upraveny = jinyDen(plan, 15, vstup({ mesice: 10, ochutnane: posunute }), 2);
    expect((upraveny.dny[14] as PlanDen).novinka).toBe(puvodni.novinka);
  });

  it('jiný den nechá novinku, ale vymění recepty', () => {
    const puvodni = plan.dny[14] as PlanDen;
    const upraveny = jinyDen(plan, 15, vstup({ mesice: 10 }), 1);
    const novy = upraveny.dny[14] as PlanDen;
    expect(novy.novinka).toBe(puvodni.novinka);
    expect(novy.jidla.map((j) => j.recipeId)).not.toEqual(puvodni.jidla.map((j) => j.recipeId));
    // Ostatní dny zůstávají netknuté.
    expect(upraveny.dny[13]).toEqual(plan.dny[13]);
  });

  it('odložený den si vymění obsah s tím následujícím', () => {
    const posunuty = odlozDen(plan, 3);
    expect(posunuty.dny[2]?.novinka).toBe(plan.dny[3]?.novinka);
    expect(posunuty.dny[3]?.novinka).toBe(plan.dny[2]?.novinka);
    expect(posunuty.dny.map((den) => den.cislo)).toEqual(plan.dny.map((den) => den.cislo));
  });

  it('poslední den se odložit nedá, protože není kam', () => {
    const hotovy: Plan = {
      ...plan,
      stavy: Object.fromEntries(
        plan.dny.slice(0, 29).map((den) => [String(den.cislo), { hodnota: 'hotovo' as const, kdy: 1 }]),
      ),
    };
    expect(odlozDen(hotovy, 30)).toEqual(hotovy);
  });
});
