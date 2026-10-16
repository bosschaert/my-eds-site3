/**
 * media-header — a header-only CE (`data-ctype="header"`: `.o-page__ce > header.c-media__header`
 * with no c-media__content) that carries a `.c-media__meta` eyebrow (home: "The Continental Tires
 * Garage" above the video section heading). Default content cannot style the eyebrow
 * (uppercase, mb-0 above the heading), so it encodes like text-media.mjs's eyebrow path:
 * block `text-media` (+ `heading-light` for .u-text-light), ONE text row:
 * <p>eyebrow</p> + the header heading(s). Header-only CEs without an eyebrow → null (default
 * content, the foundation rhythm equals the source).
 */
export const match = '.o-page__ce:has(> .c-media__header > .c-media__meta)';
export const priority = 4;

export function encode(el, ctx) {
  const { $ } = ctx;
  const ce = $(el);
  if (ce.children().not('.c-media__header').filter((i, c) => $(c).text().trim()
    || $(c).find('img, picture, iframe, video').length).length) return null;
  const header = ce.children('.c-media__header').first();
  const meta = (h) => ($(h).children('p').length
    ? $(h).children('p').get().map((p) => ctx.clean(p)).join('')
    : `<p>${ctx.cleanChildren(h).trim()}</p>`);
  const parts = header.children().get().map((h) => ($(h).is('.c-media__meta') ? meta(h) : ctx.clean(h)));
  const variants = header.find('.u-text-light').length ? ['heading-light'] : [];
  return ctx.block('text-media', variants, [[parts.join('')]]);
}
