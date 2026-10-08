#!/usr/bin/env node
// unit.mjs — targeted edit of one units.<name> object in a unit ledger (migrate/rollout progress.json).
// Usage: node unit.mjs <file> <name> <status> [--kind k] [--templates a,b] [--pages n] [--blocks n]
//        [--verdict "…"] [--gates '<json>'] ; --help prints this and touches nothing.
import fs from 'node:fs';
const a = process.argv.slice(2);
if (a.includes('--help') || a.length < 3) { console.log(fs.readFileSync(new URL(import.meta.url)).toString().split('\n').slice(1, 4).join('\n')); process.exit(a.includes('--help') ? 0 : 2); }
const [file, name, status] = a;
const opt = (k) => { const i = a.indexOf(k); return i > -1 ? a[i + 1] : undefined; };
const led = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : { units: {} };
led.units ||= {};
const u = led.units[name] || {};
u.status = status;
if (opt('--kind')) u.kind = opt('--kind');
if (opt('--templates')) u.templates = opt('--templates').split(',');
if (opt('--pages')) u.pages = Number(opt('--pages'));
if (opt('--blocks')) u.blocks = Number(opt('--blocks'));
if (opt('--verdict')) u.verdict = opt('--verdict');
if (opt('--gates')) u.gates = JSON.parse(opt('--gates'));
const now = new Date().toISOString();
if (status === 'running' && !u.startedAt) u.startedAt = now;
if (status === 'done' || status === 'failed') u.endedAt = now;
led.units[name] = u;
fs.writeFileSync(file, `${JSON.stringify(led, null, 2)}\n`);
console.log(`${file}: units.${name} ← ${status}${u.verdict ? ` — ${u.verdict}` : ''}`);
