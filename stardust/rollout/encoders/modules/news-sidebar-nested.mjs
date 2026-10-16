/**
 * news-sidebar-nested — a `.c-news-sidebar` (solr news list) OUTSIDE tabs whose
 * `.o-container.tx_solr` sits inside a container column (de-karriere / en-career "People Blog"),
 * not the archetype's tab panel. Priority 11: encodes through news-sidebar.mjs and adds the variant
 * `nested` (measured at 1440: list inset 16 px, 59 px more above, 127 px more below than the
 * plain block).
 */
import * as news from './news-sidebar.mjs';

export const match = news.match;
export const priority = 11;

export function encode(el, ctx) {
  const { $ } = ctx;
  if ($(el).closest('.o-tabs').length) return null;
  const solr = $(el).closest('.o-container.tx_solr');
  if (!solr.length || !solr.parent().is('.col, [class*="col-"]')) return null;
  const out = news.encode(el, ctx);
  if (!out) return null;
  const add = (h) => h.replace(/^(\s*<div class="news-sidebar)(?=[ "])/, '$1 nested');
  return typeof out === 'object' ? { ...out, html: add(out.html) } : add(out);
}
