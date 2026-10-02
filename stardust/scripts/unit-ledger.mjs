#!/usr/bin/env node
// unit-ledger.mjs — targeted edit of one `units.<name>` object in a unit ledger
// (stardust/migrate/progress.json or stardust/rollout/progress.json), the shape of
// replica's handoff-contract § 3 row C. Never rewrites other units.
// Usage: node stardust/scripts/unit-ledger.mjs <file> <unit> --status pending|running|done|failed
//        --kind <kind> [--templates a,b] [--pages n] [--blocks n] [--verdict "…"] [--gates '<json>']
//        node stardust/scripts/unit-ledger.mjs <file> --list
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
if (args.includes('--help') || args.length < 2) {
  console.log('usage: unit-ledger.mjs <file> <unit> --status s --kind k [--templates a,b] [--pages n] [--blocks n] [--verdict t] [--gates json] | <file> --list');
  process.exit(args.includes('--help') ? 0 : 2);
}
const [file, unit] = args;
const opt = (k) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : undefined; };
let doc = { units: {} };
if (fs.existsSync(file)) doc = JSON.parse(fs.readFileSync(file, 'utf8'));
if (!doc.units) doc.units = {};
if (unit === '--list') {
  for (const [n, u] of Object.entries(doc.units)) console.log(`${n}\t${u.status}\t${u.kind}\t${u.verdict || ''}`);
  process.exit(0);
}
const now = new Date().toISOString().replace(/\.\d+Z$/, 'Z');
const u = doc.units[unit] || { status: 'pending' };
const status = opt('--status');
if (status) u.status = status;
if (opt('--kind')) u.kind = opt('--kind');
if (opt('--templates')) u.templates = opt('--templates').split(',').filter(Boolean);
if (opt('--pages') !== undefined) u.pages = Number(opt('--pages'));
if (opt('--blocks') !== undefined) u.blocks = Number(opt('--blocks'));
if (opt('--verdict')) u.verdict = opt('--verdict');
if (opt('--gates')) u.gates = JSON.parse(opt('--gates'));
if (status === 'running' && !u.startedAt) u.startedAt = now;
if ((status === 'done' || status === 'failed')) { if (!u.startedAt) u.startedAt = now; u.endedAt = now; }
doc.units[unit] = u;
fs.mkdirSync(path.dirname(file), { recursive: true });
fs.writeFileSync(file, `${JSON.stringify(doc, null, 2)}\n`);
console.log(`${unit}: ${u.status}${u.verdict ? ` — ${u.verdict}` : ''}`);
