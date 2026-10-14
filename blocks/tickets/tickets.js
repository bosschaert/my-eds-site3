/**
 * tickets — ticket price cards + "Useful Information" panel in one grid
 * (prototype section.sm-tickets; schema stardust/eds-schema/index.json section 4:
 * heading + 6 × ARTICLE.sm-ticket {heading, img, price, link} + useful panel).
 *
 * Decode tier: reconstructive. Section head (<h2>) is DEFAULT CONTENT before the
 * block and is reabsorbed (EW8); a leading head row (h2, no image) is the
 * defensive fallback. One row per unit:
 *   ticket  — <img> | <h3> title · optional price <p> · link <p> ("Book Now").
 *             When the title carries no link, the whole card links to the link
 *             <p>'s href (EW6). When the title IS a link (Go City), the image
 *             links to the title's href and the link <p> keeps its own href.
 *   panel   — a row with no image: <h3> · <ul> (icon + text items) · CTA <p>.
 */

const HEADING = 'h1, h2, h3, h4, h5, h6';

function slot(className, ...nodes) {
  const w = document.createElement('div');
  w.className = className;
  w.append(...nodes);
  return w;
}

// Flat authored elements of the given cells. A <p> that only wraps a picture
// yields the picture. HARNESS-ONLY fallback (EW5): a text-only cell is wrapped
// by MOVING its text nodes into a <p>.
function collectNodes(cells) {
  const out = [];
  cells.forEach((cell) => {
    const kids = [...cell.children];
    if (!kids.length && cell.textContent.trim()) {
      const p = document.createElement('p');
      p.append(...cell.childNodes);
      out.push(p);
      return;
    }
    kids.forEach((el) => {
      const media = el.querySelector('picture, img');
      if (el.tagName === 'P' && media && !el.textContent.trim()) {
        out.push(media.closest('picture') || media);
      } else out.push(el);
    });
  });
  return out;
}

function adoptHead(block, rows) {
  const head = slot('tickets-head');
  const prev = block.parentElement && block.parentElement.previousElementSibling;
  if (prev && prev.classList.contains('default-content-wrapper')) {
    head.append(...prev.childNodes);
    prev.remove();
  }
  while (rows.length && rows[0].querySelector('h2') && !rows[0].querySelector('picture, img')) {
    head.append(...collectNodes([...rows.shift().children]));
  }
  return head;
}

// One unit per row; a single flattened row is split on the card-heading boundary.
function units(rows) {
  if (rows.length !== 1) return rows.map((row) => collectNodes([...row.children]));
  const groups = [];
  let pending = [];
  let current = null;
  collectNodes([...rows[0].children]).forEach((n) => {
    if (n.matches(HEADING)) {
      current = [...pending, n];
      pending = [];
      groups.push(current);
    } else if (n.matches('picture, img')) pending.push(n);
    else if (current) current.push(n);
    else pending.push(n);
  });
  return groups;
}

function buildTicket(nodes) {
  const media = nodes.find((n) => n.matches('picture, img'));
  const heading = nodes.find((n) => n.matches(HEADING));
  const titleLink = heading && heading.querySelector('a');
  const linkP = [...nodes].reverse().find((n) => n !== heading && n.querySelector('a'));
  const link = linkP && linkP.querySelector('a');
  const rest = nodes.filter((n) => ![media, heading, linkP].includes(n));

  const row = slot('tickets-row');
  if (heading) row.append(slot('tickets-title', heading));
  if (rest.length) row.append(slot('tickets-price', ...rest));
  const body = slot('tickets-body', row);
  if (linkP) body.append(slot('tickets-cta', linkP));

  const card = slot('tickets-ticket js-show-on-scroll-img');
  const mediaSlot = media ? slot('tickets-img', media) : null;
  if (titleLink) {
    // split links (Go City): the image takes the title's href; links stay authored
    if (mediaSlot) {
      const a = document.createElement('a');
      a.href = titleLink.href;
      a.className = 'tickets-img-link';
      a.append(mediaSlot);
      card.append(a);
    }
    card.append(body);
    return card;
  }
  const anchor = document.createElement('a');
  anchor.className = 'tickets-link';
  if (link) {
    anchor.href = link.href;
    link.replaceWith(...link.childNodes); // EW6: one link — the card
  }
  if (mediaSlot) anchor.append(mediaSlot);
  anchor.append(body);
  card.append(anchor);
  return card;
}

function buildPanel(nodes) {
  const heading = nodes.find((n) => n.matches(HEADING));
  const list = nodes.find((n) => n.matches('ul, ol'));
  const ctas = nodes.filter((n) => n.tagName === 'P' && n.querySelector('a'));
  const rest = nodes.filter((n) => ![heading, list].includes(n) && !ctas.includes(n));
  const panel = slot('tickets-useful');
  if (heading) panel.append(slot('tickets-useful-title', heading));
  if (list) panel.append(slot('tickets-useful-list', list));
  if (rest.length) panel.append(slot('tickets-useful-text', ...rest));
  if (ctas.length) panel.append(slot('tickets-useful-cta', ...ctas));
  panel.append(slot('tickets-useful-art js-show-on-scroll-img'));
  return panel;
}

export default function decorate(block) {
  const rows = [...block.children];
  const head = adoptHead(block, rows);
  const grid = slot('tickets-grid');
  units(rows).forEach((nodes) => {
    const hasMedia = nodes.some((n) => n.matches('picture, img'));
    grid.append(hasMedia ? buildTicket(nodes) : buildPanel(nodes));
  });
  const inner = slot('tickets-inner sm-wrap');
  if (head.childNodes.length) inner.append(head);
  inner.append(grid);
  block.id = block.id || 'Tickets';
  block.classList.add('js-show-on-scroll');
  block.replaceChildren(inner);
}
