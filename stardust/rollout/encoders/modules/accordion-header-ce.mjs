/**
 * accordion-header-ce — an `.o-accordion` in the SAME CE as the c-media__header heading above it
 * (en-pt / pt-pt "Our Company", "External Relations"; sk-sk "Naša spoločnosť", "Dôležité
 * odkazy"): the source gap heading → first item is the header margin (1.8286rem), where the
 * block's CE rhythm (default content + accordion wrapper 3.6571rem) gives +32 px. Delegates to
 * accordion-panels.mjs / accordion.mjs unchanged and adds the variant `header-ce`
 * (accordion.css). ADD-only wrapper (cluster-hub C-final).
 */
import * as panels from './accordion-panels.mjs';
import * as plain from './accordion.mjs';

export const match = '.o-accordion';
export const priority = 12;

export function encode(el, ctx) {
  const { $ } = ctx;
  if (!$(el).prev().is('header.c-media__header')) return null;
  for (const m of [panels, plain]) {
    const r = m.encode(el, ctx);
    const html = typeof r === 'string' ? r : r && r.html;
    if (html && /^<div class="accordion[ "]/.test(html)) {
      const out = html.replace(/^<div class="([^"]*)"/, '<div class="$1 header-ce"');
      return typeof r === 'string' ? out : { ...r, html: out };
    }
    if (r) return r;
  }
  return null;
}
