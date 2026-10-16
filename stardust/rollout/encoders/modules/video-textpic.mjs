/**
 * video-textpic — TYPO3 textmedia CE whose gallery is ONE AdmiralCloud video floated in the text
 * (`.c-media__content.is-textpic.is-image-left.is-image-intext`: gallery + c-media__text;
 * de-unternehmen / en-company "Hauptversammlung" CE), which video-player.mjs refuses (text in the
 * CE). Priority 14 (before video-gallery / video-player).
 * Block: video-player (intext). ONE row: [video cell, text cell]
 *   video cell — as video-player.mjs: <p><img poster></p> <p><a href=player URL>URL</a></p>
 *                + caption <p> + creator <p>
 *   text cell  — the CE header heading(s) + the c-media__text children (normal dispatch).
 * Block CSS floats the video left in the text (50 % >= 767, 33 % >= 1023), stacked below 767.
 */
export const match = '.o-page__ce';
export const priority = 14;

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const attr = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
const PLAYER = 'https://player.admiralcloud.com/?v=';

function videoCell($, gallery, ctx) {
  const c = $(gallery);
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
  const ce = $(el);
  const content = ce.find('> .row > .col > .c-media__content.is-textpic.is-image-intext.is-image-left');
  if (content.length !== 1) return null;
  const gallery = content.children('.c-media__gallery');
  const text = content.children('.c-media__text');
  if (gallery.length !== 1 || text.length !== 1) return null;
  if (gallery.find('.c-media__embed').length !== 1 || gallery.find('.c-media__embed.is-video [data-ac-container]').length !== 1) return null;
  const vcell = videoCell($, gallery.get(0), ctx);
  if (!vcell) return null;
  const head = ce.children('header.c-media__header').find('h1, h2, h3, h4, h5, h6')
    .get().map((h) => ctx.clean(h)).join('');
  const tcell = `${head}${ctx.walk(text.get(0)).trim()}`;
  return ctx.block('video-player', ['intext'], [[vcell, tcell]]);
}
