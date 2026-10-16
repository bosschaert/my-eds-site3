/**
 * hero-teaser — TYPO3 `.c-heroteaser--small` (static small hero: one art-directed picture).
 * Block: hero-teaser (small). One row per rendition, in the source <picture> order:
 *   row 1 = <source media=(min-width:1023px)>, row 2 = (min-width:767px), row 3 = fallback <img>.
 * The section gets Style `full-bleed` (the source hero sits outside any o-container).
 * Text overlays (c-heroteaser-fixed single slides) are NOT matched here — the block accepts a
 * trailing text row (headings / p / CTA links) for those, add a module for that variant.
 */
export const match = '.c-heroteaser--small';

export function encode(el, ctx) {
  const pic = ctx.$(el).find('picture').first();
  if (!pic.length) return null;
  const rows = ctx.pictureImgs(pic).map((img) => [img]);
  return { html: ctx.block('hero-teaser', ['small'], rows), sectionStyle: 'full-bleed' };
}
