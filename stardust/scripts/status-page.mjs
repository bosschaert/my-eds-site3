#!/usr/bin/env node
// Rewrites tools/replica/progress.html (owner-facing status page) from stardust/replica/status-page.json.
// Usage: node stardust/scripts/status-page.mjs [--set key=value ...]
//   keys: steps.<i>=done|progress|upcoming (i=0..4), templates=<json>, pages=<json>, now=<text>, next=<text>, state=progress|ready|attention, note=<text>|-
import fs from 'node:fs';
const RUN = JSON.parse(fs.readFileSync('stardust/.labs/run.json', 'utf8'));
const SP = 'stardust/replica/status-page.json';
const OUT = 'tools/replica/progress.html';
let s = fs.existsSync(SP) ? JSON.parse(fs.readFileSync(SP, 'utf8')) : {
  state: 'progress', steps: ['progress', 'upcoming', 'upcoming', 'upcoming', 'upcoming'],
  templates: [], pages: [], now: '', next: '', note: '',
};
const args = process.argv.slice(2);
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--set') {
    const kv = args[++i]; const eq = kv.indexOf('='); const k = kv.slice(0, eq); const v = kv.slice(eq + 1);
    if (k.startsWith('steps.')) s.steps[Number(k.slice(6))] = v;
    else if (k === 'templates' || k === 'pages') s[k] = JSON.parse(v);
    else s[k] = v === '-' ? '' : v;
  }
}
fs.writeFileSync(SP, JSON.stringify(s, null, 2));
const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const badge = (st) => {
  const map = { done: ['positive', 'Done'], ready: ['positive', 'Ready'], progress: ['informative', 'In progress'], attention: ['notice', 'Needs attention'], upcoming: ['', 'Upcoming'], yes: ['positive', 'Looks right'], pending: ['', 'Pending'], no: ['notice', 'Needs attention'] };
  const [m, label] = map[st] || ['', st];
  return `<span class="spectrum-badge${m ? ` spectrum-badge--${m}` : ''}">${label}</span>`;
};
// percent: 10,10,40,10,30
const stepPct = (st) => (st === 'done' ? 1 : st === 'progress' ? 0.5 : 0);
const tplCount = Math.max(1, s.templates.length);
const tplDone = s.templates.filter((t) => t.status === 'done').length + 0.5 * s.templates.filter((t) => t.status === 'progress').length;
const pageCount = Math.max(1, s.pages.length);
const pageDone = s.pages.filter((p) => p.ready).length;
let pct = 10 * stepPct(s.steps[0]) + 10 * stepPct(s.steps[1]);
pct += 40 * (s.templates.length ? tplDone / tplCount : stepPct(s.steps[2]));
pct += 10 * stepPct(s.steps[3]);
pct += 30 * (s.pages.length ? pageDone / pageCount : stepPct(s.steps[4]));
pct = Math.round(Math.min(100, pct));
const now = new Date();
const started = new Date(RUN.startedAt); const deadline = new Date(RUN.deadlineAt);
const fmt = (min) => { const h = Math.floor(min / 60); const m = min % 60; return h ? `${h} h${m ? ` ${m} min` : ''}` : `${m} min`; };
let estimate = 'Estimating…';
if (pct >= 100) estimate = 'Complete';
else if (pct >= 10) {
  const elapsedMin = (now - started) / 60000;
  const remain = elapsedMin * (100 - pct) / pct;
  const maxRemain = Math.max(0, (deadline - now) / 60000);
  const lo = Math.min(maxRemain, Math.max(15, Math.round(remain * 0.8 / 15) * 15));
  const hi = Math.min(maxRemain, Math.max(lo, Math.round(remain * 1.3 / 15) * 15));
  const loR = Math.floor(lo / 15) * 15; const hiR = Math.floor(hi / 15) * 15;
  estimate = hiR <= 0 ? 'Finishing up' : (loR === hiR ? `About ${fmt(hiR)} remaining` : `About ${fmt(Math.max(15, loR))} to ${fmt(hiR)} remaining`);
}
const ts = now.toISOString().slice(0, 16).replace('T', ' ') + ' UTC';
const stepNames = ['Analyzing your site', 'Capturing brand and design', 'Rebuilding page templates', 'Checking fidelity', 'Migrating your pages'];
const preview = RUN.previewUrl;
const tplRows = s.templates.length ? s.templates.map((t) => `<tr><td>${esc(t.name)}</td><td>${t.pages}</td><td>${badge(t.desktop || 'pending')}</td><td>${badge(t.mobile || 'pending')}</td><td>${badge(t.status)}</td></tr>`).join('\n') : '<tr><td colspan="5">Templates are identified once the site analysis completes.</td></tr>';
const readyPages = s.pages.filter((p) => p.ready);
const pageList = readyPages.length ? `<ul>${readyPages.map((p) => `<li><a href="${esc(new URL(p.path, preview).href)}">${esc(p.title || p.path)}</a></li>`).join('')}</ul>` : '<p>No pages are ready on the preview site yet.</p>';
const openAttr = s.pages.length > 12 ? '' : ' open';
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
    ${badge(s.state)}
  </header>
  <p class="meta">Source site: <a href="${esc(RUN.scope.sourceUrl)}">${esc(RUN.scope.sourceUrl)}</a><br>Preview site: <a href="${esc(preview)}">${esc(preview)}</a><br>Last updated: ${ts}</p>

  <section class="spectrum-panel">
    <h2 class="spectrum-panel-header">Journey</h2>
    <div class="panel-body">
      <ol class="steps">
${stepNames.map((n, i) => `        <li>${n}${badge(s.steps[i])}</li>`).join('\n')}
      </ol>
    </div>
  </section>

  <section class="spectrum-panel">
    <h2 class="spectrum-panel-header">Page templates</h2>
    <div class="panel-body">
      <table>
        <thead><tr><th>Template</th><th>Pages</th><th>Desktop</th><th>Mobile</th><th>Status</th></tr></thead>
        <tbody>
${tplRows}
        </tbody>
      </table>
    </div>
  </section>

  <section class="spectrum-panel">
    <h2 class="spectrum-panel-header">Pages migrated</h2>
    <div class="panel-body">
      <p>${pageDone} of ${s.pages.length} pages are ready on the preview site.</p>
      <details${openAttr}><summary>Ready pages</summary>${pageList}</details>
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
      <p>${esc(s.now)}</p>${s.note ? `\n      <p>${esc(s.note)}</p>` : ''}
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
fs.writeFileSync(OUT, html);
console.log(`status-page: ${OUT} pct=${pct} estimate="${estimate}"`);
