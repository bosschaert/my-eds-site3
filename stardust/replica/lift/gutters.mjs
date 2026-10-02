// Find horizontal white gutter rows inside the grid column of a stitched capture.
// node gutters.mjs <png> <x0> <x1> <y0> <y1>  → prints tile bands [top, bottom, height]
import fs from 'node:fs';
import { PNG } from 'pngjs';
const [f, X0, X1, Y0, Y1] = process.argv.slice(2);
const p = PNG.sync.read(fs.readFileSync(f));
const x0 = +X0, x1 = +X1, y0 = +Y0, y1 = Math.min(+Y1, p.height);
const white = (x, y) => { const i = (p.width * y + x) * 4; return p.data[i] > 250 && p.data[i + 1] > 250 && p.data[i + 2] > 250; };
const rowWhite = (y) => { for (let x = x0; x < x1; x++) if (!white(x, y)) return false; return true; };
const bands = []; let inTile = false, top = 0;
for (let y = y0; y < y1; y++) { const w = rowWhite(y); if (!w && !inTile) { inTile = true; top = y; } else if (w && inTile) { inTile = false; bands.push([top, y, y - top]); } }
if (inTile) bands.push([top, y1, y1 - top]);
console.log(`${f}: ${bands.length} bands`); console.log(bands.map((b) => b.join(':')).join(' '));
