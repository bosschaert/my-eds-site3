// Renders tools/replica/progress.html (site-owner status page) from stardust/replica/status-page.json
// and stardust/.labs/run.json. Static HTML, Experience Catalyst theme classes only, no JS.
import fs from 'node:fs';
const S = JSON.parse(fs.readFileSync('stardust/replica/status-page.json', 'utf8'));
const R = JSON.parse(fs.readFileSync('stardust/.labs/run.json', 'utf8'));
const now = new Date();
const badge = (state) => {
  const cls = { Done: 'spectrum-badge--positive', Ready: 'spectrum-badge--positive', 'In progress': 'spectrum-badge--informative', 'Needs attention': 'spectrum-badge--notice' }[state] || '';
  return `<span class="spectrum-badge ${cls}">${state}</span>`;
};
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
// percent: weights 10,10,40,10,30
const w = [10, 10, 40, 10, 30];
const stepPct = S.steps.map((st, i) => {
  if (i === 2) return w[i] * (S.templates.filter(t => t.status === 'Done').length / Math.max(1, S.templates.length));
  if (i === 4) return w[i] * (S.pagesReady.length / Math.max(1, S.pagesTotal));
  return st.state === 'Done' ? w[i] : 0;
});
const pct = Math.round(stepPct.reduce((a, b) => a + b, 0));
let estimate = 'Estimating…';
if (pct >= 10 && pct < 100) {
  const elapsedMin = (now - new Date(R.startedAt)) / 60000;
  let remaining = elapsedMin * (100 - pct) / pct;
  const deadlineMin = (new Date(R.deadlineAt) - now) / 60000;
  remaining = Math.min(remaining, deadlineMin);
  const lo = Math.max(15, Math.floor(remaining / 15) * 15); const hi = Math.min(lo + 15, Math.floor(deadlineMin / 15) * 15);
  estimate = hi > lo ? `About ${lo}–${hi} minutes remaining` : `About ${lo} minutes remaining`;
} else if (pct >= 100) estimate = 'Complete';
const ts = now.toISOString().replace('T', ' ').slice(0, 16) + ' UTC';
const pagesList = S.pagesReady.map(p => `<li><a href="${esc(p.url)}">${esc(p.title)}</a></li>`).join('') || '<li>No pages are live on the preview site yet.</li>';
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
  header { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
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
    ${badge(S.overall)}
  </header>
  <p class="meta">Source site: <a href="${esc(R.scope.sourceUrl)}">${esc(R.scope.sourceUrl)}</a><br>Preview site: <a href="${esc(R.previewUrl)}">${esc(R.previewUrl)}</a><br>Last updated: ${ts}</p>

  <section class="spectrum-panel">
    <h2 class="spectrum-panel-header">Journey</h2>
    <div class="panel-body">
      <ol class="steps">
${S.steps.map(st => `        <li><span>${esc(st.name)}</span>${badge(st.state)}</li>`).join('\n')}
      </ol>
    </div>
  </section>

  <section class="spectrum-panel">
    <h2 class="spectrum-panel-header">Page templates</h2>
    <div class="panel-body">
      <table>
        <thead><tr><th>Template</th><th>Pages</th><th>Desktop</th><th>Mobile</th><th>Status</th></tr></thead>
        <tbody>
${S.templates.map(t => `          <tr><td>${esc(t.name)}</td><td>${t.pages}</td><td>${esc(t.desktop)}</td><td>${esc(t.mobile)}</td><td>${badge(t.status)}</td></tr>`).join('\n')}
        </tbody>
      </table>
    </div>
  </section>

  <section class="spectrum-panel">
    <h2 class="spectrum-panel-header">Pages migrated</h2>
    <div class="panel-body">
      <p>${S.pagesReady.length} of ${S.pagesTotal} page${S.pagesTotal === 1 ? '' : 's'} ready on the preview site.</p>
      <details${S.pagesTotal > 12 ? '' : ' open'}>
        <summary>Ready pages</summary>
        <ul>${pagesList}</ul>
      </details>
    </div>
  </section>

  <section class="spectrum-panel">
    <h2 class="spectrum-panel-header">Progress</h2>
    <div class="panel-body">
      <p>${pct}% complete</p>
      <div class="bar" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><span style="width: ${pct}%"></span></div>
      <p class="estimate">${estimate}</p>
    </div>
  </section>

  <section class="spectrum-panel">
    <h2 class="spectrum-panel-header">What's happening now</h2>
    <div class="panel-body"><p>${esc(S.now)}</p>${S.attention ? '<p>Some pages need a closer look; we’re on it.</p>' : ''}</div>
  </section>

  <section class="spectrum-panel">
    <h2 class="spectrum-panel-header">What's next</h2>
    <div class="panel-body"><p>${esc(S.next)}</p></div>
  </section>
</main>
</body>
</html>
`;
fs.writeFileSync('tools/replica/progress.html', html);
console.log(`status page written: ${pct}% — ${estimate}`);
