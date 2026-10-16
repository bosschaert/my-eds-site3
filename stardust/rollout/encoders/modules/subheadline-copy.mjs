/**
 * subheadline-copy — a header CE with `h2.u-text-subheadline` under its heading AND lead copy in
 * the same CE (sk-sk "Púchov / Continental Tires Slovakia, s.r.o." + text): subheadline.mjs
 * refuses CEs with text, text-copy.mjs encodes them without the subheadline rhythm (+64 px at
 * 1440). Priority 8: text-copy.mjs output (else text-media.mjs: plain prose, en-company
 * "History") + section Style `subheadline`. (cluster-hub)
 */
import { encode as textCopy } from './text-copy.mjs';
import { encode as textMedia } from './text-media.mjs';

export const match = '.o-page__ce:has(> .c-media__header > .u-text-subheadline)';
export const priority = 8;

export function encode(el, ctx) {
  const { $ } = ctx;
  const ce = $(el);
  const rest = ce.children().not(ce.children('.c-media__header').first());
  if (!rest.text().trim()) return null;
  const out = textCopy(el, ctx) || textMedia(el, ctx);
  if (!out) return null;
  if (typeof out === 'object') {
    const style = out.sectionStyle ? `${out.sectionStyle}, subheadline` : 'subheadline';
    return { ...out, sectionStyle: style };
  }
  return { html: out, sectionStyle: 'subheadline' };
}
