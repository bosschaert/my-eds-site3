/**
 * breadcrumb-first — the breadcrumb band is the FIRST rendered section (no hero: nothing before
 * it in <main> but an empty `c-heroteaser-fixed` with data-glide-count="0"). The foundation's
 * `main > .section:first-child.is-white { padding-top: 0 }` then outranks the breadcrumb band's
 * 2.7429rem top padding (source keeps it: nav 48px under the header). Same output as
 * breadcrumb.mjs + variant `first` (breadcrumb.css restores the band padding). Priority 1.
 * (cluster-content)
 */
import { encode as crumb } from './breadcrumb.mjs';

export const match = 'nav.c-breadcrumb';
export const priority = 1;

export function encode(el, ctx) {
  const { $ } = ctx;
  const top = $(el).parentsUntil('main').last();
  if (!top.length || !top.parent().is('main')) return null;
  const before = top.prevAll().get();
  const empty = before.every((b) => $(b).is('.c-heroteaser-fixed[data-glide-count="0"], script, style, noscript')
    || (!$(b).text().trim() && !$(b).find('img, picture, iframe, video').length));
  if (!empty) return null;
  const html = crumb(el, ctx);
  if (typeof html !== 'string' || !html.startsWith('<div class="breadcrumb">')) return null;
  return html.replace('<div class="breadcrumb">', '<div class="breadcrumb first">');
}
