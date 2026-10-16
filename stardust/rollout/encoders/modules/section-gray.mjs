/**
 * section-gray — not a block: the `o-container.is-gray` ground (#cdcdcd) is not in the core's
 * GROUNDS list. Claims the section's `.o-container__content` (priority 200), walks it through
 * the normal dispatch and adds section Style `is-gray`.
 * CORE NOTE: encode.mjs GROUNDS should list 'is-gray'; foundation styles.css / scripts.js
 * GROUNDS should too (interim rule `main > .section.is-gray` ships in blocks/teaser/teaser.css).
 */
export const match = '.o-container.is-gray > .o-container__content';
export const priority = 200;

export function encode(el, ctx) {
  return { html: ctx.walk(el), sectionStyle: 'is-gray' };
}
