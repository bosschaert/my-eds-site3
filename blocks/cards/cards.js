/**
 * cards — the home JOURNAL card list (source `.p-front-journal` + `.p-journal__list`).
 *
 * Section head (default content before the block, reabsorbed — EW8):
 *   <h2>JOURNAL</h2> + <p><a href="/journal">VIEW ALL</a></p>
 * Authoring rows (one per card, collection pattern, reconstructive tier):
 *   cell 1: the card image (<picture> on the pipeline, bare <img> off it)
 *   cell 2: <p>BLOG</p> (category) · <p>#造園</p> (tag) · <h3><a href>title</a></h3>
 *           · <p>2026.05.22</p> (date)
 *
 * Roles are classified by shape (media / short uppercase category / `#`-prefixed tag /
 * heading / dotted date), never by cell index; unclassified elements are kept in a
 * leftovers slot. The card is a link (EW6): the heading's href becomes the card <a> and
 * the inner anchor is unwrapped in place. Post-decorate unit count = authored rows.
 */

function el(tag, className) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

const text = (node) => (node ? node.textContent.trim() : '');
const isCategory = (p) => /^[A-Z][A-Z0-9 &/]{1,15}$/.test(text(p));
const isTag = (p) => /^#/.test(text(p));
const isDate = (p) => /^\d{4}[./-]\d{1,2}[./-]\d{1,2}$/.test(text(p));

/**
 * Collects the authored elements of a row, expanding the runtime's wrapTextNodes fold
 * (#104: a media-led cell arrives as one <p> holding the image and its siblings).
 * @param {Element} row
 */
function collectNodes(row) {
  const out = [];
  row.querySelectorAll(':scope > div').forEach((cell) => {
    let kids = [...cell.children];
    if (kids.length === 1 && kids[0].tagName === 'P' && kids[0].children.length
        && kids[0].querySelector('picture, img') && kids[0].children.length > 1) {
      kids = [...kids[0].children];
    }
    out.push(...kids);
  });
  return out;
}

/** moves the section head (default content) into the block's head slots (EW8) */
function absorbHead(block, container) {
  const section = block.closest('.section');
  const wrapper = section ? section.querySelector(':scope > .default-content-wrapper') : null;
  if (!wrapper) return;
  const heading = wrapper.querySelector('h1, h2, h3, h4');
  const link = [...wrapper.querySelectorAll('p')].find((p) => p.querySelector('a'));
  if (heading) {
    const ttl = el('div', 'journal-ttl');
    ttl.append(heading);
    container.append(ttl);
  }
  if (link) {
    const lnk = el('div', 'journal-link');
    lnk.append(link);
    container.append(lnk);
  }
  // leftovers: any other default content of the head stays visible
  [...wrapper.children].forEach((n) => container.append(n));
  wrapper.remove();
}

function buildCard(row) {
  const nodes = collectNodes(row);
  const li = el('li', 'journal-item');
  const media = nodes.find((n) => n.matches('picture, img') || n.querySelector('picture, img'));
  const heading = nodes.find((n) => /^H[1-6]$/.test(n.tagName));
  const innerLink = heading ? heading.querySelector('a[href]') : null;
  const card = innerLink ? el('a') : el('div');
  if (innerLink) {
    card.href = innerLink.getAttribute('href');
    innerLink.replaceWith(...innerLink.childNodes);
  }
  const img = el('div', 'journal-item-img');
  const desc = el('div', 'journal-item-desc');
  const taxonomy = el('div', 'journal-item-taxonomy');
  const cat = el('div', 'journal-item-cat');
  const tag = el('div', 'journal-item-tag');
  const title = el('div', 'journal-item-title');
  const date = el('div', 'journal-item-date');
  const rest = el('div', 'journal-item-rest');

  if (media) img.append(media.matches('picture, img') ? media : media.querySelector('picture, img'));
  nodes.forEach((n) => {
    if (n === media || n === heading || n.contains(media)) return;
    if (n.tagName === 'P' && isTag(n)) tag.append(n);
    else if (n.tagName === 'P' && isDate(n)) date.append(n);
    else if (n.tagName === 'P' && !n.querySelector('a, picture, img') && isCategory(n)) cat.append(n);
    else rest.append(n);
  });
  if (heading) title.append(heading);

  if (cat.childNodes.length) taxonomy.append(cat);
  if (tag.childNodes.length) taxonomy.append(tag);
  if (taxonomy.childNodes.length) desc.append(taxonomy);
  if (title.childNodes.length) desc.append(title);
  if (date.childNodes.length) desc.append(date);
  if (rest.childNodes.length) desc.append(rest);
  if (img.childNodes.length) card.append(img);
  card.append(desc);
  li.append(card);
  return li;
}

export default function decorate(block) {
  const rows = [...block.children];
  const container = document.createDocumentFragment();
  absorbHead(block, container);
  const list = el('ul', 'journal-list');
  rows.forEach((row) => {
    if (!row.querySelector('p, h1, h2, h3, h4, h5, h6, picture, img, ul, ol')) return;
    list.append(buildCard(row));
  });
  block.replaceChildren(container, list);
}
