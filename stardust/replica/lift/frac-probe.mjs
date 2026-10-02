// One-off: fractional box tops/heights on live vs build (measure.mjs rounds).
import { chromium } from 'playwright';
const [live, build, width = '1440'] = process.argv.slice(2);
const sels = ['body', '#canvas', '#mobileNav', '#mobileMenuLink', '#header', '#logo', '#topNav', '#page', '#projectPages', '#projectThumbs', '#projectThumbs .wrapper', '#projectThumbs .project:nth-child(1)', '#projectThumbs .project:nth-child(1) img', '#projectThumbs .project:nth-child(2) img', '#footer', '#footerBlock', '.newsletter-form-wrapper', '.newsletter-form-footnote p', '#socialLinks'];
const b = await chromium.launch();
for (const url of [live, build]) {
  const p = await b.newPage({ viewport: { width: +width, height: 900 }, userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36' });
  await p.goto(url, { waitUntil: url.includes('localhost') ? 'networkidle' : 'domcontentloaded', timeout: 60000 });
  await p.waitForTimeout(url.includes('localhost') ? 500 : 4000);
  const r = await p.evaluate((sels) => sels.map((s) => { const e = document.querySelector(s); if (!e) return `${s}: —`; const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return `${s}: top ${(r.top + scrollY).toFixed(2)} h ${r.height.toFixed(2)} | mt ${cs.marginTop} mb ${cs.marginBottom} pt ${cs.paddingTop} pb ${cs.paddingBottom} lh ${cs.lineHeight} fs ${cs.fontSize}`; }), sels);
  console.log(`== ${url} @${width}`); console.log(r.join('\n'));
  await p.close();
}
await b.close();
