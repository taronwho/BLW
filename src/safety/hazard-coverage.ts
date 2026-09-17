import type { Hazard } from '@/types';

/**
 * Povinné hazardy podle tabulky zákazů v `docs/BEZPECNOST.md` kapitola 2.
 *
 * Proč to vůbec existuje: katalog vede několik položek právě proto, aby
 * řekl, že se do dvanácti měsíců nepoužívají — med, sůl, cukr, sirup,
 * bujón. Jejich texty to říkaly správně, jenže **jen v próze**, a pole
 * `hazards` u nich zůstalo prázdné. Štítek rizika se tím u nich nezobrazil,
 * filtrovat podle hazardu nešly a pravidla, která nad `hazards` počítají
 * (`mercury-limit`, `nitrate-note`), na ně nedosáhla. Hazard `botulismus`
 * byl kvůli tomu v typu i v dokumentaci, ale v datech nula ×.
 *
 * Tabulka je schválně psaná po položkách, ne odvozená z textu. Odvozování
 * ze slov v próze by u téhle věci znamenalo hádat: „sůl" se v textu objeví
 * i u suroviny, která jen říká „nesol to", a takový nález by pravidlo
 * udělal buď děravé, nebo hlučné. Zápis po id je krátký, čitelný a nedá se
 * splést — a když přibude další zakázaná položka, musí se sem dopsat, což
 * je přesně ta chvíle, kdy si toho má někdo všimnout.
 *
 * Co sem naopak **nepatří**: položka, jejíž riziko žádný z deseti hazardů
 * nepopisuje. Vymýšlet pro ni hazard „skoro odpovídající" by bylo horší než
 * ho nemít — viz `mleko-kozi` v poznámce pod tabulkou.
 */
export const POVINNE_HAZARDY: Readonly<Record<string, readonly Hazard[]>> = {
  // „Med (i pečený, i v pečivu) — Clostridium botulinum, kojenecký
  // botulismus" (BEZPECNOST.md kap. 2).
  med: ['botulismus'],

  // „Přidaná sůl, bujóny, kostky, sójová omáčka, uzeniny — zátěž ledvin"
  // (BEZPECNOST.md kap. 2). Sójová omáčka ani uzeniny v katalogu nejsou;
  // až přibudou, patří sem taky.
  sul: ['sul'],
  'bujon-kostka': ['sul'],

  // „Přidaný cukr, sirupy, javorový sirup, agáve — zuby, návyk na sladkou
  // chuť" (BEZPECNOST.md kap. 2). Agávový sirup katalog zatím nevede.
  'cukr-krystal': ['cukr'],
  'javorovy-sirup': ['cukr'],
};

/**
 * Kozí mléko v tabulce **není**, a je to záměr.
 *
 * Do roka se nedává jako hlavní nápoj, ale důvod, který uvádějí jeho
 * vlastní zdroje, je nedostatek železa a dalších látek — a na to žádný
 * z deseti hazardů není. Nejbližší `nepasterizovane` mluví o něčem jiném
 * a jeho zdroje to o kozím mléce netvrdí, takže by to byl vymyšlený údaj
 * (CLAUDE.md, pravidlo 1). Věk zavedení u něj drží `minAgeMonths: 12`
 * a vysvětlení nese text fáze, což je poctivější než falešný štítek.
 */
export const BEZ_HAZARDU_ZAMERNE: Readonly<Record<string, string>> = {
  'mleko-kozi':
    'Do roka se nedává jako hlavní nápoj kvůli nízkému obsahu železa; žádný z deseti hazardů tohle nepopisuje a vymýšlet nový se nebude.',
};

/** Hazardy, které daná surovina mít musí. Prázdné pole, když žádné. */
export function povinneHazardy(ingredientId: string): readonly Hazard[] {
  return POVINNE_HAZARDY[ingredientId] ?? [];
}
