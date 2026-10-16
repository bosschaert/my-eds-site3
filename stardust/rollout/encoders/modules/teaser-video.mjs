/**
 * teaser-video — teaser cards that open a video (`a.c-teaser[data-lightbox]` with a
 * `.c-teaser__image-overlay-icon` play button over the image; reifen "90 Jahre Winterreifen",
 * mediathek videos). Same encoding as teaser.mjs + variant `video` when EVERY card of the row (or
 * the lone card) carries the overlay: teaser.js adds the play overlay (chrome) and keeps the
 * source's chevron link icon for the external video host. Priority 12. (cluster-content)
 */
import { encode as teaser } from './teaser.mjs';

export const match = '.row, a.c-teaser, div.c-teaser';
export const priority = 12;

export function encode(el, ctx) {
  const { $ } = ctx;
  const node = $(el);
  const cards = node.is('.c-teaser') ? node : node.find('.c-teaser');
  if (!cards.length || cards.get().some((c) => !$(c).find('.c-teaser__image-overlay-icon').length)) {
    return null;
  }
  const html = teaser(el, ctx);
  if (typeof html !== 'string' || !html.startsWith('<div class="teaser')) return null;
  return html.replace(/^<div class="teaser([^"]*)"/, '<div class="teaser$1 video"');
}
