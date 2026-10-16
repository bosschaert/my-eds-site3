/**
 * teaser-color — not a block: a pre-pass (priority 250, always null) on every
 * `.o-container__content`. The c-teaser__content colour class (is-color-white|black) only
 * styles is-layout-image teasers (site.css has no rule for it on is-layout-default), so it is
 * dropped from default-layout teasers before teaser.mjs (which refuses coloured cards) runs.
 */
export const match = '.o-container__content';
export const priority = 250;

export function encode(el, ctx) {
  const { $ } = ctx;
  $(el).find('.c-teaser:not(.is-layout-image) .c-teaser__content[class*="is-color-"]').each((i, c) => {
    const n = $(c);
    n.attr('class', (n.attr('class') || '').split(/\s+/).filter((x) => !x.startsWith('is-color-')).join(' '));
  });
  return null;
}
