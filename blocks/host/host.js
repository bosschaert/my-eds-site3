/**
 * host — #host: welcome heading, italic tagline, the host's portrait and the note paragraphs.
 * Schema: stardust/eds-schema/index.json sections[1] (room-section). Tier: template-slotted.
 *
 * Authoring rows (positional):
 *   1. h2
 *   2. tagline paragraph
 *   3. portrait image
 *   4. note paragraphs (one cell, several <p>)
 */

function wrapNode(node, className) {
  const w = document.createElement('div');
  w.className = className;
  w.append(node);
  return w;
}

export default function decorate(block) {
  const heading = block.querySelector('h1, h2, h3');
  const media = block.querySelector('picture, img');
  const picture = media ? media.closest('picture') || media : null;
  const paragraphs = [...block.querySelectorAll('p')].filter((p) => !p.querySelector('picture, img'));
  const tagline = paragraphs[0];
  const notes = paragraphs.slice(1);

  const frag = document.createDocumentFragment();
  if (heading) frag.append(wrapNode(heading, 'host-headline'));
  if (tagline) frag.append(wrapNode(tagline, 'host-tagline'));
  const figure = document.createElement('div');
  figure.className = 'host-figure';
  const note = document.createElement('div');
  note.className = 'host-note';
  notes.forEach((p) => note.append(p));
  if (notes.length) figure.append(note);
  if (picture) figure.append(wrapNode(picture, 'host-media'));
  if (figure.childElementCount) frag.append(figure);
  block.replaceChildren(frag);
}
