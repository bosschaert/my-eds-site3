import * as cheerio from 'cheerio'; import fs from 'fs';
const $ = cheerio.load(fs.readFileSync('stardust/current/pages/index.html','utf8'));
const T = e => $(e).text().trim().replace(/\s+/g, ' ');
const A = (e, k) => $(e).attr(k) || undefined;
const link = e => ({ sr: T($(e).find('.sr-only')) || undefined, label: T($(e).find('.c-mega-panel__label').first().length ? $(e).find('.c-mega-panel__label').first() : e), flag: T($(e).find('.c-mega-panel__flag')) || undefined, href: A(e,'href'), aria: A(e,'aria-label'), title: A(e,'title'), target: A(e,'target') });
const nav = [];
$('.c-mega-nav__list > li.c-mega-nav__item').each((_, li) => {
  const trig = $(li).children('a,button').first();
  const item = { label: T(trig.clone().children().remove().end()), tag: trig[0].tagName, href: A(trig,'href'), aria: A(trig,'aria-label') };
  const p = $(li).find('.c-mega-nav__panel-wrap').first();
  if (p.length) {
    item.panelAria = A(p, 'aria-label');
    item.close = A(p.find('.c-mega-nav__drawer-close'), 'aria-label');
    item.back = { text: T(p.find('.c-mega-nav__back-btn')), aria: A(p.find('.c-mega-nav__back-btn'), 'aria-label') };
    item.heading = T(p.find('.c-mega-nav__l2-heading'));
    const sa = p.find('.c-mega-nav__l2-shop-all'); if (sa.length) item.shopAll = link(sa);
    const fe = p.find('.c-mega-panel__featured');
    if (fe.length) item.featured = { heading: T(fe.find('.c-mega-panel__featured-label')), items: fe.find('a').map((_, a) => ({ ...link(a), all: $(a).hasClass('c-mega-panel__featured-link--all') })).get() };
    item.columns = p.find('.c-mega-panel__column').map((_, c) => ({
      trigger: { text: T($(c).find('.c-mega-panel__l2-trigger')), aria: A($(c).find('.c-mega-panel__l2-trigger'), 'aria-label') },
      heading: T($(c).find('.c-mega-panel__heading').first()), headingHref: A($(c).find('.c-mega-panel__heading a').first(), 'href'), headingAria: A($(c).find('.c-mega-panel__heading a').first(), 'aria-label'),
      links: $(c).find('.c-mega-panel__links a').map((_, a) => link(a)).get(),
    })).get();
    const ad = p.find('[class*="c-mega-panel__ad"]').first();
    if (ad.length) item.ad = { html: ad.attr('class'), imgs: ad.find('img').map((_, i) => ({ src: A(i,'src') || A(i,'data-src'), alt: A(i,'alt') })).get(), links: ad.find('a').map((_, a) => ({ href: A(a,'href'), aria: A(a,'aria-label'), text: T(a) })).get(), text: T(ad) };
  }
  nav.push(item);
});
fs.writeFileSync('stardust/replica/lift/nav.json', JSON.stringify(nav, null, 1));
for (const n of nav) { console.log('L1', n.label, n.tag, n.href||'', '|', n.panelAria||'', '| shopAll', n.shopAll?.label, '| feat', n.featured?.items.length, '| cols', (n.columns||[]).map(c => c.trigger.text + ':' + c.links.length + (c.headingHref?'(h-link)':'')).join(', '), '| ad', n.ad ? JSON.stringify(n.ad).slice(0, 300) : ''); }
// ad tiles
const ads = {};
$('.c-mega-nav__list > li.c-mega-nav__item').each((_, li) => {
  const lab = T($(li).children('a,button').first().clone().children().remove().end());
  ads[lab] = $(li).find('section.c-mega-ad-tile, section.c-mega-paid-ad').map((_, s) => {
    const a = $(s).find('a').first(); const img = $(s).find('img').first();
    const srcs = $(s).find('source').map((_, so) => ({ media: A(so,'media'), srcset: A(so,'srcset') || A(so,'data-srcset') })).get();
    return { kind: $(s).hasClass('c-mega-paid-ad') ? 'paid' : 'tile', mod: ($(s).attr('class').match(/--([\w-]+)/)||[])[1], href: A(a,'href'), aria: A(a,'aria-label'), title: T($(s).find('strong')), desc: T($(s).find('[class$="__description"]')), cta: T($(s).find('[class$="__cta"]')), alt: A(img,'alt'), img: A(img,'data-src') || A(img,'src'), srcs };
  }).get();
});
fs.writeFileSync('stardust/replica/lift/nav-ads.json', JSON.stringify(ads, null, 1));
console.log(JSON.stringify(ads).slice(0, 1500));
