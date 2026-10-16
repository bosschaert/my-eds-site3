/**
 * video-gallery-wide — a video-gallery row (video-gallery.mjs) whose two columns are
 * col-md-8 | col-md-4 (sk-sk "Prezentačné video spoločnosti" beside "Bezpečnostné pravidlá"):
 * video-gallery.mjs names it cols-2 (50/50 at every width >= 767). Priority 14: its output with
 * `cols-2` → `wide-narrow` (8/4 >= 1023, 6/6 767–1022, as the source col-sm-6 col-md-8|4).
 * (cluster-hub)
 */
import * as gallery from './video-gallery.mjs';

export const match = gallery.match;
export const priority = 14;

export function encode(el, ctx) {
  const { $ } = ctx;
  const cols = $(el).children().get().filter((c) => $(c).children().length);
  if (cols.length !== 2) return null;
  const [a, b] = cols.map((c) => ($(c).attr('class') || '').split(/\s+/));
  if (!a.includes('col-md-8') || !b.includes('col-md-4')) return null;
  const out = gallery.encode(el, ctx);
  if (!out) return null;
  const fix = (h) => h.replace(/^(\s*<div class="video-player gallery) cols-2(?=[ "])/, '$1 wide-narrow');
  return typeof out === 'object' ? { ...out, html: fix(out.html) } : fix(out);
}
