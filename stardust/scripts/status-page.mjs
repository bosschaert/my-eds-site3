#!/usr/bin/env node
// Writes tools/replica/progress.html (customer status page) from stardust/replica/status-page.json.
// Usage: node stardust/scripts/status-page.mjs [--set key=value ...]
//   keys: state (In progress|Ready|Needs attention), step (1-5 current step index, 6 = all done),
//         now (text), next (text), templates (JSON), pages (JSON), attention (true|false)
import fs from 'node:fs';

const ROOT = process.cwd();
const RUN = JSON.parse(fs.readFileSync(`${ROOT}/stardust/.labs/run.json`, 'utf8'));
const SP = `${ROOT}/stardust/replica/status-page.json`;
const OUT = `${ROOT}/tools/replica/progress.html`;

let s = fs.existsSync(SP) ? JSON.parse(fs.readFileSync(SP, 'utf8')) : {
  step: 1, // 1-based current step; steps < step are Done; step 6 => all Done
  templateFraction: 0, // 0..1 done share of the template step
  fidelityFraction: 0, // 0..1
  templates: [], // {name, pages, desktop:'Yes'|'Checking'|'—', mobile, status}
  pages: [], // {url, title, ready:boolean}
  now: '', next: '', attention: false, ready: false,
};
const args = process.argv.slice(2);
for (let i = 0; i < args.length; i += 1) {
  if (args[i] === '--set') {
    const [k, ...rest] = args[i + 1].split('=');
    const v = rest.join('=');
    i += 1;
    if (['templates', 'pages'].includes(k)) s[k] = JSON.parse(v);
    else if (['attention', 'ready'].includes(k)) s[k] = v === 'true';
    else if (['step', 'templateFraction', 'fidelityFraction'].includes(k)) s[k] = Number(v);
    else s[k] = v;
  }
}
fs.mkdirSync(`${ROOT}/stardust/replica`, { recursive: true });
fs.writeFileSync(SP, `${JSON.stringify(s, null, 2)}\n`);

const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const STEPS = ['Analyzing your site', 'Capturing brand and design', 'Rebuilding page templates', 'Checking fidelity', 'Migrating your pages'];
const WEIGHTS = [10, 10, 40, 10, 30];
const stepState = (i) => (i + 1 < s.step ? 'Done' : i + 1 === s.step ? 'In progress' : 'Upcoming');
const total = s.pages.length || 1;
const readyPages = s.pages.filter((p) => p.ready).length;
let pct = 0;
STEPS.forEach((_, i) => {
  const st = stepState(i);
  if (st === 'Done') pct += WEIGHTS[i];
  else if (st === 'In progress') {
    if (i === 2) pct += WEIGHTS[i] * (s.templateFraction || 0);
    else if (i === 3) pct += WEIGHTS[i] * (s.fidelityFraction || 0);
    else if (i === 4) pct += WEIGHTS[i] * (readyPages / total);
  }
});
pct = Math.max(0, Math.min(100, Math.round(pct)));

const now = new Date();
const started = new Date(RUN.startedAt);
const deadline = new Date(RUN.deadlineAt);
const fmt = (d) => `${d.toISOString().slice(0, 10)} ${d.toISOString().slice(11, 16)} UTC`;
let estimate = 'Estimating…';
if (pct >= 100) estimate = 'Complete';
else if (pct >= 10) {
  const elapsedMin = (now - started) / 60000;
  const remainMin = elapsedMin * (100 - pct) / pct;
  const q = (m) => Math.max(15, Math.round(m / 15) * 15);
  const lo = q(remainMin * 0.8); let hi = q(remainMin * 1.3);
  const maxMin = Math.max(15, Math.floor((deadline - now) / 60000 / 15) * 15);
  hi = Math.min(hi, maxMin);
  const loC = Math.min(lo, hi);
  const h = (m) => (m >= 60 ? `${Math.floor(m / 60)} h${m % 60 ? ` ${m % 60} min` : ''}` : `${m} min`);
  estimate = loC === hi ? `About ${h(hi)} remaining` : `About ${h(loC)} to ${h(hi)} remaining`;
}

const overall = s.attention ? 'Needs attention' : (s.ready || pct >= 100 ? 'Ready' : 'In progress');
const badgeClass = overall === 'Ready' ? 'ready' : overall === 'Needs attention' ? 'attn' : '';
const openList = s.pages.length > 12 ? '' : ' open';
const pageItems = s.pages.map((p) => `<li>${p.ready
  ? `<a href="${esc(p.url)}">${esc(p.title || p.url)}</a> <span class="state">Ready</span>`
  : `${esc(p.title || p.url)} <span class="state">In progress</span>`}</li>`).join('\n      ');
const tplRows = s.templates.length ? s.templates.map((t) => `<tr><td>${esc(t.name)}</td><td>${esc(t.pages)}</td><td>${esc(t.desktop)}</td><td>${esc(t.mobile)}</td><td>${esc(t.status)}</td></tr>`).join('\n      ')
  : '<tr><td colspan="5">Templates will appear here once your site has been analyzed.</td></tr>';

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Migration status</title>
<style>
  :root { color-scheme: light; }
  body { margin: 0; font: 16px/1.5 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #1a1a1a; background: #f6f6f4; }
  main { max-width: 760px; margin: 0 auto; padding: 40px 24px 64px; }
  h1 { font-size: 28px; margin: 0 0 4px; }
  h2 { font-size: 18px; margin: 32px 0 12px; }
  .meta { color: #555; margin: 0 0 24px; }
  .meta a { color: inherit; }
  .badge { display: inline-block; padding: 2px 10px; border-radius: 999px; background: #e8efff; color: #1d4ed8; font-size: 13px; font-weight: 600; }
  .badge.ready { background: #e6f6ea; color: #15803d; }
  .badge.attn { background: #fff4e5; color: #b45309; }
  .bar { height: 10px; border-radius: 999px; background: #e3e3df; overflow: hidden; }
  .bar span { display: block; height: 100%; background: #1d4ed8; }
  .estimate { color: #555; margin-top: 8px; }
  ol.steps { list-style: none; padding: 0; margin: 0; }
  ol.steps li { display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid #e3e3df; }
  ol.steps .dot { width: 10px; height: 10px; border-radius: 50%; background: #c9c9c4; flex: none; }
  ol.steps .current .dot { background: #1d4ed8; }
  ol.steps .done .dot { background: #15803d; }
  .state { margin-left: auto; color: #555; font-size: 14px; }
  table { width: 100%; border-collapse: collapse; background: #fff; border: 1px solid #e3e3df; border-radius: 10px; overflow: hidden; }
  th, td { text-align: left; padding: 10px 12px; border-bottom: 1px solid #e3e3df; font-size: 15px; }
  th { background: #f0f0ec; font-weight: 600; }
  tr:last-child td { border-bottom: 0; }
  details { background: #fff; border: 1px solid #e3e3df; border-radius: 10px; padding: 12px 16px; }
  summary { cursor: pointer; font-weight: 600; }
  details ul { margin: 12px 0 0; padding-left: 20px; }
  details li { display: flex; gap: 12px; padding: 4px 0; }
  p.now, p.next { background: #fff; border: 1px solid #e3e3df; border-radius: 10px; padding: 16px; }
</style>
</head>
<body>
<main>
  <h1>Migration status</h1>
  <p class="meta">Source site: <a href="${esc(RUN.scope.sourceUrl)}">${esc(RUN.scope.sourceUrl)}</a><br>Preview site: <a href="${esc(RUN.previewUrl)}">${esc(RUN.previewUrl)}</a><br>Last updated: ${fmt(now)}</p>
  <p><span class="badge ${badgeClass}">${overall}</span></p>

  <h2>Journey</h2>
  <ol class="steps">
      ${STEPS.map((name, i) => { const st = stepState(i); const cls = st === 'Done' ? 'done' : st === 'In progress' ? 'current' : ''; return `<li class="${cls}"><span class="dot"></span>${name}<span class="state">${st}</span></li>`; }).join('\n      ')}
  </ol>

  <h2>Page templates</h2>
  <table>
    <thead><tr><th>Template</th><th>Pages</th><th>Desktop</th><th>Mobile</th><th>Status</th></tr></thead>
    <tbody>
      ${tplRows}
    </tbody>
  </table>

  <h2>Pages migrated: ${readyPages} of ${s.pages.length}</h2>
  <details${openList}>
    <summary>Page list</summary>
    <ul>
      ${pageItems || '<li>Pages will be listed here as they become ready.</li>'}
    </ul>
  </details>

  <h2>Progress</h2>
  <div class="bar"><span style="width:${pct}%"></span></div>
  <p class="estimate">${pct}% complete · ${esc(estimate)}</p>

  <h2>What's happening now</h2>
  <p class="now">${esc(s.now)}${s.attention ? ' Some pages need a closer look; we\'re on it.' : ''}</p>

  <h2>What's next</h2>
  <p class="next">${esc(s.next)}</p>
</main>
</body>
</html>
`;
fs.writeFileSync(OUT, html);
console.log(`status page: ${pct}% · ${overall} · ${estimate}`);
