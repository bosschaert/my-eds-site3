// compact per-selector rows from a measure.mjs --json file: node lift-table.mjs <file> [--width 1440] [--sel <regex>] [--props a,b]
import fs from 'node:fs';
const [file,...rest]=process.argv.slice(2); const a={}; for(let i=0;i<rest.length;i+=2)a[rest[i].replace(/^--/,'')]=rest[i+1];
const j=JSON.parse(fs.readFileSync(file,'utf8')); const url=Object.keys(j.pages)[0]; const widths=a.width?a.width.split(','):j.widths.map(String);
const selRe=a.sel?new RegExp(a.sel):null; const props=a.props?a.props.split(','):null;
for(const w of widths){ const page=j.pages[url][w]; console.log(`@${w} root`, JSON.stringify(j.root[url]?.[w]??''));
  for(const [sel,matches] of Object.entries(page)){ if(selRe&&!selRe.test(sel))continue; const arr=Array.isArray(matches)?matches:[matches];
    arr.forEach((m,i)=>{ if(!m||m.missing){console.log(`  ${sel}  —`);return;} const r=m.rect||m; const cs=m.props||m.computed||{};
      const ps=props?props.map(p=>`${p}=${cs[p]}`).join(' '):Object.entries(cs).map(([k,v])=>`${k}=${v}`).join(' ');
      console.log(`  ${sel}[${i}] x${r.x} y${r.y} w${r.w} h${r.h} ${m.visible===false?'HID':''} ${(m.text||'').slice(0,30).replace(/\n/g,' ')} | ${ps}`);});}}
