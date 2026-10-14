// Bounded-entry asset capture (replica Phase 1/3): network-intercepted fonts + stylesheets of one page.
import { chromium } from 'playwright';
import fs from 'node:fs'; import path from 'node:path';
import { newLiveContext } from './diff/live-session.mjs';
const url = process.argv[2]; const out = process.argv[3] || 'stardust/current/assets';
const b = await chromium.launch(); const ctx = await newLiveContext(b, { viewport: { width: 1440, height: 900 } });
const p = await ctx.newPage(); const log = { fonts: [], css: [] };
p.on('response', async (r) => {
  const u = r.url(); const t = r.request().resourceType();
  try {
    if (t === 'font' || /\.(woff2?|ttf|otf)(\?|$)/.test(u)) { const n = path.basename(new URL(u).pathname); fs.writeFileSync(`${out}/fonts/${n}`, await r.body()); log.fonts.push({ url: u, file: `fonts/${n}` }); }
    else if (t === 'stylesheet') { const n = path.basename(new URL(u).pathname).replace(/\.css$/, '') + '-' + log.css.length + '.css'; fs.writeFileSync(`${out}/css/${n}`, await r.body()); log.css.push({ url: u, file: `css/${n}` }); }
  } catch (e) { /* redirect bodies */ }
});
await p.goto(url, { waitUntil: 'load', timeout: 60000 });
for (let y = 0; y < 8; y++) { await p.evaluate((f) => window.scroll(0, document.body.scrollHeight * f), y / 8); await p.waitForTimeout(400); }
await p.waitForTimeout(2000);
const inline = await p.evaluate(() => [...document.querySelectorAll('style')].map((s) => s.textContent).join('\n/* --- */\n'));
fs.writeFileSync(`${out}/css/inline-styles.css`, inline);
fs.writeFileSync(`${out}/asset-log.json`, JSON.stringify(log, null, 1));
console.log(`fonts ${log.fonts.length}, css ${log.css.length}, inline ${inline.length} chars`);
await b.close();
