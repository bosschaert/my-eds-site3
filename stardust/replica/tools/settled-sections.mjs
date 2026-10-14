// settled-sections.mjs <url> [width] — section heights after a stitch-shot-like timeline
// (domcontentloaded, 3 s wait, slow scroll to bottom, back to top). Diagnosis only.
import { chromium } from 'playwright';
const [url, w = '1440'] = process.argv.slice(2);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: Number(w), height: 900 } });
const t0 = Date.now();
await p.goto(url, { waitUntil: 'domcontentloaded' });
await p.locator('button:has-text("Accept")').first().click({ timeout: 4000 }).catch(() => {});
await p.waitForTimeout(3000);
const H = await p.evaluate(() => document.documentElement.scrollHeight);
for (let y = 0; y < H; y += 450) { await p.evaluate((yy) => window.scrollTo(0, yy), y); await p.waitForTimeout(250); }
await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(500);
const rows = await p.evaluate(() => [...document.querySelectorAll('.flex-1 > .flex-col > section, footer')].map((s) => {
  const r = s.getBoundingClientRect(); return `${Math.round(r.top + scrollY)}\t${Math.round(r.height)}\t${(s.id || s.className).split(' ')[0]}`; }));
console.log(`t=${Date.now() - t0}ms doc=${await p.evaluate(() => document.documentElement.scrollHeight)}`); console.log(rows.join('\n'));
await b.close();
