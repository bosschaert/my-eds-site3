#!/usr/bin/env node
// Rename crawler slugs to the site-plan slugs (stardust/.labs/site-plan.json) and patch references.
import fs from 'node:fs';
import path from 'node:path';
const plan = JSON.parse(fs.readFileSync('stardust/.labs/site-plan.json', 'utf8'));
const byUrl = Object.fromEntries(plan.pages.map((p) => [p.url, p.slug]));
const dir = 'stardust/current/pages', shots = 'stardust/current/assets/screenshots';
const map = {};
for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.json'))) {
  const rec = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
  const to = byUrl[rec.url]; if (!to || to === rec.slug) continue;
  map[rec.slug] = to;
  rec.slug = to; rec.screenshot = `assets/screenshots/${to}.png`; rec.renderedHtml = `pages/${to}.html`;
  fs.writeFileSync(path.join(dir, `${to}.json`), JSON.stringify(rec, null, 2)); fs.unlinkSync(path.join(dir, f));
  const from = f.replace(/\.json$/, '');
  for (const [a, b] of [[`${dir}/${from}.html`, `${dir}/${to}.html`], [`${shots}/${from}.png`, `${shots}/${to}.png`]]) if (fs.existsSync(a)) fs.renameSync(a, b);
}
let log = fs.readFileSync('stardust/current/_crawl-log.json', 'utf8');
for (const [a, b] of Object.entries(map)) log = log.split(`"${a}"`).join(`"${b}"`).split(`/${a}.`).join(`/${b}.`);
fs.writeFileSync('stardust/current/_crawl-log.json', log);
console.log('renamed', Object.keys(map).length);
