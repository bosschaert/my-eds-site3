#!/usr/bin/env node
// Renders tools/replica/progress.html from stardust/replica/status-page.json + stardust/.labs/run.json.
import fs from 'node:fs';
const run = JSON.parse(fs.readFileSync('stardust/.labs/run.json', 'utf8'));
const st = JSON.parse(fs.readFileSync('stardust/replica/status-page.json', 'utf8'));
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const badge = (state) => {
  const cls = { Done: ' spectrum-badge--positive', Ready: ' spectrum-badge--positive', 'In progress': ' spectrum-badge--informative', 'Needs attention': ' spectrum-badge--notice' }[state] || '';
  return `<span class="spectrum-badge${cls}">${esc(state)}</span>`;
};
const frac = (s) => (s === 'Done' ? 1 : s === 'In progress' ? 0.5 : 0);
const steps = ['Analyzing your site', 'Capturing brand and design', 'Rebuilding page templates', 'Checking fidelity', 'Migrating your pages'];
const t = st.templates || [];
const tFrac = t.length ? t.reduce((a, x) => a + frac(x.status), 0) / t.length : frac(st.steps[2]);
const pages = st.pages || [];
const ready = pages.filter((p) => p.ready);
const pFrac = pages.length ? ready.length / pages.length : 0;
const pct = Math.round(10 * frac(st.steps[0]) + 10 * frac(st.steps[1]) + 40 * tFrac + 10 * frac(st.steps[3]) + 30 * pFrac);
const now = Date.now();
const runningMs = (run.priorRunningMs || 0) + (now - Date.parse(run.startedAt));
const deadline = Date.parse(run.deadlineAt);
const q = 15 * 60 * 1000;
const fmt = (ms) => { const m = Math.round(ms / q) * 15; const h = Math.floor(m / 60); const r = m % 60; return h ? `${h} h${r ? ` ${r} min` : ''}` : `${m} min`; };
let estimate = 'Estimating…';
if (pct >= 100) estimate = 'Complete';
else if (pct >= 10) {
  const rem = runningMs * (100 - pct) / pct;
  const cap = Math.max(0, deadline - now);
  let lo = Math.min(rem * 0.8, cap), hi = Math.min(rem * 1.3, cap);
  lo = Math.max(lo, q); hi = Math.max(hi, lo);
  estimate = `Estimated time remaining: ${fmt(lo)} – ${fmt(hi)}`;
}
const ts = new Date(now).toISOString().replace('T', ' ').slice(0, 16) + ' UTC';
const preview = run.previewUrl.replace(/\/$/, '');
const pageList = pages.map((p) => `<li>${p.ready ? `<a href="${esc(preview + p.path)}">${esc(p.title || p.path)}</a> ${badge('Ready')}` : `${esc(p.title || p.path)} ${badge(p.state || 'Upcoming')}`}</li>`).join('\n          ');
const html = `<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Migration status</title>
<link rel="stylesheet" href="spectrum.css">
<style>
  body { background-color: var(--spectrum-bg-app); }
  main { max-width: 760px; margin: 0 auto; padding: 40px 24px 64px; }
  header { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
  .meta { color: var(--spectrum-text-subdued); margin: 0 0 24px; }
  .spectrum-panel { margin-bottom: 16px; }
  .spectrum-panel-header { margin: 0; padding: 0 16px; }
  .panel-body { padding: 16px; }
  .panel-body > :last-child { margin-bottom: 0; }
  .bar { height: 8px; border-radius: 9999px; background-color: var(--spectrum-gray-200); overflow: hidden; }
  .bar span { display: block; height: 100%; background-color: var(--spectrum-accent-bg); }
  .estimate { color: var(--spectrum-text-subdued); margin: 8px 0 0; }
  ol.steps, ul.pages { list-style: none; padding: 0; margin: 0; }
  ol.steps li, ul.pages li { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 12px 0; }
  ol.steps li + li, ul.pages li + li { border-top: 1px solid var(--spectrum-gray-200); }
  table { width: 100%; border-collapse: collapse; }
  th, td { padding: 8px; text-align: left; border-bottom: 1px solid var(--spectrum-gray-200); }
  th { color: var(--spectrum-text-subdued); }
  details summary { cursor: pointer; margin-bottom: 8px; }
</style>
</head>
<body>
<main>
  <header>
    <h1>Migration status</h1>
    ${badge(st.overall)}
  </header>
  <p class="meta">Source site: <a href="${esc(run.scope.sourceUrl)}">${esc(run.scope.sourceUrl)}</a><br>Preview site: <a href="${esc(run.previewUrl)}">${esc(run.previewUrl)}</a><br>Last updated: ${ts}</p>

  <section class="spectrum-panel">
    <h2 class="spectrum-panel-header">Your migration journey</h2>
    <div class="panel-body">
      <ol class="steps">
        ${steps.map((s, i) => `<li>${esc(s)}${badge(st.steps[i])}</li>`).join('\n        ')}
      </ol>
    </div>
  </section>

  <section class="spectrum-panel">
    <h2 class="spectrum-panel-header">Page templates</h2>
    <div class="panel-body">
      ${t.length ? `<table>
        <thead><tr><th>Template</th><th>Pages</th><th>Desktop</th><th>Mobile</th><th>Status</th></tr></thead>
        <tbody>
        ${t.map((x) => `<tr><td>${esc(x.name)}</td><td>${x.pages}</td><td>${esc(x.desktop)}</td><td>${esc(x.mobile)}</td><td>${badge(x.status)}</td></tr>`).join('\n        ')}
        </tbody>
      </table>` : '<p>We are identifying the page templates on your site.</p>'}
    </div>
  </section>

  <section class="spectrum-panel">
    <h2 class="spectrum-panel-header">Pages migrated: ${ready.length} of ${pages.length}</h2>
    <div class="panel-body">
      <details${pages.length > 12 ? '' : ' open'}>
        <summary>Page list</summary>
        <ul class="pages">
          ${pageList}
        </ul>
      </details>
    </div>
  </section>

  <section class="spectrum-panel">
    <h2 class="spectrum-panel-header">Progress: ${pct}% complete</h2>
    <div class="panel-body">
      <div class="bar"><span style="width: ${pct}%"></span></div>
      <p class="estimate">${esc(estimate)}</p>
    </div>
  </section>

  <section class="spectrum-panel">
    <h2 class="spectrum-panel-header">What's happening now</h2>
    <div class="panel-body"><p>${esc(st.now)}</p>${st.attention ? '<p>Some pages need a closer look; we\'re on it.</p>' : ''}</div>
  </section>

  <section class="spectrum-panel">
    <h2 class="spectrum-panel-header">What's next</h2>
    <div class="panel-body"><p>${esc(st.next)}</p></div>
  </section>
</main>
</body>
</html>
`;
fs.writeFileSync('tools/replica/progress.html', html);
console.log(`status page: ${pct}% — ${estimate}`);
