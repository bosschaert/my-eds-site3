/**
 * section-gray-header-end — an `o-container.is-gray` band whose content ENDS with its
 * `.row.o-container__header` (en-press / de-presse "Fairs & Events" text band): section-gray.mjs
 * (priority 200) claims every gray content, so header-row-last.mjs (27) never sees it and the
 * band lost the header row's 2.7429rem margin-bottom (measured −48 px at 1440). Priority 210:
 * the same walk + Styles `is-gray, header-row-end`. (cluster-hub)
 */
import * as gray from './section-gray.mjs';

export const match = '.o-container.is-gray > .o-container__content';
export const priority = 210;

export function encode(el, ctx) {
  const { $ } = ctx;
  if (!$(el).children().last().is('.row.o-container__header')) return null;
  const out = gray.encode(el, ctx);
  if (!out) return null;
  const html = typeof out === 'object' ? out.html : out;
  const style = typeof out === 'object' && out.sectionStyle ? out.sectionStyle : 'is-gray';
  return { html, sectionStyle: `${style}, header-row-end` };
}
