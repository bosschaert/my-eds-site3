/**
 * home-products — home Products panel: drag card carousel with hover background swap.
 *
 * Authored rows (classified by content, never by index):
 *   head row   heading + description; a second cell holds the drag-hint word
 *   card rows  (repeat group, any number) an image cell — product image, its hover image,
 *              the panel background shown while the card is hovered (in that order) — and a
 *              text cell: heading, description, and the "Learn more" link whose href the
 *              whole card links to (card-as-link, EW6: the inner anchor is unwrapped)
 * Behaviour (source main.js productSwiper + productBg): pointer drag with Swiper's snap grid,
 * 1200 ms snap; >= 1240 px hovering a card sets body.type-white, .card-hover on every card
 * and fades in that card's background.
 */

const DRAG_SPEED = 1200;

function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

/** EW4: presentational clones carry no instrumentation */
function stripInstrumentation(node) {
  [node, ...node.querySelectorAll('*')].forEach((n) => {
    [...n.attributes].forEach((a) => {
      if (a.name.startsWith('data-')) n.removeAttribute(a.name);
    });
  });
  return node;
}

function btnMore(className) {
  return { span: el('span', className), arrow: el('span', 'arrow') };
}

function buildCard(row) {
  const cells = [...row.children];
  const pics = [...row.querySelectorAll('picture, img')]
    .filter((p) => !(p.tagName === 'IMG' && p.closest('picture')))
    .map((p) => p.closest('p') || p);
  const textCell = cells.find((c) => c.querySelector('h1, h2, h3, h4')) || cells[cells.length - 1];
  const link = textCell.querySelector('a[href]');
  const linkP = link ? link.closest('p') : null;

  const li = el('li', 'swiper-slide');
  const card = el('a', 'card', { href: link ? link.getAttribute('href') : '#' });
  const textArea = el('div', 'text-area');
  const heading = textCell.querySelector('h1, h2, h3, h4');
  if (heading) {
    const t = el('div', 'card-title');
    t.append(heading);
    textArea.append(t);
  }
  [...textCell.querySelectorAll('p')].filter((p) => p !== linkP).forEach((p) => {
    const t = el('div', 'card-text');
    t.append(p);
    textArea.append(t);
  });

  // normal state: the authored "Learn more" (mobile) + product image
  const normal = el('div', 'bot-area normal-type');
  const nb = btnMore('btn-more only-mb');
  if (link) {
    // EW6: href read above; the anchor is unwrapped, its text moved into the card's CTA paint
    const label = el('span', 'text');
    label.append(linkP);
    link.replaceWith(...link.childNodes);
    nb.span.append(label);
  }
  nb.span.append(nb.arrow);
  const normalImg = el('div', 'product-img');
  if (pics[0]) normalImg.append(pics[0]);
  normal.append(nb.span, normalImg);

  // hover state (>= 1240): a presentational clone of the CTA + the hover image
  const hover = el('div', 'bot-area hover-type');
  const hb = btnMore('btn-more');
  const clone = nb.span.querySelector('.text');
  if (clone) hb.span.append(stripInstrumentation(clone.cloneNode(true)));
  hb.span.append(hb.arrow);
  const hoverImg = el('div', 'product-img');
  if (pics[1]) hoverImg.append(pics[1]);
  hover.append(hb.span, hoverImg);

  card.append(textArea, hover, normal);
  li.append(card);
  return { li, bg: pics[2] || null };
}

function snaps(pc, track, cards) {
  const m = Math.max(0, track.scrollWidth - pc.clientWidth);
  const s = cards.map((c) => c.offsetLeft - cards[0].offsetLeft).filter((p) => p < m - 1);
  s.push(m);
  return s;
}

function startCarousel(pc, track, cards, bgs) {
  let index = 0;
  let offset = 0;
  const setX = (x, ms) => {
    track.style.transitionDuration = `${ms}ms`;
    track.style.transform = x ? `translate3d(${-x}px, 0, 0)` : '';
    offset = x;
  };
  const snap = (i) => {
    const s = snaps(pc, track, cards);
    index = Math.max(0, Math.min(s.length - 1, i));
    setX(s[index], DRAG_SPEED);
  };
  let drag = null;
  let moved = false;
  pc.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    drag = {
      x: e.clientX, y: e.clientY, start: offset, id: e.pointerId, axis: null,
    };
    moved = false;
  });
  window.addEventListener('pointermove', (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.x;
    const dy = e.clientY - drag.y;
    if (!drag.axis && Math.abs(dx) + Math.abs(dy) > 5) drag.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
    if (drag.axis !== 'x') return;
    moved = true;
    pc.classList.add('is-dragging');
    const s = snaps(pc, track, cards);
    const last = s[s.length - 1];
    let x = drag.start - dx;
    if (x < 0) x /= 3;
    else if (x > last) x = last + (x - last) / 3; // resistance at the edges
    setX(x, 0);
  });
  const end = (e) => {
    if (!drag || (e && e.pointerId !== drag.id)) return;
    pc.classList.remove('is-dragging');
    if (moved) {
      const dx = offset - drag.start;
      const pos = snaps(pc, track, cards);
      let i;
      if (Math.abs(dx) > 50) i = dx > 0 ? index + 1 : index - 1;
      else {
        const dist = (n) => Math.abs(pos[n] - offset);
        i = pos.reduce((b, p, n) => (dist(n) < dist(b) ? n : b), 0);
      }
      snap(i);
    }
    drag = null;
  };
  window.addEventListener('pointerup', end);
  window.addEventListener('pointercancel', end);
  pc.addEventListener('click', (e) => {
    if (moved) {
      e.preventDefault();
      moved = false;
    }
  }, true);
  pc.addEventListener('dragstart', (e) => e.preventDefault());

  // productBg(): hover → body.type-white, every card .card-hover, the matching background
  cards.forEach((card, n) => card.addEventListener('mouseenter', () => {
    document.body.classList.add('type-white');
    cards.forEach((c) => c.classList.add('card-hover'));
    bgs.forEach((b, k) => b.classList.toggle('active', k === n));
  }));
  pc.addEventListener('mouseleave', () => {
    document.body.classList.remove('type-white');
    cards.forEach((c) => c.classList.remove('card-hover'));
    bgs.forEach((b) => b.classList.remove('active'));
  });
  const desktop = window.matchMedia('(min-width: 1240px)');
  desktop.addEventListener('change', () => snap(0));
}

/**
 * @param {Element} block
 */
export default function decorate(block) {
  if (block.querySelector(':scope > .section-cont')) return; // re-entrant (EW9)
  const rows = [...block.children];
  const isCard = (row) => row.querySelector('picture, img') && row.querySelector('a[href]');
  const headRow = rows.find((row) => !isCard(row) && row.querySelector('h1, h2, h3'));
  const cardRows = rows.filter(isCard);

  const cont = el('div', 'section-cont inner');
  const titleWrap = el('div', 'main-title-wrap row-1');
  if (headRow) {
    const heading = headRow.querySelector('h1, h2, h3');
    const headCell = [...headRow.children].find((c) => c.contains(heading));
    const title = el('div', 'main-title');
    title.append(heading);
    titleWrap.append(title);
    [...headRow.children].forEach((cell) => {
      const ps = [...cell.querySelectorAll('p')];
      if (!ps.length) return;
      if (cell === headCell) {
        ps.forEach((p) => {
          const d = el('div', 'main-title-desc');
          d.append(p);
          titleWrap.append(d);
        });
        return;
      }
      // the drag hint (aria-hidden, as on the source)
      const drag = el('div', 'drag', { 'aria-hidden': 'true' });
      const text = el('div', 'text');
      text.append(...ps);
      drag.append(el('span', 'arrow prev'), text, el('span', 'arrow next'));
      titleWrap.append(drag);
    });
  }

  const pc = el('div', 'product-card-swiper');
  const track = el('ul', 'swiper-wrapper');
  pc.append(track);
  const bgWrap = el('div', 'bg-wrap', { 'aria-hidden': 'true' });
  const cards = [];
  const bgs = [];
  cardRows.forEach((row) => {
    const { li, bg } = buildCard(row);
    track.append(li);
    cards.push(li);
    const layer = el('div', 'bg');
    if (bg) layer.append(bg);
    bgWrap.append(layer);
    bgs.push(layer);
  });
  cont.append(titleWrap, pc);

  block.textContent = '';
  block.append(cont, bgWrap);
  startCarousel(pc, track, cards, bgs);
}
