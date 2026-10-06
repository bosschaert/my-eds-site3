#!/usr/bin/env node
// serve.mjs — minimal static file server for the prototype gate. Usage: node serve.mjs <dir> <port>
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
const [dir = 'stardust/prototypes', port = '8791'] = process.argv.slice(2);
const root = path.resolve(dir);
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.woff': 'font/woff', '.json': 'application/json', '.ico': 'image/x-icon', '.mp4': 'video/mp4' };
http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname); if (p.endsWith('/')) p += 'index.html';
  const f = path.join(root, p); if (!f.startsWith(root)) { res.writeHead(403); return res.end(); }
  fs.stat(f, (e, st) => { if (e || !st.isFile()) { res.writeHead(404); return res.end('not found'); }
    res.writeHead(200, { 'content-type': mime[path.extname(f).toLowerCase()] || 'application/octet-stream', 'content-length': st.size, 'cache-control': 'no-store', 'access-control-allow-origin': '*' });
    if (req.method === 'HEAD') return res.end(); fs.createReadStream(f).pipe(res); });
}).listen(Number(port), '127.0.0.1', () => console.log(`serve: ${root} on http://127.0.0.1:${port}/`));
