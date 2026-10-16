/**
 * video-player — TYPO3 textmedia CE whose gallery is ONE AdmiralCloud video embed
 * (`.c-media__embed.is-video [data-ac-container]`, inline `new AcPlayer({ link: '<uuid>' })`,
 * the hydrated video.js UI is vendor chrome and is never copied).
 * Block: video-player. ONE row:
 *   video cell → <p><img src="poster" alt=""></p>                 (video.js `poster` attribute /
 *                                                                  .vjs-poster background; the
 *                                                                  AdmiralCloud deliverEmbed URL)
 *                <p><a href="https://player.admiralcloud.com/?v=<uuid>">same URL</a></p>
 *                + caption <p> (figcaption text without the creator) + creator <p>
 *   text cell  → (two-column rows only) the other column walked through the normal dispatch.
 * Shapes claimed:
 *   a `.has-columns .row` with exactly two non-empty columns, one holding a video-only CE (no
 *   header, no text) → [video cell, text cell] (or [text, video] in source order); variant from
 *   the video column: col-md-4 → `narrow` (4/8 >= 1023), col-md-8 → `wide` (8/4), col-sm-6 only
 *   → `half`; `order-2` on the video column (text first below 767) → `video-last-mobile`.
 *   a lone video-only CE → [video cell] (no variant: full content width).
 * Video CEs with a header or text in the same CE (media library cards) → null (UNMAPPED, the
 * cluster adds that shape).
 */
export const match = '.has-columns .row, .o-page__ce';
export const priority = 12;

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const attr = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
const PLAYER = 'https://player.admiralcloud.com/?v=';

function videoOnly($, ce) {
  const c = $(ce);
  if (!c.is('.o-page__ce') || !c.find('[data-ac-container]').length) return false;
  if (c.find('.c-media__header, .c-media__text').length) return false;
  return c.find('.c-media__embed').length === 1 && c.find('.c-media__embed.is-video').length === 1;
}

function videoCell($, ce, ctx) {
  const c = $(ce);
  const script = c.find('script').map((i, s) => $(s).html()).get().join('\n');
  const id = (script.match(/link:\s*'([0-9a-f-]{36})'/i) || [])[1];
  if (!id) return null;
  let poster = c.find('[poster]').first().attr('poster') || '';
  if (!poster) {
    const bg = c.find('.vjs-poster').attr('style') || '';
    poster = (bg.match(/url\((?:&quot;|["'])?([^"')&]+(?:&[^q][^"')]*)?)/) || [])[1] || '';
  }
  if (!poster) ctx.warn(`video ${id}: no poster`);
  const url = `${PLAYER}${id}`;
  const cap = c.find('figcaption').first();
  const capText = cap.clone().children('.c-image__creator').remove().end().text()
    .replace(/\s+/g, ' ')
    .trim();
  const creator = cap.find('.c-image__creator').text().replace(/\s+/g, ' ').trim();
  return `${poster ? `<p><img src="${attr(ctx.abs(poster))}" alt=""></p>` : ''}`
    + `<p><a href="${attr(url)}">${esc(url)}</a></p>`
    + `${capText ? `<p>${esc(capText)}</p>` : ''}${creator ? `<p>${esc(creator)}</p>` : ''}`;
}

function variantOf(cls) {
  const c = cls.split(/\s+/);
  const v = [];
  if (c.includes('col-md-4')) v.push('narrow');
  else if (c.includes('col-md-8')) v.push('wide');
  else if (c.includes('col-sm-6')) v.push('half');
  if (c.includes('order-2')) v.push('video-last-mobile');
  return v;
}

export function encode(el, ctx) {
  const { $ } = ctx;
  if ($(el).is('.o-page__ce')) {
    if (!videoOnly($, el)) return null;
    const cell = videoCell($, el, ctx);
    return cell ? ctx.block('video-player', [], [[cell]]) : null;
  }
  const cols = $(el).children().get().filter((c) => $(c).children().length);
  if (cols.length !== 2) return null;
  const ces = cols.map((c) => $(c).children('.o-page__ce').get());
  if (ces.some((list) => list.length !== 1)) return null;
  const flags = ces.map((list) => videoOnly($, list[0]));
  if (flags.filter(Boolean).length !== 1) return null;
  const vi = flags.indexOf(true);
  const vcell = videoCell($, ces[vi][0], ctx);
  if (!vcell) return null;
  const cells = cols.map((c, i) => (i === vi ? vcell : ctx.walk(c).trim()));
  if (vi === 1) ctx.warn('video-player: video in the second column (text first)');
  const variants = variantOf($(cols[vi]).attr('class') || '');
  if (vi === 1) variants.push('video-right');
  return ctx.block('video-player', variants, [cells]);
}
