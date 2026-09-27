# Obrázky k průvodci tvarem sousta

Průvodce `/tvar-sousta`, panel „Tvar podle úchopu" u suroviny a zkouška
měkkosti berou obrázky ze souborů v `src/assets/sousto/`. Dokud soubor
chybí, **ruka se neukáže vůbec** a jídlo dostane jednoduchou kresbu v SVG.
Kreslené ruce z geometrických tvarů jsme zahodili: nevypadaly jako ruce.

## Jak obrázek přidat

1. Vygeneruj ho podle zadání níž. Poměr stran **4 : 3** (např. 1024 × 768).
2. Zkontroluj: pět prstů, žádný text ani písmena v obrázku, jídlo
   odpovídá popisu (hlavně tvar a velikost!), stejný styl jako ostatní.
3. Ulož ho pod přesným názvem z tabulky jako `.webp` (nebo `.png` / `.jpg`)
   do `src/assets/sousto/`. Soubor zmenši na šířku 800 px; cílová velikost
   do 80 kB, protože se ukládá do offline mezipaměti PWA.
4. `npm run validate` — test `tests/data/tvarSousta.test.ts` odmítne
   soubor s názvem, který aplikace nezná (překlep).

Není potřeba mít všechny naráz. Každý soubor se použije hned, jak ho
přidáš; co chybí, zůstane v záložní podobě.

## Společný styl — přidej na konec každého zadání

> Soft modern flat illustration for a parenting app, clean simple shapes with subtle shading, warm natural colors, plain light cream background (#F7F5EF), soft even light, centered subject with generous margin, no text, no letters, no numbers, no logos, no watermark, 4:3 aspect ratio.

Negativní zadání (když ho nástroj umí):

> text, letters, watermark, extra fingers, missing fingers, fused fingers, deformed hands, adult hand holding baby food when a baby hand is requested, photo-realistic skin pores, dark background, cluttered background, plate pattern, cutlery

Ruce: u miminka baculatá kojenecká ruka (6–12 měsíců), krátké prsty,
žádné nehty navíc. Barva pleti přirozená; když to nástroj umí, drž ji
u všech rukou stejnou.

## Úchopy

| Soubor | Zadání |
| --- | --- |
| `uchop-dlanovy` | Close-up of a chubby 6-month-old baby's hand making a whole-hand fist around a soft steamed carrot stick; the carrot stick is as long as an adult finger and about half of it sticks out of the top of the fist, all fingers and the thumb wrapped around it, side view. |
| `uchop-nuzkovy` | Close-up of a 9-month-old baby's hand picking up a small soft cube of steamed sweet potato by pressing it between the thumb and the side of the bent index finger (scissor grasp), other fingers loosely curled, side view. |
| `uchop-pinzetovy` | Close-up of a 11-month-old baby's hand picking up a single cooked green pea between the tip of the thumb and the tip of the index finger (pincer grasp), other fingers relaxed, side view, pea clearly visible between the fingertips. |

## Tvar, který z úchopu plyne

| Soubor | Zadání |
| --- | --- |
| `tvar-dlanovy` | Top-down view of three soft steamed vegetable sticks (carrot, sweet potato, zucchini), each about as long and thick as an adult index finger, lying next to an adult index finger for size comparison, on a light board. |
| `tvar-nuzkovy` | Top-down view of two soft steamed vegetable sticks and several larger soft bite-size cubes (about 2 cm) of steamed sweet potato and carrot, on a light board. |
| `tvar-pinzetovy` | Top-down view of small soft pea-size pieces of cooked food scattered on a baby tray: cooked peas, tiny cubes of steamed carrot, small pieces of soft pasta. |

## Zkouška měkkosti

| Soubor | Zadání |
| --- | --- |
| `mekkost` | Close-up of an adult thumb and index finger gently squashing a piece of steamed carrot stick, the carrot flattening easily between the fingertips, showing it is soft enough for a baby. |

## Takhle ne / takhle ano

U „takhle ne" obrázků **nepřidávej** červený křížek ani jiný symbol —
aplikace dává rámeček a ikonu sama.

| Soubor | Zadání |
| --- | --- |
| `jidlo-hrozen-cely` | A single whole round green grape, top-down view. |
| `jidlo-hrozen-ctvrtky` | One green grape cut lengthwise into four long thin quarters, the four pieces laid slightly apart, top-down view. |
| `jidlo-jablko-kostky` | Several small hard cubes of raw apple with skin, top-down view. |
| `jidlo-jablko-cele` | A whole raw red apple, side view. |
| `jidlo-jablko-mesicek` | A thick peeled apple wedge, steamed until soft and slightly translucent, a little steam rising, top-down view. |
| `jidlo-jablko-platek` | One very thin peeled slice of raw apple, top-down view. |
| `jidlo-mrkev-kolecka` | Round coin-shaped slices of raw orange carrot, top-down view. |
| `jidlo-mrkev-hranolek` | One peeled steamed carrot stick as thick and long as an adult finger, soft looking, a little steam rising, top-down view. |
| `jidlo-mrkev-kostky` | Small soft bite-size cubes of steamed carrot, top-down view. |
| `jidlo-arasidy-cele` | A few whole shelled peanuts, top-down view. |
| `jidlo-arasidy-mlete` | A small bowl of smooth oat porridge with a light sprinkle of finely ground peanuts stirred in, no whole nuts visible, top-down view. |
| `jidlo-maso-kus` | A thick piece of pan-seared steak with a browned crust, looking firm and tough, top-down view. |
| `jidlo-maso-vlakna` | Slow-cooked beef pulled into long soft strands, top-down view. |
| `jidlo-maso-kostky` | Small soft cubes of slow-cooked beef, top-down view. |
| `jidlo-brokolice-ruzicka` | One large steamed broccoli floret with a long stem that works as a handle, top-down view. |
| `jidlo-brokolice-kousky` | Small soft pieces of steamed broccoli florets, top-down view. |
| `jidlo-banan-drzadlo` | Half a banana peeled only at the top third, the bottom still in the yellow peel as a handle, standing upright. |
| `jidlo-banan-pulkolecka` | Banana slices cut into half-moons, top-down view. |
| `jidlo-banan-kostky` | Small cubes of ripe banana, top-down view. |

## Proč ne obrázky z internetu

Fotky a ilustrace z webu (Solid Starts, NHS, fotobanky) jsou chráněné
autorským právem a CLAUDE.md zakazuje přebírat cizí obsah. Obrázky
z generátoru jsou vlastní a dají se sladit do jednoho stylu.
