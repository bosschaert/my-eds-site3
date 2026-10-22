// crop.mjs <in.png> <out.png> <y> <h> [scale=2] [x=0] [w=full] — box-filter downscale of one band.
import fs from 'node:fs'; import { PNG } from 'pngjs';
const [inp, out, y0, hh, sc = '2', x0 = '0', ww] = process.argv.slice(2);
const src = PNG.sync.read(fs.readFileSync(inp));
const s = Number(sc), Y = Number(y0), X = Number(x0);
const W = Number(ww || src.width - X), H = Math.min(Number(hh), src.height - Y);
const ow = Math.floor(W / s), oh = Math.floor(H / s); const dst = new PNG({ width: ow, height: oh });
for (let y = 0; y < oh; y++) for (let x = 0; x < ow; x++) { const acc = [0, 0, 0, 0];
  for (let dy = 0; dy < s; dy++) for (let dx = 0; dx < s; dx++) { const i = ((Y + y * s + dy) * src.width + X + x * s + dx) * 4; for (let k = 0; k < 4; k++) acc[k] += src.data[i + k]; }
  const o = (y * ow + x) * 4; for (let k = 0; k < 4; k++) dst.data[o + k] = acc[k] / (s * s); }
fs.writeFileSync(out, PNG.sync.write(dst)); console.log(`${out}: ${ow}x${oh} from y=${Y}..${Y + H} of ${src.height}`);
