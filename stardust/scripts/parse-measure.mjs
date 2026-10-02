// Condense a measure.mjs log into stardust/replica/lift/<name>.json + a compact table on stdout.
// Usage: node stardust/scripts/parse-measure.mjs <log> <name> [--props a,b,c] [--rects-only]
import fs from 'node:fs';
const [log, name, ...rest] = process.argv.slice(2);
const propsArg = rest.includes('--props') ? rest[rest.indexOf('--props') + 1].split(',') : null;
const rectsOnly = rest.includes('--rects-only');
const lines = fs.readFileSync(log, 'utf8').split('\n');
const out = {}; let width = null; let sel = null; let cur = null;
for (const l of lines) {
  let m;
  if ((m = l.match(/^@ (\d+)px/))) { width = m[1]; out[width] = { root: null, boxes: [] }; continue; }
  if (!width) continue;
  if ((m = l.match(/^  root\s+scrollWidth\s+(\d+)\s+viewport\s+(\d+)\s+scrollHeight\s+(\d+)/))) { out[width].root = { scrollWidth: +m[1], viewport: +m[2], scrollHeight: +m[3] }; continue; }
  if ((m = l.match(/^  (\S.*?)(?: \[(\d+) of (\d+)\])?$/)) && !l.startsWith('   ')) { sel = m[1]; cur = { sel, idx: m[2] ? +m[2] : 1 }; out[width].boxes.push(cur); continue; }
  if ((m = l.match(/^\s+x\s+(-?\d+)\s+y\s+(-?\d+)\s+w\s+(-?\d+)\s+h\s+(-?\d+)\s+vis\s+"(.*?)"(?:\s+img\s+(\d+)×(\d+)\s+(\S+))?/)) && cur) { Object.assign(cur, { x: +m[1], y: +m[2], w: +m[3], h: +m[4], vis: m[5].slice(0, 40) }); if (m[6]) cur.img = { nw: +m[6], nh: +m[7], src: m[8] }; continue; }
  if (/^\s+display:/.test(l) && cur) { const props = {}; for (const kv of l.trim().split(/;\s*/)) { const i = kv.indexOf(': '); if (i > 0) props[kv.slice(0, i)] = kv.slice(i + 2).replace(/…$/, ''); } cur.props = props; continue; }
  if (/^\s+(missing|no match|not found)/i.test(l) && cur) { cur.missing = l.trim(); }
}
fs.mkdirSync('stardust/replica/lift', { recursive: true });
fs.writeFileSync(`stardust/replica/lift/${name}.json`, JSON.stringify(out, null, 1));
const def = ['fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing', 'textTransform', 'textAlign', 'color', 'backgroundColor', 'margin', 'padding', 'border', 'boxSizing', 'display', 'position', 'maxWidth', 'borderRadius', 'opacity'];
const show = propsArg || def;
for (const w of Object.keys(out)) {
  console.log(`@${w} root ${JSON.stringify(out[w].root)}`);
  for (const b of out[w].boxes) {
    const rect = b.x === undefined ? (b.missing || 'no rect') : `x${b.x} y${b.y} w${b.w} h${b.h}`;
    let p = '';
    if (!rectsOnly && b.props) p = show.filter((k) => b.props[k] !== undefined).map((k) => `${k}=${b.props[k]}`).join(' ');
    console.log(`  ${b.sel}${b.idx > 1 ? `[${b.idx}]` : ''}: ${rect}${b.img ? ` img${b.img.nw}x${b.img.nh}` : ''} ${p}`);
  }
}
