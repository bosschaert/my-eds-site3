// Crop one band of a stitched PNG: node crop.mjs <in.png> <out.png> <y> <height> [x] [width]
import fs from 'node:fs';
import { PNG } from 'pngjs';
const [inp, out, y0, h0, x0 = '0', w0] = process.argv.slice(2);
const src = PNG.sync.read(fs.readFileSync(inp));
const x = +x0, y = +y0, w = w0 ? +w0 : src.width - x, h = Math.min(+h0, src.height - y);
const dst = new PNG({ width: w, height: h });
PNG.bitblt(src, dst, x, y, w, h, 0, 0);
fs.writeFileSync(out, PNG.sync.write(dst));
console.log(`${out}: ${w}x${h} from y=${y}`);
