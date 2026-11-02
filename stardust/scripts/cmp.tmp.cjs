const [a0,b0]=process.argv.slice(2);
const a=require(process.cwd()+'/'+a0).rows.filter(r=>r.t&&!/sr-only|uw-sl/.test(r.el)), b=require(process.cwd()+'/'+b0).rows.filter(r=>r.t&&!/sr-only/.test(r.el));
const used=new Set();let last=null;
for(const r of a){const i=b.findIndex((x,i)=>!used.has(i)&&x.t===r.t);if(i<0)continue;used.add(i);const m=b[i];const d=m.y-r.y;if(Math.abs(d-(last??1e9))>1){console.log(r.y,'->',m.y,'d',d,'x',r.x,m.x,JSON.stringify(r.t).slice(0,40));last=d;}}
