import * as cheerio from 'cheerio'; import fs from 'fs';
const $ = cheerio.load(fs.readFileSync('stardust/current/pages/index.html','utf8'));
const map = { search: '#menu-search-icon svg.c-header__icon', account: '#customer-menu svg.c-header__icon', cart: '#menu-cart-icon svg', hamburger: '#megamenu-hamburger svg', close: '#menu-search-icon svg.c-header__icon-close' };
for (const [k, s] of Object.entries(map)) { const el = $(s).first(); el.removeAttr('class'); fs.writeFileSync(`stardust/current/assets/icons/${k}.svg`, $.html(el).replace(/\s+/g,' ')); console.log(k, $.html(el).length); }
