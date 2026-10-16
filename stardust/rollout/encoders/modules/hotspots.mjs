/**
 * hotspots — TYPO3 `.c-hotspots-image` (infographic with plus/minus hotspots; each opens a text
 * box beside its point). Block: hotspots. Rows:
 *   [<p><img></p>]                                  — the image (picture fallback rendition)
 *   [<p>left top side</p>, rich text]               — one per hotspot, source order: the point
 *        position (the source trigger's inline `left` / `top` percentages, verbatim) and the box
 *        side (is-left | is-right) + box width % (box-wrapper inline width), then the box text
 *        (s-richtext children, cleaned verbatim).
 * The icons, indicator lines and box chrome are block chrome.
 */
export const match = '.c-hotspots-image';
export const priority = 10;

const pct = (style, prop) => ((style || '').match(new RegExp(`(?:^|;)\\s*${prop}:\\s*([\\d.]+%)`)) || [])[1] || '';

export function encode(el, ctx) {
  const { $ } = ctx;
  const h = $(el);
  const pic = h.find('.c-hotspots-image__hotspots picture, .c-hotspots-image__hotspots img').first();
  if (!pic.length) return null;
  const rows = [[`<p>${ctx.img(pic)}</p>`]];
  const boxes = {};
  h.find('.c-hotspots-image__box-wrapper').each((i, w) => {
    const box = $(w).find('[data-hotspots-image-target]').first();
    boxes[box.attr('data-hotspots-image-target')] = w;
  });
  let ok = true;
  h.find('[data-hotspots-image-trigger]').each((i, t) => {
    const trig = $(t);
    const w = boxes[trig.attr('data-hotspots-image-trigger')];
    if (!w) { ok = false; return; }
    const wrap = $(w);
    const side = wrap.is('.is-left') ? 'left' : 'right';
    const pos = `${pct(trig.attr('style'), 'left')} ${pct(trig.attr('style'), 'top')} ${side} ${pct(wrap.attr('style'), 'width')}`;
    const content = wrap.find('.c-hotspots-image__box-content').first();
    const inner = content.children('.s-richtext').length ? content.children('.s-richtext').first() : content;
    rows.push([`<p>${pos}</p>`, ctx.cleanChildren(inner.get(0)).trim()]);
  });
  if (!ok || rows.length < 2) return null;
  return ctx.block('hotspots', [], rows);
}
