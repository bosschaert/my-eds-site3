/**
 * cs-stage — stories template intro + latest-article stage
 * (`.o-container__content` holding `article.c-cs-stage`, optionally preceded by the page intro
 * `h1.u-cs-text--h1` + `.u-cs-text--subtitle`).
 * Block: cs-stage. Rows (template-slotted, classified by content in the block JS):
 *   [intro]  h1 (<strong> part + light part, verbatim) + subtitle <p>      (optional)
 *   [media]  one <p><img></p> per <picture> rendition, source order
 *            (3 → >=1279 | 767–1278 | <767; 2 → >=767 | <767; 1 → all)
 *   [text]   label <p>, title h3 (bold part in <strong>, then the thin part), popup text <p>,
 *            CTA <p><strong><a href>…</a></strong></p> (→ a.button; also the stage overlay link)
 * Lazy renditions: data-srcset / data-src are the settled URLs (src is the lazy placeholder).
 */
export const match = '.o-container__content:has(> article.c-cs-stage)';
export const priority = 10;

const attr = (s) => (s || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;');
const firstSrc = (srcset) => (srcset || '').trim().split(/\s+/)[0] || '';

/** settled renditions of a lazy <picture>, as `<p><img></p>` strings (source order, then img) */
export function lazyPictureImgs(pic, ctx) {
  const p = ctx.$(pic);
  const fallback = p.find('img').first();
  const alt = fallback.attr('alt') || '';
  const srcs = p.find('source').map((i, s) => firstSrc(ctx.$(s).attr('data-srcset')
    || ctx.$(s).attr('srcset'))).get();
  srcs.push(fallback.attr('data-src') || fallback.attr('src'));
  return srcs.filter(Boolean).map((src) => `<p><img src="${attr(ctx.abs(src))}" alt="${attr(alt)}"></p>`);
}

/** inner HTML parts of a heading made of <strong>bold</strong><span>light</span> parts; the
 *  whitespace between parts is kept as one space where the source had any */
export function splitHeading(el, ctx) {
  const $ = ctx.$;
  let out = '';
  let gap = false;
  $(el).contents().each((i, n) => {
    const raw = n.type === 'text' ? n.data : $(n).text();
    if (!raw.trim()) {
      if (raw.length) gap = true;
      return;
    }
    if (out && (gap || /^\s/.test(raw))) out += ' ';
    if (n.type === 'text') out += raw.trim().replace(/&/g, '&amp;').replace(/</g, '&lt;');
    else if ($(n).is('strong, b, .u-cs-text--bold')) out += `<strong>${ctx.cleanChildren(n).trim()}</strong>`;
    else out += ctx.cleanChildren(n).trim();
    gap = /\s$/.test(raw);
  });
  return out;
}

export function encode(el, ctx) {
  const $ = ctx.$;
  const root = $(el);
  const stage = root.children('article.c-cs-stage').first();
  const rows = [];

  const h1 = root.find('.u-cs-text--h1').first();
  if (h1.length) {
    const tag = h1.get(0).tagName;
    const cell = [`<${tag}>${splitHeading(h1, ctx)}</${tag}>`];
    const sub = root.find('.u-cs-text--subtitle').first();
    if (sub.length && sub.text().trim()) cell.push(`<p>${ctx.cleanChildren(sub).trim()}</p>`);
    rows.push([cell.join('')]);
  }

  const pic = stage.find('picture').first();
  if (pic.length) rows.push([lazyPictureImgs(pic, ctx).join('')]);

  const text = [];
  const label = stage.find('.c-cs-stage__label').first();
  if (label.text().trim()) text.push(`<p>${ctx.cleanChildren(label).trim()}</p>`);
  const title = stage.find('.c-cs-stage__title').first();
  if (title.length) {
    const bold = title.find('.u-cs-text--bold').first();
    const thin = title.find('.u-cs-text--thin').first();
    const parts = [];
    if (bold.text().trim()) parts.push(`<strong>${ctx.cleanChildren(bold).trim()}</strong>`);
    if (thin.text().trim()) parts.push(ctx.cleanChildren(thin).trim());
    if (!parts.length && title.text().trim()) parts.push(ctx.cleanChildren(title).trim());
    const tag = title.get(0).tagName;
    text.push(`<${tag}>${parts.join(' ')}</${tag}>`);
  }
  const popup = stage.find('.c-cs-stage__popup').first();
  popup.find('p').each((i, p) => {
    if ($(p).text().trim()) text.push(`<p>${ctx.cleanChildren(p).trim()}</p>`);
  });
  const cta = popup.find('a[href]').first();
  const href = cta.attr('href') || stage.find('a.c-cs-stage__overlay').attr('href');
  if (href) {
    const label2 = cta.length ? ctx.cleanChildren(cta).trim() : '';
    if (label2) text.push(`<p><strong><a href="${attr(ctx.abs(href))}">${label2}</a></strong></p>`);
    else ctx.warn('cs-stage: overlay link without a CTA label — link dropped');
  }
  if (text.length) rows.push([text.join('')]);

  // anything else inside the content wrapper is not part of the stage composition
  root.children().each((i, c) => {
    if ($(c).is(stage) || $(c).find('.u-cs-text--h1').length || $(c).is('.u-cs-text--h1')) return;
    if ($(c).text().trim()) ctx.warn(`cs-stage: extra element ${c.tagName}.${$(c).attr('class')} ignored`);
  });
  return ctx.block('cs-stage', [], rows);
}
