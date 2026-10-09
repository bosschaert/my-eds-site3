// Flatten a measure.mjs JSON. Usage: flatten-measure.mjs <file> [selectorRegex [width]]
//  no regex → TSV (w, selector, i, x, y, w, h, props…); with regex → one "k=v" block per match.
import fs from 'node:fs';
const [,, file, re, wOnly] = process.argv;
const j = JSON.parse(fs.readFileSync(file, 'utf8'));
const page = Object.values(j.pages)[0];
let header = null;
for (const w of Object.keys(page)) {
  if (wOnly && w !== wOnly) continue;
  const byW = page[w];
  for (const sel of Object.keys(byW)) {
    if (re && !new RegExp(re).test(sel)) continue;
    const entries = Array.isArray(byW[sel]) ? byW[sel] : [byW[sel]];
    entries.forEach((e, i) => {
      if (!e) return;
      const r = e.rect || e;
      const props = e.computed || e.styles || e.props || {};
      if (re) {
        const kv = Object.entries(props).filter(([k,v]) => v !== 'none' && v !== 'normal' && v !== '0px' && v !== 'rgba(0, 0, 0, 0)' && v !== 'auto').map(([k,v]) => `${k}=${String(v).replace(/\s+/g,' ').slice(0,160)}`);
        const extra = Object.entries(e).filter(([k]) => !['rect','computed','styles','props'].includes(k)).map(([k,v]) => `${k}=${JSON.stringify(v).slice(0,120)}`);
        console.log(`[${w}] ${sel} #${i} @${r.x},${r.y} ${r.width ?? r.w}x${r.height ?? r.h}\n   ${kv.join(' | ')}\n   ${extra.join(' | ')}`);
        return;
      }
      if (!header) { header = ['w','selector','i','x','y','width','height', ...Object.keys(props)]; console.log(header.join('\t')); }
      console.log([w, sel, i, r.x, r.y, r.width ?? r.w, r.height ?? r.h, ...Object.keys(props).map(k => String(props[k]).replace(/\s+/g,' ').slice(0,60))].join('\t'));
    });
  }
}
