/**
 * teaser-embed — a has-columns `.row` of teaser CEs next to a third-party iframe widget CE
 * (EquityStory share-price chart: `div[eqswidget] > iframe` + a c-button below).
 * Block: teaser, variants <grid> + `with-embed` (grid from the first column as teaser.mjs:
 * col-md-3 → cols-4, col-md-4 → cols-3, col-sm-6 only → cols-2). Rows in column order:
 *   teaser column → the teaser card row (teaser.mjs teaserRow)
 *   widget column → ONE cell: <p><a href="iframe src">iframe src</a></p> (the frame URL as a
 *                   URL-display link) + the CE's c-button links as <p><strong><a></a></strong></p>
 * The block JS turns a row whose only plain link is a URL-display link into the iframe slot.
 */
import { teaserRow, headerGap } from './teaser.mjs';

export const match = '.row:has(> div > .o-page__ce iframe)';
export const priority = 10;

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const attr = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');

function variantOf(colClass) {
  const c = colClass.split(/\s+/);
  if (c.includes('col-md-3')) return 'cols-4';
  if (c.includes('col-md-4')) return 'cols-3';
  if (c.includes('col-sm-6')) return 'cols-2';
  return '';
}

export function encode(el, ctx) {
  const { $ } = ctx;
  const cols = $(el).children().get().filter((c) => $(c).children().length);
  const rows = [];
  for (const c of cols) {
    const ces = $(c).children('.o-page__ce');
    if (ces.length !== 1) return null;
    const teaser = ces.children('.c-teaser');
    const frame = ces.find('iframe[src]').first();
    if (teaser.length === 1) {
      const r = teaserRow(teaser.get(0), ctx);
      if (!r) return null;
      rows.push(r);
    } else if (frame.length && !ces.find('.c-media__text, .c-teaser').length) {
      const src = ctx.abs(frame.attr('src'));
      const btns = ces.find('a[href]').get().map((a) => `<p><strong><a href="${attr(ctx.abs($(a).attr('href')))}">${esc($(a).text().replace(/\s+/g, ' ').trim())}</a></strong></p>`);
      rows.push([`<p><a href="${attr(src)}">${esc(src)}</a></p>${btns.join('')}`]);
    } else return null;
  }
  if (!rows.length) return null;
  const v = variantOf($(cols[0]).attr('class') || '');
  const variants = [v, 'with-embed'];
  // a lone widget column col-sm-6 col-md-8 (IR share pages: EquityStory teaser-t1) → `wide`
  // (66.67 % >= 1023); the section header CE ending in an empty media row → `header-gap`
  // (source keeps the c-media__header margin, +32px at every width) — cluster-content
  const c0 = ($(cols[0]).attr('class') || '').split(/\s+/);
  if (cols.length === 1 && c0.includes('col-md-8')) variants.push('wide');
  if (cols.length === 1 && headerGap(el, ctx)) variants.push('header-gap');
  return ctx.block('teaser', variants.filter(Boolean), rows);
}
