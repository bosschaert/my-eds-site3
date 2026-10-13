import { chromium } from 'playwright';
const fams = ['Noto Sans JP','Zen Kaku Gothic New','BIZ UDPGothic','M PLUS 1p','IBM Plex Sans JP','Murecho','Zen Kaku Gothic Antique','Sawarabi Gothic','M PLUS 2','Kosugi'];
const tests = [ // [text, size, ls(px), weightClass B/M, palt, liveWidth]
 ['いいオモイを、つたえるオモイに',40,1.6,'B',0,624],
 ['つくる（デザインワーク）',18,0.72,'B',0,224],
 ['ささえる（ブランディングデザイン）',18,0.72,'B',0,316],
 ['かんがえる（コンセプト、販促企画）',18,0.72,'B',0,318],
 ['できること',28,2.24,'B',0,151],
 ['お知らせ',24,0.96,'B',0,100],
 ['いいオモイを、つたえるオモイに',15,3.3,'B',0,275],
 ['HALO, pâtisserie',16,0.64,'B',0,143],
 ['はじめてご依頼をお考えの方へ',14,2.52,'M',1,216],
 ['日本ヴァリティー株式会社',16,0.64,'B',0,0],
];
const q = fams.map(f=>'family='+f.replace(/ /g,'+')+':wght@400;500;700').join('&');
const b = await chromium.launch(); const p = await b.newPage();
await p.setContent(`<link rel=stylesheet href="https://fonts.googleapis.com/css2?${q}&display=block"><body></body>`);
await p.waitForTimeout(500);
const res = await p.evaluate(async ({fams,tests})=>{
  const out={};
  for (const f of fams) for (const w of [400,500,700]) {
    let err=0,row=[];
    for (const [t,s,ls,cls,palt,live] of tests){ const sp=document.createElement('span'); sp.textContent=t; sp.style.cssText=`font-family:'${f}';font-size:${s}px;letter-spacing:${ls}px;font-weight:${cls==='B'?w:400};white-space:nowrap;position:absolute;${palt?"font-feature-settings:'palt' 1;":''}`; document.body.appendChild(sp); await document.fonts.load(`${cls==='B'?w:400} ${s}px '${f}'`, t); const W=sp.getBoundingClientRect().width; row.push(Math.round(W)); if(live) err+=Math.abs(W-live)/live; sp.remove(); }
    out[f+' '+w]={err:+(err*100/9).toFixed(1),row:row.join(' ')};
  }
  return out;},{fams,tests});
for (const [k,v] of Object.entries(res).sort((a,b)=>a[1].err-b[1].err)) console.log(v.err.toString().padStart(5), k.padEnd(28), v.row);
console.log('live ', tests.map(t=>t[5]).join(' '));
await b.close();
