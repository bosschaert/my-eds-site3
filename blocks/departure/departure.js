/*
 * Departure — template-slotted. Authored row: cell 1 = <h2> (visually hidden) + eyebrow, hope,
 * blessing, Gujarati blessing, "now" paragraph (holds the link); cell 2 = portrait image + thanks.
 * decorate() builds EMPTY wrappers with the prototype's class names and MOVES the authored nodes
 * into them (EW1). Roles: the heading → `departure-sr`; the paragraph holding a link → `departure-
 * now`; the link-free paragraphs of the copy cell in authored order → eyebrow, hope, blessing,
 * guj-blessing (template order; extra paragraphs stay in the copy column unstyled); media → the
 * figure, the paragraph beside the image → `departure-thanks`. Nothing is rebuilt from text.
 */

function cellsOf(block) {
  return [...block.querySelectorAll(':scope > div > div')].map((cell) => {
    let kids = [...cell.children];
    if (kids.length === 1 && kids[0].tagName === 'P' && kids[0].children.length
      && kids[0].querySelector('picture, img')) {
      kids = [...kids[0].children];
    }
    return kids;
  });
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

export default function decorate(block) {
  const cells = cellsOf(block);
  const sr = slot('departure-sr sr-only');
  const copy = slot('departure-copy');
  const figure = slot('departure-figure');
  const thanks = slot('departure-thanks');
  const now = slot('departure-now');
  const ordered = ['departure-eyebrow', 'departure-hope', 'blessing', 'guj-blessing'].map(slot);
  const copyExtra = [];
  let filled = 0;

  const mediaCell = cells.find((kids) => kids.some((k) => mediaOf(k)));
  cells.forEach((kids) => {
    kids.forEach((k) => {
      const m = mediaOf(k);
      if (m) {
        figure.append(m);
        if (k !== m && k.textContent.trim()) thanks.append(k);
      } else if (kids === mediaCell) {
        if (k.textContent.trim()) thanks.append(k);
      } else if (k.matches('h1, h2, h3, h4, h5, h6')) {
        sr.append(k);
      } else if (k.querySelector('a[href]')) {
        now.append(k);
      } else if (k.matches('p') && filled < ordered.length) {
        ordered[filled].append(k);
        filled += 1;
      } else if (k.textContent.trim()) {
        copyExtra.push(k);
      }
    });
  });

  ordered.forEach((s) => {
    if (s.childElementCount) copy.append(s);
  });
  if (now.childElementCount) copy.append(now);
  copy.append(...copyExtra);
  if (thanks.childElementCount) figure.append(thanks);

  const out = [];
  if (sr.childElementCount) out.push(sr);
  if (copy.childElementCount) out.push(copy);
  if (figure.childElementCount) out.push(figure);
  block.replaceChildren(...out);
}
