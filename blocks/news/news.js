/**
 * news — "What's New" band: yellow-ruled heading, a 3-up story rail (4 stories, dots + arrows,
 * no autoplay — the source's slick config rebuilt natively) and a "See All" pill.
 *
 * Schema: stardust/eds-schema/index.json → sections[2] (heading; repeat LI.news__slide ×4,
 * each 1 img + 1 text run; cta "See All").
 * Decode tier: reconstructive (authors add/remove stories).
 *
 * Authoring (container shape, one row per story — a flattened single cell also decodes):
 *   - <h2> section heading
 *   - per story: <picture> | <p><a href>story title</a></p>  (plain link → whole card links)
 *   - <p><strong><a href>See All</a></strong></p>  (pill CTA)
 * Story boundary = each plain (non-button) link paragraph; the picture seen before it (same
 * row or preceding sibling) is that story's image.
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
const isButton = (n) => !!n.querySelector('a.button, strong > a, em > a');

function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

function buildCard(link, picture) {
  const card = el('a', 'news-card', { href: link.getAttribute('href') });
  const img = el('span', 'news-card-img');
  if (picture) img.append(picture);
  card.append(img);
  const title = el('div', 'news-card-title');
  const par = link.closest('p') || link;
  title.append(par);
  // EW6: card-as-link — unwrap the authored inner anchor, its paragraph stays editable
  if (par !== link) link.replaceWith(...link.childNodes);
  card.append(title);
  const li = el('li', 'news-slide');
  li.append(card);
  return li;
}

function initRail(rail, track, dots) {
  const slides = [...track.children];
  const per = Number(rail.dataset.perView) || 3;
  let index = 0;
  const go = (i) => {
    index = (i + slides.length) % slides.length;
    const shift = Math.min(index, Math.max(0, slides.length - per));
    track.style.transform = `translateX(${-shift * (100 / per)}%)`;
    [...dots.children].forEach((d, k) => d.classList.toggle('is-active', k === index));
  };
  slides.forEach((_, i) => {
    const li = el('li');
    const btn = el('button', '', {
      type: 'button',
      role: 'tab',
      'aria-label': `${i + 1} of ${slides.length - per + 1}`,
    });
    btn.textContent = String(i + 1);
    btn.addEventListener('click', () => go(i));
    li.append(btn);
    dots.append(li);
  });
  rail.querySelector('.news-arrow-prev').addEventListener('click', () => go(index - 1));
  rail.querySelector('.news-arrow-next').addEventListener('click', () => go(index + 1));
  go(0);
}

export default function decorate(block) {
  const nodes = collectNodes(block);
  let heading = null;
  const more = [];
  const leftovers = [];
  const cards = [];
  let pending = null;

  nodes.forEach((n) => {
    if (!heading && /^H[1-3]$/.test(n.tagName)) {
      heading = n;
    } else if (media(n) && !n.querySelector('a')) {
      if (pending) leftovers.push(pending);
      pending = media(n).closest('picture') || media(n);
    } else if (n.querySelector('a[href]') && isButton(n)) {
      more.push(n);
    } else if (n.matches('p') && n.querySelector('a[href]')) {
      cards.push(buildCard(n.querySelector('a[href]'), pending));
      pending = null;
    } else {
      leftovers.push(n);
    }
  });
  if (pending) leftovers.push(pending);

  const title = el('div', 'news-title');
  if (heading) title.append(heading);

  const container = el('div', 'news-container');
  const rail = el('div', 'news-rail', { 'data-per-view': '3' });
  const prev = el('button', 'news-arrow news-arrow-prev', { type: 'button', 'aria-label': 'Previous' });
  prev.textContent = 'Previous';
  const next = el('button', 'news-arrow news-arrow-next', { type: 'button', 'aria-label': 'Next' });
  next.textContent = 'Next';
  const viewport = el('div', 'news-viewport');
  const track = el('ul', 'news-track');
  track.append(...cards);
  viewport.append(track);
  const dots = el('ul', 'news-dots', { role: 'tablist' });
  rail.append(prev, viewport, next, dots);
  container.append(rail);

  if (more.length || leftovers.length) {
    const moreWrap = el('div', 'news-more');
    moreWrap.append(...leftovers, ...more);
    container.append(moreWrap);
  }

  block.replaceChildren(title, container);
  if (cards.length) initRail(rail, track, dots);
}
