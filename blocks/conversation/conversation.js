/*
 * Conversation — template-slotted. Authored row: cell 1 = image, cell 2 = eyebrow <p>, <h2>, lede
 * paragraphs, CTAs as <p><em><a>> (already `p.button-wrapper > a.button` when this runs).
 * decorate() builds EMPTY wrappers with the prototype's class names (`split` > `conversation-room-
 * media` + `conversation-copy` > `conversation-eyebrow`, heading, `conversation-ledes`, `doors`)
 * and MOVES the authored nodes into them by role (EW1): the link-free <p> before the heading is
 * the eyebrow, a paragraph that is entirely one link is a CTA (moved as its <p>, EW3), the other
 * paragraphs are ledes. Non-mailto CTA anchors get target/rel attributes and the mailto anchor the
 * source's aria-label="Send email" — attributes, not text.
 */

function collectNodes(block) {
  const out = [];
  block.querySelectorAll(':scope > div > div').forEach((cell) => {
    let kids = [...cell.children];
    if (kids.length === 1 && kids[0].tagName === 'P' && kids[0].children.length
      && kids[0].querySelector('picture, img')) {
      kids = [...kids[0].children];
    }
    out.push(...kids);
  });
  return out;
}

function slot(className) {
  const div = document.createElement('div');
  div.className = className;
  return div;
}

function mediaOf(el) {
  if (el.matches('picture')) return el;
  if (el.matches('img')) return el.closest('picture') || el;
  return el.querySelector('picture') || el.querySelector('img');
}

function isLinkParagraph(el) {
  const a = el.querySelector('a[href]');
  return !!a && el.textContent.trim() === a.textContent.trim();
}

export default function decorate(block) {
  const nodes = collectNodes(block);
  const split = slot('split');
  const media = slot('conversation-room-media');
  const copy = slot('conversation-copy');
  const eyebrow = slot('conversation-eyebrow');
  const ledes = slot('conversation-ledes');
  const doors = slot('doors');
  let heading = null;

  nodes.forEach((n) => {
    const m = mediaOf(n);
    if (n.matches('h1, h2, h3, h4, h5, h6')) {
      heading = heading || n;
      if (heading !== n) ledes.append(n);
    } else if (m) {
      media.append(m);
      if (n !== m && n.textContent.trim()) ledes.append(n);
    } else if (isLinkParagraph(n)) {
      const a = n.querySelector('a[href]');
      const href = a.getAttribute('href') || '';
      if (/^https?:/i.test(href)) {
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener noreferrer');
      } else if (/^mailto:/i.test(href) && !a.hasAttribute('aria-label')) {
        a.setAttribute('aria-label', 'Send email');
      }
      doors.append(n);
    } else if (!heading && !eyebrow.childElementCount && n.matches('p')) {
      eyebrow.append(n);
    } else if (n.textContent.trim()) {
      ledes.append(n);
    }
  });

  if (eyebrow.childElementCount) copy.append(eyebrow);
  if (heading) copy.append(heading);
  if (ledes.childElementCount) copy.append(ledes);
  if (doors.childElementCount) copy.append(doors);
  if (media.childElementCount) split.append(media);
  split.append(copy);
  block.replaceChildren(split);
}
