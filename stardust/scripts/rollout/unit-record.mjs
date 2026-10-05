#!/usr/bin/env node
// unit-record.mjs <name> <status> [--verdict "…"] [--gates-json '{…}'] [--pages n] [--blocks n]
// Writes stardust/rollout/progress.json units.<name> (C-deliver unit ledger). Main-agent writer, single process.
import { readFileSync, writeFileSync, renameSync } from 'node:fs';
const [name, status, ...rest] = process.argv.slice(2);
if (!name || !status) { console.error('usage: unit-record.mjs <name> <status> [--verdict s] [--gates-json j] [--pages n] [--blocks n]'); process.exit(1); }
const opt = {}; for (let i = 0; i < rest.length; i += 2) opt[rest[i].replace(/^--/, '')] = rest[i + 1];
const file = 'stardust/rollout/progress.json';
const data = JSON.parse(readFileSync(file, 'utf8'));
const u = data.units[name] ?? (data.units[name] = {});
const now = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
u.status = status;
if (status === 'running' && !u.startedAt) u.startedAt = now;
if (status === 'done' || status === 'failed') { u.startedAt ??= now; u.endedAt = now; }
if (opt.verdict) u.verdict = opt.verdict;
if (opt['gates-json']) u.gates = JSON.parse(opt['gates-json']);
if (opt.pages) u.pages = Number(opt.pages);
if (opt.blocks) u.blocks = Number(opt.blocks);
data._provenance = { ...(data._provenance || {}), writtenAt: now };
writeFileSync(file + '.tmp', JSON.stringify(data, null, 2) + '\n'); renameSync(file + '.tmp', file);
console.log(`${name}: ${status}${u.verdict ? ' — ' + u.verdict : ''}`);
