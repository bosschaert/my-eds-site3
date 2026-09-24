#!/usr/bin/env node
// Renders tools/replica/progress.html (customer status page) from stardust/.labs/progress-state.json.
// Usage: node stardust/scripts/stardust/progress-page.mjs [--set key=value ...]
//   keys: steps.<n>=done|current|upcoming (n=0..4), state=In progress|Ready|Needs attention,
//         now="..." next="..." attention=true|false
// Templates/pages are edited in the JSON directly. Inline CSS only, no JS, no external assets.
import fs from 'node:fs';
const STATE = 'stardust/.labs/progress-state.json';
const RUN = JSON.parse(fs.readFileSync('stardust/.labs/run.json', 'utf8'));
const OUT = 'tools/replica/progress.html';
const s = JSON.parse(fs.readFileSync(STATE, 'utf8'));
const args = process.argv.slice(2);
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--set') {
    const [k, ...rest] = args[++i].split('='); const v = rest.join('=');
    const path = k.split('.'); let o = s;
    for (let j = 0; j < path.length - 1; j++) o = o[path[j]];
    o[path[path.length - 1]] = v === 'true' ? true : v === 'false' ? false : v;
  }
}
fs.writeFileSync(STATE, JSON.stringify(s, null, 2) + '\n');
const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const STEP_NAMES = ['Analyzing your site', 'Capturing brand and design', 'Rebuilding page templates', 'Checking fidelity', 'Migrating your pages'];
const WEIGHTS = [10, 10, 40, 10, 30];
const label = (st) => st === 'done' ? 'Done' : st === 'current' ? 'In progress' : 'Upcoming';
// percent
const tpl = s.templates || []; const pages = s.pages || [];
let pct = 0;
s.steps.forEach((st, i) => {
  if (st === 'done') { pct += WEIGHTS[i]; return; }
  if (i === 2 && tpl.length) pct += WEIGHTS[2] * tpl.filter((t) => t.status === 'done').length / tpl.length;
  if (i === 4 && pages.length) pct += WEIGHTS[4] * pages.filter((p) => p.ready).length / pages.length;
});
pct = Math.round(pct);
// estimate
const now = new Date();
const started = new Date(RUN.startedAt); const deadline = new Date(RUN.deadlineAt);
let estimate = 'Estimating…';
if (s.state === 'Ready') estimate = 'Complete';
else if (pct >= 10) {
  const elapsed = (now - started) / 60000; const remaining = elapsed * (100 - pct) / pct;
  const r15 = (m) => Math.max(15, Math.round(m / 15) * 15);
  const maxLeft = Math.max(15, (deadline - now) / 60000);
  let lo = Math.min(r15(remaining * 0.8), r15(maxLeft)); let hi = Math.min(r15(remaining * 1.3), r15(maxLeft));
  if (hi < lo) hi = lo;
  const fmt = (m) => (m >= 60 ? `${Math.floor(m / 60)} h${m % 60 ? ` ${m % 60} min` : ''}` : `${m} min`);
  estimate = lo === hi ? `About ${fmt(lo)} remaining` : `About ${fmt(lo)} to ${fmt(hi)} remaining`;
}
const ts = now.toISOString().replace('T', ' ').slice(0, 16) + ' UTC';
const badgeClass = s.state === 'Ready' ? 'ready' : s.state === 'Needs attention' ? 'attn' : '';
const ready = pages.filter((p) => p.ready);
const openAttr = pages.length > 12 ? '' : ' open';
const yesno = (v) => v === true ? 'Looks right' : v === false ? 'Being adjusted' : 'Not yet checked';
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
  .meta { color: #555; margin: 0 0 16px; }
  .meta a { color: inherit; }
  .badge { display: inline-block; padding: 2px 10px; border-radius: 999px; background: #e8efff; color: #1d4ed8; font-size: 13px; font-weight: 600; }
  .badge.ready { background: #e3f6e8; color: #15803d; }
  .badge.attn { background: #fff1e0; color: #b45309; }
  .bar { height: 10px; border-radius: 999px; background: #e3e3df; overflow: hidden; }
  .bar span { display: block; height: 100%; background: #1d4ed8; }
  .estimate { color: #555; margin-top: 8px; }
  ol.steps { list-style: none; padding: 0; margin: 0; }
  ol.steps li { display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid #e3e3df; }
  ol.steps .dot { width: 10px; height: 10px; border-radius: 50%; background: #c9c9c4; flex: none; }
  ol.steps .current .dot { background: #1d4ed8; }
  ol.steps .done .dot { background: #15803d; }
  ol.steps .state { margin-left: auto; color: #555; font-size: 14px; }
  table { width: 100%; border-collapse: collapse; background: #fff; border: 1px solid #e3e3df; border-radius: 10px; overflow: hidden; }
  th, td { text-align: left; padding: 10px 12px; border-bottom: 1px solid #e3e3df; font-size: 15px; }
  th { background: #f0f0ec; font-weight: 600; }
  tr:last-child td { border-bottom: 0; }
  details { background: #fff; border: 1px solid #e3e3df; border-radius: 10px; padding: 12px 16px; }
  summary { cursor: pointer; font-weight: 600; }
  details ul { margin: 8px 0 0; padding-left: 20px; }
  p.now, p.next { background: #fff; border: 1px solid #e3e3df; border-radius: 10px; padding: 16px; }
</style>
</head>
<body>
<main>
  <h1>Migration status</h1>
  <p class="meta">Source site: <a href="${esc(RUN.scope.sourceUrl)}">${esc(RUN.scope.sourceUrl)}</a><br>Preview site: <a href="${esc(RUN.previewUrl)}">${esc(RUN.previewUrl)}</a><br>Last updated: ${ts}</p>
  <p><span class="badge ${badgeClass}">${esc(s.state)}</span></p>
${s.attention ? '  <p>Some pages need a closer look; we\'re on it.</p>\n' : ''}
  <h2>Journey</h2>
  <ol class="steps">
${s.steps.map((st, i) => `    <li class="${st}"><span class="dot"></span>${STEP_NAMES[i]}<span class="state">${label(st)}</span></li>`).join('\n')}
  </ol>

  <h2>Page templates</h2>
  <table>
    <thead><tr><th>Template</th><th>Pages</th><th>Desktop</th><th>Mobile</th><th>Status</th></tr></thead>
    <tbody>
${tpl.length ? tpl.map((t) => `      <tr><td>${esc(t.name)}</td><td>${t.pages}</td><td>${yesno(t.desktop)}</td><td>${yesno(t.mobile)}</td><td>${label(t.status)}</td></tr>`).join('\n') : '      <tr><td colspan="5">We\'re identifying your page templates.</td></tr>'}
    </tbody>
  </table>

  <h2>Pages migrated</h2>
  <details${openAttr}>
    <summary>${ready.length} of ${pages.length} pages ready</summary>
${ready.length ? `    <ul>\n${ready.map((p) => `      <li><a href="${esc(p.url)}">${esc(p.title || p.url)}</a></li>`).join('\n')}\n    </ul>` : '    <p>No pages are ready on the preview site yet.</p>'}
  </details>

  <h2>Progress</h2>
  <div class="bar"><span style="width: ${pct}%"></span></div>
  <p class="estimate">${pct}% complete · ${esc(estimate)}</p>

  <h2>What's happening now</h2>
  <p class="now">${esc(s.now)}</p>

  <h2>What's next</h2>
  <p class="next">${esc(s.next)}</p>
</main>
</body>
</html>
`;
fs.writeFileSync(OUT, html);
console.log(`${OUT}: ${pct}% · ${s.state} · ${estimate}`);
