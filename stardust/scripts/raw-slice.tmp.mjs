import * as cheerio from 'cheerio'; import fs from 'fs';
const $ = cheerio.load(fs.readFileSync(process.argv[2],'utf8'));
const el = $(process.argv[3]).first(); el.find('script,style').remove();
let h = $.html(el).replace(/\s(x-[\w:.-]+|@[\w:.-]+|:[\w-]+|data-[\w-]+|aria-[\w-]+|tabindex|role)="[^"]*"/g,'').replace(/\s+/g,' ');
console.log(h.slice(0, +process.argv[4] || 4000));
