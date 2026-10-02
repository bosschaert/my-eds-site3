// One-off: which faces actually render on the served prototype, and the width of the nav words.
import { chromium } from 'playwright';
const url = process.argv[2] || 'http://localhost:8791/index-proposed.html';
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto(url, { waitUntil: 'networkidle' }); await p.evaluate(() => document.fonts.ready);
const r = await p.evaluate(() => {
  const faces = [...document.fonts].map((f) => `${f.family} ${f.weight} ${f.status}`);
  const words = [...document.querySelectorAll('#topNav li a')].map((a) => `${a.textContent}:${a.getBoundingClientRect().width.toFixed(1)}`);
  const c = document.createElement('canvas').getContext('2d');
  const w = (font, t) => { c.font = font; return c.measureText(t).width.toFixed(1); };
  return { faces, words, probe: { ssp: w('700 15px "Source Sans Pro"', 'CONTACT'), arial: w('700 15px Arial', 'CONTACT'), ptserif: w('400 15px "PT Serif"', 'Sign up to receive'), georgia: w('400 15px Georgia', 'Sign up to receive') } };
});
console.log(JSON.stringify(r, null, 1)); await b.close();
