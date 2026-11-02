// Dump visible structure of the live page per width: elements with text/img, rects, key computed styles.
import { chromium } from 'playwright';
import fs from 'fs';
const url = process.argv[2], width = +process.argv[3], out = process.argv[4];
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 1, userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36' });
const page = await ctx.newPage();
await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(4000);
try { await page.click('#truste-consent-button', { timeout: 3000 }); } catch {}
for (let y = 0; y < 12000; y += 600) { await page.evaluate(v => window.scrollTo(0, v), y); await page.waitForTimeout(150); }
await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(1500);
const data = await page.evaluate(() => {
  const rows = [];
  const vis = el => { const s = getComputedStyle(el); if (s.display === 'none' || s.visibility === 'hidden' || +s.opacity === 0) return false; const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
  const sel = el => { let s = el.tagName.toLowerCase(); if (el.id) s += '#' + el.id; const c = [...el.classList].filter(x => !/[\[\]:!/]/.test(x)).slice(0, 2); if (c.length) s += '.' + c.join('.'); return s; };
  const all = document.querySelectorAll('header, main, footer, body > div *, body *');
  const seen = new Set();
  for (const el of document.body.querySelectorAll('*')) {
    if (['SCRIPT','STYLE','NOSCRIPT','svg','path','SOURCE','LINK','META','TEMPLATE'].includes(el.tagName)) continue;
    if (el.closest('svg') && el.tagName !== 'svg') continue;
    if (!vis(el)) continue;
    const r = el.getBoundingClientRect(); const y = r.top + scrollY;
    const s = getComputedStyle(el);
    const own = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join(' ').replace(/\s+/g, ' ').trim();
    const isImg = el.tagName === 'IMG' || el.tagName === 'VIDEO' || el.tagName === 'svg';
    const bg = s.backgroundImage !== 'none' ? s.backgroundImage.slice(0, 140) : '';
    const bgc = s.backgroundColor !== 'rgba(0, 0, 0, 0)' ? s.backgroundColor : '';
    const border = s.borderTopWidth !== '0px' ? `${s.borderTopWidth} ${s.borderTopStyle} ${s.borderTopColor}` : '';
    if (!own && !isImg && !bg && !bgc && !border) continue;
    const row = { y: Math.round(y), x: Math.round(r.left), w: Math.round(r.width), h: Math.round(r.height), el: sel(el), pos: s.position !== 'static' ? s.position : undefined };
    if (own) Object.assign(row, { t: own.slice(0, 120), font: `${s.fontSize}/${s.lineHeight} ${s.fontWeight}${s.fontStyle==='italic'?' i':''} ${s.fontFamily.split(',')[0]}`, color: s.color, ls: s.letterSpacing !== 'normal' ? s.letterSpacing : undefined, tt: s.textTransform !== 'none' ? s.textTransform : undefined, ta: s.textAlign, td: s.textDecorationLine !== 'none' ? s.textDecorationLine : undefined });
    if (isImg) Object.assign(row, { src: (el.currentSrc || el.getAttribute('src') || '').slice(0, 200), alt: el.getAttribute('alt'), fit: s.objectFit, nat: el.naturalWidth ? el.naturalWidth + 'x' + el.naturalHeight : undefined });
    if (bg) row.bg = bg; if (bgc) row.bgc = bgc; if (border) row.border = border;
    if (s.borderRadius !== '0px') row.rad = s.borderRadius;
    if (s.padding !== '0px') row.pad = s.padding;
    if (el.tagName === 'A') row.href = el.getAttribute('href');
    rows.push(row);
  }
  return { docH: document.documentElement.scrollHeight, scrollW: document.documentElement.scrollWidth, rows };
});
fs.writeFileSync(out, JSON.stringify(data));
const txt = data.rows.map(r => [r.y, r.x, r.w + 'x' + r.h, r.el, r.pos || '', r.t ? JSON.stringify(r.t) : '', r.font || '', r.color || '', r.ls ? 'ls=' + r.ls : '', r.tt || '', r.td||'', r.ta && r.ta !== 'start' && r.ta!=='left' ? 'ta=' + r.ta : '', r.bgc ? 'bgc=' + r.bgc : '', r.bg ? 'bg=' + r.bg : '', r.border ? 'bd=' + r.border : '', r.rad ? 'rad=' + r.rad : '', r.pad ? 'pad=' + r.pad : '', r.src ? 'src=' + r.src : '', r.alt ? 'alt=' + JSON.stringify(r.alt) : '', r.fit && r.fit!=='fill' ? 'fit=' + r.fit : '', r.nat||'', r.href ? 'href=' + r.href : ''].filter(Boolean).join(' | ')).join('\n');
fs.writeFileSync(out.replace(/\.json$/, '.txt'), `docH=${data.docH} scrollW=${data.scrollW}\n` + txt);
console.log('rows', data.rows.length, 'docH', data.docH);
await browser.close();
