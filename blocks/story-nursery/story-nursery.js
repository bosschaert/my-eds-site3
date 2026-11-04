/*
 * Story Nursery — template-slotted. Authored rows: [1] eyebrow <p> + <h2>; [2] image;
 * [3] copy <p> + CTA <p><a>. decorate() builds EMPTY wrappers with the prototype's class names
 * and MOVES the authored nodes into them by role (EW1): the link-free paragraph BEFORE the heading
 * is the eyebrow, a paragraph that is entirely one link is the CTA (moved as its <p>, EW3), media
 * goes to the figure, every other paragraph is copy. No row indices, no rebuilt text.
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

function slot(className, tag = 'div') {
  const el = document.createElement(tag);
  el.className = className;
  return el;
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
  const wrap = slot('story-nursery-home-wrap');
  const eyebrow = slot('story-nursery-eyebrow');
  const title = slot('story-nursery-title');
  const figure = slot('story-nursery-home-image', 'figure');
  const copy = slot('story-nursery-home-copy');
  const cta = slot('story-nursery-cta');

  let seenHeading = false;
  nodes.forEach((n) => {
    const media = mediaOf(n);
    if (n.matches('h1, h2, h3, h4, h5, h6')) {
      seenHeading = true;
      title.append(n);
    } else if (media) {
      figure.append(media);
      if (n !== media && n.textContent.trim()) copy.append(n);
    } else if (isLinkParagraph(n)) {
      cta.append(n);
    } else if (!seenHeading && !eyebrow.childElementCount && n.matches('p')) {
      eyebrow.append(n);
    } else if (n.textContent.trim()) {
      copy.append(n);
    }
  });

  if (cta.childElementCount) copy.append(cta);
  [eyebrow, title, figure, copy].forEach((s) => {
    if (s.childElementCount) wrap.append(s);
  });
  block.replaceChildren(wrap);
}
