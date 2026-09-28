/**
 * Rooms doors — "The Rooms" (source `section.rooms#rooms`, stardust:replica of
 * www.niravmanubhai.com). Decode tier: RECONSTRUCTIVE (rows are classified by content).
 * Schema: stardust/eds-schema/index.json → section "rooms" (head: eyebrow + heading + body;
 * repeats: 4 × door card (image, number, h3, long, short, rhythm); 1 × books card
 * (image | number, h3, description, free-line); "Also in the House": eyebrow + 3 × link + line).
 *
 * Row classification (never by index):
 *   - head row      — holds the <h2> (text before it = eyebrow, after it = first-visit note)
 *   - door card     — ONE cell with an image and an <h3> (whose link is the card's target).
 *                     Texts in schema order: number (digits only), then long, short, rhythm.
 *   - books card    — TWO cells (image | copy) with an <h3>: number, title, description, free-line
 *   - also group    — link paragraphs without an <h3>: text before the first link = eyebrow; each
 *                     link paragraph opens an item, the following link-free paragraph is its line
 *   - anything else — kept visible in `.rooms-doors-extra`
 *
 * Every authored node is MOVED (EW1); the cards are generated <a> elements and the authored
 * inner link is unwrapped after its href is read (EW6). The one letterboxed door (`.poster-insert`,
 * contained, not cropped) is the door whose cell carries the configuration word `poster` — the
 * source's per-instance variant. Wrappers carry the layout classes (EW2). Re-entrant (EW9).
 * @ew-exempt config token: "poster" in a door cell selects the letterboxed variant (consumed)
 */

function wrapNode(node, className) {
  const w = document.createElement('div');
  w.className = className;
  w.append(node);
  return w;
}

const MEDIA = 'picture, img';

function mediaOf(el) {
  return el.matches(MEDIA) ? el : el.querySelector(MEDIA);
}

const hasLink = (el) => el.matches('a') || !!el.querySelector('a');
const isNumber = (el) => /^\d{1,3}$/.test(el.textContent.trim());
const hasText = (el) => !!el.textContent.trim();

/** Authored elements of one cell (DA-flattened cell; harness-only fallbacks wrap text NODES). */
function cellNodes(cell) {
  let kids = [...cell.children];
  if (kids.length === 1 && kids[0].tagName === 'P' && kids[0].children.length
    && kids[0].querySelector(MEDIA)) {
    kids = [...kids[0].childNodes].map((n) => {
      if (n.nodeType === 1) return n;
      if (n.textContent.trim()) {
        const p = document.createElement('p');
        p.append(n);
        return p;
      }
      return null;
    }).filter(Boolean);
  }
  if (!kids.length && cell.textContent.trim()) {
    const p = document.createElement('p');
    p.append(...cell.childNodes);
    kids = [p];
  }
  return kids;
}

/** Card-as-link (EW6): a generated <a> targeting the authored link; inner anchors unwrapped. */
function cardLink(className, nodes) {
  const card = document.createElement('a');
  card.className = className;
  const heading = nodes.find((n) => n.matches('h3, h4') || n.querySelector('h3, h4'));
  const first = (heading && heading.querySelector('a'))
    || nodes.map((n) => (n.matches('a') ? n : n.querySelector('a'))).find(Boolean);
  if (first) {
    card.href = first.getAttribute('href');
    if (first.title) card.title = first.title;
  }
  nodes.forEach((n) => {
    n.querySelectorAll('a').forEach((a) => a.replaceWith(...a.childNodes));
  });
  return card;
}

/**
 * The letterboxed poster card: the source page marks exactly one door (`poster-insert`, the
 * "Come, Sit – Just Ask" poster) by class, not by image shape — two doors share the same portrait
 * ratio and only one is letterboxed. Authors mark it with a configuration word: a paragraph
 * reading `poster` in the door's cell, consumed here (declared @ew-exempt in the leading JSDoc).
 */
const POSTER_TOKEN = /^poster$/i;
const isPosterToken = (el) => el.matches('p') && !el.querySelector('a, picture, img')
  && POSTER_TOKEN.test(el.textContent.trim());

function buildDoor(allNodes) {
  const tokens = allNodes.filter((n) => isPosterToken(n));
  tokens.forEach((n) => n.remove());
  const nodes = allNodes.filter((n) => !tokens.includes(n));
  const card = cardLink('reading-door r24-door', nodes);
  const media = nodes.map((n) => mediaOf(n)).find(Boolean);
  const heading = nodes.find((n) => n.matches('h3, h4'));
  const texts = nodes.filter((n) => n !== heading && !mediaOf(n) && hasText(n));
  const number = texts.find((n) => isNumber(n));
  const [long, short, rhythm, ...extra] = texts.filter((n) => n !== number);
  if (media) {
    const frame = wrapNode(media, 'courtyard-door-media');
    if (tokens.length) frame.classList.add('poster-insert');
    card.append(frame);
  }
  if (number) card.append(wrapNode(number, 'r24-door-num'));
  if (heading) card.append(wrapNode(heading, 'r24-door-title'));
  if (long) card.append(wrapNode(long, 'r24-door-long'));
  if (short) card.append(wrapNode(short, 'r24-door-short'));
  if (rhythm) card.append(wrapNode(rhythm, 'r24-door-rhythm'));
  extra.forEach((p) => card.append(wrapNode(p, 'r24-door-extra')));
  return card;
}

function buildBooks(nodes) {
  const card = cardLink('r24-books', nodes);
  const media = nodes.map((n) => mediaOf(n)).find(Boolean);
  const heading = nodes.find((n) => n.matches('h3, h4'));
  const texts = nodes.filter((n) => n !== heading && !mediaOf(n) && hasText(n));
  const number = texts.find((n) => isNumber(n));
  const [desc, free, ...extra] = texts.filter((n) => n !== number);
  if (media) card.append(wrapNode(media, 'r24-books-media'));
  const copy = document.createElement('div');
  copy.className = 'r24-books-copy';
  if (number) copy.append(wrapNode(number, 'r24-books-num'));
  if (heading) copy.append(wrapNode(heading, 'r24-books-title'));
  if (desc) copy.append(wrapNode(desc, 'r24-books-desc'));
  if (free) copy.append(wrapNode(free, 'r24-books-free'));
  extra.forEach((p) => copy.append(wrapNode(p, 'r24-books-extra')));
  card.append(copy);
  return card;
}

function buildAlso(nodes) {
  const box = document.createElement('div');
  box.className = 'r24-also';
  const grid = document.createElement('div');
  grid.className = 'r24-also-grid';
  let item = null;
  nodes.filter((n) => hasText(n)).forEach((n) => {
    if (hasLink(n)) {
      item = cardLink('r24-also-item', [n]);
      item.append(wrapNode(n, 'r24-also-title'));
      grid.append(item);
    } else if (item) {
      item.append(wrapNode(n, 'r24-also-line'));
    } else {
      box.append(wrapNode(n, 'r24-also-eyebrow'));
    }
  });
  box.append(grid);
  return box;
}

function buildHead(nodes) {
  const head = document.createElement('div');
  head.className = 'rooms-doors-head';
  const heading = nodes.find((n) => n.matches('h1, h2'));
  const index = heading ? nodes.indexOf(heading) : nodes.length;
  nodes.forEach((n, i) => {
    if (n === heading) head.append(wrapNode(n, 'rooms-doors-heading'));
    else if (mediaOf(n)) head.append(wrapNode(mediaOf(n), 'rooms-doors-media'));
    else if (hasText(n)) {
      head.append(wrapNode(n, i < index ? 'eyebrow' : 'rooms-first-visit'));
    }
  });
  return head;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .wrap')) return;
  const rows = [...block.children];
  const section = block.closest('.section');
  if (section && !section.id) section.id = section.dataset.id || 'rooms';

  const wrap = document.createElement('div');
  wrap.className = 'wrap';
  let doors = null;

  rows.forEach((row) => {
    const cells = [...row.children];
    const nodes = cells.flatMap((cell) => cellNodes(cell));
    if (!nodes.length) return;
    const hasH2 = nodes.some((n) => n.matches('h1, h2'));
    const hasH3 = nodes.some((n) => n.matches('h3, h4'));
    const hasMedia = nodes.some((n) => mediaOf(n));
    const links = nodes.filter((n) => hasLink(n));
    if (hasH2) {
      wrap.append(buildHead(nodes));
    } else if (hasH3 && hasMedia && cells.length >= 2) {
      wrap.append(buildBooks(nodes));
    } else if (hasH3 && hasMedia) {
      if (!doors) {
        doors = document.createElement('div');
        doors.className = 'r24-doors';
        wrap.append(doors);
      }
      doors.append(buildDoor(nodes));
    } else if (links.length && !hasH3) {
      wrap.append(buildAlso(nodes));
    } else if (!hasH3 && !hasMedia && !links.length && !doors) {
      wrap.append(buildHead(nodes));
    } else {
      const extra = document.createElement('div');
      extra.className = 'rooms-doors-extra';
      extra.append(...nodes.filter((n) => hasText(n) || mediaOf(n)));
      wrap.append(extra);
    }
  });

  block.replaceChildren(wrap);
}
