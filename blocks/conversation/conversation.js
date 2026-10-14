/**
 * conversation — #conversation: split section (portrait visual left); eyebrow, h2, four lede
 * paragraphs, six outline door links and the "Follow the House" panel with its solid CTA.
 * Schema: stardust/eds-schema/index.json sections[5] (room-section). Tier: template-slotted.
 *
 * Authoring rows (classified by content, order-independent):
 *   - the row with the image → visual
 *   - the row with the h2 → eyebrow (first paragraph), h2, ledes
 *   - the row whose paragraphs are all links (<em><a>) → the door links (EW3: each keeps its <p>)
 *   - the remaining row (eyebrow, paragraph, <strong><a>) → the follow panel
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

const SAME_SITE = ['www.niravmanubhai.com', window.location.hostname];

// the source opens its social/channel links in a new tab (rel noopener)
function externalise(scope) {
  scope.querySelectorAll('a[href^="http"]').forEach((a) => {
    if (SAME_SITE.includes(new URL(a.href).hostname)) return;
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
  });
}

function prose(row) {
  return [...row.querySelectorAll('p')].filter((p) => !p.querySelector('picture, img'));
}

export default function decorate(block) {
  const rows = [...block.children];
  const split = document.createElement('div');
  split.className = 'split';
  const copy = document.createElement('div');
  copy.className = 'copy';
  const doors = document.createElement('div');
  doors.className = 'doors-links';
  const follow = document.createElement('div');
  follow.className = 'follow';

  rows.forEach((row) => {
    const media = row.querySelector('picture, img');
    const heading = row.querySelector('h1, h2, h3');
    const ps = prose(row);
    if (media) {
      split.append(wrapNode(media.closest('picture') || media, 'visual'));
      return;
    }
    if (heading) {
      const eyebrow = ps.find((p) => !isLinkOnly(p));
      if (eyebrow) copy.append(wrapNode(eyebrow, 'eyebrow'));
      copy.append(wrapNode(heading, 'headline'));
      ps.filter((p) => p !== eyebrow).forEach((p, i) => {
        copy.append(wrapNode(p, i === 0 ? 'lede' : 'lede lede-follow'));
      });
      return;
    }
    if (ps.length && ps.every(isLinkOnly)) {
      ps.forEach((p) => doors.append(p));
      return;
    }
    const texts = ps.filter((p) => !isLinkOnly(p));
    const ctas = ps.filter(isLinkOnly);
    texts.forEach((p, i) => follow.append(wrapNode(p, i === 0 ? 'follow-eyebrow' : 'follow-body')));
    if (ctas.length) {
      const actions = document.createElement('div');
      actions.className = 'follow-actions';
      ctas.forEach((p) => actions.append(p));
      follow.append(actions);
    }
  });

  if (doors.childElementCount) copy.append(doors);
  if (follow.childElementCount) copy.append(follow);
  externalise(copy);
  split.append(copy);
  block.replaceChildren(split);
}
