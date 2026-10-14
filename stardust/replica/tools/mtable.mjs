// mtable.mjs <measure.json> [width] [selector-regex] — compact rect + key style rows.
import fs from 'node:fs';
const [f, wf, re] = process.argv.slice(2); const j = JSON.parse(fs.readFileSync(f, 'utf8'));
const page = Object.values(j.pages)[0];
for (const [w, sels] of Object.entries(page)) { if (wf && wf !== 'all' && String(w) !== wf) continue; console.log(`== ${w}`);
  for (const [sel, ms] of Object.entries(sels)) { if (re && !new RegExp(re).test(sel)) continue; const arr = Array.isArray(ms) ? ms : (ms.matches || [ms]);
    arr.forEach((m, i) => { if (!m || !m.rect) { console.log(sel, 'MISSING'); return; } const r = m.rect, s = m.props || {};
      console.log(`${sel}[${i}] ${r.x},${r.y} ${r.w}x${r.h} fs=${s.fontSize} lh=${s.lineHeight} fw=${s.fontWeight} pad=${s.padding} mar=${s.margin} mw=${s.maxWidth}${s.backgroundImage && s.backgroundImage !== 'none' ? ' bg=' + s.backgroundImage.slice(0, 70) : ''}`); }); } }
