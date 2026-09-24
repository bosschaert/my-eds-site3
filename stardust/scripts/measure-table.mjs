// Compact table of a measure.mjs JSON: selector · rect · font values, per width.
import { readFileSync } from 'node:fs';
const [file, ...rest] = process.argv.slice(2);
const m = JSON.parse(readFileSync(file, 'utf8'));
const widths = rest.length ? rest : null;
for (const [url, byW] of Object.entries(m.pages)) for (const [w, sels] of Object.entries(byW)) {
  if (widths && !widths.includes(w)) continue;
  console.log(`== ${url} @${w}`);
  for (const [sel, arr] of Object.entries(sels)) {
    const r = arr[0]; if (!r) { console.log(sel.padEnd(40), 'MISSING'); continue; }
    const b = r.rect, p = r.props || {};
    console.log(sel.padEnd(40), r.visible ? '   ' : 'hid', `x${b.x} y${b.y} w${b.w} h${b.h}`.padEnd(28), `fs ${p.fontSize} fw ${p.fontWeight} lh ${p.lineHeight} ls ${p.letterSpacing}`, p.fontFamily ? p.fontFamily.split(',')[0].replace(/"/g, '') : '', p.margin && p.margin !== '0px' ? `m ${p.margin}` : '', p.padding && p.padding !== '0px' ? `p ${p.padding}` : '', arr.length > 1 ? `(+${arr.length - 1})` : '');
  }
}
