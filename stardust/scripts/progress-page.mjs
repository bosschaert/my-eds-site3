#!/usr/bin/env node
// Renders tools/replica/progress.html from stardust/replica/status-page.json + stardust/.labs/run.json.
// Static HTML, Spectrum theme classes only; inline <style> is layout-only with var(--spectrum-*) values.
import fs from 'node:fs';
if (process.argv.includes('--help')) { console.log('usage: node stardust/scripts/progress-page.mjs  (reads stardust/replica/status-page.json, writes tools/replica/progress.html)'); process.exit(0); }
const run = JSON.parse(fs.readFileSync('stardust/.labs/run.json', 'utf8'));
const s = JSON.parse(fs.readFileSync('stardust/replica/status-page.json', 'utf8'));
const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const badge = (state) => {
  const cls = { Done: 'spectrum-badge--positive', Ready: 'spectrum-badge--positive', 'In progress': 'spectrum-badge--informative', 'Needs attention': 'spectrum-badge--notice' }[state] || '';
  return `<span class="spectrum-badge ${cls}">${esc(state)}</span>`;
};
// steps: [{name,state}], weights 10,10,40,10,30; template step split per page type, migration per page
const W = [10, 10, 40, 10, 30];
const stepPct = (i) => {
  const st = s.steps[i];
  if (st.state === 'Done') return W[i];
  if (st.state !== 'In progress') return 0;
  if (i === 2) { const n = s.templates.length || 1; return W[i] * s.templates.filter((t) => t.status === 'Done').length / n; }
  if (i === 4) { const n = s.pagesTotal || 1; return W[i] * (s.pagesReady.length / n); }
  return 0;
};
const pct = Math.round(W.reduce((a, _, i) => a + stepPct(i), 0));
const now = new Date();
const fmt = (d) => d.toISOString().slice(0, 16).replace('T', ' ') + ' UTC';
const q15 = (min) => Math.max(15, Math.round(min / 15) * 15);
const hm = (m) => (m >= 60 ? `${Math.floor(m / 60)} h${m % 60 ? ` ${m % 60} min` : ''}` : `${m} min`);
let estimate = 'Estimating…';
if (pct >= 100) estimate = 'Complete';
else if (pct >= 10) {
  const elapsed = (now - new Date(run.startedAt)) / 60000;
  const remaining = elapsed * (100 - pct) / pct;
  const maxLeft = (new Date(run.deadlineAt) - now) / 60000;
  let lo = q15(remaining * 0.8), hi = q15(remaining * 1.25);
  hi = Math.min(hi, Math.floor(maxLeft / 15) * 15); lo = Math.min(lo, hi);
  estimate = hi <= 0 ? 'Finishing up' : `Estimated time remaining: ${hm(lo)} – ${hm(hi)}`;
}
const stepsHtml = s.steps.map((st) => `        <li>${esc(st.name)}${badge(st.state)}</li>`).join('\n');
const rows = s.templates.map((t) => `        <tr><td>${esc(t.name)}</td><td>${t.pages}</td><td>${esc(t.desktop)}</td><td>${esc(t.mobile)}</td><td>${badge(t.status)}</td></tr>`).join('\n');
const pageLinks = s.pagesReady.map((p) => `          <li><a href="${esc(p.url)}">${esc(p.title)}</a></li>`).join('\n');
const open = s.pagesTotal > 12 ? '' : ' open';
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
  ol.steps { list-style: none; padding: 0; margin: 0; }
  ol.steps li { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 12px 0; }
  ol.steps li + li { border-top: 1px solid var(--spectrum-gray-200); }
  table { width: 100%; border-collapse: collapse; }
  th, td { padding: 8px; text-align: left; border-bottom: 1px solid var(--spectrum-gray-200); }
  th { color: var(--spectrum-text-subdued); font-weight: 700; }
  details ul { margin: 8px 0 0; padding-left: 20px; }
</style>
</head>
<body>
<main>
  <header>
    <h1>Migration status</h1>
    ${badge(s.overall)}
  </header>
  <p class="meta">Source site: <a href="${esc(run.scope.sourceUrl)}">${esc(run.scope.sourceUrl)}</a><br>Preview site: <a href="${esc(run.previewUrl)}">${esc(run.previewUrl)}</a><br>Last updated: ${fmt(now)}</p>

  <section class="spectrum-panel">
    <h2 class="spectrum-panel-header">Journey</h2>
    <div class="panel-body">
      <ol class="steps">
${stepsHtml}
      </ol>
    </div>
  </section>

  <section class="spectrum-panel">
    <h2 class="spectrum-panel-header">Page templates</h2>
    <div class="panel-body">
      <table>
        <thead><tr><th>Template</th><th>Pages</th><th>Desktop</th><th>Mobile</th><th>Status</th></tr></thead>
        <tbody>
${rows}
        </tbody>
      </table>
    </div>
  </section>

  <section class="spectrum-panel">
    <h2 class="spectrum-panel-header">Pages migrated</h2>
    <div class="panel-body">
      <p>${s.pagesReady.length} of ${s.pagesTotal} pages are ready on the preview site.</p>
      <details${open}>
        <summary>Ready pages</summary>
        <ul>
${pageLinks || '          <li>None yet</li>'}
        </ul>
      </details>
    </div>
  </section>

  <section class="spectrum-panel">
    <h2 class="spectrum-panel-header">Progress</h2>
    <div class="panel-body">
      <div class="bar" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><span style="width: ${pct}%"></span></div>
      <p class="estimate">${pct}% complete. ${esc(estimate)}</p>
    </div>
  </section>

  <section class="spectrum-panel">
    <h2 class="spectrum-panel-header">What's happening now</h2>
    <div class="panel-body">
      <p>${esc(s.now)}</p>${s.attention ? '\n      <p>Some pages need a closer look; we’re on it.</p>' : ''}
    </div>
  </section>

  <section class="spectrum-panel">
    <h2 class="spectrum-panel-header">What's next</h2>
    <div class="panel-body">
      <p>${esc(s.next)}</p>
    </div>
  </section>
</main>
</body>
</html>
`;
fs.writeFileSync('tools/replica/progress.html', html);
console.log(`progress.html written: ${pct}% — ${estimate}`);
