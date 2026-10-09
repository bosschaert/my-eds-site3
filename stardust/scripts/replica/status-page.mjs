#!/usr/bin/env node
// Renders tools/replica/progress.html (owner-facing status page) from stardust/replica/status-page.json + stardust/.labs/run.json.
// Usage: node stardust/scripts/replica/status-page.mjs [--pct N]   (pct defaults to the weighted formula)
import fs from 'node:fs';
if (process.argv.includes('--help')) { console.log('Usage: node stardust/scripts/replica/status-page.mjs [--pct N]  (renders tools/replica/progress.html from stardust/replica/status-page.json + run.json; --help touches no file)'); process.exit(0); }
const S = JSON.parse(fs.readFileSync('stardust/replica/status-page.json', 'utf8'));
const R = JSON.parse(fs.readFileSync('stardust/.labs/run.json', 'utf8'));
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const badge = (state) => {
  const cls = { Done: 'spectrum-badge--positive', Ready: 'spectrum-badge--positive', 'In progress': 'spectrum-badge--informative', 'Needs attention': 'spectrum-badge--notice' }[state] || '';
  return `<span class="spectrum-badge${cls ? ' ' + cls : ''}">${esc(state)}</span>`;
};
// percent: steps weighted 10,10,40,10,30; template step split per page type, migration per page
const W = [10, 10, 40, 10, 30];
const stepFrac = (i) => {
  const st = S.steps[i];
  if (st === 'Done') return 1;
  if (st !== 'In progress') return 0;
  if (i === 2) { const t = S.templates; return t.length ? t.reduce((a, x) => a + (x.status === 'Done' ? 1 : x.status === 'In progress' ? (x.partial ?? 0.5) : 0), 0) / t.length : 0; }
  if (i === 4) { const p = S.pages; return p.length ? p.filter((x) => x.ready).length / p.length : 0; }
  return S.partial?.[i] ?? 0.5;
};
let pct = W.reduce((a, w, i) => a + w * stepFrac(i), 0);
const ai = process.argv.indexOf('--pct'); if (ai > 0) pct = Number(process.argv[ai + 1]);
pct = Math.max(0, Math.min(100, Math.round(pct)));
const now = new Date();
const runningMs = (R.priorRunningMs || 0) + (now - new Date(R.startedAt));
const q15 = (ms) => Math.max(15, Math.round(ms / 900000) * 15);
const fmt = (m) => (m >= 60 ? `${Math.floor(m / 60)} h${m % 60 ? ' ' + (m % 60) + ' min' : ''}` : `${m} min`);
let estimate = 'Estimating…';
if (pct >= 100) estimate = 'Complete';
else if (pct >= 10) {
  const rem = runningMs * (100 - pct) / pct;
  const cap = new Date(R.deadlineAt) - now;
  let lo = q15(rem * 0.8), hi = q15(rem * 1.25);
  const capMin = Math.floor(cap / 900000) * 15;
  if (hi > capMin) hi = capMin; if (lo > hi) lo = hi;
  estimate = lo <= 0 ? 'Less than 15 min' : lo === hi ? `about ${fmt(hi)}` : `${fmt(lo)} – ${fmt(hi)}`;
}
const ts = now.toISOString().slice(0, 16).replace('T', ' ') + ' UTC';
const ready = S.pages.filter((p) => p.ready).length;
const preview = R.previewUrl.replace(/\/$/, '');
const stepNames = ['Analyzing your site', 'Capturing brand and design', 'Rebuilding page templates', 'Checking fidelity', 'Migrating your pages'];
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
    ${badge(S.overall)}
  </header>
  <p class="meta">Source site: <a href="${esc(R.scope.sourceUrl)}">${esc(R.scope.sourceUrl)}</a><br>Preview site: <a href="${esc(R.previewUrl)}">${esc(R.previewUrl)}</a><br>Last updated: ${ts}</p>

  <section class="spectrum-panel">
    <h2 class="spectrum-panel-header">Your migration journey</h2>
    <div class="panel-body">
      <ol class="steps">
${stepNames.map((n, i) => `        <li>${n}${badge(S.steps[i])}</li>`).join('\n')}
      </ol>
    </div>
  </section>

  <section class="spectrum-panel">
    <h2 class="spectrum-panel-header">Page templates</h2>
    <div class="panel-body">
      <table>
        <thead><tr><th>Template</th><th>Pages</th><th>Desktop</th><th>Mobile</th><th>Status</th></tr></thead>
        <tbody>
${S.templates.map((t) => `        <tr><td>${esc(t.name)}</td><td>${t.pages}</td><td>${esc(t.desktop)}</td><td>${esc(t.mobile)}</td><td>${badge(t.status)}</td></tr>`).join('\n')}
        </tbody>
      </table>
    </div>
  </section>

  <section class="spectrum-panel">
    <h2 class="spectrum-panel-header">Pages migrated: ${ready} of ${S.pages.length}</h2>
    <div class="panel-body">
      <details${S.pages.length > 12 ? '' : ' open'}>
        <summary>Page list</summary>
        <ul class="pages">
${S.pages.map((p) => `          <li>${p.ready ? `<a href="${esc(preview + p.path)}">${esc(p.title)}</a>` : esc(p.title)} ${badge(p.ready ? 'Ready' : p.state)}</li>`).join('\n')}
        </ul>
      </details>
    </div>
  </section>

  <section class="spectrum-panel">
    <h2 class="spectrum-panel-header">Progress: ${pct}% complete</h2>
    <div class="panel-body">
      <div class="bar"><span style="width: ${pct}%"></span></div>
      <p class="estimate">Estimated time remaining: ${estimate}</p>
    </div>
  </section>

  <section class="spectrum-panel">
    <h2 class="spectrum-panel-header">What's happening now</h2>
    <div class="panel-body"><p>${esc(S.now)}</p></div>
  </section>

  <section class="spectrum-panel">
    <h2 class="spectrum-panel-header">What's next</h2>
    <div class="panel-body"><p>${esc(S.next)}</p></div>
  </section>
</main>
</body>
</html>
`;
fs.mkdirSync('tools/replica', { recursive: true });
fs.writeFileSync('tools/replica/progress.html', html);
console.log(`status-page: wrote tools/replica/progress.html — ${pct}% · ${estimate} · ${ts}`);
