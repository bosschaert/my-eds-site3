/**
 * cs-article-cluster — stories template article cluster (`.o-container__content` holding
 * `a.c-cs-article-cluster__teaser` cards). Block: cs-article-cluster [wide-first].
 * Rows (reconstructive; the block JS classifies each row by content, never by index):
 *   [heading]  h2 (<strong> part + light part, verbatim)
 *   [featured] image cell (one <p><img></p>) | text: eyebrow <p>, h3, teaser <p>,
 *              CTA <p><strong><a href>Read article</a></strong></p>   ← bold CTA = featured story
 *   [card]×n   image cell (<p><img></p> per rendition: >=767 | <767) | text: eyebrow <p>, h3,
 *              teaser <p> (omitted when empty), <p><a href>Read article</a></p>  ← plain link = card
 *   [more]     <p>More articles</p> (text only, no link) — every card row AFTER it stays hidden
 *              until the button is pressed (constories load-more: the endpoint's cards are authored
 *              from the captured snapshot stardust/prototypes/assets/stories-api/<ce>-offset<n>.html).
 * Variant wide-first: the first card spans 2/3 at >=1279 (source col-lg-8).
 * No snapshot for a load-more button → the button is dropped (captured cards kept) + WARN
 * `dynamic-dependency` (log it in stardust/dynamic-features.md).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { lazyPictureImgs, splitHeading } from './cs-stage.mjs';

export const match = '.o-container__content:has(a.c-cs-article-cluster__teaser)';
export const priority = 10;

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SNAPSHOTS = path.resolve(HERE, '../../../prototypes/assets/stories-api');
const attr = (s) => (s || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;');

function textCell(teaser, ctx, featured) {
  const $ = ctx.$;
  const t = $(teaser);
  const out = [];
  const eyebrow = t.find('.u-cs-text--normal').first();
  if (eyebrow.text().trim()) out.push(`<p>${ctx.cleanChildren(eyebrow).trim()}</p>`);
  const title = t.find('.c-cs-article-cluster__teaser-title').first();
  if (title.text().trim()) {
    const tag = title.get(0).tagName;
    out.push(`<${tag}>${ctx.cleanChildren(title).trim()}</${tag}>`);
  }
  t.find('p').each((i, p) => {
    if ($(p).text().trim()) out.push(`<p>${ctx.cleanChildren(p).trim()}</p>`);
  });
  const href = attr(ctx.abs(t.attr('href')));
  const ctaEl = featured ? t.find('.c-button').first()
    : t.find('.c-cs-article-cluster__link span').last();
  const cta = ctaEl.length ? ctx.cleanChildren(ctaEl).trim() : '';
  if (href && cta) out.push(featured ? `<p><strong><a href="${href}">${cta}</a></strong></p>`
    : `<p><a href="${href}">${cta}</a></p>`);
  else if (href) ctx.warn(`cs-article-cluster: teaser ${href} without a CTA label`);
  return out.join('');
}

function cardRow(col, ctx) {
  const $ = ctx.$;
  const teaser = $(col).find('a.c-cs-article-cluster__teaser').first();
  const pic = teaser.find('picture').first();
  const img = pic.length ? lazyPictureImgs(pic, ctx).join('') : '';
  return [img, textCell(teaser, ctx, false)];
}

function snapshotRows(btn, ctx) {
  const xhr = decodeURIComponent(ctx.$(btn).attr('data-constories-xhr') || '');
  const ce = (xhr.match(/\[contentElement\]=(\d+)/) || [])[1];
  const off = (xhr.match(/\[offset\]=(\d+)/) || [])[1];
  const file = path.join(SNAPSHOTS, `${ce}-offset${off}.html`);
  if (!ce || !fs.existsSync(file)) {
    ctx.warn(`cs-article-cluster: dynamic-dependency — no snapshot ${path.basename(file)} for the `
      + 'load-more button; button dropped, captured cards kept');
    return null;
  }
  const $s = ctx.$.load(fs.readFileSync(file, 'utf8'));
  const sctx = { ...ctx, $: $s };
  return $s('a.c-cs-article-cluster__teaser').map((i, a) => [cardRow($s(a).parent(), sctx)]).get();
}

export function encode(el, ctx) {
  const $ = ctx.$;
  const root = $(el);
  const rows = [];
  const variants = [];

  const h = root.find('.u-cs-text--h2').first();
  if (h.length && h.text().trim()) {
    const tag = h.get(0).tagName;
    rows.push([`<${tag}>${splitHeading(h, ctx)}</${tag}>`]);
  }

  const featured = root.find('.c-cs-article-cluster').first();
  if (featured.length) {
    const pic = featured.find('.c-cs-article-cluster__picture').first();
    const teaser = featured.find('a.c-cs-article-cluster__teaser').first();
    rows.push([pic.length ? lazyPictureImgs(pic, ctx).join('') : '', textCell(teaser, ctx, true)]);
  }

  const cols = root.find('a.c-cs-article-cluster__teaser').not(featured.find('a'))
    .map((i, a) => $(a).parent().get(0)).get();
  cols.forEach((col, i) => {
    if ($(col).is('.col-lg-8')) {
      if (i === 0) variants.push('wide-first');
      else ctx.warn(`cs-article-cluster: wide card at position ${i + 1} rendered as a normal card`);
    }
    rows.push(cardRow(col, ctx));
  });

  const btn = root.find('button[data-constories-loadmore]').first();
  if (btn.length) {
    const extra = snapshotRows(btn, ctx);
    if (extra) {
      rows.push([`<p>${ctx.cleanChildren(btn).trim()}</p>`]);
      rows.push(...extra);
    }
  }
  return ctx.block('cs-article-cluster', variants, rows);
}
