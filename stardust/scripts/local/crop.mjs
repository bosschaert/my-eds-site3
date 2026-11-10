#!/usr/bin/env node
// crop.mjs <in.png> <out.png> --y <px> --h <px> [--x 0 --w <px>] [--scale 0.5] — one crop per fact (box-filter downscale).
import { PNG } from 'pngjs'; import { readFileSync, writeFileSync } from 'node:fs';
const a = process.argv.slice(2); const o = (k, d) => { const i = a.indexOf(k); return i >= 0 ? Number(a[i + 1]) : d; };
const src = PNG.sync.read(readFileSync(a[0]));
const x0 = o('--x', 0), y0 = o('--y', 0), w = Math.min(o('--w', src.width - x0), src.width - x0), h = Math.min(o('--h', 900), src.height - y0), s = o('--scale', 0.5);
const W = Math.max(1, Math.round(w * s)), H = Math.max(1, Math.round(h * s)); const out = new PNG({ width: W, height: H });
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
  const sx0 = x0 + Math.floor(x / s), sy0 = y0 + Math.floor(y / s), sx1 = Math.max(sx0 + 1, x0 + Math.floor((x + 1) / s)), sy1 = Math.max(sy0 + 1, y0 + Math.floor((y + 1) / s));
  const acc = [0, 0, 0, 0]; let n = 0;
  for (let yy = sy0; yy < sy1; yy++) for (let xx = sx0; xx < sx1; xx++) { const i = (yy * src.width + xx) * 4; for (let c = 0; c < 4; c++) acc[c] += src.data[i + c]; n++; }
  const j = (y * W + x) * 4; for (let c = 0; c < 4; c++) out.data[j + c] = Math.round(acc[c] / n);
}
writeFileSync(a[1], PNG.sync.write(out)); console.log(`${a[1]} ${W}x${H} from ${x0},${y0} ${w}x${h}`);
