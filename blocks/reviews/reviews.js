/**
 * reviews — "What Our Visitors Say" testimonial carousel with bullets and
 * auto height (prototype section.sm-reviews; schema stardust/eds-schema/index.json
 * section 3: heading + 7 × DIV.sm-track__slide {2 text runs}).
 *
 * Decode tier: reconstructive. Section head (<h2>) is DEFAULT CONTENT before the
 * block and is reabsorbed (EW8); a leading head row (heading only) is the
 * defensive fallback. One row per review: quote <p> | reviewer name <p>.
 * DA-flattened single-cell content pairs paragraphs in order (quote, name).
 * The four rating stars are presentational (no text). Behaviour (js/motion.js):
 * Swiper-equivalent loop, autoplay 5500 ms, bullets, autoHeight.
 */

const AUTOPLAY = 5500;
const SPEED = 300;
// [min viewport width, slides per view, gap px] — live Swiper breakpoints
const LAYOUT = [[1024, 3, 40], [768, 3, 5], [340, 1, 5], [0, 1, 0]];

function slot(className, ...nodes) {
  const w = document.createElement('div');
  w.className = className;
  w.append(...nodes);
  return w;
}

// Authored text elements of the given cells. HARNESS-ONLY fallback (EW5): a
// text-only cell is wrapped by MOVING its text nodes into a <p>.
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
    out.push(...kids);
  });
  return out;
}

function adoptHead(block, rows) {
  const head = slot('reviews-head');
  const prev = block.parentElement && block.parentElement.previousElementSibling;
  if (prev && prev.classList.contains('default-content-wrapper')) {
    head.append(...prev.childNodes);
    prev.remove();
  }
  while (rows.length && rows[0].querySelector('h1, h2, h3')) {
    head.append(...collectNodes([...rows.shift().children]));
  }
  return head;
}

function units(rows) {
  if (rows.length !== 1) return rows.map((row) => collectNodes([...row.children]));
  const nodes = collectNodes([...rows[0].children]);
  const groups = [];
  for (let i = 0; i < nodes.length; i += 2) groups.push(nodes.slice(i, i + 2));
  return groups;
}

function buildReview(nodes) {
  const [quoteEl, ...rest] = nodes;
  const name = rest.pop();
  const quote = document.createElement('blockquote');
  quote.className = 'reviews-quote';
  if (quoteEl) quote.append(quoteEl, ...rest);
  const stars = document.createElement('ul');
  stars.className = 'reviews-stars';
  for (let i = 0; i < 4; i += 1) stars.append(document.createElement('li'));
  const review = slot('reviews-review', quote, slot('reviews-rating', stars));
  if (name) review.append(slot('reviews-name', name));
  return slot('reviews-slide', review);
}

function carousel(block, track, rail, slides, dots) {
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
    return { spv, gap, width };
  };

  const heightFrom = (start) => {
    const { spv } = layout();
    let max = 0;
    for (let i = 0; i < Math.ceil(spv); i += 1) {
      max = Math.max(max, slides[(start + i) % count].offsetHeight);
    }
    return max;
  };

  const fitHeight = () => {
    if (!count) return;
    rail.style.height = `${heightFrom(real)}px`;
  };

  const paint = () => {
    slides.forEach((s, i) => s.classList.toggle('active', i === real));
    [...dots.children].forEach((d, i) => d.classList.toggle('active', i === real));
  };

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
    fitHeight();
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
    rail.getBoundingClientRect();
    rail.style.transitionDuration = `${speed}ms`;
    rail.style.transform = `translate3d(${-(width + gap) * (before + dir)}px, 0, 0)`;
    rail.style.height = `${heightFrom((real + dir + count) % count)}px`;
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

  slides.forEach((_, i) => {
    const bullet = document.createElement('span');
    bullet.addEventListener('click', () => {
      real = i;
      moved = true;
      order();
    });
    dots.append(bullet);
  });
  new ResizeObserver(() => {
    if (track.clientWidth === lastWidth) return;
    lastWidth = track.clientWidth;
    order();
  }).observe(track);
  window.addEventListener('load', fitHeight);
  if (document.fonts) document.fonts.ready.then(fitHeight);
  order();
  schedule();
}

export default function decorate(block) {
  const rows = [...block.children];
  const head = adoptHead(block, rows);
  const slides = units(rows).map(buildReview);

  const rail = slot('reviews-rail', ...slides);
  const dots = slot('reviews-dots');
  const track = slot('reviews-track', rail, dots);
  const inner = slot('reviews-inner sm-wrap');
  if (head.childNodes.length) inner.append(head);
  inner.append(track);

  block.classList.add('js-show-on-scroll');
  block.replaceChildren(inner);
  carousel(block, track, rail, slides, dots);
}
