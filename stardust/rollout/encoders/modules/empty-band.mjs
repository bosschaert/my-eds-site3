/**
 * empty-band — a top-level `.o-container` that renders NO content (en-pt / pt-pt: a container
 * whose only CE reference renders nothing, "<!-- Reference: c174615 -->"): the source still
 * paints the band (padding 2.7429rem + 3.6571rem = 112 px at 1440, and the next white band
 * collapses onto it). The core drops it (empty → no section), shifting everything below by
 * 112 px. Emitted as one zero-width-space line + section Style `empty-band` (the line is
 * collapsed to height 0 by CSS, the section keeps its padding). Priority 290. (cluster-hub)
 */
export const match = '.o-container__content';
export const priority = 290;

export function encode(el, ctx) {
  const { $ } = ctx;
  const c = $(el).parent('.o-container');
  if (!c.length || !c.parent().is('main')) return null;
  if (c.text().trim() || c.find('img, picture, iframe, video, form, input, svg').length) return null;
  return { html: '<p>&#8203;</p>', sectionStyle: 'empty-band' };
}
