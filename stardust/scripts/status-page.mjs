#!/usr/bin/env node
// Renders tools/replica/progress.html (customer status page) from stardust/replica/status-page.json.
// Usage: node stardust/scripts/status-page.mjs [--in stardust/replica/status-page.json] [--out tools/replica/progress.html]
import fs from 'node:fs';
const a = process.argv.slice(2);
const opt = (k, d) => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : d; };
const inFile = opt('--in', 'stardust/replica/status-page.json');
const outFile = opt('--out', 'tools/replica/progress.html');
const run = JSON.parse(fs.readFileSync('stardust/.labs/run.json', 'utf8'));
const s = JSON.parse(fs.readFileSync(inFile, 'utf8'));
// s: { state: 'In progress'|'Ready'|'Needs attention', steps:[5 x 'Done'|'In progress'|'Upcoming'],
//      templates:[{name,pages,desktop,mobile,status}], pages:[{title,path,ready}], now, next, attention?, partial?:{templates:0..1, pages:0..1} }
const esc = (t) => String(t ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const W = [10, 10, 40, 10, 30];
let pct = 0;
s.steps.forEach((st, i) => {
  if (st === 'Done') pct += W[i];
  else if (st === 'In progress') {
    if (i === 2) { const t = s.templates; const done = t.filter((x) => x.status === 'Done').length; pct += W[i] * (t.length ? done / t.length : 0) + W[i] * (s.partial?.templates ?? 0) / Math.max(t.length, 1); }
    else if (i === 4) { const p = s.pages; const done = p.filter((x) => x.ready).length; pct += W[i] * (p.length ? done / p.length : 0) + W[i] * (s.partial?.pages ?? 0) / Math.max(p.length, 1); }
    else pct += W[i] * (s.partial?.step ?? 0.5);
  }
});
pct = Math.max(0, Math.min(100, Math.round(pct)));
const now = new Date();
const started = new Date(run.startedAt); const deadline = new Date(run.deadlineAt);
const q = (m) => Math.max(15, Math.round(m / 15) * 15);
const fmtDur = (m) => (m >= 60 ? `${Math.floor(m / 60)} h${m % 60 ? ` ${m % 60} min` : ''}` : `${m} min`);
let estimate = 'Estimating…';
if (s.state === 'Ready' || pct >= 100) estimate = 'Complete';
else if (pct >= 10) {
  const elapsed = (now - started) / 60000;
  const rem = elapsed * (100 - pct) / pct;
  const maxRem = Math.max(0, (deadline - now) / 60000);
  let lo = Math.min(q(rem * 0.8), Math.floor(maxRem / 15) * 15);
  let hi = Math.min(q(rem * 1.3), Math.floor(maxRem / 15) * 15);
  if (hi < 15) hi = 15; if (lo < 15) lo = 15; if (lo > hi) lo = hi;
  estimate = lo === hi ? `About ${fmtDur(lo)} remaining` : `About ${fmtDur(lo)} to ${fmtDur(hi)} remaining`;
}
const stepNames = ['Analyzing your site', 'Capturing brand and design', 'Rebuilding page templates', 'Checking fidelity', 'Migrating your pages'];
const cls = (st) => (st === 'Done' ? 'done' : st === 'In progress' ? 'current' : '');
const readyPages = s.pages.filter((p) => p.ready);
const preview = run.previewUrl.replace(/\/$/, '');
const src = run.scope.sourceUrl;
const srcHost = new URL(src).host;
const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Migration status — ${esc(srcHost)}</title>
<style>
  :root { color-scheme: light; }
  body { margin: 0; font: 16px/1.5 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #1a1a1a; background: #f6f6f4; }
  main { max-width: 760px; margin: 0 auto; padding: 40px 24px 64px; }
  h1 { font-size: 28px; margin: 0 0 4px; }
  h2 { font-size: 18px; margin: 32px 0 12px; }
  .meta { color: #555; margin: 0 0 24px; }
  .meta a { color: inherit; }
  .badge { display: inline-block; padding: 2px 10px; border-radius: 999px; background: #e8efff; color: #1d4ed8; font-size: 13px; font-weight: 600; vertical-align: middle; }
  .badge.ready { background: #e6f4ea; color: #15803d; }
  .badge.attention { background: #fdf1e0; color: #b45309; }
  .bar { height: 10px; border-radius: 999px; background: #e3e3df; overflow: hidden; }
  .bar span { display: block; height: 100%; width: ${pct}%; background: #1d4ed8; }
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
  p.now, p.next { background: #fff; border: 1px solid #e3e3df; border-radius: 10px; padding: 14px 16px; margin: 0; }
  details { background: #fff; border: 1px solid #e3e3df; border-radius: 10px; padding: 10px 16px; }
  summary { cursor: pointer; font-weight: 600; }
  ul.pages { margin: 8px 0 0; padding-left: 20px; }
  .note { color: #b45309; margin: 12px 0 0; }
</style>
</head>
<body>
<main>
  <h1>Your website migration</h1>
  <p class="meta">Source site: <a href="${esc(src)}">${esc(src)}</a><br>
  Preview site: <a href="${esc(run.previewUrl)}">${esc(run.previewUrl)}</a><br>
  Last updated: ${now.toISOString().replace('T', ' ').slice(0, 16)} UTC &nbsp; <span class="badge ${s.state === 'Ready' ? 'ready' : s.state === 'Needs attention' ? 'attention' : ''}">${esc(s.state)}</span></p>

  <h2>Progress</h2>
  <div class="bar"><span></span></div>
  <p class="estimate">${pct}% complete · ${esc(estimate)}</p>

  <h2>Your migration journey</h2>
  <ol class="steps">
${stepNames.map((n, i) => `    <li class="${cls(s.steps[i])}"><span class="dot"></span>${esc(n)}<span class="state">${esc(s.steps[i])}</span></li>`).join('\n')}
  </ol>

  <h2>Page templates</h2>
  <table>
    <thead><tr><th>Template</th><th>Pages</th><th>Desktop</th><th>Mobile</th><th>Status</th></tr></thead>
    <tbody>
${s.templates.map((t) => `      <tr><td>${esc(t.name)}</td><td>${esc(t.pages)}</td><td>${esc(t.desktop)}</td><td>${esc(t.mobile)}</td><td>${esc(t.status)}</td></tr>`).join('\n')}
    </tbody>
  </table>

  <h2>Pages migrated</h2>
  <details${s.pages.length > 12 ? '' : ' open'}>
    <summary>${readyPages.length} of ${s.pages.length} page${s.pages.length === 1 ? '' : 's'} ready on the preview site</summary>
    <ul class="pages">
${readyPages.map((p) => `      <li><a href="${esc(preview + p.path)}">${esc(p.title)}</a></li>`).join('\n') || '      <li>No pages are on the preview site yet.</li>'}
    </ul>
  </details>

  <h2>What's happening now</h2>
  <p class="now">${esc(s.now)}</p>
${s.attention ? `  <p class="note">Some pages need a closer look; we're on it.</p>\n` : ''}
  <h2>What's next</h2>
  <p class="next">${esc(s.next)}</p>
</main>
</body>
</html>
`;
fs.writeFileSync(outFile, html);
console.log(`status-page: wrote ${outFile} (${pct}%, ${estimate})`);
