/**
 * carousel — the home hero fade slideshow (source: `.p-front-fv` / Splide fade).
 *
 * Authoring rows (one per slide, collection pattern):
 *   cell 1: the slide image (<picture> on the pipeline, bare <img> off it), optionally
 *           followed by the mobile art-directed image (source `<source media="(max-width:
 *           767px)">`); one image = shown at every width
 *   cell 2: <h2>ja title</h2> + <p><a href="/works/…">VIEW THIS WORK</a></p>
 *
 * decorate() builds the source's Splide shell (track / list / slides, one pagination
 * dot per slide, the page-info with the 01/09 counter + progress ring, and one title
 * slot per slide) as EMPTY containers and MOVES the authored picture, heading and
 * CTA paragraph in by role (EW1). The counter digits, the ring and the dots are
 * block-generated chrome, not authored text.
 *
 * Behaviours (the only ones observed live, stardust/prototypes/js/index.js):
 * fade autoplay INTERVAL 7000 / SPEED 4000 with rewind, dot click, counter,
 * ring stroke-dashoffset animation, per-slide title/link, zoomOut on the active
 * image from the first change on (R-02), pause while scrolled out of view (R-01).
 */

const INTERVAL = 7000;
const SPEED = 4000;
const TICK = 16;
const RING_R = 25;

function el(tag, className) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

function pad(n) {
  return n < 10 ? `0${n}` : String(n);
}

function svgEl(tag, attrs) {
  const node = document.createElementNS('http://www.w3.org/2000/svg', tag);
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

/** the counter + progress ring (source `.circular-progress`), generated chrome */
function buildPageNum(total) {
  const pageNum = el('div', 'splide-page-num');
  const progress = el('div', 'circular-progress');
  const ring = svgEl('svg', { class: 'progress-ring', viewBox: '0 0 54 54' });
  ring.append(
    svgEl('circle', {
      class: 'progress-ring-circle-bg', cx: 27, cy: 27, r: RING_R,
    }),
    svgEl('circle', {
      class: 'progress-ring-circle', cx: 27, cy: 27, r: RING_R,
    }),
  );
  const content = el('div', 'progress-content');
  const current = el('span', 'current');
  current.textContent = pad(1);
  const totalEl = el('span', 'total');
  totalEl.textContent = pad(total);
  content.append(current, el('span', 'separator'), totalEl);
  progress.append(ring, content);
  pageNum.append(progress);
  return { pageNum, current, ring: ring.querySelector('.progress-ring-circle') };
}

/**
 * Reads one authored row into its roles. Media matches `picture, img` (#72); the
 * heading and the link-bearing paragraph are found by shape, never by cell index.
 * @param {Element} row
 */
function readRow(row) {
  const pictures = [...row.querySelectorAll('picture')];
  const media = pictures.length ? pictures
    : [...row.querySelectorAll('img')].filter((img) => !img.closest('a'));
  const heading = row.querySelector('h1, h2, h3, h4, h5, h6');
  const cta = [...row.querySelectorAll('p')].find((p) => p.querySelector('a'));
  const rest = [...row.querySelectorAll(':scope > div > *')]
    .filter((n) => n !== heading && n !== cta && !media.some((m) => n === m || n.contains(m)));
  return {
    media, heading, cta, rest,
  };
}

export default function decorate(block) {
  const rows = [...block.children].filter((row) => row.querySelector('picture, img, h2, a'));
  if (!rows.length) return;

  const splide = el('div', 'splide splide-fade is-active is-initialized');
  const track = el('div', 'splide-track splide-track-fade');
  const list = el('ul', 'splide-list');
  const pageInfo = el('div', 'splide-page-info u-ds-lg');
  const titles = el('div', 'splide-slide-titles');
  const pagination = el('ul', 'splide-pagination');
  pagination.setAttribute('role', 'tablist');

  const slides = [];
  const dots = [];
  const titleSlots = [];
  rows.forEach((row, i) => {
    const {
      media, heading, cta, rest,
    } = readRow(row);
    const slide = el('li', 'splide-slide');
    slide.setAttribute('role', 'tabpanel');
    // media[0] = every-width (or desktop) image, media[1] = mobile image (≤ 767px)
    media.slice(0, 2).forEach((m, k) => {
      const wrap = el('div', k === 0 && media.length > 1 ? 'slide-media slide-media-pc'
        : `slide-media${k === 1 ? ' slide-media-sp' : ''}`);
      wrap.append(m);
      slide.append(wrap);
    });
    list.append(slide);
    slides.push(slide);

    const slot = el('div', 'slide-title');
    if (heading) slot.append(heading);
    if (cta) slot.append(cta);
    // leftovers pass: any authored element no slot consumed stays visible
    rest.forEach((n) => slot.append(n));
    titles.append(slot);
    titleSlots.push(slot);

    const li = el('li');
    const dot = el('button', 'splide-pagination-page');
    dot.type = 'button';
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    li.append(dot);
    pagination.append(li);
    dots.push(dot);
  });

  const { pageNum, current, ring } = buildPageNum(slides.length);
  pageInfo.append(pageNum, titles);
  track.append(list);
  splide.append(track, pageInfo, pagination);
  block.replaceChildren(splide);

  // ── behaviour ──
  const circ = 2 * Math.PI * RING_R;
  let index = 0;
  let timer = null;
  let ringTimer = null;
  let ringStart = 0;
  let inView = true;
  slides.forEach((s) => { s.style.transition = `opacity ${SPEED}ms ease`; });

  function startRing() {
    if (ringTimer) clearInterval(ringTimer);
    ringStart = Date.now();
    ring.style.strokeDasharray = circ;
    ring.style.strokeDashoffset = circ;
    ringTimer = setInterval(() => {
      const p = Math.min(100, ((Date.now() - ringStart) / INTERVAL) * 100);
      ring.style.strokeDashoffset = circ - (p / 100) * circ;
      if (p >= 100) clearInterval(ringTimer);
    }, TICK);
  }

  function zoom(img) {
    if (!img) return;
    img.style.transition = 'none';
    img.classList.remove('is-zooming');
    // eslint-disable-next-line no-void
    void img.offsetWidth;
    img.classList.add('is-zooming');
    requestAnimationFrame(() => { img.style.transition = ''; });
  }

  function render(i) {
    const n = slides.length;
    slides.forEach((s, k) => {
      s.classList.toggle('is-active', k === i);
      s.classList.toggle('is-visible', k === i);
      s.classList.toggle('is-prev', k === (i + n - 1) % n);
      s.classList.toggle('is-next', k === (i + 1) % n);
      if (k === i) s.removeAttribute('inert'); else s.setAttribute('inert', '');
    });
    dots.forEach((d, k) => {
      d.classList.toggle('is-active', k === i);
      d.setAttribute('aria-selected', k === i ? 'true' : 'false');
    });
    titleSlots.forEach((t, k) => { t.classList.toggle('is-active', k === i); });
    current.textContent = pad(i + 1);
  }

  function schedule() {
    if (timer) clearTimeout(timer);
    if (!inView) return;
    // eslint-disable-next-line no-use-before-define
    timer = setTimeout(() => { go(index + 1); }, INTERVAL);
  }

  function go(i) {
    index = (i + slides.length) % slides.length;
    render(index);
    zoom(slides[index].querySelector('img'));
    startRing();
    schedule();
  }

  dots.forEach((d, k) => { d.addEventListener('click', () => { go(k); }); });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      inView = entries[0].isIntersecting;
      splide.classList.toggle('is-paused', !inView);
      if (inView) schedule(); else if (timer) clearTimeout(timer);
    }, { threshold: 0.2 }).observe(splide);
  }

  // R-02: slide 1 mounts without a zoom replay; zoomOut runs from the first change on.
  render(0);
  startRing();
  schedule();
}
