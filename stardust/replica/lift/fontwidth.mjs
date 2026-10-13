// literal-string width probe (recreation-procedure § CSS lifting: metric vs layout fork)
import { chromium } from 'playwright';
const [url] = process.argv.slice(2);
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 }, userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36' });
await p.goto(url, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(4000);
const r = await p.evaluate(async () => {
  await document.fonts.ready;
  const out = { faces: [...document.fonts].filter(f => /Montserrat/.test(f.family)).map(f => `${f.family} ${f.weight} ${f.style} ${f.status} ${f.unicodeRange.slice(0,30)}`) };
  for (const css of ['', 'display:flex', 'word-spacing:1px', 'display:flex;word-spacing:1px']) {
    const s = document.createElement('p'); s.textContent = 'Home'; s.style.cssText = `position:absolute;font-family:Montserrat;font-size:14px;letter-spacing:0.56px;white-space:nowrap;${css}`; document.body.appendChild(s);
    out[css || 'plain'] = s.getBoundingClientRect().width; s.remove(); }
  return out; });
console.log(JSON.stringify(r, null, 1)); await b.close();
