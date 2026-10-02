import fs from 'node:fs'; import path from 'node:path';
const man = JSON.parse(fs.readFileSync('stardust/current/assets/media/media-manifest.json', 'utf8'));
const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36';
let ok = 0, fail = 0;
for (const m of man) {
  if (!m.file || !/format=300w/.test(m.src)) continue;
  const u = m.src.replace('format=300w', 'format=500w');
  const file = m.file.replace(/(\.[a-z]+)$/, '-500w$1');
  try { const r = await fetch(u, { headers: { 'user-agent': UA } }); if (!r.ok) { fail++; continue; } fs.writeFileSync(path.join('stardust/current', file), Buffer.from(await r.arrayBuffer())); m.file500 = file; m.src500 = u; ok++; } catch { fail++; }
}
fs.writeFileSync('stardust/current/assets/media/media-manifest.json', JSON.stringify(man, null, 2));
console.log(`harvest-500w: ${ok} ok, ${fail} failed`);
