// Render tools/replica/progress.html (customer status page) from stardust/replica/status-page.json + stardust/.labs/run.json.
// Usage: node stardust/replica/status-page.mjs   (rewrites the whole file; never appends)
import fs from 'node:fs';
const run = JSON.parse(fs.readFileSync('stardust/.labs/run.json', 'utf8'));
const s = JSON.parse(fs.readFileSync('stardust/replica/status-page.json', 'utf8'));
const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const badge = (state) => {
  const cls = { Done: 'spectrum-badge spectrum-badge--positive', Ready: 'spectrum-badge spectrum-badge--positive', 'Looks right': 'spectrum-badge spectrum-badge--positive',
    'In progress': 'spectrum-badge spectrum-badge--informative', Checking: 'spectrum-badge spectrum-badge--informative',
    'Needs attention': 'spectrum-badge spectrum-badge--notice', Upcoming: 'spectrum-badge' }[state] || 'spectrum-badge';
  return `<span class="${cls}">${esc(state)}</span>`;
};
const stepNames = ['Analyzing your site', 'Capturing brand and design', 'Rebuilding page templates', 'Checking fidelity', 'Migrating your pages'];
const weights = [10, 10, 40, 10, 30];
const frac = (st) => st.state === 'Done' ? 1 : (st.state === 'Upcoming' ? 0 : (typeof st.frac === 'number' ? st.frac : 0.5));
let pct = 0; s.steps.forEach((st, i) => { pct += weights[i] * frac(st); });
pct = Math.max(0, Math.min(100, Math.round(pct)));
const now = new Date();
const runningMs = (run.priorRunningMs || 0) + (now - new Date(run.startedAt));
let estimate = 'Estimating…';
if (pct >= 10 && pct < 100) {
  const remainMs = runningMs * (100 - pct) / pct;
  const q = 15 * 60 * 1000;
  let lo = Math.max(q, Math.round(remainMs * 0.8 / q) * q), hi = Math.max(lo + q, Math.round(remainMs * 1.3 / q) * q);
  const deadline = new Date(run.deadlineAt) - now;
  if (hi > deadline) hi = Math.max(q, Math.floor(deadline / q) * q);
  if (lo > hi) lo = hi;
  const fmt = (ms) => { const m = Math.round(ms / 60000); const h = Math.floor(m / 60), r = m % 60; return h ? (r ? `${h} h ${r} min` : `${h} h`) : `${m} min`; };
  estimate = lo === hi ? `About ${fmt(hi)} remaining` : `About ${fmt(lo)} to ${fmt(hi)} remaining`;
} else if (pct >= 100) estimate = 'Complete';
const ts = now.toISOString().slice(0, 16).replace('T', ' ') + ' UTC';
const pagesTotal = s.pages.total, ready = s.pages.ready || [];
const openAttr = pagesTotal > 12 ? '' : ' open';
const pageList = ready.length ? ready.map((p) => `<li><a href="${esc(p.url)}">${esc(p.title || p.url)}</a></li>`).join('\n          ') : '<li>No pages are ready yet.</li>';
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
  ul.pages { margin: 8px 0 0; padding-left: 20px; }
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
    <h2 class="spectrum-panel-header">Your migration journey</h2>
    <div class="panel-body">
      <ol class="steps">
        ${s.steps.map((st, i) => `<li>${stepNames[i]}${badge(st.state)}</li>`).join('\n        ')}
      </ol>
    </div>
  </section>

  <section class="spectrum-panel">
    <h2 class="spectrum-panel-header">Page templates</h2>
    <div class="panel-body">
      <table>
        <thead><tr><th>Template</th><th>Pages</th><th>Desktop</th><th>Mobile</th><th>Status</th></tr></thead>
        <tbody>
          ${s.templates.map((t) => `<tr><td>${esc(t.name)}</td><td>${t.pages}</td><td>${badge(t.desktop)}</td><td>${badge(t.mobile)}</td><td>${badge(t.status)}</td></tr>`).join('\n          ')}
        </tbody>
      </table>
    </div>
  </section>

  <section class="spectrum-panel">
    <h2 class="spectrum-panel-header">Pages migrated</h2>
    <div class="panel-body">
      <p>${ready.length} of ${pagesTotal} page${pagesTotal === 1 ? '' : 's'} ready on the preview site.</p>
      <details${openAttr}>
        <summary>Ready pages</summary>
        <ul class="pages">
          ${pageList}
        </ul>
      </details>
    </div>
  </section>

  <section class="spectrum-panel">
    <h2 class="spectrum-panel-header">Progress</h2>
    <div class="panel-body">
      <div class="bar"><span style="width: ${pct}%"></span></div>
      <p class="estimate">${pct}% complete · ${estimate}</p>
    </div>
  </section>

  <section class="spectrum-panel">
    <h2 class="spectrum-panel-header">What's happening now</h2>
    <div class="panel-body">
      <p>${esc(s.now)}</p>${s.attention ? `\n      <p>Some pages need a closer look; we're on it.</p>` : ''}
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
console.log(`status page: ${pct}% · ${estimate} · ${ts}`);
