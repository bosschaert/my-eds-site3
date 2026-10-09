// minimal static server for stardust/prototypes (fallback when python3 http.server cannot bind)
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
const [dir, port] = [process.argv[2] || 'stardust/prototypes', Number(process.argv[3] || 8791)];
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json', '.woff2': 'font/woff2' };
http.createServer((req, res) => {
  const p = path.normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^(\.\.[/\\])+/, '');
  const f = path.join(dir, p === '/' ? '/index.html' : p);
  fs.readFile(f, (e, b) => { if (e) { res.writeHead(404); res.end('not found'); return; } res.writeHead(200, { 'content-type': types[path.extname(f)] || 'application/octet-stream' }); res.end(req.method === 'HEAD' ? undefined : b); });
}).listen(port, '127.0.0.1', () => console.log(`serving ${dir} on http://127.0.0.1:${port}`));
