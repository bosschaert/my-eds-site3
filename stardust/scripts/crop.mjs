// crop.mjs <in.png> <out.png> <x> <y> <w> <h> [scale] — one crop per fact (reading discipline).
import fs from 'node:fs'; import { PNG } from 'pngjs';
const [i, o, x, y, w, h, sc = '1'] = process.argv.slice(2);
const src = PNG.sync.read(fs.readFileSync(i)); const s = Number(sc);
const W = Math.min(+w, src.width - +x), H = Math.min(+h, src.height - +y);
const ow = Math.round(W / s), oh = Math.round(H / s); const out = new PNG({ width: ow, height: oh });
for (let yy = 0; yy < oh; yy++) for (let xx = 0; xx < ow; xx++) {
  const si = ((+y + Math.floor(yy * s)) * src.width + (+x + Math.floor(xx * s))) * 4, di = (yy * ow + xx) * 4;
  for (let k = 0; k < 4; k++) out.data[di + k] = src.data[si + k];
}
fs.writeFileSync(o, PNG.sync.write(out)); console.log(`${o} ${ow}x${oh}`);
