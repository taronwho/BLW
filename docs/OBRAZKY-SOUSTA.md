# Obrázky k průvodci tvarem sousta

Průvodce `/tvar-sousta`, panel „Tvar podle úchopu" u suroviny a zkouška
měkkosti berou obrázky ze souborů v `src/assets/sousto/`. Dokud soubor
chybí, **ruka se neukáže vůbec** a jídlo dostane jednoduchou kresbu v SVG.
Kreslené ruce z geometrických tvarů jsme zahodili: nevypadaly jako ruce.

## Jak obrázek přidat

1. Vygeneruj ho podle zadání níž. Poměr stran **4 : 3** (např. 1024 × 768).
2. Zkontroluj: pět prstů, žádný text ani písmena v obrázku, jídlo
   odpovídá popisu (hlavně tvar a velikost!), stejný styl jako ostatní.
3. Ulož ho pod přesným názvem (tučně nad zadáním) jako `.webp` (nebo `.png` / `.jpg`)
   do `src/assets/sousto/`. Soubor zmenši na šířku 800 px; cílová velikost
   do 80 kB, protože se ukládá do offline mezipaměti PWA.
4. `npm run validate` — test `tests/data/tvarSousta.test.ts` odmítne
   soubor s názvem, který aplikace nezná (překlep).

Není potřeba mít všechny naráz. Každý soubor se použije hned, jak ho
přidáš; co chybí, zůstane v záložní podobě.

## Zadání

Každé zadání je celé, i se společným stylem na konci — stačí ho zkopírovat.
Negativní zadání vlož do zvláštního pole, když ho nástroj má; když ne,
vynech ho. U „takhle ne" obrázků **nepřidávej** červený křížek ani jiný
symbol — aplikace dává rámeček a ikonu sama.

Kontrola po vygenerování: pět prstů, žádný text, jídlo odpovídá popisu
(hlavně tvar a velikost), stejný styl a barva pleti jako u ostatních.

### Úchopy

**`uchop-dlanovy`**

```
Close-up side view of a 6-month-old baby's hand making a whole-hand fist around a soft steamed bright orange carrot stick with subtle carrot texture and faint rings, clearly a vegetable. The stick is as long as an adult finger; about half of it sticks out of the top of the fist. All four fingers and the thumb are wrapped around it. The hand is a chubby baby hand with short fingers, exactly one thumb and four fingers, natural light skin tone, a light blue-grey sleeve at the wrist. Soft modern flat illustration for a parenting app, clean simple shapes with subtle shading, warm natural colors, plain light cream background (#F7F5EF), soft even light, centered subject with generous margin, no text, no letters, no numbers, no logos, no watermark, 4:3 aspect ratio.
```

Negativní: `text, letters, watermark, extra fingers, missing fingers, fused fingers, deformed hands, dark background, cluttered background, cutlery, sausage, hot dog`

**`uchop-nuzkovy`**

Generuj úplně nově, ne jako variaci jiného obrázku. Popis „scissor grasp"
ani „natažený ukazovák" generátory nepochopily (kreslily pěst nebo znak
„V"); přirovnání k držení klíče funguje líp. Když nástroj bere referenční
obrázek, dej mu fotku ruky, která drží klíč.

```
Close-up of a chubby 9-month-old baby's hand holding one small soft cube of steamed orange sweet potato (about 1.5 cm) the same way an adult holds a key: the index finger is gently curled, and the flat pad of the thumb presses the cube against the outer side of the curled index finger. The middle, ring and little fingers are curled into the palm behind the index finger, not extended. Viewed from the thumb side, the thumb and the side of the index finger in the foreground, the cube clearly visible between them. The hand is a chubby baby hand with short fingers, exactly one thumb and four fingers, natural light skin tone, a light blue-grey sleeve at the wrist. Soft modern flat illustration for a parenting app, clean simple shapes with subtle shading, warm natural colors, plain light cream background (#F7F5EF), soft even light, centered subject with generous margin, no text, no letters, no numbers, no logos, no watermark, 4:3 aspect ratio.
```

Negativní: `text, letters, watermark, extra fingers, missing fingers, fused fingers, deformed hands, dark background, cluttered background, cutlery, two fingers extended, V sign, peace sign, pointing finger, straight fingers, thumb on the back of the hand, food between two fingers, fingertip pinch`

Správně: kostka mezi bříškem palce a bokem ohnutého ukazováku, ostatní
prsty schované v dlani, žádný natažený prst.

**`uchop-pinzetovy`**

```
Close-up side view of an 11-month-old baby's hand picking up one single cooked green pea between the very tip of the thumb and the very tip of the index finger (pincer grasp). The pea is clearly visible between the two fingertips. The middle, ring and little fingers are relaxed and slightly curled. The hand is a chubby baby hand with short fingers, exactly one thumb and four fingers, natural light skin tone, a light blue-grey sleeve at the wrist. Soft modern flat illustration for a parenting app, clean simple shapes with subtle shading, warm natural colors, plain light cream background (#F7F5EF), soft even light, centered subject with generous margin, no text, no letters, no numbers, no logos, no watermark, 4:3 aspect ratio.
```

Negativní: `text, letters, watermark, extra fingers, missing fingers, fused fingers, deformed hands, dark background, cluttered background, cutlery, fist, pea hidden in the hand, several peas in the hand`

### Tvar, který z úchopu plyne

**`tvar-dlanovy`**

```
Top-down view of three soft steamed vegetable sticks (orange carrot, orange sweet potato, green zucchini with skin), each about as long and thick as an adult index finger, lying side by side next to an adult index finger for size comparison, on a light wooden board. Soft modern flat illustration for a parenting app, clean simple shapes with subtle shading, warm natural colors, plain light cream background (#F7F5EF), soft even light, centered subject with generous margin, no text, no letters, no numbers, no logos, no watermark, 4:3 aspect ratio.
```

Negativní: `text, letters, watermark, extra fingers, missing fingers, fused fingers, deformed hands, dark background, cluttered background, cutlery`

**`tvar-nuzkovy`**

```
Top-down view of two soft steamed vegetable sticks (as long as an adult finger) and five larger soft bite-size cubes (about 2 cm) of steamed sweet potato and carrot, on a light wooden board. Soft modern flat illustration for a parenting app, clean simple shapes with subtle shading, warm natural colors, plain light cream background (#F7F5EF), soft even light, centered subject with generous margin, no text, no letters, no numbers, no logos, no watermark, 4:3 aspect ratio.
```

Negativní: `text, letters, watermark, extra fingers, missing fingers, fused fingers, deformed hands, dark background, cluttered background, cutlery`

**`tvar-pinzetovy`**

```
Top-down view of small soft pea-size pieces of cooked food scattered on a light baby high-chair tray: cooked green peas, tiny cubes of steamed carrot and small pieces of soft cooked pasta. Soft modern flat illustration for a parenting app, clean simple shapes with subtle shading, warm natural colors, plain light cream background (#F7F5EF), soft even light, centered subject with generous margin, no text, no letters, no numbers, no logos, no watermark, 4:3 aspect ratio.
```

Negativní: `text, letters, watermark, extra fingers, missing fingers, fused fingers, deformed hands, dark background, cluttered background, cutlery`

### Zkouška měkkosti

**`mekkost`**

```
Close-up side view of an adult thumb and index finger gently squashing a short piece of steamed orange carrot stick; the carrot flattens easily between the fingertips, showing it is soft enough for a baby. Exactly one thumb and one index finger visible, natural light skin tone. Soft modern flat illustration for a parenting app, clean simple shapes with subtle shading, warm natural colors, plain light cream background (#F7F5EF), soft even light, centered subject with generous margin, no text, no letters, no numbers, no logos, no watermark, 4:3 aspect ratio.
```

Negativní: `text, letters, watermark, extra fingers, missing fingers, fused fingers, deformed hands, dark background, cluttered background, cutlery`

### Takhle ne / takhle ano

**`jidlo-hrozen-cely`**

```
A single whole round green grape, top-down view. Soft modern flat illustration for a parenting app, clean simple shapes with subtle shading, warm natural colors, plain light cream background (#F7F5EF), soft even light, centered subject with generous margin, no text, no letters, no numbers, no logos, no watermark, 4:3 aspect ratio.
```

Negativní: `text, letters, watermark, extra fingers, missing fingers, fused fingers, deformed hands, dark background, cluttered background, cutlery`

**`jidlo-hrozen-ctvrtky`**

```
One green grape cut lengthwise into four long thin quarters, the four pieces laid slightly apart, top-down view. Soft modern flat illustration for a parenting app, clean simple shapes with subtle shading, warm natural colors, plain light cream background (#F7F5EF), soft even light, centered subject with generous margin, no text, no letters, no numbers, no logos, no watermark, 4:3 aspect ratio.
```

Negativní: `text, letters, watermark, extra fingers, missing fingers, fused fingers, deformed hands, dark background, cluttered background, cutlery`

**`jidlo-jablko-kostky`**

```
Several small hard cubes of raw apple with red skin, top-down view. Soft modern flat illustration for a parenting app, clean simple shapes with subtle shading, warm natural colors, plain light cream background (#F7F5EF), soft even light, centered subject with generous margin, no text, no letters, no numbers, no logos, no watermark, 4:3 aspect ratio.
```

Negativní: `text, letters, watermark, extra fingers, missing fingers, fused fingers, deformed hands, dark background, cluttered background, cutlery`

**`jidlo-jablko-cele`**

```
A whole raw red apple, side view. Soft modern flat illustration for a parenting app, clean simple shapes with subtle shading, warm natural colors, plain light cream background (#F7F5EF), soft even light, centered subject with generous margin, no text, no letters, no numbers, no logos, no watermark, 4:3 aspect ratio.
```

Negativní: `text, letters, watermark, extra fingers, missing fingers, fused fingers, deformed hands, dark background, cluttered background, cutlery`

**`jidlo-jablko-mesicek`**

```
A thick peeled apple wedge, steamed until soft and slightly translucent, a little steam rising, top-down view. Soft modern flat illustration for a parenting app, clean simple shapes with subtle shading, warm natural colors, plain light cream background (#F7F5EF), soft even light, centered subject with generous margin, no text, no letters, no numbers, no logos, no watermark, 4:3 aspect ratio.
```

Negativní: `text, letters, watermark, extra fingers, missing fingers, fused fingers, deformed hands, dark background, cluttered background, cutlery`

**`jidlo-jablko-platek`**

```
One very thin peeled slice of raw apple, top-down view. Soft modern flat illustration for a parenting app, clean simple shapes with subtle shading, warm natural colors, plain light cream background (#F7F5EF), soft even light, centered subject with generous margin, no text, no letters, no numbers, no logos, no watermark, 4:3 aspect ratio.
```

Negativní: `text, letters, watermark, extra fingers, missing fingers, fused fingers, deformed hands, dark background, cluttered background, cutlery`

**`jidlo-mrkev-kolecka`**

```
Round coin-shaped slices of raw bright orange carrot, top-down view. Soft modern flat illustration for a parenting app, clean simple shapes with subtle shading, warm natural colors, plain light cream background (#F7F5EF), soft even light, centered subject with generous margin, no text, no letters, no numbers, no logos, no watermark, 4:3 aspect ratio.
```

Negativní: `text, letters, watermark, extra fingers, missing fingers, fused fingers, deformed hands, dark background, cluttered background, cutlery`

**`jidlo-mrkev-hranolek`**

```
One peeled steamed bright orange carrot stick as thick and long as an adult finger, soft looking, a little steam rising, top-down view. Soft modern flat illustration for a parenting app, clean simple shapes with subtle shading, warm natural colors, plain light cream background (#F7F5EF), soft even light, centered subject with generous margin, no text, no letters, no numbers, no logos, no watermark, 4:3 aspect ratio.
```

Negativní: `text, letters, watermark, extra fingers, missing fingers, fused fingers, deformed hands, dark background, cluttered background, cutlery, sausage, hot dog`

**`jidlo-mrkev-kostky`**

```
Small soft bite-size cubes of steamed bright orange carrot, top-down view. Soft modern flat illustration for a parenting app, clean simple shapes with subtle shading, warm natural colors, plain light cream background (#F7F5EF), soft even light, centered subject with generous margin, no text, no letters, no numbers, no logos, no watermark, 4:3 aspect ratio.
```

Negativní: `text, letters, watermark, extra fingers, missing fingers, fused fingers, deformed hands, dark background, cluttered background, cutlery`

**`jidlo-arasidy-cele`**

```
A few whole shelled peanuts, top-down view. Soft modern flat illustration for a parenting app, clean simple shapes with subtle shading, warm natural colors, plain light cream background (#F7F5EF), soft even light, centered subject with generous margin, no text, no letters, no numbers, no logos, no watermark, 4:3 aspect ratio.
```

Negativní: `text, letters, watermark, extra fingers, missing fingers, fused fingers, deformed hands, dark background, cluttered background, cutlery`

**`jidlo-arasidy-mlete`**

```
A small bowl of smooth oat porridge with a light sprinkle of finely ground peanuts stirred in, no whole nuts and no nut pieces visible, top-down view. Soft modern flat illustration for a parenting app, clean simple shapes with subtle shading, warm natural colors, plain light cream background (#F7F5EF), soft even light, centered subject with generous margin, no text, no letters, no numbers, no logos, no watermark, 4:3 aspect ratio.
```

Negativní: `text, letters, watermark, extra fingers, missing fingers, fused fingers, deformed hands, dark background, cluttered background, cutlery, whole peanuts, nut pieces`

**`jidlo-maso-kus`**

```
A thick piece of pan-seared steak with a browned crust, looking firm and tough, top-down view. Soft modern flat illustration for a parenting app, clean simple shapes with subtle shading, warm natural colors, plain light cream background (#F7F5EF), soft even light, centered subject with generous margin, no text, no letters, no numbers, no logos, no watermark, 4:3 aspect ratio.
```

Negativní: `text, letters, watermark, extra fingers, missing fingers, fused fingers, deformed hands, dark background, cluttered background, cutlery`

**`jidlo-maso-vlakna`**

```
Slow-cooked beef pulled into long soft strands, top-down view. Soft modern flat illustration for a parenting app, clean simple shapes with subtle shading, warm natural colors, plain light cream background (#F7F5EF), soft even light, centered subject with generous margin, no text, no letters, no numbers, no logos, no watermark, 4:3 aspect ratio.
```

Negativní: `text, letters, watermark, extra fingers, missing fingers, fused fingers, deformed hands, dark background, cluttered background, cutlery`

**`jidlo-maso-kostky`**

```
Small soft cubes of slow-cooked beef, top-down view. Soft modern flat illustration for a parenting app, clean simple shapes with subtle shading, warm natural colors, plain light cream background (#F7F5EF), soft even light, centered subject with generous margin, no text, no letters, no numbers, no logos, no watermark, 4:3 aspect ratio.
```

Negativní: `text, letters, watermark, extra fingers, missing fingers, fused fingers, deformed hands, dark background, cluttered background, cutlery`

**`jidlo-brokolice-ruzicka`**

```
One large steamed broccoli floret with a long stem that works as a handle, top-down view. Soft modern flat illustration for a parenting app, clean simple shapes with subtle shading, warm natural colors, plain light cream background (#F7F5EF), soft even light, centered subject with generous margin, no text, no letters, no numbers, no logos, no watermark, 4:3 aspect ratio.
```

Negativní: `text, letters, watermark, extra fingers, missing fingers, fused fingers, deformed hands, dark background, cluttered background, cutlery`

**`jidlo-brokolice-kousky`**

```
Small soft pieces of steamed broccoli florets, top-down view. Soft modern flat illustration for a parenting app, clean simple shapes with subtle shading, warm natural colors, plain light cream background (#F7F5EF), soft even light, centered subject with generous margin, no text, no letters, no numbers, no logos, no watermark, 4:3 aspect ratio.
```

Negativní: `text, letters, watermark, extra fingers, missing fingers, fused fingers, deformed hands, dark background, cluttered background, cutlery`

**`jidlo-banan-drzadlo`**

```
Half a banana peeled only at the top third, the bottom still in the yellow peel as a handle, standing upright. Soft modern flat illustration for a parenting app, clean simple shapes with subtle shading, warm natural colors, plain light cream background (#F7F5EF), soft even light, centered subject with generous margin, no text, no letters, no numbers, no logos, no watermark, 4:3 aspect ratio.
```

Negativní: `text, letters, watermark, extra fingers, missing fingers, fused fingers, deformed hands, dark background, cluttered background, cutlery`

**`jidlo-banan-pulkolecka`**

```
Banana slices cut into half-moons, top-down view. Soft modern flat illustration for a parenting app, clean simple shapes with subtle shading, warm natural colors, plain light cream background (#F7F5EF), soft even light, centered subject with generous margin, no text, no letters, no numbers, no logos, no watermark, 4:3 aspect ratio.
```

Negativní: `text, letters, watermark, extra fingers, missing fingers, fused fingers, deformed hands, dark background, cluttered background, cutlery`

**`jidlo-banan-kostky`**

```
Small cubes of ripe banana, top-down view. Soft modern flat illustration for a parenting app, clean simple shapes with subtle shading, warm natural colors, plain light cream background (#F7F5EF), soft even light, centered subject with generous margin, no text, no letters, no numbers, no logos, no watermark, 4:3 aspect ratio.
```

Negativní: `text, letters, watermark, extra fingers, missing fingers, fused fingers, deformed hands, dark background, cluttered background, cutlery`

## Proč ne obrázky z internetu

Fotky a ilustrace z webu (Solid Starts, NHS, fotobanky) jsou chráněné
autorským právem a CLAUDE.md zakazuje přebírat cizí obsah. Obrázky
z generátoru jsou vlastní a dají se sladit do jednoho stylu.
