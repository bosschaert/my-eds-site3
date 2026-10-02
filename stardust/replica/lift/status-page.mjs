// Rewrites tools/replica/progress.html (owner status page) from stardust/replica/status-page.json + run.json.
import fs from 'node:fs';
const run = JSON.parse(fs.readFileSync('stardust/.labs/run.json', 'utf8'));
const st = JSON.parse(fs.readFileSync('stardust/replica/status-page.json', 'utf8'));
const now = new Date();
const badge = (s) => {
  const m = { done: ['spectrum-badge--positive', 'Done'], ready: ['spectrum-badge--positive', 'Ready'], progress: ['spectrum-badge--informative', 'In progress'], attention: ['spectrum-badge--notice', 'Needs attention'], upcoming: ['', 'Upcoming'], yes: ['spectrum-badge--positive', 'Looks right'], pending: ['', 'Pending'] };
  const [cls, label] = m[s] || m.upcoming;
  return `<span class="spectrum-badge${cls ? ' ' + cls : ''}">${label}</span>`;
};
const stepNames = ['Analyzing your site', 'Capturing brand and design', 'Rebuilding page templates', 'Checking fidelity', 'Migrating your pages'];
const weights = [10, 10, 40, 10, 30];
const nTypes = st.templates.length || 1;
const tplFrac = st.templates.reduce((a, t) => a + (t.status === 'done' ? 1 : (t.desktop === 'yes' ? 0.5 : 0)), 0) / nTypes;
const pagesTotal = st.pages.length || 1;
const pagesReady = st.pages.filter((p) => p.ready).length;
let pct = 0;
pct += st.steps[0] === 'done' ? weights[0] : 0;
pct += st.steps[1] === 'done' ? weights[1] : 0;
pct += weights[2] * tplFrac;
pct += st.steps[3] === 'done' ? weights[3] : 0;
pct += weights[4] * (pagesReady / pagesTotal);
pct = Math.round(pct);
const started = new Date(run.startedAt), deadline = new Date(run.deadlineAt);
let estimate = 'Estimating…';
if (pct >= 10 && pct < 100) {
  const elapsedMin = (now - started) / 60000;
  const remain = elapsedMin / pct * (100 - pct);
  const q = (m) => Math.max(15, Math.round(m / 15) * 15);
  const lo = q(remain), hi = q(remain * 1.35 + 15);
  const maxMin = Math.max(0, (deadline - now) / 60000);
  const cap = (m) => Math.min(m, Math.floor(maxMin / 15) * 15);
  const fmt = (m) => (m >= 60 ? `${Math.floor(m / 60)} h${m % 60 ? ` ${m % 60} min` : ''}` : `${m} min`);
  estimate = `About ${fmt(cap(lo))} to ${fmt(cap(hi))} remaining`;
} else if (pct >= 100) estimate = 'Complete';
const overall = st.state === 'ready' ? badge('ready') : st.state === 'attention' ? badge('attention') : badge('progress');
const ts = now.toISOString().slice(0, 16).replace('T', ' ') + ' UTC';
const readyPages = st.pages.filter((p) => p.ready);
const detailsOpen = st.pages.length > 12 ? '' : ' open';
const pageList = readyPages.length
  ? `<ul>${readyPages.map((p) => `<li><a href="${run.previewUrl.replace(/\/$/, '')}${p.path}">${p.title}</a></li>`).join('')}</ul>`
  : '<p>No pages are ready on the preview site yet.</p>';
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
  .pct { display: flex; justify-content: space-between; margin: 0 0 8px; }
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
    ${overall}
  </header>
  <p class="meta">Source site: <a href="${run.scope.sourceUrl}">${run.scope.sourceUrl}</a><br>Preview site: <a href="${run.previewUrl}">${run.previewUrl}</a><br>Last updated: ${ts}</p>

  <section class="spectrum-panel">
    <h2 class="spectrum-panel-header">Journey</h2>
    <div class="panel-body">
      <ol class="steps">
${stepNames.map((n, i) => `        <li>${n}${badge(st.steps[i])}</li>`).join('\n')}
      </ol>
    </div>
  </section>

  <section class="spectrum-panel">
    <h2 class="spectrum-panel-header">Page templates</h2>
    <div class="panel-body">
      <table>
        <thead><tr><th>Template</th><th>Pages</th><th>Desktop</th><th>Mobile</th><th>Status</th></tr></thead>
        <tbody>
${st.templates.map((t) => `<tr><td>${t.name}</td><td>${t.pages}</td><td>${badge(t.desktop || 'pending')}</td><td>${badge(t.mobile || 'pending')}</td><td>${badge(t.status)}</td></tr>`).join('\n')}
        </tbody>
      </table>
    </div>
  </section>

  <section class="spectrum-panel">
    <h2 class="spectrum-panel-header">Pages migrated</h2>
    <div class="panel-body">
      <p>${pagesReady} of ${st.pages.length} pages are ready on the preview site.</p>
      <details${detailsOpen}><summary>Ready pages</summary>${pageList}</details>
    </div>
  </section>

  <section class="spectrum-panel">
    <h2 class="spectrum-panel-header">Progress</h2>
    <div class="panel-body">
      <p class="pct"><span>${pct}% complete</span></p>
      <div class="bar"><span style="width:${pct}%"></span></div>
      <p class="estimate">${estimate}</p>
    </div>
  </section>

  <section class="spectrum-panel">
    <h2 class="spectrum-panel-header">What's happening now</h2>
    <div class="panel-body">
      <p>${st.now}</p>${st.note ? `\n      <p>${st.note}</p>` : ''}
    </div>
  </section>

  <section class="spectrum-panel">
    <h2 class="spectrum-panel-header">What's next</h2>
    <div class="panel-body">
      <p>${st.next}</p>
    </div>
  </section>
</main>
</body>
</html>
`;
fs.writeFileSync('tools/replica/progress.html', html);
console.log(`status page: ${pct}% — ${estimate}`);
