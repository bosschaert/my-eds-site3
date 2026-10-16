/**
 * media-columns-caption — a media-columns row whose gallery figure carries a figcaption with the
 * column text below it (en-pt / pt-pt "Tires" column): in the source the figcaption's
 * margin-bottom (.6857rem) collapses into the c-media__text margin-top (block flow), where the
 * block's flex column keeps both (+12 px). Delegates to media-columns.mjs unchanged and adds the
 * variant `caption-gap` (media-columns.css). ADD-only wrapper (cluster-hub C-final).
 */
import * as mediaColumns from './media-columns.mjs';

export const match = mediaColumns.match;
export const priority = 8;

export function encode(el, ctx) {
  const { $ } = ctx;
  const captioned = $(el).find('.o-page__ce').filter((i, ce) => {
    const content = $(ce).find('> .row > .col > .c-media__content');
    return content.find('.c-media__gallery figure figcaption').text().trim()
      && content.children('.c-media__text').text().trim();
  });
  if (!captioned.length) return null;
  const r = mediaColumns.encode(el, ctx);
  const html = typeof r === 'string' ? r : r && r.html;
  if (!html || !/^<div class="media-columns[ "]/.test(html)) return r;
  const out = html.replace(/^<div class="([^"]*)"/, '<div class="$1 caption-gap"');
  return typeof r === 'string' ? out : { ...r, html: out };
}
