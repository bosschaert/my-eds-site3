/**
 * posts — "Latest Events" / "Latest News" three-up post cards + "View All"
 * (prototype section.sm-posts; schema stardust/eds-schema/index.json sections 7
 * and 9: heading + 3 × ARTICLE.sm-post {heading, img, excerpt, link} + cta).
 *
 * Decode tier: reconstructive. Section head (<h2>) is DEFAULT CONTENT before the
 * block and is reabsorbed (EW8); a leading head row (h2, no image) is the
 * defensive fallback. One row per post: <img> | <h3> · excerpt <p> · link <p>
 * ("Read more" — the post's href; the whole card becomes the link, EW6).
 * A trailing row with a CTA and no heading/image is the "View All" button.
 * DA-flattened single-cell content is segmented on the card heading.
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
  const head = slot('posts-head');
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

// Units: one per row; a single flattened row is split on the card-heading boundary.
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
  if (pending.length) groups.push(pending);
  return groups;
}

function buildPost(nodes) {
  const media = nodes.find((n) => n.matches('picture, img'));
  const heading = nodes.find((n) => n.matches(HEADING));
  const linkP = [...nodes].reverse().find((n) => n !== heading && n.querySelector('a'));
  const link = linkP && linkP.querySelector('a');
  const rest = nodes.filter((n) => ![media, heading, linkP].includes(n));

  const anchor = document.createElement('a');
  anchor.className = 'sm-card-link';
  if (link) {
    anchor.href = link.href;
    link.replaceWith(...link.childNodes); // EW6: one link — the card
  }
  if (media) anchor.append(slot('posts-card-img', media));
  if (heading) anchor.append(slot('posts-card-title', heading));
  if (rest.length) anchor.append(slot('sm-rich posts-card-text', ...rest));
  if (linkP) anchor.append(slot('sm-txtlink posts-card-more', linkP));
  return slot('posts-card js-show-on-scroll-img', anchor);
}

export default function decorate(block) {
  const rows = [...block.children];
  const head = adoptHead(block, rows);
  const grid = slot('posts-grid');
  const tail = [];
  units(rows).forEach((nodes) => {
    const isPost = nodes.some((n) => n.matches(`${HEADING}, picture, img`));
    if (isPost) grid.append(buildPost(nodes));
    else tail.push(...nodes);
  });
  const inner = slot('posts-inner sm-wrap');
  if (head.childNodes.length) inner.append(head);
  inner.append(grid);
  if (tail.length) inner.append(slot('posts-all', ...tail));
  block.classList.add('js-show-on-scroll');
  block.replaceChildren(inner);
}
