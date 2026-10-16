/**
 * text-media-copy — header-less text CE whose paragraphs are all `.u-text-copy` (intro / lead
 * copy, 1.25rem / 1.5rem >= 767). Block: text-media (copy), one text row (paragraphs; button
 * links via button.mjs). Mixed u-text-copy / plain paragraphs → null (text-media.mjs default
 * content; the lead size is lost — warned).
 */
export const match = '.o-page__ce:has(> .row > .col > .c-media__content.is-textpic .u-text-copy)';
export const priority = 5;

export function encode(el, ctx) {
  const { $ } = ctx;
  const ce = $(el);
  if (ce.children('.c-media__header').length) return null;
  const content = ce.find('> .row > .col > .c-media__content').first();
  if (content.children('.c-media__gallery').length) return null;
  const text = content.children('.c-media__text');
  const paras = text.children();
  if (!paras.length || paras.not('p.u-text-copy').length) {
    ctx.warn('u-text-copy mixed with other content — encoded as default content');
    return null;
  }
  return ctx.block('text-media', ['copy'], [[text.get().map((t) => ctx.walk(t)).join('')]]);
}
