import fs from 'node:fs'; import * as cheerio from 'cheerio';
const $ = cheerio.load(fs.readFileSync(process.argv[2], 'utf8'));
const walk = (el, d, max) => { if (d > max) return; $(el).children().each((_, c) => { if (['script','style','svg','noscript','path'].includes(c.tagName)) return;
  const cls = ($(c).attr('class') || '').slice(0, 110); const t = $(c).children().length ? '' : $(c).text().trim().slice(0, 40);
  console.log('  '.repeat(d) + c.tagName + (cls ? '.' + cls.replace(/\s+/g, '.') : '') + (t ? ` "${t}"` : '')); walk(c, d + 1, max); }); };
walk($(process.argv[3])[0], 0, Number(process.argv[4] || 2));
