// Supplementary capture: full page with the live scroll-reveal hidden state forced visible.
// Same command on live and prototype; used beside the gate (which freezes entrance animations at t=0).
// Usage: node reveal-shot.mjs <url> <out.png> [--width 1440]
import { chromium } from 'playwright';
const [url, out] = process.argv.slice(2);
const wi = process.argv.indexOf('--width');
const width = wi > 0 ? Number(process.argv[wi + 1]) : 1440;
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width, height: 900 }, userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36' });
const p = await ctx.newPage();
await p.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
await p.waitForTimeout(2000);
await p.locator('.cmplz-accept, button:has-text("Accept")').first().click({ timeout: 3000 }).catch(() => {});
const h = await p.evaluate(() => document.documentElement.scrollHeight);
for (let y = 0; y < h; y += 600) { await p.evaluate((yy) => window.scrollTo(0, yy), y); await p.waitForTimeout(120); }
await p.evaluate(() => window.scrollTo(0, 0));
await p.addStyleTag({ content: '.js-show-on-scroll,.js-show-on-scroll-img{opacity:1!important;animation:none!important;transform:none!important}*,*::before,*::after{transition:none!important;animation-play-state:paused!important}#cmplz-manage-consent,.cmplz-manage-consent{display:none!important}' });
await p.evaluate(async () => { await document.fonts.ready; });
await p.waitForTimeout(800);
await p.screenshot({ path: out, fullPage: true });
console.log('wrote', out);
await b.close();
