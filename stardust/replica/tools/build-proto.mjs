// build-proto.mjs — writes stardust/prototypes/index-proposed.html.
// Clean, re-authored markup; every string, href and alt is read verbatim from the settled
// capture (stardust/current/pages/index.html) so nothing is retyped. No live DOM is copied.
import fs from 'node:fs';
import path from 'node:path';
import * as cheerio from 'cheerio';

const SRC = 'stardust/current/pages/index.html';
const OUT = 'stardust/prototypes/index-proposed.html';
const $ = cheerio.load(fs.readFileSync(SRC, 'utf8'));

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const txt = (el) => $(el).text().replace(/\s+/g, ' ').trim();
const asset = (url) => {
  if (!url) return '';
  const base = path.basename(url.split('?')[0]);
  return `assets/${base}`;
};
const bgUrl = (el) => {
  const m = ($(el).attr('style') || '').match(/url\(['"]?([^'")]+)/);
  return m ? m[1] : '';
};
// inner HTML of a rich-text block, re-emitted with only the semantic tags kept
const rich = (el) => {
  const out = [];
  $(el).children().each((_, c) => {
    if (c.tagName !== 'p') return;
    out.push(`<p>${cleanInline($(c))}</p>`);
  });
  return out.join('\n          ');
};
function cleanInline(node) {
  let h = '';
  node.contents().each((_, c) => {
    if (c.type === 'text') { h += esc(c.data.replace(/\s+/g, ' ')); return; }
    const t = c.tagName;
    if (t === 'br') { h += '<br>'; return; }
    if (['em', 'strong', 'i', 'b'].includes(t)) { h += `<${t}>${cleanInline($(c))}</${t}>`; return; }
    if (t === 'a') { h += `<a href="${esc($(c).attr('href'))}">${cleanInline($(c))}</a>`; return; }
    h += cleanInline($(c));
  });
  return h.replace(/^\s+/, '');
}

// ---------- header ----------
const navs = $('header nav ul[data-nav]');
const navList = (ul, side) => {
  const items = [];
  $(ul).children('li').each((_, li) => {
    const a = $(li).children('a').first();
    const chev = a.find('img.chev');
    const drop = $(li).children('ul.dropdown-menu');
    let h = `<li><a class="sm-nav__link" href="${esc(a.attr('href'))}">${esc(txt(a))}`;
    if (chev.length) h += `<img src="${asset(chev.attr('src'))}" alt="${esc(chev.attr('alt'))}" width="24" height="24">`;
    h += '</a>';
    if (drop.length) {
      h += '\n            <ul class="sm-nav__drop">';
      drop.children('li').each((__, dl) => { const da = $(dl).find('a'); h += `\n              <li><a href="${esc(da.attr('href'))}">${esc(txt(da))}</a></li>`; });
      h += '\n            </ul>\n          ';
    }
    items.push(h + '</li>');
  });
  return `<nav class="sm-nav"><ul class="sm-nav__list sm-nav__list--${side}">\n          ${items.join('\n          ')}\n        </ul></nav>`;
};
const logoSvg = fs.readFileSync('stardust/prototypes/assets/logo-header.svg', 'utf8').replace(/\s*\n\s*/g, ' ');
const mobLogo = $('header img.mob-logo');
const bookBtn = $('header a.book-btn');
const mobMenu = [];
$('#menu-mobile').children('li').each((_, li) => {
  const a = $(li).children('a');
  const sub = $(li).children('ul.mob-sub');
  let h = `<li class="${sub.length ? 'has-children' : ''}"><a href="${esc(a.attr('href'))}">${esc(txt(a))}</a>`;
  if (sub.length) {
    h += '<ul class="sub">';
    sub.children('li').each((__, s) => { const sa = $(s).find('a'); h += `<li><a href="${esc(sa.attr('href'))}">${esc(txt(sa))}</a></li>`; });
    h += `</ul><button class="toggle_child" type="button"><img src="assets/Chevron_Down_White.svg" alt=""></button>`;
  }
  mobMenu.push(h + '</li>');
});

const header = `<header class="sm-header">
      <div class="sm-header__bar">
        ${navList(navs.eq(0), 'left')}
        <div class="sm-logo"><a href="${esc($('header a.logo').attr('href'))}">${logoSvg}</a></div>
        <div class="sm-moblogo"><a href="${esc(mobLogo.parent().attr('href'))}"><img src="${asset(mobLogo.attr('src'))}" alt="${esc(mobLogo.attr('alt'))}" width="112" height="55"></a></div>
        ${navList(navs.eq(1), 'right')}
        <a class="sm-bookbtn" href="${esc(bookBtn.attr('href'))}">${esc(txt(bookBtn))}</a>
        <div class="sm-burger-wrap"><button class="sm-burger" id="menu-btn" type="button" aria-controls="menu"><span></span><span></span><span></span></button></div>
      </div>
    </header>
    <div class="sm-mobmenu" id="menu">
      <ul>
        ${mobMenu.join('\n        ')}
      </ul>
    </div>`;

// ---------- hero ----------
const hero = $('#hero');
const heroImg = hero.find('img').first();
const heroBtn = hero.find('a.btn');
const heroHtml = `<section class="sm-hero" id="hero">
        <div class="sm-hero__media sm-hero__media--desktop"><img src="${asset(heroImg.attr('src'))}" alt="${esc(heroImg.attr('alt'))}" width="1552" height="1090" fetchpriority="high"></div>
        <div class="sm-hero__media sm-hero__media--mobile"><img src="${asset(heroImg.attr('src'))}" alt="${esc(heroImg.attr('alt'))}" width="1552" height="1090"></div>
        <div class="sm-hero__copy">
          <h1>${esc(txt(hero.find('h1')))}</h1>
          <p>${esc(txt(hero.find('p')))}</p>
          <a class="sm-btn" href="${esc(heroBtn.attr('href'))}">${esc(txt(heroBtn))}</a>
        </div>
        <div class="sm-hero__scrim"></div>
      </section>`;

// ---------- image-text-cta sections ----------
const split = (sec) => {
  const s = $(sec);
  const inner = s.children('div').first();
  const reverse = /flex-row-reverse/.test(inner.attr('class') || '');
  const img = inner.find('img').first();
  const text = inner.children('div').eq(1);
  const h2 = text.children('h2');
  const hoursRow = text.children('div').filter((_, d) => $(d).find('.info').length).first();
  const content = text.find('.the-content').first();
  const ctas = text.find('.cta-group a');
  const art = s.children('.ill-img');
  let hours = '';
  if (hoursRow.length) {
    const icon = hoursRow.find('.info img');
    const ps = hoursRow.find('.details p');
    hours = `<div class="sm-hours">
            <div class="sm-hours__info">
              <img src="${asset(icon.attr('src'))}" alt="${esc(icon.attr('alt'))}" width="32" height="32">
              <div><p class="sm-hours__days">${esc(txt(ps.eq(0)))}</p><p class="sm-hours__time">${esc(txt(ps.eq(1)))}</p></div>
            </div>
          </div>
            <div class="sm-rich">
          ${rich(content)}
            </div>`;
  }
  const ctaHtml = ctas.map((_, a) => `<a class="sm-btn sm-btn--shadow${/brand-maroon/.test($(a).attr('class')) ? ' sm-btn--maroon' : ''}" href="${esc($(a).attr('href'))}">${esc(txt(a))}</a>`).get().join('\n            ');
  const artHtml = art.length ? `\n        <div class="sm-split__art js-show-on-scroll-img" style="background-image:url('${asset(bgUrl(art))}');${($(art).attr('style') || '').replace(/background-image:url\([^)]*\);?\s*/, '')}"></div>` : '';
  return `<section class="sm-split${reverse ? ' sm-split--reverse' : ''}">
        <div class="sm-split__inner js-show-on-scroll">
          <div class="sm-split__media"><img class="js-show-on-scroll-img" src="${asset(img.attr('src'))}" alt="${esc(img.attr('alt'))}"></div>
          <div class="sm-split__text">
            <h2>${esc(txt(h2))}</h2>
            ${hours || `<div class="sm-rich">\n          ${rich(content)}\n            </div>`}
            <div class="sm-ctas">
            ${ctaHtml}
            </div>
          </div>
        </div>${artHtml}
      </section>`;
};

// ---------- attractions ----------
const att = $('section.attraction-carousel');
const attSlides = [];
att.find('.swiper-slide').each((_, sl) => {
  const a = $(sl).find('a').first();
  const img = a.find('img');
  const body = a.children('div').eq(1);
  const fixed = /lg:h-60/.test(body.attr('class') || '');
  attSlides.push(`<div class="sm-track__slide">
              <div class="sm-card js-show-on-scroll-img">
                <a class="sm-card-link" href="${esc(a.attr('href'))}">
                  <div class="sm-card__img"><img src="${asset(img.attr('src'))}" alt="${esc(img.attr('alt'))}"></div>
                  <div class="sm-card__body${fixed ? ' sm-card__body--fixed' : ''}">
                    <h2>${esc(txt(body.find('h2')))}</h2>
                    <div class="sm-rich">${esc(txt(body.find('.the-content')))}</div>
                    <div class="sm-card__cta"><span class="sm-more">${esc(txt(body.find('.btn-link')))}</span></div>
                  </div>
                </a>
              </div>
            </div>`);
});
const attHtml = `<section class="sm-attractions js-show-on-scroll" style="background-image:url('${asset(bgUrl(att))}')">
        <div class="sm-attractions__inner">
          <h2>${esc(txt(att.children('div').first().children('h2')))}</h2>
          <div class="sm-track" data-carousel="attractions" data-autoplay="5500">
            <div class="sm-track__rail">
            ${attSlides.join('\n            ')}
            </div>
          </div>
        </div>
        <button class="sm-arrow sm-arrow--prev" type="button"></button>
        <button class="sm-arrow sm-arrow--next" type="button"></button>
      </section>`;

// ---------- testimonials ----------
const tes = $('section.testimonials');
const reviews = [];
tes.find('.swiper-slide').each((_, sl) => {
  const q = $(sl).find('blockquote');
  const stars = $(sl).find('ul.starred li').length;
  reviews.push(`<div class="sm-track__slide">
              <div class="sm-review">
                <blockquote>${esc($(q).text().replace(/\s+/g, ' ').trim())}</blockquote>
                <div class="sm-rating"><ul class="sm-stars">${'<li></li>'.repeat(stars)}</ul></div>
                <p class="sm-review__name">${esc(txt($(sl).find('p')))}</p>
              </div>
            </div>`);
});
const tesHtml = `<section class="sm-reviews js-show-on-scroll" style="background-image:url('${asset(bgUrl(tes))}')">
        <div class="sm-reviews__inner sm-wrap">
          <h2>${esc(txt(tes.find('h2')))}</h2>
          <div class="sm-track" data-carousel="reviews" data-autoplay="5500">
            <div class="sm-track__rail">
            ${reviews.join('\n            ')}
            </div>
            <div class="sm-dots"></div>
          </div>
        </div>
      </section>`;

// ---------- tickets ----------
const tk = $('#Tickets');
const tickets = [];
tk.find('article').each((_, art) => {
  const A = $(art);
  if (A.hasClass('useful')) return;
  const imgs = A.find('img');
  const h3 = A.find('h3');
  const price = A.find('p');
  const btn = A.find('.btn');
  const links = A.find('a');
  if (links.length > 1) {
    // Go City card: image + title link to one target, button to another
    const a1 = links.eq(0);
    const a2 = links.last();
    tickets.push(`<article class="sm-ticket js-show-on-scroll-img">
              <a href="${esc(a1.attr('href'))}"><img src="${asset(imgs.attr('src'))}" alt="${esc(imgs.attr('alt'))}"></a>
              <div class="sm-ticket__body">
                <a href="${esc(a1.attr('href'))}" class="sm-ticket__row"><h3>${esc(txt(h3))}</h3></a>
                <a href="${esc(a2.attr('href'))}"><span class="sm-btn">${esc(txt(btn))}</span></a>
              </div>
            </article>`);
    return;
  }
  tickets.push(`<article class="sm-ticket js-show-on-scroll-img">
              <a href="${esc(links.attr('href'))}">
                <img src="${asset(imgs.attr('src'))}" alt="${esc(imgs.attr('alt'))}">
                <div class="sm-ticket__body">
                  <div class="sm-ticket__row"><h3>${esc(txt(h3))}</h3><p>${esc(txt(price))}</p></div>
                  <span class="sm-btn">${esc(txt(btn))}</span>
                </div>
              </a>
            </article>`);
});
const useful = tk.find('article.useful');
const usefulItems = [];
useful.find('ul > li').each((_, li) => {
  const L = $(li);
  const img = L.find('img');
  const a = L.children('a');
  const icon = `<img class="sm-icon" src="${asset(img.attr('src'))}" alt="${esc(img.attr('alt'))}" width="32" height="32">`;
  if (a.length) usefulItems.push(`<li><a href="${esc(a.attr('href'))}">${icon}${esc(txt(a))}</a></li>`);
  else usefulItems.push(`<li class="sm-useful__row">${icon}${esc(txt(L))}</li>`);
});
const usefulCta = useful.find('.cta a');
const loaf = useful.find('.ill-img');
const tkHtml = `<section class="sm-tickets js-show-on-scroll" id="Tickets">
        <div class="sm-tickets__inner sm-wrap">
          <h2>${esc(txt(tk.find('h2').first()))}</h2>
          <div class="sm-tickets__grid">
            ${tickets.join('\n            ')}
            <article class="sm-useful">
              <h3>${esc(txt(useful.find('h3')))}</h3>
              <ul>
                ${usefulItems.join('\n                ')}
              </ul>
              <div class="sm-useful__cta"><a class="sm-btn sm-btn--shadow" href="${esc(usefulCta.attr('href'))}">${esc(txt(usefulCta))}</a></div>
              <div class="sm-useful__art js-show-on-scroll-img" style="background-image:url('${asset(bgUrl(loaf))}')"></div>
            </article>
          </div>
        </div>
      </section>`;

// ---------- call-out ----------
const co = $('#callOut');
const coIcon = co.find('img');
const coBtn = co.find('a.btn');
const coHtml = `<section class="sm-callout js-show-on-scroll" id="callOut" style="background-image:url('${asset(bgUrl(co))}')">
        <div class="sm-callout__inner">
          <div class="sm-callout__row">
            <div class="sm-callout__copy">
              <h3>${esc(txt(co.find('h3')))}</h3>
              <p>${esc(txt(co.find('p')))}</p>
              <div class="sm-callout__hours"><img src="${asset(coIcon.attr('src'))}" alt="${esc(coIcon.attr('alt'))}" width="32" height="32">${esc(txt(coIcon.closest('.icn').parent()))}</div>
              <a class="sm-btn" href="${esc(coBtn.attr('href'))}">${esc(txt(coBtn))}</a>
            </div>
          </div>
        </div>
      </section>`;

// ---------- posts ----------
const posts = (sec) => {
  const S = $(sec);
  const items = [];
  S.find('article').each((_, art) => {
    const a = $(art).find('a').first();
    const img = a.find('img');
    items.push(`<article class="sm-post js-show-on-scroll-img">
              <a class="sm-card-link" href="${esc(a.attr('href'))}">
                <div class="sm-post__img"><img src="${asset(img.attr('src'))}" alt="${esc(img.attr('alt'))}" width="395" height="296"></div>
                <h3>${esc(txt(a.find('h3')))}</h3>
                <div class="sm-post__excerpt sm-rich"><p>${esc(txt(a.find('.the-content p')))}</p></div>
                <span class="sm-txtlink">${esc(txt(a.find('.btn-txt')))}</span>
              </a>
            </article>`);
  });
  const all = S.find('a.btn').last();
  return `<section class="sm-posts js-show-on-scroll">
        <div class="sm-posts__inner sm-wrap">
          <h2>${esc(txt(S.find('h2').first()))}</h2>
          <div class="sm-posts__grid">
            ${items.join('\n            ')}
          </div>
          <div class="sm-posts__all"><a class="sm-btn" href="${esc(all.attr('href'))}">${esc(txt(all))}</a></div>
        </div>
      </section>`;
};

// ---------- footer ----------
const ft = $('footer');
const flogo = ft.find('img.logo-foot');
const fcols = [];
ft.find('.container').first().children('div').first().children('.col').each((i, col) => {
  const C = $(col);
  const loose = /space-y-4/.test(C.attr('class') || '');
  const rows = [];
  C.children('div').each((_, r) => {
    const R = $(r);
    if (R.hasClass('flex') && R.hasClass('space-x-6')) {
      const socials = R.find('a').map((__, a) => `<a href="${esc($(a).attr('href'))}"${$(a).attr('target') ? ` target="${esc($(a).attr('target'))}"` : ''}${$(a).attr('aria-label') ? ` aria-label="${esc($(a).attr('aria-label'))}"` : ''}><img src="${asset($(a).find('img').attr('src'))}" alt="${esc($(a).find('img').attr('alt'))}" width="32" height="32"></a>`).get().join('');
      rows.push(`<div class="sm-footer__socials">${socials}</div>`);
      return;
    }
    const img = R.find('.icn img');
    const a = R.children('a');
    let body;
    if (a.length && a.attr('href')) body = `<a href="${esc(a.attr('href'))}">${esc(txt(a))}</a>`;
    else if (a.length) body = `<a>${esc(txt(a))}</a>`;
    else body = `<div>${R.children('div').last().html().split(/<br\s*\/?>/).map((s) => esc(cheerio.load(s).text().trim())).join('<br>')}</div>`;
    rows.push(`<div class="sm-footer__item"><img src="${asset(img.attr('src'))}" alt="${esc(img.attr('alt'))}" width="24" height="24">${body}</div>`);
  });
  fcols.push(`<div class="sm-footer__col${loose ? ' sm-footer__col--loose' : ''}">
              <h4>${esc(txt(C.children('h4')))}</h4>
              ${rows.join('\n              ')}
            </div>`);
});
const partners = ft.find('.grid img').map((_, im) => `<div><img src="${asset($(im).attr('src'))}" alt="${esc($(im).attr('alt'))}"></div>`).get().join('\n            ');
const support = ft.find('p').filter((_, p) => /supported/.test($(p).text())).first();
const legal = ft.find('ul li a').map((_, a) => `<li><a href="${esc($(a).attr('href'))}">${esc(txt(a))}</a></li>`).get().join('\n              ');
const credit = ft.find('p').last();
const creditA = credit.find('a');
const footer = `<footer class="sm-footer">
      <div class="sm-footer__grass"></div>
      <div class="sm-footer__body">
        <div class="sm-footer__logo"><a href="${esc(flogo.parent().attr('href'))}"><img src="${asset(flogo.attr('src'))}" alt="${esc(flogo.attr('alt'))}" width="672" height="79"></a></div>
        <div class="sm-footer__cols sm-wrap">
          <div class="sm-footer__grid">
            ${fcols.join('\n            ')}
          </div>
        </div>
        <div class="sm-footer__partners sm-wrap">
          <div class="sm-footer__logos">
            ${partners}
          </div>
          <p class="sm-footer__support">${esc(txt(support))}</p>
        </div>
        <div class="sm-footer__bottom sm-wrap">
          <div class="sm-footer__bottom-row">
            <ul class="sm-footer__legal">
              ${legal}
            </ul>
            <p class="sm-footer__credit">${esc(credit.contents().first().text().trim())} <a href="${esc(creditA.attr('href'))}">${esc(txt(creditA))}</a></p>
          </div>
        </div>
      </div>
    </footer>`;

const sections = $('div.flex-1 > div.flex.flex-col > section');
const body = [];
sections.each((_, sec) => {
  const S = $(sec);
  if (S.hasClass('image-text-cta')) body.push(split(sec));
  else if (S.hasClass('attraction-carousel')) body.push(attHtml);
  else if (S.hasClass('testimonials')) body.push(tesHtml);
  else if (S.attr('id') === 'Tickets') body.push(tkHtml);
  else if (S.attr('id') === 'callOut') body.push(coHtml);
  else if (S.attr('id') === 'latest_posts_block') body.push(posts(sec));
});

const title = $('head title').text();
const meta = (n) => esc($(`head meta[name="${n}"], head meta[property="${n}"]`).attr('content'));
const html = `<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${meta('description')}">
  <meta property="og:title" content="${meta('og:title')}">
  <meta property="og:description" content="${meta('og:description')}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${meta('og:site_name')}">
  <link rel="canonical" href="https://www.skerriesmills.ie/">
  <link rel="icon" href="assets/cropped-skerries-mills-favi-32x32.png" sizes="32x32">
  <link rel="stylesheet" href="https://use.typekit.net/pbd5qiw.css">
  <link rel="stylesheet" href="css/canon.css">
  <link rel="stylesheet" href="css/index.css">
  <script src="js/motion.js" defer></script>
</head>
<body class="home">
  <main class="sm-page">
    ${header}
    <div class="sm-content flex-1">
      ${heroHtml}
      <div class="sm-sections flex-col">
      ${body.join('\n      ')}
      </div>
    </div>
    ${footer}
  </main>
</body>
</html>
`;
// carry the source's intrinsic dimensions + lazy flag onto every re-authored <img>, so the
// layout reserves the same space before the bitmap arrives (live: WordPress width/height attrs)
const dims = new Map();
$('img').each((_, im) => {
  const src = $(im).attr('src');
  if (!src) return;
  const key = path.basename(src.split('?')[0]);
  if (!dims.has(key)) dims.set(key, { w: $(im).attr('width'), h: $(im).attr('height'), lazy: $(im).attr('loading') === 'lazy' });
});
const finalHtml = html.replace(/<img ([^>]*?)src="assets\/([^"]+)"([^>]*)>/g, (m, pre, file, post) => {
  const d = dims.get(file);
  if (!d) return m;
  let attrs = `${pre}src="assets/${file}"${post}`;
  attrs = attrs.replace(/\s(width|height|loading)="[^"]*"/g, '');
  if (d.w && d.h) attrs += ` width="${d.w}" height="${d.h}"`;
  return `<img ${attrs}>`;
});
fs.writeFileSync(OUT, finalHtml);
console.log(`wrote ${OUT} (${finalHtml.length} bytes, ${body.length} sections, ${attSlides.length} attraction slides, ${reviews.length} reviews, ${tickets.length} tickets)`);
