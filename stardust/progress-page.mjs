#!/usr/bin/env node
// Renders tools/replica/progress.html (owner status page) from stardust/progress-page.json + stardust/.labs/run.json.
import fs from 'node:fs';
const run = JSON.parse(fs.readFileSync('stardust/.labs/run.json', 'utf8'));
const s = JSON.parse(fs.readFileSync('stardust/progress-page.json', 'utf8'));
const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const badge = (state) => {
  const cls = { Done: ' spectrum-badge--positive', Ready: ' spectrum-badge--positive', 'In progress': ' spectrum-badge--informative', 'Needs attention': ' spectrum-badge--notice', Yes: ' spectrum-badge--positive', Checking: ' spectrum-badge--informative' }[state] || '';
  return `<span class="spectrum-badge${cls}">${esc(state)}</span>`;
};
const STEPS = ['Analyzing your site', 'Capturing brand and design', 'Rebuilding page templates', 'Checking fidelity', 'Migrating your pages'];
const W = [10, 10, 40, 10, 30];
// s.steps: array of 5 states; s.stepFraction: optional fractional progress per step (0..1) overriding Done/In progress
const frac = STEPS.map((_, i) => {
  if (typeof s.stepFraction?.[i] === 'number') return Math.max(0, Math.min(1, s.stepFraction[i]));
  return s.steps[i] === 'Done' ? 1 : 0;
});
const pct = Math.round(frac.reduce((a, f, i) => a + f * W[i], 0));
const now = Date.now();
const runningMs = (run.priorRunningMs || 0) + (now - Date.parse(run.startedAt));
const deadline = Date.parse(run.deadlineAt);
const r15 = (ms) => Math.max(15, Math.round(ms / 900000) * 15);
let estimate = 'Estimating…';
if (s.overall === 'Ready' || pct >= 100) estimate = 'Complete';
else if (pct >= 10) {
  const remain = runningMs * (100 - pct) / pct;
  const cap = Math.max(0, deadline - now);
  let lo = r15(Math.min(remain * 0.8, cap)); let hi = r15(Math.min(remain * 1.3, cap));
  if (hi <= lo) hi = lo + 15;
  if (now + hi * 60000 > deadline) hi = Math.max(lo, Math.floor(cap / 900000) * 15);
  const fmt = (m) => (m >= 60 ? `${Math.floor(m / 60)} h${m % 60 ? ` ${m % 60} min` : ''}` : `${m} min`);
  estimate = hi > lo ? `About ${fmt(lo)} to ${fmt(hi)} remaining` : `About ${fmt(lo)} remaining`;
}
const ts = new Date(now).toISOString().replace('T', ' ').slice(0, 16) + ' UTC';
const pagesReady = s.pages.filter((p) => p.ready);
const details = `<details${s.pages.length > 12 ? '' : ' open'}><summary>Pages</summary><ul class="pages">${s.pages.map((p) => `<li>${p.ready ? `<a href="${esc(p.url)}">${esc(p.title)}</a>` : esc(p.title)} ${badge(p.ready ? 'Ready' : (p.state || 'Upcoming'))}</li>`).join('')}</ul></details>`;
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
  th { color: var(--spectrum-text-subdued); font-weight: 700; }
  details summary { cursor: pointer; margin-bottom: 8px; }
</style>
</head>
<body>
<main>
  <header>
    <h1>Migration status</h1>
    ${badge(s.overall)}
  </header>
  <p class="meta">Source site: <a href="${esc(run.scope.sourceUrl)}">${esc(run.scope.sourceUrl)}</a><br>Preview site: <a href="${esc(run.previewUrl)}">${esc(run.previewUrl)}</a><br>Last updated: ${ts}</p>

  <section class="spectrum-panel">
    <h2 class="spectrum-panel-header">Journey</h2>
    <div class="panel-body">
      <ol class="steps">
${STEPS.map((t, i) => `        <li>${t}${badge(s.steps[i])}</li>`).join('\n')}
      </ol>
    </div>
  </section>

  <section class="spectrum-panel">
    <h2 class="spectrum-panel-header">Page templates</h2>
    <div class="panel-body">
      <table>
        <thead><tr><th>Template</th><th>Pages</th><th>Desktop</th><th>Mobile</th><th>Status</th></tr></thead>
        <tbody>
${s.templates.map((t) => `          <tr><td>${esc(t.name)}</td><td>${t.pages}</td><td>${badge(t.desktop)}</td><td>${badge(t.mobile)}</td><td>${badge(t.status)}</td></tr>`).join('\n')}
        </tbody>
      </table>
    </div>
  </section>

  <section class="spectrum-panel">
    <h2 class="spectrum-panel-header">Pages migrated: ${pagesReady.length} of ${s.pages.length}</h2>
    <div class="panel-body">
      ${details}
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
    <div class="panel-body">
      <p>${esc(s.now)}</p>${s.attention ? '\n      <p>Some pages need a closer look; we\'re on it.</p>' : ''}
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
