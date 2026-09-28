#!/usr/bin/env node
// Renders tools/replica/progress.html from stardust/replica/status-model.json + stardust/.labs/run.json.
// Usage: node stardust/scripts/status-page.mjs [--model <file>] [--out <file>]
import fs from 'node:fs';
const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
if (args.includes('--help') || args.includes('-h')) { console.log('node status-page.mjs [--model stardust/replica/status-model.json] [--out tools/replica/progress.html]'); process.exit(0); }
const model = JSON.parse(fs.readFileSync(opt('--model', 'stardust/replica/status-model.json'), 'utf8'));
const run = JSON.parse(fs.readFileSync('stardust/.labs/run.json', 'utf8'));
const out = opt('--out', 'tools/replica/progress.html');
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const badge = (state) => {
  const cls = { Done: 'spectrum-badge--positive', Ready: 'spectrum-badge--positive', 'In progress': 'spectrum-badge--informative', 'Needs attention': 'spectrum-badge--notice', Yes: 'spectrum-badge--positive', Checking: 'spectrum-badge--informative' }[state] || '';
  return `<span class="spectrum-badge ${cls}">${esc(state)}</span>`;
};
// Percent: weights 10/10/40/10/30; steps carry a fraction 0..1
const w = [10, 10, 40, 10, 30];
const steps = model.steps; // [{name, fraction}]
const pct = Math.round(steps.reduce((a, s, i) => a + w[i] * Math.min(1, Math.max(0, s.fraction || 0)), 0));
const stepState = (s) => (s.fraction >= 1 ? 'Done' : s.fraction > 0 ? 'In progress' : 'Upcoming');
const now = new Date();
const started = new Date(run.startedAt); const deadline = new Date(run.deadlineAt);
const q = 15 * 60 * 1000;
let estimate = 'Estimating…';
if (pct >= 10 && pct < 100) {
  const elapsed = now - started; const rem = elapsed * (100 - pct) / pct;
  const lo = Math.max(q, Math.round(rem * 0.8 / q) * q); let hi = Math.max(lo + q, Math.round(rem * 1.25 / q) * q);
  const maxRem = deadline - now; const cap = Math.floor(maxRem / q) * q;
  const l = Math.min(lo, cap), h = Math.min(hi, cap);
  const fmt = (ms) => { const m = Math.round(ms / 60000); const hh = Math.floor(m / 60), mm = m % 60; return hh ? `${hh} h${mm ? ` ${mm} min` : ''}` : `${mm} min`; };
  estimate = h <= 0 ? 'Finishing up' : (l === h ? `About ${fmt(h)} remaining` : `About ${fmt(l)} to ${fmt(h)} remaining`);
} else if (pct >= 100) estimate = 'Complete';
const utc = now.toISOString().replace('T', ' ').slice(0, 16) + ' UTC';
const pages = model.pages || []; const ready = pages.filter((p) => p.ready);
const openList = pages.length <= 12 ? ' open' : '';
const tmplRows = (model.templates || []).map((t) => `<tr><td>${esc(t.name)}</td><td>${t.pages}</td><td>${badge(t.desktop)}</td><td>${badge(t.mobile)}</td><td>${badge(t.status)}</td></tr>`).join('\n');
const pageItems = pages.map((p) => p.ready ? `<li><a href="${esc(p.previewUrl)}">${esc(p.title || p.path)}</a> ${badge('Ready')}</li>` : `<li>${esc(p.title || p.path)} ${badge(p.state || 'Upcoming')}</li>`).join('\n');
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
  header { display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
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
  ul.pages { padding-left: 20px; margin: 8px 0 0; }
  ul.pages li { padding: 4px 0; }
</style>
</head>
<body>
<main>
<header>
  <h1>Migration status</h1>
  ${badge(model.overall)}
</header>
<p class="meta">Source site: <a href="${esc(run.scope.sourceUrl)}">${esc(run.scope.sourceUrl)}</a><br>
Preview site: <a href="${esc(run.previewUrl)}">${esc(run.previewUrl)}</a><br>
Last updated: ${utc}</p>

<section class="spectrum-panel">
  <h2 class="spectrum-panel-header">Your migration journey</h2>
  <div class="panel-body">
    <ol class="steps">
${steps.map((s) => `      <li><span>${esc(s.name)}</span>${badge(stepState(s))}</li>`).join('\n')}
    </ol>
  </div>
</section>

<section class="spectrum-panel">
  <h2 class="spectrum-panel-header">Page templates</h2>
  <div class="panel-body">
    <table>
      <thead><tr><th>Template</th><th>Pages</th><th>Desktop</th><th>Mobile</th><th>Status</th></tr></thead>
      <tbody>
${tmplRows}
      </tbody>
    </table>
  </div>
</section>

<section class="spectrum-panel">
  <h2 class="spectrum-panel-header">Pages migrated</h2>
  <div class="panel-body">
    <p>${ready.length} of ${pages.length} pages are ready on the preview site.</p>
    <details${openList}>
      <summary>Page list</summary>
      <ul class="pages">
${pageItems}
      </ul>
    </details>
  </div>
</section>

<section class="spectrum-panel">
  <h2 class="spectrum-panel-header">Overall progress</h2>
  <div class="panel-body">
    <p>${pct}% complete</p>
    <div class="bar" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><span style="width: ${pct}%"></span></div>
    <p class="estimate">${esc(estimate)}</p>
  </div>
</section>

<section class="spectrum-panel">
  <h2 class="spectrum-panel-header">What's happening now</h2>
  <div class="panel-body"><p>${esc(model.now)}</p>${model.attention ? '<p>Some pages need a closer look; we\'re on it.</p>' : ''}</div>
</section>

<section class="spectrum-panel">
  <h2 class="spectrum-panel-header">What's next</h2>
  <div class="panel-body"><p>${esc(model.next)}</p></div>
</section>
</main>
</body>
</html>
`;
fs.writeFileSync(out, html);
console.log(`status page written: ${out} (${pct}%, ${estimate})`);
