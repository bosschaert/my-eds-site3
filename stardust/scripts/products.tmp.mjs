import * as cheerio from 'cheerio'; import fs from 'fs';
const $ = cheerio.load(fs.readFileSync('stardust/current/pages/index.html','utf8'));
const out = [];
$('.hf__category-product__slider').each((i, s) => {
  const items = [];
  $(s).find('.slider-item').each((_, it) => {
    const a = $(it).find('a').first(); const img = $(it).find('img.product-image-photo');
    items.push({ href: a.attr('href'), name: $(it).find('[id^=slider-name]').text().trim(), price: $(it).find('.price').first().text().trim(), img: (img.attr('data-static-image')||img.attr('src')).split('/').pop(), alt: img.attr('alt') });
  });
  const cta = $(s).find('a.c-product-carousel-transparent__cta');
  out.push({ title: $(s).find('h2').first().text().trim(), cta: { href: cta.attr('href'), text: cta.text().trim(), title: cta.attr('title') }, items });
});
fs.writeFileSync('stardust/replica/lift/products.json', JSON.stringify(out, null, 1));
for (const c of out) { console.log(c.title, JSON.stringify(c.cta)); c.items.forEach(x => console.log('  ', x.name, x.price, x.img, x.href)); }
