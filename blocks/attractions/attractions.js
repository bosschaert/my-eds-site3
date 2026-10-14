/**
 * attractions — "The Attractions" looping card carousel with prev/next arrows
 * (prototype section.sm-attractions; schema stardust/eds-schema/index.json
 * section 2: heading + 6 × DIV.sm-track__slide {1 heading, 1 img, 3 text runs}).
 *
 * Decode tier: reconstructive. Section head (<h2>) is DEFAULT CONTENT before the
 * block and is reabsorbed (EW8); a leading head row (h2, no image) is the
 * defensive fallback. One row per card: <img> | <h3> · excerpt <p> · link <p>
 * ("Read More" — the card's href; the whole card becomes the link, EW6).
 * DA-flattened single-cell content is segmented on the card heading.
 * Behaviour (js/motion.js): Swiper-equivalent loop, autoplay 5500 ms, arrows.
 */

const HEADING = 'h1, h2, h3, h4, h5, h6';
const AUTOPLAY = 5500;
const SPEED = 300;
// [min viewport width, slides per view, gap px] — live Swiper breakpoints
const LAYOUT = [[1224, 4.2, 40], [1024, 3.2, 40], [768, 2.2, 15], [340, 1, 5], [0, 1, 0]];

function slot(className, ...nodes) {
  const w = document.createElement('div');
  w.className = className;
  w.append(...nodes);
  return w;
}

// Flat authored elements of one row (or of the whole block). A <p> that only
// wraps a picture yields the picture. HARNESS-ONLY fallback (EW5): a text-only
// cell is wrapped by MOVING its text nodes into a <p>.
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

// Units: one per row; a single flattened row is split on the card-heading boundary
// (a picture before a heading belongs to the card that heading opens).
function units(rows) {
  const cellsOf = (row) => [...row.children];
  if (rows.length !== 1) return rows.map((row) => collectNodes(cellsOf(row)));
  const nodes = collectNodes(cellsOf(rows[0]));
  const groups = [];
  let pending = [];
  let current = null;
  nodes.forEach((n) => {
    if (n.matches(HEADING)) {
      current = [...pending, n];
      pending = [];
      groups.push(current);
    } else if (n.matches('picture, img') && (!current || current.some((x) => x.matches('picture, img')))) {
      pending.push(n);
    } else if (current) current.push(n);
    else pending.push(n);
  });
  if (!groups.length && pending.length) groups.push(pending);
  return groups;
}

function adoptHead(block, rows) {
  const head = slot('attractions-head');
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

function buildCard(nodes) {
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
  if (media) anchor.append(slot('attractions-card-img', media));
  const body = slot('attractions-card-body');
  if (heading) body.append(slot('attractions-card-title', heading));
  if (rest.length) body.append(slot('sm-rich attractions-card-text', ...rest));
  if (linkP) body.append(slot('attractions-card-cta', slot('sm-more', linkP)));
  anchor.append(body);
  return slot('attractions-slide', slot('attractions-card js-show-on-scroll-img', anchor));
}

function carousel(block, track, rail, slides) {
  const count = slides.length;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const speed = reduced ? 0 : SPEED;
  let real = 0;
  let moved = false;
  let busy = false;
  let timer;
  let lastWidth = 0;

  const layout = () => {
    const [, spv, gap] = LAYOUT.find(([min]) => window.innerWidth >= min);
    const width = (track.clientWidth - gap * (spv - 1)) / spv;
    return { gap, width };
  };

  const paint = () => slides.forEach((s, i) => {
    s.classList.toggle('active', i === real);
  });

  const order = () => {
    const { gap, width } = layout();
    const before = moved ? 1 : 0;
    for (let i = 0; i < count; i += 1) {
      const s = slides[(real - before + i + count) % count];
      s.style.width = `${width}px`;
      s.style.marginRight = `${gap}px`;
      rail.append(s);
    }
    rail.style.transitionDuration = '0ms';
    rail.style.transform = `translate3d(${-(width + gap) * before}px, 0, 0)`;
    paint();
  };

  const go = (dir) => {
    if (busy || count < 2) return;
    busy = true;
    if (!moved && dir < 0) {
      moved = true;
      order();
    }
    const { gap, width } = layout();
    const before = moved ? 1 : 0;
    // force the reset transform to apply before the animated one
    rail.getBoundingClientRect();
    rail.style.transitionDuration = `${speed}ms`;
    rail.style.transform = `translate3d(${-(width + gap) * (before + dir)}px, 0, 0)`;
    window.setTimeout(() => {
      moved = true;
      real = (real + dir + count) % count;
      order();
      busy = false;
    }, speed);
  };

  const schedule = () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      if (!block.isConnected) return;
      go(1);
      schedule();
    }, AUTOPLAY);
  };

  block.querySelector('.attractions-arrow.next').addEventListener('click', () => go(1));
  block.querySelector('.attractions-arrow.prev').addEventListener('click', () => go(-1));
  new ResizeObserver(() => {
    if (track.clientWidth === lastWidth) return;
    lastWidth = track.clientWidth;
    order();
  }).observe(track);
  order();
  schedule();
}

export default function decorate(block) {
  const rows = [...block.children];
  const head = adoptHead(block, rows);
  const slides = units(rows).map(buildCard);

  const rail = slot('attractions-rail', ...slides);
  const track = slot('attractions-track', rail);
  const inner = slot('attractions-inner');
  if (head.childNodes.length) inner.append(head);
  inner.append(track);

  const prev = document.createElement('button');
  prev.type = 'button';
  prev.className = 'attractions-arrow prev';
  prev.setAttribute('aria-label', 'Previous');
  const next = document.createElement('button');
  next.type = 'button';
  next.className = 'attractions-arrow next';
  next.setAttribute('aria-label', 'Next');

  block.classList.add('js-show-on-scroll');
  block.replaceChildren(inner, prev, next);
  carousel(block, track, rail, slides);
}
