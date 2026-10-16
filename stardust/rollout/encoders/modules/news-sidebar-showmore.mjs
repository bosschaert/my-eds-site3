/**
 * news-sidebar-showmore — a `.c-news-sidebar` whose result list ends in the Solr "load more"
 * control (`.c-search__show-more-button`, en-sustainability / de-nachhaltigkeit news): the
 * archetype encoding drops it, the band below comes out 36 px high at 1440. Priority 12:
 * news-sidebar-nested.mjs / news-sidebar.mjs output + variant `show-more` — the block CSS draws
 * the source separator line + orange tab (decoration only: paging is not live, dynamic-features
 * row 2 interim, as the press search pagination). (cluster-hub)
 */
import * as news from './news-sidebar.mjs';
import * as nested from './news-sidebar-nested.mjs';

export const match = news.match;
export const priority = 12;

export function encode(el, ctx) {
  const { $ } = ctx;
  if (!$(el).find('.c-search__show-more-button').length) return null;
  const out = nested.encode(el, ctx) || news.encode(el, ctx);
  if (!out) return null;
  const add = (h) => h.replace(/^(\s*<div class="news-sidebar)(?=[ "])/, '$1 show-more');
  return typeof out === 'object' ? { ...out, html: add(out.html) } : add(out);
}
