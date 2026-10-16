/**
 * text-media-unnest — a textpic CE whose c-media__text holds a module that walks to a block
 * (sk-sk "Vízia / misia": text + two c-table content tables beside a floated image): text-media.mjs
 * nests that block table inside its text cell (davids-model D2). Priority 1 (after the specific
 * text-media helpers, before text-media.mjs); CEs without a nested block → null (text-media.mjs
 * keeps them).
 * Output: the text-media block (encoded by text-media.mjs) with its text cell cut before the
 * first nested block; the nested block(s) and the text after them follow the block in source
 * order (blocks + default content of the same section).
 */
import * as textMedia from './text-media.mjs';

export const match = textMedia.match;
export const priority = 1;

export function encode(el, ctx) {
  const { $ } = ctx;
  if (!$(el).find('.c-media__text table, .c-media__text .c-table__wrapper, .c-media__text .c-table__container').length) return null;
  const out = textMedia.encode(el, ctx);
  const html = out && typeof out === 'object' ? out.html : out;
  if (!html) return null;
  const frag = $('<div></div>').append(html);
  const block = frag.children('div.text-media').first();
  if (!block.length) return null;
  const rows = block.children().get();
  const textCell = $(rows[rows.length - 1]).children().first();
  const kids = textCell.children().get();
  const cut = kids.findIndex((k) => k.tagName === 'div' && $(k).attr('class'));
  if (cut < 0) return null;
  const after = kids.slice(cut).map((k) => $.html(k)).join('');
  kids.slice(cut).forEach((k) => $(k).remove());
  const result = `${frag.html()}${after}`;
  return out && typeof out === 'object' ? { ...out, html: result } : result;
}
