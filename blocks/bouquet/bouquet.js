/**
 * bouquet — #story-bouquet-home: split section, visual left; eyebrow, h2, lede and a solid CTA.
 * Schema: stardust/eds-schema/index.json sections[4] (room-section). Tier: template-slotted.
 *
 * Authoring rows (positional):
 *   1. image
 *   2. eyebrow paragraph, h2, lede paragraph(s), CTA paragraph (<strong><a> → .button.primary)
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
  const ledes = prose.slice(1);

  const split = document.createElement('div');
  split.className = 'split';
  if (picture) split.append(wrapNode(picture, 'visual'));
  const copy = document.createElement('div');
  copy.className = 'copy';
  if (eyebrow) copy.append(wrapNode(eyebrow, 'eyebrow'));
  if (heading) copy.append(wrapNode(heading, 'headline'));
  ledes.forEach((p) => copy.append(wrapNode(p, 'lede')));
  if (ctas.length) {
    const actions = document.createElement('div');
    actions.className = 'actions';
    ctas.forEach((p) => actions.append(p));
    copy.append(actions);
  }
  split.append(copy);
  block.replaceChildren(split);
}
