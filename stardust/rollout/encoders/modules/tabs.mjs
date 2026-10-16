/**
 * tabs — TYPO3 `.o-tabs` (header items [data-tabs-trigger] + content items [data-tabs-target]).
 * Block: tabs. One row per tab, header order:
 *   [label]            — the panel is the ONE block that follows the tabs block (news-sidebar,
 *                        teaser …): the panel's content walked through the normal dispatch
 *                        produced exactly one block, which is emitted right after the tabs
 *                        block (panels in tab order). The block JS moves it into the panel.
 *   [label, content]   — the panel walked to default content only (no block) stays in cell 2.
 * Panels that walk to a mix of blocks and default content → null + WARN (→ UNMAPPED).
 * The active tab (header .is-active) is not authored: the first tab opens (source default).
 * `header-gap` when the section header CE ends with an empty c-media__content (see teaser.mjs).
 */
import { headerGap } from './teaser.mjs';

export const match = '.o-tabs';
export const priority = 10;

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

// top-level elements of an html fragment: count blocks (div with class) vs other content
function topLevel(ctx, html) {
  const { $ } = ctx;
  const frag = $('<div></div>').append(html);
  const kids = frag.children().get();
  return {
    blocks: kids.filter((k) => k.tagName === 'div' && $(k).attr('class')).length,
    total: kids.length,
  };
}

export function encode(el, ctx) {
  const { $ } = ctx;
  const tabs = $(el);
  const heads = tabs.find('> .o-tabs__header > .o-tabs__header-item').get();
  const items = tabs.find('> .o-tabs__content > .o-tabs__content-item').get();
  if (!heads.length || heads.length !== items.length) return null;
  const byTarget = {};
  items.forEach((it) => { byTarget[$(it).attr('data-tabs-target')] = it; });
  const rows = [];
  const after = [];
  for (let i = 0; i < heads.length; i += 1) {
    const h = $(heads[i]);
    const panel = byTarget[h.attr('data-tabs-trigger')] || items[i];
    const label = `<p>${esc(h.text().replace(/\s+/g, ' ').trim())}</p>`;
    const html = ctx.walk(panel).trim();
    const t = topLevel(ctx, html);
    if (t.blocks === 1 && t.total === 1) {
      rows.push([label]);
      after.push(html);
    } else if (t.blocks === 0) {
      rows.push([label, html]);
    } else {
      ctx.warn(`tabs: panel "${h.text().trim()}" mixes blocks and text — not encoded`);
      return null;
    }
  }
  const variants = headerGap(el, ctx) ? ['header-gap'] : [];
  if (tabs.closest('.o-container.is-gray, .o-container.is-pastel-yellow').length) variants.push('dark-line');
  return `${ctx.block('tabs', variants, rows)}${after.join('')}`;
}
