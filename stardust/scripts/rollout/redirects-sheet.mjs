#!/usr/bin/env node
// redirects-sheet.mjs — wire stardust/redirects.tsv into the DA-backed /redirects.json sheet:
// PUT (admin.da.live source API, multipart `data` JSON), then preview + publish via admin.hlx.page.
// Token from --token-file <path> (read once, never printed). Also stages content/redirects.json.
import { readFileSync, writeFileSync } from 'node:fs';
const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const tsv = opt('--tsv', 'stardust/redirects.tsv');
const org = opt('--org'), repo = opt('--repo'), ref = opt('--ref', 'main');
const sheetPath = opt('--path', 'redirects.json');
const tokenFile = opt('--token-file');
const noPublish = args.includes('--no-publish');
if (!org || !repo || !tokenFile) { console.error('usage: --org <org> --repo <repo> --token-file <path> [--ref main] [--tsv file] [--path redirects.json] [--no-publish]'); process.exit(2); }
const token = readFileSync(tokenFile, 'utf8').trim();
if (!token) { console.error('token file empty'); process.exit(2); }
const lines = readFileSync(tsv, 'utf8').split(/\r?\n/).filter((l) => l.trim());
const [h, ...rows] = lines.map((l) => l.split('\t'));
const [cS, cD] = [h.indexOf('Source'), h.indexOf('Destination')];
if (cS < 0 || cD < 0) { console.error('TSV needs Source and Destination columns'); process.exit(2); }
const data = rows.map((r) => ({ Source: r[cS].trim(), Destination: r[cD].trim() })).filter((r) => r.Source && r.Destination);
const sheet = { total: data.length, limit: data.length, offset: 0, data, ':type': 'sheet' };
writeFileSync(`content/${sheetPath}`, JSON.stringify(sheet, null, 2) + '\n');
const auth = { Authorization: `Bearer ${token}` };
const fd = new FormData();
fd.append('data', new Blob([JSON.stringify(sheet)], { type: 'application/json' }));
const put = await fetch(`https://admin.da.live/source/${org}/${repo}/${sheetPath}`, { method: 'POST', headers: auth, body: fd });
console.log(`PUT source ${sheetPath}: ${put.status}`);
if (!put.ok) { console.error((await put.text()).slice(0, 300)); process.exit(1); }
for (const stage of ['preview', ...(noPublish ? [] : ['live'])]) {
  const r = await fetch(`https://admin.hlx.page/${stage}/${org}/${repo}/${ref}/${sheetPath}`, { method: 'POST', headers: auth });
  console.log(`${stage} ${sheetPath}: ${r.status}`);
  if (!r.ok) { console.error((await r.text()).slice(0, 300)); process.exit(1); }
}
console.log(`rows: ${data.length}`);
