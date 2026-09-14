import { describe, expect, it } from 'vitest';
import { migrateHouseholdState, SCHEMA_VERSION } from '../../src/sync/merge';

describe('převod staršího stavu', () => {
  it('z pole oblíbených udělá mapu se značkou času', () => {
    const stary = {
      childName: 'Anna',
      childBirthDate: '2026-01-10',
      members: ['uid-1'],
      tastings: [],
      favorites: ['brokolice', 'mrkev'],
      recipeNotes: { placky: 'moc jich neudělá' },
      schemaVersion: 1,
    };

    const novy = migrateHouseholdState(stary);

    expect(novy.schemaVersion).toBe(SCHEMA_VERSION);
    expect(novy.childName).toBe('Anna');
    expect(novy.favorites['brokolice']).toEqual({ hodnota: true, kdy: 0 });
    expect(novy.recipeNotes['placky']).toEqual({ hodnota: 'moc jich neudělá', kdy: 0 });
    // Čas 0 znamená „od nepaměti", takže jakékoli pozdější přepnutí vyhraje.
    expect(novy.favorites['mrkev']?.kdy).toBe(0);
  });

  it('dnešní tvar nechá být', () => {
    const dnesni = {
      ...migrateHouseholdState({}),
      favorites: { brokolice: { hodnota: false, kdy: 500 } },
    };
    expect(migrateHouseholdState(dnesni).favorites['brokolice']).toEqual({
      hodnota: false,
      kdy: 500,
    });
  });

  it('z cizího souboru udělá prázdný stav místo pádu', () => {
    // Rodič vybere jiný JSON. Dřív se slučování rozbilo na tom, že
    // `favorites` není pole, a chyba se k němu nedostala.
    for (const nesmysl of [null, [], 42, 'text', { foo: 1 }, { favorites: 'ne' }]) {
      const vysledek = migrateHouseholdState(nesmysl);
      expect(vysledek.favorites).toEqual({});
      expect(vysledek.tastings).toEqual([]);
      expect(vysledek.schemaVersion).toBe(SCHEMA_VERSION);
    }
  });

  it('zachová ochutnávky, ale zahodí záznamy bez id', () => {
    const vysledek = migrateHouseholdState({
      tastings: [
        { id: 'a', ingredientId: 'mrkev', date: '2026-09-01', amount: 'ochutnala', reaction: 'zadna', createdBy: 'u', createdAt: 1 },
        { neco: 'jiného' },
      ],
    });
    expect(vysledek.tastings).toHaveLength(1);
    expect(vysledek.tastings[0]?.id).toBe('a');
  });
});
