// Assembles index-proposed.html from its template: rewrites the media placeholder and inlines
// the captured map SVG (the source renders it inline, so the theme's label CSS applies).
import fs from 'node:fs';
const dir = new URL('.', import.meta.url).pathname;
const tpl = fs.readFileSync(dir + 'index-proposed.template.html', 'utf8');
const svg = fs.readFileSync(dir + '../current/assets/media/map.svg', 'utf8');
const out = tpl.replaceAll('__M__', '../current/assets/media').replace('__MAP_SVG__', () => svg);
fs.writeFileSync(dir + 'index-proposed.html', out);
console.log('index-proposed.html', out.length, 'chars');
