/**
 * text-copy — textmedia CEs carrying `.u-text-copy` lead copy in the shapes text-media-copy.mjs
 * (priority 5: header-less, gallery-less, ALL paragraphs lead copy) does not claim. Priority 6,
 * so it is tried first; the archetype's pure shape is handed back (null) untouched.
 * Claimed when every c-media__text paragraph is `p.u-text-copy` or a button-only paragraph
 * (one `a.c-button*`, nothing else — "Direkt zum Jobportal"), with at least one lead paragraph:
 *   - no header, no gallery, lead + buttons → text-media (copy): one text row (walked).
 *   - header (h1/h2 …), no gallery, CE in a content row under a section header row → one
 *     text-media (copy) row: headings + lead text (text-media rhythm).
 *   - header (h1/h2 …), no gallery, otherwise → the header headings as DEFAULT CONTENT, then
 *     text-media (copy, in-header): the source header→text gap is the c-media__header margin
 *     (1.8286rem) instead of the o-container__header row gap (2.7429rem).
 *   - gallery of images (with or without header) → text-media.mjs output with `copy` added to
 *     the block's variants (image-below / image-left / image-right / above as text-media sets).
 * Anything else (plain prose mixed with lead copy, video galleries) → null.
 */
import { encode as textMedia } from './text-media.mjs';

export const match = '.o-page__ce:has(> .row > .col > .c-media__content.is-textpic .u-text-copy)';
export const priority = 6;

export function encode(el, ctx) {
  const { $ } = ctx;
  const ce = $(el);
  const content = ce.find('> .row > .col > .c-media__content').first();
  const text = content.children('.c-media__text');
  if (text.length !== 1) return null;
  const header = ce.children('.c-media__header').first();
  const gallery = content.children('.c-media__gallery');
  const paras = text.children().get();
  const isCopy = (p) => $(p).is('p.u-text-copy');
  const isButton = (p) => $(p).is('p') && $(p).find('a').length === 1
    && /c-button/.test($(p).find('a').attr('class') || '')
    && $(p).text().trim() === $(p).find('a').text().trim();
  if (!paras.some(isCopy) || !paras.every((p) => isCopy(p) || isButton(p))) return null;
  const pure = paras.every(isCopy);
  if (!header.length && !gallery.length) {
    if (pure) return null; // text-media-copy.mjs (archetype shape)
    return ctx.block('text-media', ['copy'], [[ctx.walk(text.get(0))]]);
  }
  if (!gallery.length) {
    const heads = header.children('h1, h2, h3, h4, h5, h6').get().map((h) => ctx.clean(h)).join('');
    if (!heads || header.children().not('h1, h2, h3, h4, h5, h6').length) return null;
    // a CE in the content row under a section header row: the heading rides inside the block
    // (header row gap 2.7429rem above it, c-media__header margin below it — text-media rhythm)
    if (ce.closest('.o-container__content > .row').prevAll('.o-container__header').length) {
      return ctx.block('text-media', ['copy'], [[heads + ctx.walk(text.get(0))]]);
    }
    return heads + ctx.block('text-media', ['copy', 'in-header'], [[ctx.walk(text.get(0))]]);
  }
  const out = textMedia(el, ctx);
  const html = typeof out === 'string' ? out : out && out.html;
  if (!html || !/^<div class="text-media[ "]/.test(html)) return null;
  // linked figures: keep the source link title (text-media.mjs writes href only)
  let res = html;
  gallery.find('a[href][title]').each((i, a) => {
    const href = ctx.abs($(a).attr('href')).replace(/&/g, '&amp;');
    const title = $(a).attr('title').replace(/&/g, '&amp;').replace(/"/g, '&quot;');
    res = res.replace(`<a href="${href}">`, `<a href="${href}" title="${title}">`);
  });
  return res.replace(/^<div class="text-media([^"]*)"/, '<div class="text-media$1 copy"');
}
