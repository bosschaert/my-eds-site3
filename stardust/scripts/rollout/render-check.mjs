#!/usr/bin/env node
// render-check.mjs <url> [--contract stardust/runtime-contract.json] — rollout Phase E headless render check:
// decoration ran (runtime appear class on body), main .section > 0, 0 pageerror, 0 broken images. Exit 0 pass / 2 fail.
import { chromium } from 'playwright';
import { readFileSync, existsSync } from 'node:fs';
const [url, ...rest] = process.argv.slice(2);
const ci = rest.indexOf('--contract'); const cf = ci >= 0 ? rest[ci + 1] : 'stardust/runtime-contract.json';
let appear = 'appear';
if (existsSync(cf)) { const c = JSON.parse(readFileSync(cf, 'utf8')); const s = JSON.stringify(c); const m = s.match(/"(?:appearClass|bodyAppear|appear)"\s*:\s*"([^"]+)"/); if (m) appear = m[1].replace(/^\./, ''); }
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = []; page.on('pageerror', (e) => errors.push(String(e.message || e)));
await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForFunction((cls) => document.body.classList.contains(cls), appear, { timeout: 20000 }).catch(() => {});
await page.waitForTimeout(1500);
const r = await page.evaluate((cls) => ({
  appear: document.body.classList.contains(cls),
  sections: document.querySelectorAll('main .section').length,
  blocks: document.querySelectorAll('main .block').length,
  brokenImages: [...document.images].filter((i) => i.complete && i.naturalWidth === 0 && i.getAttribute('src')).length,
  images: document.images.length,
}), appear);
await browser.close();
const pass = r.appear && r.sections > 0 && errors.length === 0 && r.brokenImages === 0;
console.log(`render-check ${url} → body.${appear} ${r.appear ? 'yes' : 'NO'}; main .section ${r.sections}; blocks ${r.blocks}; pageerror ${errors.length}; broken images ${r.brokenImages}/${r.images} → ${pass ? 'PASS' : 'FAIL'}`);
for (const e of errors) console.log('  pageerror: ' + e.slice(0, 200));
process.exit(pass ? 0 : 2);
