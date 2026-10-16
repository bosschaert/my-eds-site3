/**
 * webform-header-row — a `form.c-webforms` in the content row under the section's
 * o-container__header row (en-pt / pt-pt "Contact us" one-pager form): the source gap heading →
 * legend is the header margin (1.8286rem) + the header-row gap (2.7429rem) = 80 px, where the
 * block's CE rhythm after default content gives 96; the one-pager's step tabs (o-tabs mb-4)
 * keep 36 px below them (24 in the block default). Delegates to webform.mjs unchanged and adds
 * the variant `header-row` (webform.css). ADD-only wrapper (cluster-hub C-final).
 */
import * as webform from './webform.mjs';

export const match = webform.match;
export const priority = 11;

export function encode(el, ctx) {
  const { $ } = ctx;
  const row = $(el).closest('.o-page__ce').parent('.col').parent('.row');
  if (!row.length || !row.prev().is('.row.o-container__header')) return null;
  const r = webform.encode(el, ctx);
  const html = typeof r === 'string' ? r : r && r.html;
  if (!html || !/^<div class="webform[ "]/.test(html)) return r;
  const out = html.replace(/^<div class="([^"]*)"/, '<div class="$1 header-row"');
  return typeof r === 'string' ? out : { ...r, html: out };
}
