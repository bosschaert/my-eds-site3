/**
 * docs — "Documents for Download": yellow-ruled heading, a centred row of document covers
 * (title + cover, even items image-first) and a "See All" pill.
 *
 * Schema: stardust/eds-schema/index.json → sections[5] (heading; repeat LI.doc ×4, each
 * 1 heading-link + 1 img; cta "See All").
 * Decode tier: reconstructive (authors add/remove documents).
 *
 * Authoring (container shape, one row per document — a flattened single cell also decodes):
 *   - <h2> section heading
 *   - per document: <h4><a href="…pdf">Title</a></h4> | <picture> (cover)
 *   - <p><strong><a href>See All</a></strong></p>  (pill CTA)
 * Document boundary = each h3/h4 heading; a picture attaches to the open document (or to the
 * next one when it precedes the first heading). The cover links to the heading's href.
 */

function collectNodes(block) {
  const out = [];
  block.querySelectorAll(':scope > div > div').forEach((cell) => {
    let kids = [...cell.children];
    // wrapTextNodes folds a media-led cell into one <p> — expand it back (#104)
    if (kids.length === 1 && kids[0].tagName === 'P' && kids[0].children.length
      && kids[0].querySelector('picture, img')) {
      kids = [...kids[0].children];
    }
    if (kids.length) out.push(...kids);
    // HARNESS-ONLY fallback (EW5): bare text cell — move its text nodes into a <p>
    else if (cell.textContent.trim()) {
      const p = document.createElement('p');
      p.append(...cell.childNodes);
      out.push(p);
    }
  });
  return out;
}

const media = (n) => (n.matches('picture, img') ? n : n.querySelector('picture, img'));

function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

function attachCover(doc, picture) {
  const link = doc.heading && doc.heading.querySelector('a[href]');
  const figure = el('figure');
  if (link) {
    const a = el('a', '', { href: link.getAttribute('href') });
    a.append(picture);
    figure.append(a);
  } else {
    figure.append(picture);
  }
  doc.li.append(figure);
}

export default function decorate(block) {
  const nodes = collectNodes(block);
  let title = null;
  const more = [];
  const docs = [];
  let pendingPic = null;
  let current = null;

  nodes.forEach((n) => {
    if (/^H[1-2]$/.test(n.tagName) && !title) {
      title = n;
    } else if (/^H[3-6]$/.test(n.tagName)) {
      current = { li: el('li', 'doc'), heading: n };
      current.li.append(n);
      docs.push(current);
      if (pendingPic) {
        attachCover(current, pendingPic);
        pendingPic = null;
      }
    } else if (media(n) && !n.querySelector('a')) {
      const pic = media(n).closest('picture') || media(n);
      if (current && !current.li.querySelector('figure')) attachCover(current, pic);
      else pendingPic = pic;
    } else if (n.querySelector('a.button, strong > a, em > a')) {
      more.push(n);
    } else if (current) {
      current.li.append(n);
    } else {
      more.unshift(n);
    }
  });
  if (pendingPic) more.unshift(pendingPic);

  const container = el('div', 'docs-container');
  const titleWrap = el('div', 'docs-title');
  if (title) titleWrap.append(title);
  const list = el('ul', 'docs-list');
  list.append(...docs.map((d) => d.li));
  container.append(titleWrap, list);
  if (more.length) {
    const moreWrap = el('div', 'docs-more');
    moreWrap.append(...more);
    container.append(moreWrap);
  }
  block.replaceChildren(container);
}
