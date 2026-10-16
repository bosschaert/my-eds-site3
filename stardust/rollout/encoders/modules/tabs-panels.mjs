/**
 * tabs-panels — `.o-tabs` whose panels mix default content and blocks (press "Messen & Events":
 * panel = h3 header + teaser row; media library: header + text + teaser / video rows), which
 * tabs.mjs refuses. Priority 11 (before tabs.mjs); panels tabs.mjs can encode → null (its shapes
 * stay untouched).
 * Block: tabs (panels [+ header-gap / dark-line as tabs.mjs]). One row per tab, header order:
 *   [<p>label</p>, <p>n</p>] — the panel is the n wrappers that follow the tabs block: each
 *   default-content run and each block of the panel's walked content counts one (the delivery
 *   pipeline wraps them one wrapper each). All panels' content is emitted after the tabs block
 *   in tab order. Two panels whose boundary would join two default-content runs into ONE
 *   wrapper → null (not representable).
 */
import { headerGap } from './teaser.mjs';

export const match = '.o-tabs';
export const priority = 11;

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

function groups(ctx, html) {
  const { $ } = ctx;
  const frag = $('<div></div>').append(html);
  const kids = frag.children().get();
  let n = 0;
  let prevBlock = null;
  const isBlock = (k) => k.tagName === 'div' && $(k).attr('class');
  kids.forEach((k) => {
    const b = isBlock(k);
    if (b || prevBlock !== false) n += 1;
    prevBlock = b;
  });
  const first = kids.length ? isBlock(kids[0]) : null;
  const last = kids.length ? isBlock(kids[kids.length - 1]) : null;
  return { n, first, last, blocks: kids.filter(isBlock).length };
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
  let mixed = false;
  let prevLast = null;
  for (let i = 0; i < heads.length; i += 1) {
    const h = $(heads[i]);
    const panel = byTarget[h.attr('data-tabs-trigger')] || items[i];
    const html = ctx.walk(panel).trim();
    const g = groups(ctx, html);
    if (g.blocks && g.n > 1) mixed = true;
    if (!g.n) return null;
    if (prevLast === false && g.first === false) return null;
    prevLast = g.last;
    rows.push([`<p>${esc(h.text().replace(/\s+/g, ' ').trim())}</p>`, `<p>${g.n}</p>`]);
    after.push(html);
  }
  if (!mixed) return null;
  const variants = ['panels'];
  if (headerGap(el, ctx)) variants.push('header-gap');
  if (tabs.closest('.o-container.is-gray, .o-container.is-pastel-yellow').length) variants.push('dark-line');
  return `${ctx.block('tabs', variants, rows)}${after.join('')}`;
}
