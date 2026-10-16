/**
 * tabs-grid — `.o-tabs` whose panels nest an `.o-container.has-columns` grid (fremdkapital-rating
 * bonds tabs, press listings): the nested container's row cancels the tab padding, so the teaser
 * grid inside a panel sits on the page grid. Same encoding as tabs-panels.mjs / tabs.mjs + variant
 * `grid` (tabs.css: a panel's teaser grid takes the full content width). Priority 12.
 * (cluster-content)
 */
import { encode as panels } from './tabs-panels.mjs';
import { encode as tabs } from './tabs.mjs';

export const match = '.o-tabs';
export const priority = 12;

export function encode(el, ctx) {
  const { $ } = ctx;
  if (!$(el).find('.o-tabs__content-item > .o-container.has-columns').length) return null;
  const r = panels(el, ctx) ?? tabs(el, ctx);
  if (r === null || r === undefined) return null;
  const add = (h) => h.replace(/<div class="tabs([^"]*)"/, '<div class="tabs$1 grid"');
  if (typeof r === 'string') return add(r);
  return { ...r, html: add(r.html || '') };
}
