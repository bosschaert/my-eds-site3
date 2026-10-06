#!/usr/bin/env node
// status-page.mjs — rewrite tools/replica/progress.html from stardust/.work/progress-state.json
// Usage: node stardust/scripts/status-page.mjs [--state <json>] [--out <html>]
// State: { steps:[5 x "done"|"progress"|"upcoming"], templates:[{name,pages,desktop,mobile,status}],
//          pagesTotal, pagesReady:[{path,title}], templateFraction (0..1 of template step done),
//          migrationFraction (0..1), now, next, attention(bool), ready(bool) }
import fs from 'node:fs';
const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const statePath = opt('--state', 'stardust/.work/progress-state.json');
const outPath = opt('--out', 'tools/replica/progress.html');
const run = JSON.parse(fs.readFileSync('stardust/.labs/run.json', 'utf8'));
const s = JSON.parse(fs.readFileSync(statePath, 'utf8'));
const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const badge = (st) => st === 'done' ? '<span class="spectrum-badge spectrum-badge--positive">Done</span>'
  : st === 'progress' ? '<span class="spectrum-badge spectrum-badge--informative">In progress</span>'
  : st === 'ready' ? '<span class="spectrum-badge spectrum-badge--positive">Ready</span>'
  : st === 'attention' ? '<span class="spectrum-badge spectrum-badge--notice">Needs attention</span>'
  : '<span class="spectrum-badge">Upcoming</span>';
const yn = (v) => v === true ? '<span class="spectrum-badge spectrum-badge--positive">Yes</span>' : v === 'progress' ? '<span class="spectrum-badge spectrum-badge--informative">Checking</span>' : '<span class="spectrum-badge">Pending</span>';
const weights = [10, 10, 40, 10, 30];
const frac = (i) => s.steps[i] === 'done' ? 1 : i === 2 ? (s.templateFraction || 0) : i === 4 ? (s.migrationFraction || 0) : (s.steps[i] === 'progress' ? 0.5 : 0);
const pct = Math.min(100, Math.round(weights.reduce((a, w, i) => a + w * frac(i), 0)));
const now = new Date();
const started = new Date(run.startedAt); const deadline = new Date(run.deadlineAt);
let estimate = 'Estimating…';
if (pct >= 100) estimate = 'Complete';
else if (pct >= 10) {
  const elapsed = now - started; const total = elapsed / (pct / 100); let rem = total - elapsed;
  const q = 15 * 60 * 1000; const lo = Math.max(q, Math.floor(rem / q) * q); let hi = Math.ceil((rem * 1.3) / q) * q; if (hi <= lo) hi = lo + q;
  const cap = deadline - now; const loC = Math.min(lo, cap), hiC = Math.min(hi, cap);
  const fmt = (ms) => { const m = Math.round(ms / 60000); const h = Math.floor(m / 60), mm = m % 60; return h ? `${h} h${mm ? ` ${mm} min` : ''}` : `${mm} min`; };
  estimate = loC >= hiC ? `About ${fmt(hiC)} remaining` : `About ${fmt(loC)} to ${fmt(hiC)} remaining`;
}
const overall = s.attention ? 'attention' : s.ready ? 'ready' : 'progress';
const stepNames = ['Analyzing your site', 'Capturing brand and design', 'Rebuilding page templates', 'Checking fidelity', 'Migrating your pages'];
const prev = run.previewUrl.replace(/\/$/, '');
const pagesList = (s.pagesReady || []).map((p) => `<li><a href="${esc(prev + p.path)}">${esc(p.title || p.path)}</a></li>`).join('\n          ');
const detailsOpen = (s.pagesTotal || 0) > 12 ? '' : ' open';
const ts = now.toISOString().slice(0, 16).replace('T', ' ') + ' UTC';
const html = `<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Migration status — ${esc(run.scope.sourceUrl.replace(/^https?:\/\//, '').replace(/\/$/, ''))}</title>
<link rel="stylesheet" href="spectrum.css">
<style>
  main { max-width: 760px; margin: 0 auto; padding: 40px 24px 64px; }
  header { display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
  .meta { margin: 0 0 24px; }
  .spectrum-panel { margin-bottom: 16px; }
  .spectrum-panel-header { margin: 0; padding: 0 16px; }
  .panel-body { padding: 16px; }
  .panel-body > :last-child { margin-bottom: 0; }
  .bar { height: 8px; border-radius: 9999px; background-color: var(--spectrum-gray-200); overflow: hidden; }
  .bar span { display: block; height: 100%; background-color: var(--spectrum-accent-bg); }
  .estimate { margin: 8px 0 0; }
  ol.steps { list-style: none; padding: 0; margin: 0; }
  ol.steps li { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 12px 0; }
  ol.steps li + li { border-top: 1px solid var(--spectrum-gray-200); }
  table { width: 100%; border-collapse: collapse; }
  th, td { padding: 8px; text-align: left; border-bottom: 1px solid var(--spectrum-gray-200); }
  details ul { margin: 8px 0 0; padding-left: 20px; }
</style>
</head>
<body>
<main>
  <header>
    <h1>Migration status</h1>
    ${badge(overall)}
  </header>
  <p class="meta">Source site: <a href="${esc(run.scope.sourceUrl)}">${esc(run.scope.sourceUrl)}</a><br>Preview site: <a href="${esc(run.previewUrl)}">${esc(run.previewUrl)}</a><br>Last updated: ${ts}</p>

  <section class="spectrum-panel">
    <h2 class="spectrum-panel-header">Your migration journey</h2>
    <div class="panel-body">
      <ol class="steps">
        ${stepNames.map((n, i) => `<li>${n}${badge(s.steps[i])}</li>`).join('\n        ')}
      </ol>
    </div>
  </section>

  <section class="spectrum-panel">
    <h2 class="spectrum-panel-header">Page templates</h2>
    <div class="panel-body">
      <table>
        <thead><tr><th>Template</th><th>Pages</th><th>Desktop</th><th>Mobile</th><th>Status</th></tr></thead>
        <tbody>
        ${(s.templates || []).map((t) => `<tr><td>${esc(t.name)}</td><td>${t.pages}</td><td>${yn(t.desktop)}</td><td>${yn(t.mobile)}</td><td>${badge(t.status)}</td></tr>`).join('\n        ')}
        </tbody>
      </table>
    </div>
  </section>

  <section class="spectrum-panel">
    <h2 class="spectrum-panel-header">Pages migrated</h2>
    <div class="panel-body">
      <p>${(s.pagesReady || []).length} of ${s.pagesTotal || 0} pages are ready on the preview site.</p>
      <details${detailsOpen}>
        <summary>Ready pages</summary>
        <ul>
          ${pagesList || '<li>No pages are ready yet.</li>'}
        </ul>
      </details>
    </div>
  </section>

  <section class="spectrum-panel">
    <h2 class="spectrum-panel-header">Progress</h2>
    <div class="panel-body">
      <div class="bar"><span style="width: ${pct}%"></span></div>
      <p class="estimate">${pct}% complete · ${esc(estimate)}</p>
    </div>
  </section>

  <section class="spectrum-panel">
    <h2 class="spectrum-panel-header">What's happening now</h2>
    <div class="panel-body">
      <p>${esc(s.now)}</p>
      ${s.attention ? '<p>Some pages need a closer look; we\'re on it.</p>' : ''}
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
fs.writeFileSync(outPath, html);
console.log(`status-page: wrote ${outPath} (${pct}%, ${estimate})`);
