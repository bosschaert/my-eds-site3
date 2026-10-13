// node crop.cjs <png> <x> <y> <w> <h> <scale-div> <out>
const {PNG}=require('pngjs');const fs=require('fs');
const [,,f,x,y,w,h,d,o]=process.argv;const s=PNG.sync.read(fs.readFileSync(f));const D=+d;
const W=Math.floor(+w/D),H=Math.floor(Math.min(+h,s.height-+y)/D);const out=new PNG({width:W,height:H});
for(let j=0;j<H;j++)for(let i=0;i<W;i++){let r=0,g=0,b=0;for(let v=0;v<D;v++)for(let u=0;u<D;u++){const k=((+y+j*D+v)*s.width+(+x+i*D+u))*4;r+=s.data[k];g+=s.data[k+1];b+=s.data[k+2];}const q=(j*W+i)*4,n=D*D;out.data[q]=r/n;out.data[q+1]=g/n;out.data[q+2]=b/n;out.data[q+3]=255;}
fs.writeFileSync(o,PNG.sync.write(out));
