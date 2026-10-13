import { chromium } from 'playwright';
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('https://current-design.jp/', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(4000);
console.log(await p.evaluate(() => { const host=document.querySelector('.symbol-3__sd-12'); const o={};
 for (const cls of ['text _p3o','_p3o','text symbol-3__sd-13 _p37 _p3n _p3o']) { const s=document.createElement('p'); s.className=cls; s.textContent='Home'; s.style.position='absolute'; host.appendChild(s); o[cls]=s.getBoundingClientRect().width; const cs=getComputedStyle(s); o[cls]+=' '+cs.transform+' '+cs.textTransform+' '+cs.fontStretch+' '+cs.textIndent; s.remove(); }
 const t=document.querySelector('.symbol-3__sd-13'); const r=document.createRange(); r.selectNodeContents(t); o.range=r.getBoundingClientRect().width; o.scale=getComputedStyle(t).scale+' '+getComputedStyle(t.parentElement).scale+' '+getComputedStyle(t).transform; return o; }));
await b.close();
