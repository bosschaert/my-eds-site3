// print sel[i] x,y,w,h text from a measure.mjs --out JSON: node mj.cjs <json>
const j=require(require('path').resolve(process.argv[2]));
for (const byW of Object.values(j.pages)) for (const [w,sels] of Object.entries(byW)) for (const [sel,ms] of Object.entries(sels))
  (Array.isArray(ms)?ms:[ms]).forEach((m,i)=>{const r=m.rect||{};console.log(`${w} ${sel}[${i}] ${r.x},${r.y},${r.w},${r.h} ${(m.text||'').slice(0,16)}`);});
