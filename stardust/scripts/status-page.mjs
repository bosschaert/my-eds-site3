// Renders tools/replica/progress.html from stardust/replica/status-page.json + stardust/.labs/run.json.
import { readFileSync, writeFileSync } from 'node:fs';
const run = JSON.parse(readFileSync('stardust/.labs/run.json', 'utf8'));
const m = JSON.parse(readFileSync('stardust/replica/status-page.json', 'utf8'));
const W = [10, 10, 40, 10, 30];
const names = ['Analyzing your site', 'Capturing brand and design', 'Rebuilding page templates', 'Checking fidelity', 'Migrating your pages'];
const pct = Math.round(m.stepFractions.reduce((a, f, i) => a + f * W[i], 0));
const now = new Date();
const started = new Date(run.startedAt), deadline = new Date(run.deadlineAt);
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const fmtDur = (min) => { const h = Math.floor(min / 60), mm = min % 60; return h ? `${h} h${mm ? ` ${mm} min` : ''}` : `${mm} min`; };
let eta = 'Estimating…';
if (pct >= 10 && pct < 100) {
  const elapsed = (now - started) / 60000;
  const rem = elapsed * (100 - pct) / pct;
  const r15 = (x) => Math.max(15, Math.round(x / 15) * 15);
  const maxLeft = Math.max(0, Math.floor((deadline - now) / 60000 / 15) * 15);
  let lo = Math.min(r15(rem * 0.8), maxLeft), hi = Math.min(r15(rem * 1.3), maxLeft);
  if (lo > hi) lo = hi;
  eta = hi > 0 ? `About ${fmtDur(lo)}${hi !== lo ? ` to ${fmtDur(hi)}` : ''} remaining` : 'Finishing up';
} else if (pct >= 100) eta = 'Complete';
const ready = m.pages.filter((p) => p.ready);
const open = m.pages.length > 12 ? '' : ' open';
const badge = (s) => `<span class="badge ${s === 'Done' ? 'done' : s === 'In progress' ? 'prog' : 'up'}">${esc(s)}</span>`;
const preview = run.previewUrl.replace(/\/$/, '');
const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Migration status — ${esc(run.scope.sourceUrl)}</title>
<style>
:root{--ink:#1c1c1e;--muted:#6b7280;--line:#e5e7eb;--bg:#f7f7f8;--card:#fff;--ok:#0f7b3f;--okbg:#e6f4ec;--prog:#1d4ed8;--progbg:#e8eefc;--up:#6b7280;--upbg:#f1f2f4;--warn:#b45309;--warnbg:#fdf3e3}
*{box-sizing:border-box}body{margin:0;font:16px/1.55 -apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif;color:var(--ink);background:var(--bg)}
main{max-width:880px;margin:0 auto;padding:40px 20px 64px}
header{display:flex;flex-wrap:wrap;justify-content:space-between;gap:16px;align-items:flex-start;margin-bottom:28px}
h1{font-size:26px;margin:0 0 6px}h2{font-size:18px;margin:0 0 14px}
.meta{color:var(--muted);font-size:14px}.meta a{color:var(--prog)}
.state{font-weight:600;padding:8px 14px;border-radius:999px;background:var(--progbg);color:var(--prog);white-space:nowrap}
.state.ready{background:var(--okbg);color:var(--ok)}.state.attn{background:var(--warnbg);color:var(--warn)}
section{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:22px 24px;margin-bottom:18px}
ol.journey{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(5,1fr);gap:10px}
ol.journey li{border:1px solid var(--line);border-radius:10px;padding:12px;font-size:14px;display:flex;flex-direction:column;gap:8px}
ol.journey li .n{color:var(--muted);font-size:12px}
.badge{display:inline-block;font-size:12px;font-weight:600;padding:3px 9px;border-radius:999px;white-space:nowrap}
.badge.done{background:var(--okbg);color:var(--ok)}.badge.prog{background:var(--progbg);color:var(--prog)}.badge.up{background:var(--upbg);color:var(--up)}
table{width:100%;border-collapse:collapse;font-size:15px}th,td{text-align:left;padding:10px 8px;border-bottom:1px solid var(--line)}th{color:var(--muted);font-weight:600;font-size:13px}
.bar{height:14px;background:var(--upbg);border-radius:999px;overflow:hidden;margin:10px 0}.bar span{display:block;height:100%;background:linear-gradient(90deg,#1d4ed8,#3b82f6);border-radius:999px}
.big{font-size:32px;font-weight:700}.eta{color:var(--muted)}
details summary{cursor:pointer;color:var(--prog);font-weight:600}details ul{margin:10px 0 0;padding-left:20px}
p{margin:0 0 8px}
@media(max-width:700px){ol.journey{grid-template-columns:1fr 1fr}}
</style></head><body><main>
<header>
  <div>
    <h1>Your site migration</h1>
    <div class="meta">Source site: <strong>${esc(run.scope.sourceUrl)}</strong><br>
    Preview site: <a href="${esc(run.previewUrl)}">${esc(run.previewUrl)}</a><br>
    Last updated: ${now.toISOString().replace('T', ' ').slice(0, 16)} UTC</div>
  </div>
  <div class="state ${m.state === 'Ready' ? 'ready' : m.state === 'Needs attention' ? 'attn' : ''}">${esc(m.state)}</div>
</header>
<section><h2>Your migration journey</h2>
<ol class="journey">${names.map((n, i) => `<li><span class="n">Step ${i + 1}</span><strong>${n}</strong>${badge(m.steps[i])}</li>`).join('')}</ol>
</section>
<section><h2>Page templates</h2>
<table><thead><tr><th>Template</th><th>Pages</th><th>Desktop</th><th>Mobile</th><th>Status</th></tr></thead><tbody>
${m.templates.map((t) => `<tr><td>${esc(t.name)}</td><td>${t.pages}</td><td>${esc(t.desktop)}</td><td>${esc(t.mobile)}</td><td>${badge(t.status)}</td></tr>`).join('\n')}
</tbody></table></section>
<section><h2>Pages migrated</h2>
<p><strong>${ready.length} of ${m.pages.length}</strong> pages are ready on the preview site.</p>
<details${open}><summary>Page list</summary><ul>
${m.pages.map((p) => `<li>${p.ready ? `<a href="${esc(preview + p.path)}">${esc(p.title)}</a> — ready` : `${esc(p.title)} — ${esc(p.note || 'upcoming')}`}</li>`).join('\n')}
</ul></details></section>
<section><h2>Overall progress</h2>
<div class="big">${pct}%</div>
<div class="bar"><span style="width:${pct}%"></span></div>
<div class="eta">${esc(eta)}</div>
</section>
<section><h2>What's happening now</h2><p>${esc(m.now)}</p>${m.attention ? '<p>Some pages need a closer look; we\'re on it.</p>' : ''}</section>
<section><h2>What's next</h2><p>${esc(m.next)}</p></section>
</main></body></html>
`;
writeFileSync('tools/replica/progress.html', html);
console.log(`status page written: ${pct}% — ${eta}`);
