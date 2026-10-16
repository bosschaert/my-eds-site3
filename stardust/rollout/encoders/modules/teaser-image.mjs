/**
 * teaser-image — TYPO3 `c-teaser.is-layout-image` (text over the 16:9 image, button CTA).
 * Block: teaser, variants `image-layout single` (+ `text-black` for c-teaser__content
 * is-color-black; white text with shadow otherwise). `single` = the card fills its block
 * (used beside another column, e.g. content-list `beside`). Card row as teaser.mjs teaserRow():
 * [<img>, <h3>header</h3> + text paragraphs + <p><a href title>CTA label</a></p>].
 * Below 577px the block renders the card in the default layout (live behaviour at 360).
 */
export const match = 'a.c-teaser.is-layout-image, div.c-teaser.is-layout-image';
export const priority = 1;

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const attr = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
const txt = (n) => n.text().replace(/\s+/g, ' ').trim();

export function encode(el, ctx) {
  const { $ } = ctx;
  const t = $(el);
  const img = ctx.img(t.find('.c-teaser__image picture, .c-teaser__image img').first());
  const header = txt(t.find('.c-teaser__header').first());
  const textEl = t.find('.c-teaser__text').first();
  const paras = textEl.length && txt(textEl) ? ctx.cleanChildren(textEl).trim() : '';
  const label = txt(t.find('.c-teaser__link').first());
  const href = t.is('a') ? t.attr('href') : t.find('a[href]').first().attr('href');
  const title = t.attr('title');
  const ti = title ? ` title="${attr(title)}"` : '';
  const link = href ? `<p><a href="${attr(ctx.abs(href))}"${ti}>${esc(label || title || header)}</a></p>` : '';
  const body = `${header ? `<h3>${esc(header)}</h3>` : ''}${paras}${link}`;
  const variants = ['image-layout', 'single'];
  if (t.find('.c-teaser__content.is-color-black').length) variants.push('text-black');
  return ctx.block('teaser', variants, [img ? [img, body] : [body]]);
}
