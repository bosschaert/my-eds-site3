/*
 * Rooms — reconstructive (repeat group of door cards). Rows are classified by CONTENT, never by
 * index: a row with a picture is a door card; the picture-less row holding the <h2> (and any
 * picture-less row before the first card) is the head; picture-less rows after the cards are the
 * closing line. Head roles: the link-free <p> before the heading is the eyebrow, a post-heading
 * paragraph ending in an arrow is the mobile hint, the rest is the first-visit note. Card roles:
 * a short digits-only <p> is the index, the heading is moved as authored, a paragraph that is
 * entirely one link is the CTA — its href becomes the card <a> (EW6) and the inner anchor is
 * unwrapped in place (no nested anchors); the remaining paragraphs are the description.
 * Everything is MOVED (EW1); wrappers carry the prototype's class names.
 */

function expandCell(cell) {
  let kids = [...cell.children];
  if (kids.length === 1 && kids[0].tagName === 'P' && kids[0].children.length
    && kids[0].querySelector('picture, img')) {
    kids = [...kids[0].children];
  }
  return kids;
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

function buildHead(nodes) {
  const head = slot('rooms-head');
  const eyebrow = slot('rooms-eyebrow');
  const title = slot('rooms-title');
  const firstVisit = slot('rooms-first-visit');
  const hint = slot('mobile-room-hint');
  hint.setAttribute('aria-hidden', 'true');
  let seenHeading = false;
  nodes.forEach((n) => {
    if (n.matches('h1, h2, h3, h4, h5, h6')) {
      seenHeading = true;
      title.append(n);
    } else if (!seenHeading && !eyebrow.childElementCount && n.matches('p') && !n.querySelector('a')) {
      eyebrow.append(n);
    } else if (/→\s*$/.test(n.textContent) && !n.querySelector('a')) {
      hint.append(n);
    } else if (n.textContent.trim()) {
      firstVisit.append(n);
    }
  });
  [eyebrow, title, firstVisit, hint].forEach((s) => {
    if (s.childElementCount) head.append(s);
  });
  return head;
}

function buildCard(nodes) {
  const ctaP = nodes.find((n) => n.matches('p') && isLinkParagraph(n));
  const link = ctaP ? ctaP.querySelector('a[href]') : null;
  const card = document.createElement(link ? 'a' : 'div');
  card.className = 'reading-door';
  if (link) card.href = link.href;

  const media = slot('courtyard-door-media');
  const index = slot('door-index');
  const cta = slot('door-cta');
  const rest = [];
  nodes.forEach((n) => {
    const m = mediaOf(n);
    if (m) {
      media.append(m);
      if (n !== m && n.textContent.trim()) rest.push(n);
    } else if (n === ctaP) {
      cta.append(n);
    } else if (n.matches('p') && /^\d{1,3}$/.test(n.textContent.trim()) && !index.childElementCount) {
      index.append(n);
    } else if (n.textContent.trim()) {
      rest.push(n);
    }
  });
  if (link) link.replaceWith(...link.childNodes);

  if (media.childElementCount) card.append(media);
  if (index.childElementCount) card.append(index);
  card.append(...rest);
  if (cta.childElementCount) card.append(cta);
  return card;
}

export default function decorate(block) {
  const rows = [...block.children].map((row) => [...row.children].flatMap(expandCell));
  const isCard = (nodes) => nodes.some((n) => mediaOf(n));
  const firstCard = rows.findIndex(isCard);
  const lastCard = rows.length - 1 - [...rows].reverse().findIndex(isCard);

  const headNodes = [];
  const cards = [];
  const tailNodes = [];
  rows.forEach((nodes, i) => {
    if (isCard(nodes)) cards.push(nodes);
    else if (firstCard === -1 || i < firstCard) headNodes.push(...nodes);
    else if (i > lastCard) tailNodes.push(...nodes);
    else headNodes.push(...nodes);
  });

  const out = [];
  if (headNodes.length) out.push(buildHead(headNodes));
  if (cards.length) {
    const rail = slot('reading-door-rail');
    cards.forEach((nodes) => rail.append(buildCard(nodes)));
    out.push(rail);
  }
  const closing = slot('rooms-continuing');
  tailNodes.forEach((n) => {
    if (n.textContent.trim()) closing.append(n);
  });
  if (closing.childElementCount) out.push(closing);
  block.replaceChildren(...out);
}
