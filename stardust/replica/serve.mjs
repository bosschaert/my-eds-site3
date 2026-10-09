// Minimal static file server for the prototype dir (python http.server fails on this host's hostname lookup).
// Usage: node serve.mjs <dir> <port>
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
const [,, dir = '.', port = '8791'] = process.argv;
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ico': 'image/x-icon', '.webp': 'image/webp' };
const root = path.resolve(dir);
http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p.endsWith('/')) p += 'index.html';
  const f = path.normalize(path.join(root, p));
  if (!f.startsWith(root)) { res.writeHead(403); return res.end(); }
  fs.stat(f, (err, st) => {
    if (err || !st.isFile()) { res.writeHead(404); return res.end('not found'); }
    res.writeHead(200, { 'content-type': types[path.extname(f).toLowerCase()] || 'application/octet-stream', 'content-length': st.size, 'cache-control': 'no-store' });
    if (req.method === 'HEAD') return res.end();
    fs.createReadStream(f).pipe(res);
  });
}).listen(Number(port), '127.0.0.1', () => console.log(`serving ${root} on http://127.0.0.1:${port}/`));
