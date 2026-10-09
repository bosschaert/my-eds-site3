#!/usr/bin/env node
// Minimal static file server for the prototype dir (python3 http.server fails on this host's long hostname).
// Usage: node static-serve.mjs <dir> <port> [pidfile]   — writes its own pid to <pidfile> so it can be stopped by exactly that pid
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
const [dir = '.', port = '8791', pidfile] = process.argv.slice(2);
if (dir === '--help' || dir === '-h') { console.log('Usage: node static-serve.mjs <dir> <port> [pidfile]'); process.exit(0); }
const root = path.resolve(dir);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.gif': 'image/gif', '.ico': 'image/x-icon', '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.mp4': 'video/mp4', '.txt': 'text/plain; charset=utf-8' };
http.createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  let p = path.normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[/\\])+/, '');
  let file = path.join(root, p);
  if (!file.startsWith(root)) { res.writeHead(403); return res.end(); }
  try { if (fs.statSync(file).isDirectory()) file = path.join(file, 'index.html'); } catch { res.writeHead(404); return res.end('not found'); }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); return res.end('not found'); }
    res.writeHead(200, { 'content-type': types[path.extname(file).toLowerCase()] || 'application/octet-stream', 'cache-control': 'no-store', 'content-length': data.length });
    res.end(req.method === 'HEAD' ? undefined : data);
  });
}).listen(Number(port), '127.0.0.1', () => { if (pidfile) fs.writeFileSync(pidfile, String(process.pid)); console.log(`static-serve: ${root} on http://127.0.0.1:${port} (pid ${process.pid})`); });
