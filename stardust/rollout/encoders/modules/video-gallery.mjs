/**
 * video-gallery — a `.row` of columns, each ONE textmedia CE with an AdmiralCloud video embed
 * and (optionally) a header heading above it and text below it (press media library "Footage":
 * col-12 col-sm-6 col-md-4 cards). video-player.mjs claims video-only CEs; these cards → null
 * there (UNMAPPED before this module). Priority 13 (before video-player.mjs).
 * Block: video-player (gallery cols-N). One row per card: [heading(s) | video cell | text]:
 *   heading cell — the c-media__header heading(s) (cleaned); omitted when absent
 *   video cell   — as video-player.mjs: <p><img poster></p> <p><a href=player URL>URL</a></p>
 *                  + caption <p> + creator <p>
 *   text cell    — the c-media__text children walked (default content: p, links, buttons)
 * Variant from the column classes: col-md-4 → cols-3, col-md-3 → cols-4, else cols-2.
 */
export const match = '.row';
export const priority = 13;

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const attr = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
const PLAYER = 'https://player.admiralcloud.com/?v=';

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

export function encode(el, ctx) {
  const { $ } = ctx;
  const cols = $(el).children().get().filter((c) => $(c).children().length);
  if (cols.length < 2) return null;
  const ces = cols.map((c) => $(c).children('.o-page__ce'));
  if (ces.some((l) => l.length !== 1)) return null;
  if (!ces.every((l) => l.find('.c-media__embed.is-video [data-ac-container], .c-media__embed.is-video .ac-player').length
    && l.find('.c-media__embed').length === 1)) return null;
  if (!ces.some((l) => l.children('.c-media__header').length || l.find('.c-media__text').text().trim())) return null;
  $(el).find('a[class*="c-button"]').each((i, a) => {
    if (!$(a).parent().is('strong, b')) $(a).wrap('<strong></strong>');
  });
  const rows = [];
  for (const l of ces) {
    const video = videoCell($, l.get(0), ctx);
    if (!video) return null;
    const heads = l.children('.c-media__header').children('h1, h2, h3, h4, h5, h6').get()
      .map((h) => ctx.clean(h)).join('');
    const text = l.find('.c-media__text').get().map((t) => ctx.walk(t)).join('').trim();
    const row = [];
    if (heads) row.push(heads);
    row.push(video);
    if (text) row.push(text);
    rows.push(row);
  }
  const cls = $(cols[0]).attr('class') || '';
  let v = 'cols-2';
  if (/\bcol-md-4\b/.test(cls)) v = 'cols-3';
  else if (/\bcol-md-3\b/.test(cls)) v = 'cols-4';
  return ctx.block('video-player', ['gallery', v], rows);
}
