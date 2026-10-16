/**
 * subheadline — header CE whose `.c-media__header` holds a heading followed by
 * `h2.u-text-subheadline` (source margin-top -.9143rem: the subheadline sits directly under the
 * h1, no rhythm gap). Emitted as the headings (default content, verbatim) + section Style
 * `subheadline` (CSS: `.section.subheadline` pulls the h2 that follows an h1 up to the h1 —
 * hosted in teaser.css next to the teaser header-gap rules until the foundation request lands).
 * Any other content in the CE → null (text-media.mjs).
 */
export const match = '.o-page__ce:has(> .c-media__header > .u-text-subheadline)';
export const priority = 7;

export function encode(el, ctx) {
  const { $ } = ctx;
  const ce = $(el);
  const header = ce.children('.c-media__header').first();
  const rest = ce.children().not(header);
  if (rest.text().trim() || rest.find('img, picture, iframe, video, form').length) return null;
  const heads = header.children().get();
  if (!heads.every((h) => /^h[1-6]$/.test(h.tagName))) return null;
  return { html: heads.map((h) => ctx.clean(h)).join(''), sectionStyle: 'subheadline' };
}
