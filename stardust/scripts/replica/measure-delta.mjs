#!/usr/bin/env node
// Prints, per match, the rect at width B and only the props that differ from width A (same page).
// Usage: node measure-delta.mjs <measure.json> <widthA> <widthB> [--skip-dupes]
import fs from 'node:fs';
const [file, a, b, ...rest] = process.argv.slice(2);
const j = JSON.parse(fs.readFileSync(file, 'utf8'));
const url = j._provenance.urls[0]; const P = j.pages[url];
console.log(`# ${url} ${a}→${b} root: ${JSON.stringify(j.root[url][a])} → ${JSON.stringify(j.root[url][b])}`);
const skipDupes = rest.includes('--skip-dupes');
const short = (v) => String(v).replace(/"/g, '').replace(/Playfair Display/g, 'PD').replace(/, ?(system-ui|Georgia|Arial).*$/, '').slice(0, 60);
for (const sel of j.selectors) {
  const A = P[a]?.[sel] || []; const B = P[b]?.[sel] || [];
  const n = Math.max(A.length, B.length);
  for (let i = 0; i < n; i += 1) {
    if (skipDupes && i > 0 && n > 2 && i < n - 1) continue;
    const ma = A[i]; const mb = B[i];
    if (!mb) { console.log(`${sel}[${i}] MISSING at ${b}`); continue; }
    const rb = mb.rect; const ra = ma?.rect || {};
    const diffs = [];
    for (const k of Object.keys(mb.props || {})) { const va = ma?.props?.[k]; const vb = mb.props[k]; if (va !== vb) diffs.push(`${k}=${short(vb)}`); }
    const img = mb.img ? ` img=${mb.img.naturalWidth}x${mb.img.naturalHeight} ${String(mb.img.currentSrc || '').split('/').pop()}` : '';
    const hid = mb.visible === false ? ' HIDDEN' : (ma && ma.visible === false ? ' (was hidden)' : '');
    console.log(`${sel}[${i}] ${rb.x},${rb.y} ${rb.w}x${rb.h} (Δw ${rb.w - (ra.w ?? 0)} Δh ${rb.h - (ra.h ?? 0)})${hid}${img}${diffs.length ? '\n    ' + diffs.join(' ') : ''}`);
  }
}
