import { vsechnyTexty } from './kontrola';
const P = 'a-zA-ZáčďéěíňóřšťúůýžÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ';
const VY = new RegExp(`(?<![${P}])(vašeho|vaše|vaší|vašich|vašemu|vašim|vašem|váš|vám|vás|vámi)(?![${P}])`, 'giu');
for (const { misto, text } of vsechnyTexty()) {
  for (const m of text.matchAll(VY)) {
    console.log(`${misto}  [${m[0]}]\n   …${text.slice(Math.max(0, m.index - 50), m.index + 60)}…`);
  }
}
