#!/usr/bin/env node
// Renders tools/replica/progress.html (customer status page) from stardust/replica/status-model.json
// + stardust/.labs/run.json. Whole-file rewrite every time. Layout-only inline CSS, spectrum classes.
import fs from 'node:fs';
const run = JSON.parse(fs.readFileSync('stardust/.labs/run.json', 'utf8'));
const m = JSON.parse(fs.readFileSync('stardust/replica/status-model.json', 'utf8'));
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const badge = st => {
  const cls = { Done: 'spectrum-badge spectrum-badge--positive', Ready: 'spectrum-badge spectrum-badge--positive',
    'In progress': 'spectrum-badge spectrum-badge--informative', 'Needs attention': 'spectrum-badge spectrum-badge--notice',
    Upcoming: 'spectrum-badge', Yes: 'spectrum-badge spectrum-badge--positive', Pending: 'spectrum-badge' }[st] || 'spectrum-badge';
  return `<span class="${cls}">${esc(st)}</span>`;
};
// steps: [{name, state, fraction}] fraction 0..1 (fraction drives percent; state drives the badge)
const W = [10, 10, 40, 10, 30];
const pct = Math.max(0, Math.min(100, Math.round(m.steps.reduce((a, s, i) => a + W[i] * (s.fraction ?? (s.state === 'Done' ? 1 : 0)), 0))));
const now = new Date();
const started = new Date(run.startedAt), deadline = new Date(run.deadlineAt);
let estimate = 'Estimating…';
if (pct >= 10 && pct < 100) {
  const elapsed = now - started;
  const remaining = elapsed / pct * (100 - pct);
  const q = 15 * 60 * 1000;
  const r15 = ms => Math.max(q, Math.round(ms / q) * q);
  const lo = r15(remaining * 0.75), hi = r15(remaining * 1.25);
  const maxLeft = deadline - now;
  const clamp = ms => Math.min(ms, Math.floor(maxLeft / q) * q);
  const fmt = ms => { const min = Math.round(ms / 60000); const h = Math.floor(min / 60), mm = min % 60; return h ? (mm ? `${h} h ${mm} min` : `${h} h`) : `${mm} min`; };
  const L = clamp(lo), H = clamp(hi);
  estimate = H <= 0 ? 'Finishing up' : (L === H ? `About ${fmt(H)} remaining` : `About ${fmt(L)} to ${fmt(H)} remaining`);
} else if (pct >= 100) estimate = 'Complete';
const overall = m.overall || (pct >= 100 ? 'Ready' : 'In progress');
const ready = m.pagesReady || [];
const total = m.pagesTotal || 0;
const openAttr = total > 12 ? '' : ' open';
const preview = run.previewUrl.replace(/\/$/, '');
const pageLinks = ready.length
  ? `<ul>${ready.map(p => `<li><a href="${esc(preview + p.path)}">${esc(p.label || p.path)}</a></li>`).join('')}</ul>`
  : '<p>No pages are live on the preview site yet.</p>';
const html = `<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Migration status</title>
<link rel="stylesheet" href="spectrum.css">
<style>
  main { max-width: 760px; margin: 0 auto; padding: 40px 24px 64px; }
  header { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
  header h1 { margin: 0 0 8px; }
  .meta { margin: 0 0 24px; }
  .meta p { margin: 4px 0; }
  .spectrum-panel { margin-bottom: 16px; }
  .spectrum-panel-header { margin: 0; padding: 0 16px; }
  .panel-body { padding: 16px; }
  .panel-body > :last-child { margin-bottom: 0; }
  .bar { height: 8px; border-radius: 9999px; background-color: var(--spectrum-gray-200); overflow: hidden; margin: 8px 0; }
  .bar span { display: block; height: 100%; background-color: var(--spectrum-accent-bg); }
  ol.steps { list-style: none; padding: 0; margin: 0; }
  ol.steps li { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 12px 0; }
  ol.steps li + li { border-top: 1px solid var(--spectrum-gray-200); }
  table { width: 100%; border-collapse: collapse; }
  th, td { padding: 8px; text-align: left; border-bottom: 1px solid var(--spectrum-gray-200); vertical-align: middle; }
  details summary { cursor: pointer; margin-bottom: 8px; }
</style>
</head>
<body>
<main>
<header>
  <div>
    <h1>Migration status</h1>
    <div class="meta">
      <p>Source site: <a href="${esc(run.scope.sourceUrl)}">${esc(run.scope.sourceUrl.replace(/^https?:\/\//, '').replace(/\/$/, ''))}</a></p>
      <p>Preview site: <a href="${esc(run.previewUrl)}">${esc(run.previewUrl.replace(/^https?:\/\//, '').replace(/\/$/, ''))}</a></p>
      <p>Last updated: ${esc(now.toISOString().replace('T', ' ').slice(0, 16))} UTC</p>
    </div>
  </div>
  <div>${badge(overall)}</div>
</header>

<section class="spectrum-panel">
  <h2 class="spectrum-panel-header">Your migration journey</h2>
  <div class="panel-body">
    <ol class="steps">
${m.steps.map(s => `      <li><span>${esc(s.name)}</span>${badge(s.state)}</li>`).join('\n')}
    </ol>
  </div>
</section>

<section class="spectrum-panel">
  <h2 class="spectrum-panel-header">Page templates</h2>
  <div class="panel-body">
    <table>
      <thead><tr><th>Template</th><th>Pages</th><th>Desktop</th><th>Mobile</th><th>Status</th></tr></thead>
      <tbody>
${m.templates.map(t => `        <tr><td>${esc(t.name)}</td><td>${t.pages}</td><td>${badge(t.desktop)}</td><td>${badge(t.mobile)}</td><td>${badge(t.status)}</td></tr>`).join('\n')}
      </tbody>
    </table>
  </div>
</section>

<section class="spectrum-panel">
  <h2 class="spectrum-panel-header">Pages migrated</h2>
  <div class="panel-body">
    <p>${ready.length} of ${total} pages are ready on the preview site.</p>
    <details${openAttr}>
      <summary>Ready pages</summary>
      ${pageLinks}
    </details>
  </div>
</section>

<section class="spectrum-panel">
  <h2 class="spectrum-panel-header">Overall progress</h2>
  <div class="panel-body">
    <p>${pct}% complete</p>
    <div class="bar" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><span style="width:${pct}%"></span></div>
    <p>${esc(estimate)}</p>
  </div>
</section>

<section class="spectrum-panel">
  <h2 class="spectrum-panel-header">What's happening now</h2>
  <div class="panel-body"><p>${esc(m.now)}</p>${m.attention ? '<p>Some pages need a closer look; we\'re on it.</p>' : ''}</div>
</section>

<section class="spectrum-panel">
  <h2 class="spectrum-panel-header">What's next</h2>
  <div class="panel-body"><p>${esc(m.next)}</p></div>
</section>
</main>
</body>
</html>
`;
fs.mkdirSync('tools/replica', { recursive: true });
fs.writeFileSync('tools/replica/progress.html', html);
console.log(`progress.html written: ${pct}% — ${overall} — ${estimate}`);
