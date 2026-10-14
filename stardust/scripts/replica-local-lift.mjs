// Phase-3 CSS lift helper: computed styles + rects of named live elements per width → JSON + compact table.
import { chromium } from 'playwright'; import fs from 'node:fs';
import { newLiveContext } from './diff/live-session.mjs';
const [url, width, out, ...sels] = process.argv.slice(2);
const PROPS = ['display','position','fontFamily','fontSize','fontWeight','lineHeight','letterSpacing','textTransform','color','backgroundColor','backgroundImage','padding','margin','border','borderRadius','width','height','maxWidth','textAlign','boxShadow','gap','gridTemplateColumns','flexDirection','justifyContent','alignItems','objectFit','opacity','top','left','zIndex','boxSizing','transform'];
const b = await chromium.launch(); const ctx = await newLiveContext(b, { viewport: { width: +width, height: 900 } });
const p = await ctx.newPage(); await p.goto(url, { waitUntil: 'load', timeout: 60000 }); await p.waitForTimeout(2500);
const res = await p.evaluate(([sels, PROPS]) => {
  const out = {}; const base = getComputedStyle(document.body);
  for (const s of sels) {
    const els = [...document.querySelectorAll(s)].slice(0, 3);
    out[s] = els.map((e) => { const cs = getComputedStyle(e); const r = e.getBoundingClientRect(); const o = { rect: [Math.round(r.x), Math.round(r.y + scrollY), Math.round(r.width), Math.round(r.height)] };
      for (const k of PROPS) { const v = cs[k]; if (v && v !== 'none' && v !== 'normal' && v !== 'auto' && v !== '0px' && v !== 'static' && v !== 'rgba(0, 0, 0, 0)' && !(k==='opacity'&&v==='1')) o[k] = v; }
      for (const pe of ['::before','::after']) { const c = getComputedStyle(e, pe); if (c.content && c.content !== 'none' && c.content !== 'normal') o[pe] = { content: c.content, w: c.width, h: c.height, border: c.borderTop, margin: c.margin, bg: c.backgroundColor, display: c.display }; }
      return o; });
  }
  out.__doc = { scrollH: document.documentElement.scrollHeight };
  return out;
}, [sels, PROPS]);
fs.writeFileSync(out, JSON.stringify(res, null, 1)); await b.close();
for (const [s, arr] of Object.entries(res)) { if (s === '__doc') { console.log('doc', JSON.stringify(arr)); continue; }
  if (!arr.length) { console.log(`${s}: (none)`); continue; }
  const a = arr[0]; console.log(`${s} [${arr.length}] ${JSON.stringify(a).slice(0, 700)}`); }
