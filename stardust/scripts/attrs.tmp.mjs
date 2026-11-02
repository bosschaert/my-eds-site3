import * as cheerio from 'cheerio'; import fs from 'fs';
const $ = cheerio.load(fs.readFileSync('stardust/current/pages/index.html','utf8'));
for (const root of process.argv.slice(2)) {
  $(root).find('[aria-label],[title]').each((_, e) => {
    const el = $(e); const t = el.text().trim().replace(/\s+/g,' ').slice(0,40);
    console.log(root, e.tagName, el.attr('class')?.split(' ')[0] || '', '|', el.attr('href') || '', '| AL=', el.attr('aria-label') || '', '| T=', el.attr('title') || '', '|', t);
  });
}
