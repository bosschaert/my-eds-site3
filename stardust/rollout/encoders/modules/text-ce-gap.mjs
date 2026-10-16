/**
 * text-ce-gap — textpic CEs whose source spacing the default-content rhythm cannot express
 * (cluster-hub C-final, measured at 360 headless-both on sk-sk / en-pt / pt-pt):
 *   ce           — a header-less, image-less text CE directly after another text CE in the same
 *                  column (sk-sk "KONTAKTY" after the Púchov prose, the "-----" dual-education
 *                  CEs): source CE gap 3.6571rem, merged default content gives one paragraph
 *                  margin (1.8286rem) → −32 px per boundary.
 *   after-header — the first CE of the content row under the section's o-container__header row
 *                  (en-pt / pt-pt "Working at Continental" text, sk-sk dual-education list,
 *                  sk-sk "Zistite viac" textpic): source gap = header-row margin 2.7429rem, where
 *                  default content gives 1.8286rem (−16) and a text-media block 3.6571rem (+16).
 * Output: a text-media block (text-media.mjs / its header / unnest wrappers when they encode a
 * block; else ONE text cell holding the walked c-media__text) + variant `ce` / `after-header`
 * (text-media.css). Lead-copy CEs (u-text-copy), video galleries, CEs whose text walks to a
 * nested block or holds headings (text-media.js would lift them into the header) → null.
 * ADD-only module.
 */
import * as textMedia from './text-media.mjs';
import * as textMediaHeader from './text-media-header.mjs';
import * as textMediaUnnest from './text-media-unnest.mjs';

export const match = textMedia.match;
export const priority = 6.5;

const isTextCe = ($, n) => $(n).is('.o-page__ce')
  && $(n).find('.c-media__text, .s-richtext').length > 0;

export function encode(el, ctx) {
  const { $ } = ctx;
  const ce = $(el);
  const content = ce.find('> .row > .col > .c-media__content').first();
  const header = ce.children('.c-media__header').first();
  const gallery = content.children('.c-media__gallery');
  if (content.find('.u-text-copy').length) return null;
  if (gallery.find('.c-media__embed').not('.is-image').length) return null;
  if (ce.closest('.o-container__header, .c-content-slider, .o-accordion, .o-tabs').length) return null;
  const figures = gallery.find('figure').length;
  const row = ce.parent('.col').parent('.row');
  const afterHeader = !ce.prevAll('.o-page__ce').length && row.length
    && row.prev().is('.row.o-container__header') && !row.is('.o-container__header');
  const afterCe = !header.length && !figures && isTextCe($, ce.prev());
  if (!afterHeader && !afterCe) return null;
  const variants = afterHeader ? ['after-header'] : ['ce'];

  for (const m of [textMediaHeader, textMediaUnnest, textMedia]) {
    const r = m.encode(el, ctx);
    const html = typeof r === 'string' ? r : r && r.html;
    if (!html) continue;
    if (/^<div class="text-media[ "]/.test(html)) {
      if ((html.match(/<div class="/g) || []).length > 1) return null;
      return html.replace(/^<div class="([^"]*)"/, (s, c) => `<div class="${[c, ...variants].join(' ').trim()}"`);
    }
    break;
  }
  if (header.length || figures) return null;
  const textEl = content.children('.c-media__text');
  if (textEl.length !== 1 || textEl.find('h1, h2, h3, h4, h5, h6').length) return null;
  const inner = ctx.walk(textEl.get(0)).trim();
  if (!inner || /<div class="/.test(inner)) return null;
  return ctx.block('text-media', variants, [[inner]]);
}
