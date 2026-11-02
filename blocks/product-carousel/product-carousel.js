/**
 * product-carousel — titled, horizontally scrolling product shelf with arrow buttons (>= 768px)
 * and a progress bar per product (current = products fully in view).
 *
 * Authoring rows:
 *   head row (no image): heading, CTA link paragraph (link title = accessible name)
 *   product rows: image cell (<img>), info cell (product name link paragraph, price paragraph -
 *     a leading word before the price, e.g. "Final", is kept for screen readers only)
 * Rows are classified by content (image or not), never by position.
 * Variant: `lunch` (warm background, larger CTA).
 * @ew-exempt none
 */

const ARROW_LEFT = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256" width="32" height="32"><path d="M179.199,38.399c0,1.637-0.625,3.274-1.875,4.524l-85.076,85.075l85.076,85.075c2.5,2.5,2.5,6.55,0,9.05s-6.55,2.5-9.050,0l-89.601-89.6c-2.5-2.5-2.5-6.551,0-9.051l89.601-89.6c2.5-2.5,6.55-2.5,9.05,0C178.574,35.124,179.199,36.762,179.199,38.399z"></path></svg>';
const ARROW_RIGHT = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256" width="32" height="32"><path d="M76.8,217.6c0-1.637,0.625-3.274,1.875-4.524L163.75,128L78.675,42.925c-2.5-2.5-2.5-6.55,0-9.05s6.55-2.5,9.05,0l89.601,89.6c2.5,2.5,2.5,6.551,0,9.051l-89.601,89.6c-2.5,2.5-6.55,2.5-9.05,0C77.425,220.875,76.8,219.237,76.8,217.6z"></path></svg>';

function wrapNode(node, className) {
  const w = document.createElement('div');
  w.className = className;
  if (node) w.append(node);
  return w;
}

/** presentation refinement: a leading word before the price is screen-reader only */
function decoratePrice(p) {
  const first = p.firstChild;
  if (!first || first.nodeType !== Node.TEXT_NODE) return;
  const m = first.data.match(/^([^$£€\d]+\s)(?=[$£€\d])/);
  if (!m) return;
  first.splitText(m[1].length);
  const span = document.createElement('span');
  span.className = 'sr-only';
  first.replaceWith(span);
  span.append(first);
}

function buildItem(row) {
  const item = wrapNode(null, 'product-item');
  const media = row.querySelector('picture') || row.querySelector('img');
  const paras = [...row.querySelectorAll('p')].filter((p) => !p.querySelector('picture, img'));
  const nameP = paras.find((p) => p.querySelector('a'));
  const link = nameP ? nameP.querySelector('a') : null;
  if (media) {
    const imageLink = document.createElement(link ? 'a' : 'div');
    imageLink.className = 'product-image';
    if (link) {
      imageLink.href = link.href;
      if (link.title) imageLink.title = link.title;
    }
    imageLink.append(media);
    item.append(imageLink);
  }
  const meta = wrapNode(null, 'product-meta');
  if (nameP) meta.append(wrapNode(nameP, 'product-name'));
  paras.filter((p) => p !== nameP).forEach((p) => {
    decoratePrice(p);
    meta.append(wrapNode(p, 'product-price'));
  });
  [...row.querySelectorAll('h2, h3, h4, ul, ol')].forEach((n) => meta.append(n));
  item.append(meta);
  return item;
}

function button(className, label, html) {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = className;
  if (label) b.setAttribute('aria-label', label);
  if (html) b.innerHTML = html;
  return b;
}

export default function decorate(block) {
  const rows = [...block.children];
  const hasMedia = (r) => r.querySelector('picture, img');
  const headRows = rows.filter((r) => !hasMedia(r));
  const itemRows = rows.filter(hasMedia);

  const inner = wrapNode(null, 'products-inner');
  const header = wrapNode(null, 'products-header');
  headRows.forEach((r) => {
    [...r.querySelectorAll('h1, h2, h3, h4, h5, h6, p, ul, ol')].forEach((n) => {
      if (n.matches('h1, h2, h3, h4, h5, h6')) {
        header.append(wrapNode(n, 'products-title'));
      } else if (n.querySelector('a')) {
        header.append(wrapNode(n, 'products-cta'));
      } else if (n.textContent.trim()) {
        header.append(wrapNode(n, 'products-text'));
      }
    });
  });
  inner.append(header);

  // the source's (hidden) compact indicator controls, kept for parity
  const indicator = wrapNode(null, 'products-indicator');
  indicator.hidden = true;
  ['Prev', 'Next'].forEach((label) => {
    const b = button('products-indicator-arrow', label);
    const icon = document.createElement('span');
    icon.className = 'products-indicator-icon';
    b.append(icon);
    indicator.append(b);
  });
  inner.append(indicator);

  const wrap = wrapNode(null, 'products-track-wrap');
  const arrows = wrapNode(null, 'products-arrows');
  const prev = button('products-arrow', 'Scroll left', ARROW_LEFT);
  const next = button('products-arrow', 'Scroll right', ARROW_RIGHT);
  prev.disabled = true;
  arrows.append(prev, next);
  const track = wrapNode(null, 'products-track');
  const items = itemRows.map(buildItem);
  track.append(...items);
  const bars = wrapNode(null, 'products-bars');
  const barButtons = items.map((it, i) => {
    const b = button('products-bar');
    const label = document.createElement('span');
    label.className = 'sr-only';
    label.textContent = `Go to slide ${i + 1}`;
    b.append(label);
    b.addEventListener('click', () => {
      track.scrollTo({ left: it.offsetLeft - track.offsetLeft, behavior: 'smooth' });
    });
    bars.append(b);
    return b;
  });
  wrap.append(arrows, track, bars);
  inner.append(wrap);
  block.replaceChildren(inner);

  const update = () => {
    const box = track.getBoundingClientRect();
    if (!box.width) return;
    items.forEach((it, i) => {
      const r = it.getBoundingClientRect();
      const inView = r.left >= box.left - 2 && r.right <= box.right + 2;
      barButtons[i].classList.toggle('is-current', inView);
    });
    prev.disabled = track.scrollLeft <= 1;
    next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 1;
  };
  const page = (dir) => track.scrollBy({ left: dir * track.clientWidth, behavior: 'smooth' });
  prev.addEventListener('click', () => page(-1));
  next.addEventListener('click', () => page(1));
  track.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  if (window.ResizeObserver) new ResizeObserver(update).observe(track);
  requestAnimationFrame(update);
}
