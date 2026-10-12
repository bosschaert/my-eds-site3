#!/usr/bin/env node
// Renders tools/replica/progress.html (owner status page) from stardust/replica/status-page.json + run.json.
import fs from 'node:fs';
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log('Usage: node stardust/scripts/status-page.mjs\nReads stardust/.labs/run.json and stardust/replica/status-page.json.\nWrites: tools/replica/progress.html');
  process.exit(0);
}
const run = JSON.parse(fs.readFileSync('stardust/.labs/run.json', 'utf8'));
const st = JSON.parse(fs.readFileSync('stardust/replica/status-page.json', 'utf8'));
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const badge = (state) => {
  const cls = { Done: ' spectrum-badge--positive', Ready: ' spectrum-badge--positive', 'In progress': ' spectrum-badge--informative', 'Needs attention': ' spectrum-badge--notice', Upcoming: '', Yes: ' spectrum-badge--positive', Pending: '' }[state] ?? '';
  return `<span class="spectrum-badge${cls}">${esc(state)}</span>`;
};
const frac = (s) => (s === 'Done' ? 1 : s === 'In progress' ? 0.5 : 0);
const STEPS = ['Analyzing your site', 'Capturing brand and design', 'Rebuilding page templates', 'Checking fidelity', 'Migrating your pages'];
const steps = st.steps; // array of 5 states
const tpls = st.templates || [];
const tplFrac = tpls.length ? tpls.reduce((a, t) => a + (t.status === 'Done' ? 1 : t.status === 'In progress' ? 0.5 : 0), 0) / tpls.length : frac(steps[2]);
const total = st.pages?.total ?? 0;
const ready = st.pages?.ready || [];
const migFrac = total ? ready.length / total : frac(steps[4]);
const pct = Math.round(10 * frac(steps[0]) + 10 * frac(steps[1]) + 40 * tplFrac + 10 * frac(steps[3]) + 30 * migFrac);
const now = Date.now();
const runningMs = (run.priorRunningMs || 0) + (now - Date.parse(run.startedAt));
const deadlineMs = Date.parse(run.deadlineAt) - now;
const q15 = (ms) => Math.max(15, Math.round(ms / 900000) * 15);
const fmt = (min) => (min >= 60 ? `${Math.floor(min / 60)} h${min % 60 ? ` ${min % 60} min` : ''}` : `${min} min`);
let estimate;
if (pct >= 100) estimate = 'Complete';
else if (pct < 10) estimate = 'Estimating…';
else {
  const rem = runningMs * (100 - pct) / pct;
  let lo = Math.min(rem * 0.8, deadlineMs), hi = Math.min(rem * 1.3, deadlineMs);
  lo = q15(lo); hi = Math.max(lo, q15(hi));
  if (hi * 60000 > deadlineMs) hi = Math.max(15, Math.floor(deadlineMs / 900000) * 15);
  if (lo > hi) lo = hi;
  estimate = lo === hi ? `About ${fmt(lo)} remaining` : `About ${fmt(lo)} to ${fmt(hi)} remaining`;
}
const updated = new Date(now).toISOString().replace('T', ' ').slice(0, 16) + ' UTC';
const overall = st.overall || (pct >= 100 ? 'Ready' : 'In progress');
const preview = run.previewUrl;
const pageLinks = ready.map((p) => `<li><a href="${esc(p.url)}">${esc(p.label || p.path)}</a></li>`).join('\n          ');
const detailsOpen = total > 12 ? '' : ' open';
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
    ${badge(overall)}
  </header>
  <p class="meta">Source site: <a href="${esc(run.scope.sourceUrl)}">${esc(run.scope.sourceUrl)}</a><br>Preview site: <a href="${esc(preview)}">${esc(preview)}</a><br>Last updated: ${updated}</p>

  <section class="spectrum-panel">
    <h2 class="spectrum-panel-header">Journey</h2>
    <div class="panel-body">
      <ol class="steps">
        ${STEPS.map((s, i) => `<li>${esc(s)}${badge(steps[i])}</li>`).join('\n        ')}
      </ol>
    </div>
  </section>

  <section class="spectrum-panel">
    <h2 class="spectrum-panel-header">Page templates</h2>
    <div class="panel-body">
      <table>
        <thead><tr><th>Template</th><th>Pages</th><th>Desktop</th><th>Mobile</th><th>Status</th></tr></thead>
        <tbody>
          ${tpls.length ? tpls.map((t) => `<tr><td>${esc(t.name)}</td><td>${t.pages}</td><td>${badge(t.desktop)}</td><td>${badge(t.mobile)}</td><td>${badge(t.status)}</td></tr>`).join('\n          ') : '<tr><td colspan="5">We are identifying your page templates.</td></tr>'}
        </tbody>
      </table>
    </div>
  </section>

  <section class="spectrum-panel">
    <h2 class="spectrum-panel-header">Pages migrated</h2>
    <div class="panel-body">
      <p>${ready.length} of ${total} pages are ready on the preview site.</p>
      <details${detailsOpen}>
        <summary>Ready pages</summary>
        <ul>
          ${pageLinks || '<li>No pages are ready yet.</li>'}
        </ul>
      </details>
    </div>
  </section>

  <section class="spectrum-panel">
    <h2 class="spectrum-panel-header">Progress</h2>
    <div class="panel-body">
      <p>${pct}% complete</p>
      <div class="bar"><span style="width: ${pct}%"></span></div>
      <p class="estimate">${esc(estimate)}</p>
    </div>
  </section>

  <section class="spectrum-panel">
    <h2 class="spectrum-panel-header">What's happening now</h2>
    <div class="panel-body">
      <p>${esc(st.now)}</p>${st.needsPerson ? '\n      <p>Some pages need a closer look; we’re on it.</p>' : ''}
    </div>
  </section>

  <section class="spectrum-panel">
    <h2 class="spectrum-panel-header">What's next</h2>
    <div class="panel-body">
      <p>${esc(st.next)}</p>
    </div>
  </section>
</main>
</body>
</html>
`;
fs.mkdirSync('tools/replica', { recursive: true });
fs.writeFileSync('tools/replica/progress.html', html);
console.log(`status-page: ${pct}% — ${estimate} — ${overall}`);
