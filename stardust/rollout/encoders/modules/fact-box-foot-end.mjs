/**
 * fact-box-foot-end — fact-box rows whose source foot section carries the equaliser
 * (`.c-fact-box__section.align-items-end[data-equalize-height^="fact-box-foot"]`) get the variant
 * `foot-end`: the source equalises the FOOT and bottom-aligns the text in it, so a box whose text
 * is one line shorter sits its text lower (de home at 360: +22px). The block's text equaliser
 * (archetype home) top-aligns it instead — invisible while all texts share a height (en).
 * Delegates to fact-box.mjs unchanged and only appends the class.
 * CORE NOTE: belongs in fact-box.mjs; kept as a separate module (ADD-only rule).
 */
import * as factBox from './fact-box.mjs';

export const match = factBox.match;
export const priority = 11;

const FOOT = '.c-fact-box__section.align-items-end[data-equalize-height^="fact-box-foot"]';

export function encode(el, ctx) {
  const { $ } = ctx;
  if (!$(el).find(FOOT).length) return null;
  const r = factBox.encode(el, ctx);
  const html = typeof r === 'string' ? r : r && r.html;
  if (!html || !/^<div class="fact-box[ "]/.test(html)) return null;
  const out = html.replace(/^<div class="([^"]*)"/, '<div class="$1 foot-end"');
  return typeof r === 'string' ? out : { ...r, html: out };
}
