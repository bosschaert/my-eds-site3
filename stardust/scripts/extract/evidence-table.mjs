#!/usr/bin/env node
// One line per captured page: the extract evidence table (live, wait, status, media, headings, text).
import fs from 'node:fs';
const dir = process.argv[2] || 'stardust/current/pages';
console.log(['slug','live','waitMode','waitMs','status','img/bg','h','textLen','shot','title'].join('\t'));
for (const f of fs.readdirSync(dir).filter((f) => f.endsWith('.json')).sort()) {
  const r = JSON.parse(fs.readFileSync(`${dir}/${f}`, 'utf8'));
  const p = r._provenance || {};
  const live = p.renderedBy === 'playwright' && p.waitMs > 0 ? 'yes' : 'NO';
  console.log([r.slug, live, p.waitMode, p.waitMs, p.httpStatus, `${(r.media?.imgs || []).length}/${(r.media?.cssBackgrounds || []).length}`, (r.headings || []).length, r._signals?.mainTextLen, r._signals?.screenshotMode, (r.title || '').slice(0, 60)].join('\t'));
}
