/**
 * search-nested — a Solr `.c-search` box whose `.o-container.tx_solr` sits INSIDE a container
 * column (hub intros: de-presse / en-press "Pressesuche" under the page intro), not as a band of
 * its own (press release lists, search.mjs). Priority 11: encodes through search.mjs and adds the
 * variant `nested` (measured: box inset 16 px further, 48 px above, 72 px below the field at
 * 1440 and 360).
 */
import * as search from './search.mjs';

export const match = search.match;
export const priority = 11;

export function encode(el, ctx) {
  const { $ } = ctx;
  const solr = $(el).closest('.o-container.tx_solr');
  if (!solr.length || !solr.parent().is('.col, [class*="col-"]')) return null;
  const out = search.encode(el, ctx);
  if (!out) return null;
  const add = (h) => h.replace(/^(\s*<div class="search)(?=[ "])/, '$1 nested');
  return typeof out === 'object' ? { ...out, html: add(out.html) } : add(out);
}
