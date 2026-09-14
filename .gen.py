# -*- coding: utf-8 -*-
"""Generátor receptů: alergeny a věk dopočítá z katalogu, ať se na ně nezapomene."""
import io, json
KAT = json.load(io.open('.kat.json', encoding='utf-8'))

import re as _re
def q(t):
    # Vlastní překlep se nejhůř hledá očima: cyrilské „а" vypadá jako české.
    assert not _re.search(r'[\u0400-\u04FF]', t), 'cyrilice v textu: ' + t[:60]
    assert '  ' not in t, 'dvojitá mezera v textu: ' + t[:60]
    return "'" + t.replace("\\", "\\\\").replace("'", "\\'") + "'"

def recept(d):
    ids = [i[0] for i in d['slozky']]
    for i in ids:
        assert i in KAT, 'neznámá surovina: ' + i
    alerg = sorted({a for i in ids for a in KAT[i]['a']})
    vek = max([KAT[i]['v'] for i in ids] + [d.get('vek', 6)])
    maso = any(not KAT[i]['veg'] for i in ids)
    if maso:
        assert 'vegKroky' in d, 'recept s masem potřebuje vegetariánskou variantu: ' + d['id']
    else:
        assert 'vegKroky' not in d, 'bezmasý recept nesmí mít vegetariánskou variantu: ' + d['id']
    o = []
    o.append('  {')
    o.append('    id: ' + q(d['id']) + ',')
    o.append('    titleCz: ' + q(d['nazev']) + ',')
    o.append('    category: ' + q(d['kat']) + ',')
    o.append('    minAgeMonths: ' + str(vek) + ',')
    o.append('    timeMinutes: ' + str(d['cas']) + ',')
    o.append('    servings: ' + q(d.get('porce', '2 dospělí + 1 miminko')) + ',')
    o.append('    ingredients: [')
    for iid, mn, tr in d['slozky']:
        o.append('      { ingredientId: ' + q(iid) + ', amount: ' + q(mn) + ", track: " + q(tr) + ' },')
    o.append('    ],')
    for klic, pole in (('baseSteps', 'zaklad'), ('babySteps', 'detske')):
        o.append('    ' + klic + ': [')
        for k in d[pole]:
            o.append('      ' + q(k) + ',')
        o.append('    ],')
        if klic == 'baseSteps':
            o.append('    babySplitPoint:')
            o.append('      ' + q(d['odber']) + ',')
    o.append('    babyServing: {')
    for st in ('6m', '9m', '12m'):
        o.append('      ' + q(st) + ': ' + q(d['podani'][st]) + ',')
    o.append('    },')
    o.append('    adultSteps: [')
    for k in d['dospeli']:
        o.append('      ' + q(k) + ',')
    o.append('    ],')
    if maso:
        o.append('    vegetarianSteps: [')
        for k in d['vegKroky']:
            o.append('      ' + q(k) + ',')
        o.append('    ],')
        o.append('    vegetarianProteinSwap:')
        o.append('      ' + q(d['vegSwap']) + ',')
    o.append('    allergens: [' + ', '.join(q(a) for a in alerg) + '],')
    o.append('    tags: [' + ', '.join(q(t) for t in d['stitky']) + '],')
    o.append('    sources: [' + ', '.join(d.get('zdroje', ['NHS_FIRST_FOODS', 'NHS_VEGETARIAN'])) + '],')
    o.append("    reviewStatus: 'verified',")
    o.append('  },')
    return '\n'.join(o) + '\n'

def zapis(cesta, recepty, zdroje_navic=()):
    s = io.open(cesta, encoding='utf-8').read()
    i = s.rstrip().rfind('];')
    s = s[:i] + ''.join(recept(r) for r in recepty) + '];\n'
    # Každý použitý zdroj musí být v importu, jinak build spadne až za běhu.
    pouzite = {z for r in recepty for z in r.get('zdroje', ['NHS_FIRST_FOODS', 'NHS_VEGETARIAN'])}
    hl = s[:s.index("_sources';")]
    for n in sorted(pouzite) + list(zdroje_navic):
        if ('\n  ' + n + ',') not in hl:
            s = s.replace('import {\n', 'import {\n  ' + n + ',\n', 1)
    io.open(cesta, 'w', encoding='utf-8').write(s)
