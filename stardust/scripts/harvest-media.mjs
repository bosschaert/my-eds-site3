// Download every media.imgs src (+ og image + logo) of a captured page JSON into stardust/current/assets/media/.
// Usage: node stardust/scripts/harvest-media.mjs <page.json>   → writes assets/media/<basename>-<hash8>.<ext> + media-manifest.json
import fs from 'node:fs'; import path from 'node:path'; import crypto from 'node:crypto';
const page = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const out = 'stardust/current/assets/media'; fs.mkdirSync(out, { recursive: true });
const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36';
const urls = [...new Set(page.media.imgs.map((i) => i.src).concat(page.og?.image ? [page.og.image] : []))].map((u) => (u.startsWith('//') ? 'https:' + u : u));
const manifest = []; let ok = 0, fail = 0;
for (const u of urls) {
  try {
    const res = await fetch(u, { headers: { 'user-agent': UA, referer: page.url } });
    if (!res.ok) { fail++; manifest.push({ src: u, status: res.status }); continue; }
    const buf = Buffer.from(await res.arrayBuffer());
    const ct = res.headers.get('content-type') || '';
    const base = decodeURIComponent(path.basename(new URL(u).pathname)).replace(/[^\w.-]+/g, '_');
    let ext = path.extname(base).toLowerCase(); let stem = base.slice(0, base.length - ext.length);
    if (!ext || ext.length > 5) ext = ct.includes('png') ? '.png' : ct.includes('gif') ? '.gif' : ct.includes('webp') ? '.webp' : '.jpg';
    const hash = crypto.createHash('sha1').update(u).digest('hex').slice(0, 8);
    const file = `${stem}-${hash}${ext}`;
    fs.writeFileSync(path.join(out, file), buf); ok++;
    manifest.push({ src: u, file: `assets/media/${file}`, bytes: buf.length, contentType: ct });
  } catch (e) { fail++; manifest.push({ src: u, error: String(e.message || e) }); }
}
fs.writeFileSync(path.join(out, 'media-manifest.json'), JSON.stringify(manifest, null, 2));
console.log(`harvest: ${ok} ok, ${fail} failed → ${out}/media-manifest.json`);
