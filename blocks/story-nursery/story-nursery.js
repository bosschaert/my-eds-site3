/**
 * story-nursery — #story-nursery: centred eyebrow, h2, wide nursery image, copy and a text CTA.
 * Schema: stardust/eds-schema/index.json sections[2] (story-nursery-home). Tier: template-slotted.
 * The 1100px / 920px caps are this block's own (the section is authored style "full-bleed").
 *
 * Authoring rows (positional):
 *   1. eyebrow paragraph
 *   2. h2
 *   3. image
 *   4. body paragraph
 *   5. CTA paragraph (bare link — a text link, not a button)
 */

function wrapNode(node, className) {
  const w = document.createElement('div');
  w.className = className;
  w.append(node);
  return w;
}

const isLinkOnly = (p) => {
  const a = p.querySelector('a');
  return !!a && p.textContent.trim() === a.textContent.trim();
};

export default function decorate(block) {
  const heading = block.querySelector('h1, h2, h3');
  const media = block.querySelector('picture, img');
  const picture = media ? media.closest('picture') || media : null;
  const paragraphs = [...block.querySelectorAll('p')].filter((p) => !p.querySelector('picture, img'));
  const ctas = paragraphs.filter(isLinkOnly);
  const prose = paragraphs.filter((p) => !isLinkOnly(p));
  const eyebrow = prose[0];
  const body = prose.slice(1);

  const wrap = document.createElement('div');
  wrap.className = 'nursery-wrap';
  if (eyebrow) wrap.append(wrapNode(eyebrow, 'nursery-eyebrow'));
  if (heading) wrap.append(wrapNode(heading, 'nursery-headline'));
  if (picture) wrap.append(wrapNode(picture, 'nursery-image'));
  const copy = document.createElement('div');
  copy.className = 'nursery-copy';
  body.forEach((p) => copy.append(p));
  if (ctas.length) {
    const actions = document.createElement('div');
    actions.className = 'nursery-cta';
    ctas.forEach((p) => actions.append(p));
    copy.append(actions);
  }
  if (copy.childElementCount) wrap.append(copy);
  block.replaceChildren(wrap);
}
