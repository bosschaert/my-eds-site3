#!/usr/bin/env node
// Compact per-width dump of a measure.mjs --json file: one line per match (rect + props), for grep.
// Usage: node measure-dump.mjs <measure.json> <width> [--side 0|1] [--props a,b] > out.txt
import fs from 'node:fs';
const [file, widthArg, ...rest] = process.argv.slice(2);
const j = JSON.parse(fs.readFileSync(file, 'utf8'));
const width = Number(widthArg);
let side = 0; let props = null;
for (let i = 0; i < rest.length; i += 1) { if (rest[i] === '--side') side = Number(rest[++i]); if (rest[i] === '--props') props = rest[++i].split(','); }
const url = j._provenance.urls[side];
const page = j.pages[url];
const root = j.root?.[url]?.[String(width)];
console.log(`# ${url} @${width} root=${JSON.stringify(root)}`);
const short = (v) => String(v).replace(/rgba?\(([^)]+)\)/g, (m, a) => { const p = a.split(',').map((x) => parseFloat(x)); if (p.length === 3 || p[3] === 1) return `#${p.slice(0, 3).map((n) => n.toString(16).padStart(2, '0')).join('')}`; return m; }).replace(/"/g, '').replace(/Playfair Display/g, 'PD').replace(/, ?system-ui.*$/, '').slice(0, 90);
for (const sel of j.selectors) {
  const entry = page[String(width)]?.[sel];
  const matches = Array.isArray(entry) ? entry : entry?.matches ?? (entry ? [entry] : []);
  if (!matches.length) { console.log(`${sel}  (no match)`); continue; }
  matches.forEach((m, i) => {
    const r = m.rect || m;
    const st = m.style || m.props || m.computed || {};
    const keys = props || Object.keys(st);
    const ps = keys.filter((k) => st[k] !== undefined && st[k] !== '' && !['none', 'normal', 'static', '0px', 'rgba(0, 0, 0, 0)', 'auto', 'start'].includes(String(st[k]))).map((k) => `${k}=${short(st[k])}`).join(' ');
    const img = m.img ? ` img=${m.img.naturalWidth}x${m.img.naturalHeight} ${String(m.img.currentSrc || '').split('/').pop()}` : '';
    const t = m.text ? ` "${String(m.text).slice(0, 30)}"` : '';
    console.log(`${sel}[${i}] ${r.x},${r.y} ${r.w}x${r.h}${m.visible === false ? ' HIDDEN' : ''}${img}${t}\n    ${ps}`);
  });
}
