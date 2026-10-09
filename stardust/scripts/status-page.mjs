// Rewrites tools/replica/progress.html from stardust/replica/status-page.json + stardust/.labs/run.json
import fs from 'node:fs';
const run = JSON.parse(fs.readFileSync('stardust/.labs/run.json','utf8'));
const s = JSON.parse(fs.readFileSync('stardust/replica/status-page.json','utf8'));
const esc = t => String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const badge = st => ({Done:'spectrum-badge spectrum-badge--positive',Ready:'spectrum-badge spectrum-badge--positive','In progress':'spectrum-badge spectrum-badge--informative','Needs attention':'spectrum-badge spectrum-badge--notice',Upcoming:'spectrum-badge',Yes:'spectrum-badge spectrum-badge--positive',Checking:'spectrum-badge spectrum-badge--informative','Not yet':'spectrum-badge'})[st]||'spectrum-badge';
const B = st => `<span class="${badge(st)}">${esc(st)}</span>`;
// percent: weights 10,10,40,10,30
const W=[10,10,40,10,30]; const frac=[s.steps[0].frac??0,s.steps[1].frac??0,
  s.templates.length? s.templates.reduce((a,t)=>a+(t.frac??0),0)/s.templates.length:0,
  s.steps[3].frac??0, s.pages.total? s.pages.ready.length/s.pages.total:0];
const rawPct = Math.round(frac.reduce((a,f,i)=>a+f*W[i],0));
const pct = s.overall==="Ready" ? rawPct : Math.min(rawPct, 95); // capped until Ready
const now = new Date();
const runningMs = (run.priorRunningMs||0) + (now - new Date(run.startedAt));
let estimate='Estimating…';
if (pct>=10 && pct<100){
  const rem = runningMs*(100-pct)/pct; const q=15*60e3;
  const r15 = ms => Math.max(q, Math.round(ms/q)*q);
  const lo=r15(rem*0.8), hi=r15(rem*1.3);
  const cap = new Date(run.deadlineAt)-now;
  const fmt = ms => { ms=Math.min(ms,cap); const h=Math.floor(ms/36e5), m=Math.round((ms%36e5)/6e4); return h?`${h} h${m?` ${m} min`:''}`:`${m} min`; };
  estimate = lo>=cap ? `About ${fmt(cap)} remaining` : `About ${fmt(lo)} to ${fmt(hi)} remaining`;
} else if (pct>=100) estimate='Complete';
const ts = now.toISOString().replace('T',' ').slice(0,16)+' UTC';
const stepNames=['Analyzing your site','Capturing brand and design','Rebuilding page templates','Checking fidelity','Migrating your pages'];
const open = s.pages.total>12 ? '' : ' open';
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
    ${B(s.overall)}
  </header>
  <p class="meta">Source site: <a href="${esc(run.scope.sourceUrl)}">${esc(run.scope.sourceUrl)}</a><br>Preview site: <a href="${esc(run.previewUrl)}">${esc(run.previewUrl)}</a><br>Last updated: ${ts}</p>

  <section class="spectrum-panel">
    <h2 class="spectrum-panel-header">Your migration journey</h2>
    <div class="panel-body">
      <ol class="steps">
${stepNames.map((n,i)=>`        <li>${n}${B(s.steps[i].state)}</li>`).join('\n')}
      </ol>
    </div>
  </section>

  <section class="spectrum-panel">
    <h2 class="spectrum-panel-header">Page templates</h2>
    <div class="panel-body">
      <table>
        <thead><tr><th>Template</th><th>Pages</th><th>Desktop</th><th>Mobile</th><th>Status</th></tr></thead>
        <tbody>
${s.templates.map(t=>`          <tr><td>${esc(t.name)}</td><td>${t.pages}</td><td>${B(t.desktop)}</td><td>${B(t.mobile)}</td><td>${B(t.status)}</td></tr>`).join('\n')}
        </tbody>
      </table>
    </div>
  </section>

  <section class="spectrum-panel">
    <h2 class="spectrum-panel-header">Pages migrated</h2>
    <div class="panel-body">
      <p>${s.pages.ready.length} of ${s.pages.total} pages ready on the preview site.</p>
      <details${open}>
        <summary>Ready pages</summary>
        <ul class="pages">
${s.pages.ready.map(p=>`          <li><a href="${esc(p.url)}">${esc(p.title)}</a></li>`).join('\n') || '          <li>No pages are ready yet.</li>'}
        </ul>
      </details>
    </div>
  </section>

  <section class="spectrum-panel">
    <h2 class="spectrum-panel-header">Progress</h2>
    <div class="panel-body">
      <div class="bar"><span style="width: ${pct}%"></span></div>
      <p class="estimate">${pct}% complete · ${esc(estimate)}</p>
    </div>
  </section>

  <section class="spectrum-panel">
    <h2 class="spectrum-panel-header">What's happening now</h2>
    <div class="panel-body">
      <p>${esc(s.now)}</p>${s.attention?`\n      <p>Some pages need a closer look; we're on it.</p>`:''}
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
console.log(`status page written: ${pct}% — ${estimate}`);
