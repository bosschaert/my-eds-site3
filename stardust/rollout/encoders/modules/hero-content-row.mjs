/**
 * hero-content-row — a `.c-heroteaser-fixed` whose slides carry NO title / description / link but
 * still render the (empty) `c-heroteaser-fixed__content-container` (ro-ro-cariera: the empty
 * c-heroteaser__links row): under 1023px that container is a 74 px band below the image. Slides
 * without the container (sk-sk) have no band. Priority 11: hero-stage-slider.mjs output +
 * variant `content-row` (the block renders the empty row for image-only slides). (cluster-hub)
 */
import * as hero from './hero-stage-slider.mjs';

export const match = hero.match;
export const priority = 11;

export function encode(el, ctx) {
  const { $ } = ctx;
  const slides = $(el).find('.c-heroteaser-fixed__slide');
  if (!slides.length) return null;
  const empty = slides.get().every((s) => {
    const c = $(s).find('.c-heroteaser-fixed__content-container');
    return c.length && !c.text().trim() && !c.find('a[href]').length;
  });
  if (!empty) return null;
  const out = hero.encode(el, ctx);
  if (!out) return null;
  const add = (h) => h.replace(/^(\s*<div class="hero-stage-slider)(?=[ "])/, '$1 content-row');
  return typeof out === 'object' ? { ...out, html: add(out.html) } : add(out);
}
