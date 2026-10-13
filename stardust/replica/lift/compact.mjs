// Compact measure.mjs output → one line per selector, non-default props only.
import fs from 'fs';
const [,, inp, out] = process.argv;
const lines = fs.readFileSync(inp, 'utf8').split('\n');
const dflt = new Set(['display: block','position: static','flexDirection: row','flexWrap: nowrap','justifyContent: normal','alignItems: normal','maxWidth: none','margin: 0px','padding: 0px','gap: normal','top: auto','left: auto','right: auto','bottom: auto','zIndex: auto','transform: none','backgroundColor: rgba(0, 0, 0, 0)','backgroundSize: auto','backgroundPosition: 0% 0%','color: rgb(0, 0, 0)','fontFamily: sans-serif','fontSize: 16px','fontWeight: 400','lineHeight: 16px','letterSpacing: normal','textAlign: start','borderRadius: 0px','opacity: 1','objectFit: fill','overflow: visible','maxWidth: 100%']);
const res = []; let cur = null;
for (const l of lines) {
  const m = l.match(/^  (\.[\w-]+)(?: \[\d+ of \d+\])?\s*$/); if (m) { cur = { sel: m[1] }; res.push(cur); continue; }
  if (!cur) continue;
  const r = l.match(/^\s+x\s+(-?\d+)\s+y\s+(-?\d+)\s+w\s+(\d+)\s+h\s+(\d+)\s+(\S+)\s*(".*")?/);
  if (r) { Object.assign(cur, { x: r[1], y: r[2], w: r[3], h: r[4], vis: r[5], txt: (r[6] || '').slice(0, 40) }); continue; }
  if (/^\s+\w+: /.test(l) && !cur.props) {
    cur.props = l.trim().split(/; (?=[a-zA-Z]+: )/).filter(p => !dflt.has(p) && !/^(width|height): /.test(p) && !/^(top|left|right|bottom): 0px$/.test(p) && p!=='zIndex: 0' && !(/^(top|left|right|bottom): /.test(p) && /position: (relative|static)/.test(l)) && !/^border(Bottom)?: 0px none/.test(p)).join('; ');
  }
  if (/no match/.test(l)) cur.vis = 'nomatch';
}
fs.writeFileSync(out, res.map(r => `${r.sel}\t${r.x},${r.y},${r.w},${r.h}\t${r.vis}\t${r.txt || ''}\t${r.props || ''}`).join('\n') + '\n');
console.log(res.length, fs.statSync(out).size);
