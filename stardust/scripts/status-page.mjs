// Writes tools/replica/progress.html (customer status page) from stardust/replica/status-model.json
// and stardust/.labs/run.json. Self-contained HTML, inline CSS, no JS. Usage: node stardust/scripts/status-page.mjs
import fs from 'node:fs';
const run = JSON.parse(fs.readFileSync('stardust/.labs/run.json', 'utf8'));
const m = JSON.parse(fs.readFileSync('stardust/replica/status-model.json', 'utf8'));
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const STEPS = ['Analyzing your site', 'Capturing brand and design', 'Rebuilding page templates', 'Checking fidelity', 'Migrating your pages'];
const W = [10, 10, 40, 10, 30];
// percent: steps 1,2,4 are all-or-nothing; step 3 per template (done if both breakpoints ok); step 5 per page
const tpl = m.templates || []; const pages = m.pages || [];
const frac = (i) => {
  if (i === 2 && tpl.length) return tpl.filter((t) => t.status === 'Done').length / tpl.length;
  if (i === 4 && pages.length) return pages.filter((p) => p.ready).length / pages.length;
  return m.steps[i] === 'Done' ? 1 : 0;
};
let pct = 0; for (let i = 0; i < 5; i++) pct += W[i] * frac(i);
pct = Math.round(pct);
const now = new Date();
const started = new Date(run.startedAt), deadline = new Date(run.deadlineAt);
let estimate = 'Estimating…';
if (m.state === 'Ready') estimate = 'Complete';
else if (pct >= 10) {
  const elapsed = (now - started) / 60000;
  const remaining = elapsed * (100 - pct) / pct;
  const q = (x) => Math.max(15, Math.round(x / 15) * 15);
  const maxLeft = Math.max(0, (deadline - now) / 60000);
  let lo = Math.min(q(remaining * 0.8), maxLeft), hi = Math.min(q(remaining * 1.3), maxLeft);
  lo = Math.floor(lo / 15) * 15; hi = Math.floor(hi / 15) * 15; if (hi < lo) hi = lo;
  const fmt = (mins) => (mins >= 60 ? `${Math.floor(mins / 60)} h${mins % 60 ? ` ${mins % 60} min` : ''}` : `${mins} min`);
  estimate = lo === hi ? `About ${fmt(hi)} remaining` : `About ${fmt(lo)} to ${fmt(hi)} remaining`;
}
const ts = now.toISOString().replace('T', ' ').slice(0, 16) + ' UTC';
const badgeClass = m.state === 'Ready' ? 'ready' : m.state === 'Needs attention' ? 'attn' : '';
const stepsHtml = STEPS.map((s, i) => {
  const st = m.steps[i]; const cls = st === 'Done' ? 'done' : st === 'In progress' ? 'current' : '';
  return `      <li class="${cls}"><span class="dot"></span>${esc(s)}<span class="state">${esc(st)}</span></li>`;
}).join('\n');
const tplRows = tpl.length ? tpl.map((t) => `      <tr><td>${esc(t.name)}</td><td>${t.pages}</td><td>${esc(t.desktop)}</td><td>${esc(t.mobile)}</td><td>${esc(t.status)}</td></tr>`).join('\n')
  : '      <tr><td colspan="5">We\'re identifying your page templates.</td></tr>';
const ready = pages.filter((p) => p.ready);
const pagesList = pages.length ? `  <details${pages.length > 12 ? '' : ' open'}><summary>${ready.length} of ${pages.length} pages migrated</summary>
    <ul class="pages">
${pages.map((p) => p.ready ? `      <li><a href="${esc(p.previewUrl)}">${esc(p.title)}</a> <span class="ok">Ready</span></li>` : `      <li>${esc(p.title)} <span class="pending">Upcoming</span></li>`).join('\n')}
    </ul>
  </details>` : '  <p>0 of 0 pages migrated so far. The page list appears once we have mapped your site.</p>';
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
  .badge.ready { background: #dcfce7; color: #15803d; }
  .badge.attn { background: #fef3c7; color: #b45309; }
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
  ul.pages { margin: 12px 0 0; padding-left: 20px; }
  ul.pages li { padding: 4px 0; }
  .ok { color: #15803d; font-size: 13px; font-weight: 600; margin-left: 6px; }
  .pending { color: #777; font-size: 13px; margin-left: 6px; }
  p.now { background: #fff; border: 1px solid #e3e3df; border-radius: 10px; padding: 16px; }
</style>
</head>
<body>
<main>
  <h1>Migration status</h1>
  <p class="meta">Source site: <a href="${esc(run.url)}">${esc(run.url)}</a><br>Preview site: <a href="${esc(run.previewUrl)}">${esc(run.previewUrl)}</a><br>Last updated: ${ts}</p>
  <p><span class="badge ${badgeClass}">${esc(m.state)}</span></p>

  <h2>Journey</h2>
  <ol class="steps">
${stepsHtml}
  </ol>

  <h2>Page templates</h2>
  <table>
    <thead><tr><th>Template</th><th>Pages</th><th>Desktop</th><th>Mobile</th><th>Status</th></tr></thead>
    <tbody>
${tplRows}
    </tbody>
  </table>

  <h2>Pages migrated</h2>
${pagesList}

  <h2>Progress</h2>
  <div class="bar"><span style="width: ${pct}%"></span></div>
  <p class="estimate">${pct}% complete · ${esc(estimate)}</p>

  <h2>What's happening now</h2>
  <p class="now">${esc(m.now)}${m.attention ? ' Some pages need a closer look; we\'re on it.' : ''}</p>

  <h2>What's next</h2>
  <p>${esc(m.next)}</p>
</main>
</body>
</html>
`;
fs.mkdirSync('tools/replica', { recursive: true });
fs.writeFileSync('tools/replica/progress.html', html);
console.log(`progress.html written: ${pct}% · ${estimate} · ${m.state}`);
