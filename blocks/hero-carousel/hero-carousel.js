/**
 * hero-carousel — the home page hero banner: N slides that fade, auto-rotate every 6.5 s once a
 * real user is present (first mousemove / touchend, like the source), pause on hover / focus,
 * with a pause/play button and dot navigation.
 *
 * Authoring rows (one row per slide, 4 cells):
 *   1. variant word (layout of the slide)
 *   2. main image set — 1..3 <img>, widest first: wide (>= 1561px), desktop (768-1560px), mobile
 *   3. secondary image set (feature: product shot, wide then mobile; may be empty)
 *   4. text: heading (the first slide's is the page <h1>, others <h2>; an <em> part is the
 *      smaller second line), paragraph(s), CTA link paragraph (link title = accessible name)
 *
 * @variants cell 1: feature | holiday (default feature)
 * @ew-exempt metadata - the variant cell (cell 1) is never displayed
 */

const VARIANTS = ['feature', 'holiday'];
const INTERVAL = 6500;

function wrapNode(node, className) {
  const w = document.createElement('div');
  w.className = className;
  if (node) w.append(node);
  return w;
}

/** media nodes of a cell, in authored order (EDS pictures or bare images) */
function mediaOf(cell) {
  if (!cell) return [];
  return [...cell.querySelectorAll('picture, img')].filter((n) => !(n.tagName === 'IMG' && n.closest('picture')));
}

/** label the authored image set by breakpoint: widest first */
function imageSet(cell, className) {
  const media = mediaOf(cell);
  if (!media.length) return null;
  const set = wrapNode(null, className);
  const roles = {
    1: ['all'],
    2: ['wide', 'mobile'],
    3: ['wide', 'desktop', 'mobile'],
  }[Math.min(media.length, 3)];
  media.forEach((m, i) => {
    set.append(wrapNode(m, `img-${roles[i] || 'extra'}`));
  });
  return set;
}

/** presentation refinement: wrap a trademark glyph in a span (text content unchanged) */
function markTrademark(heading) {
  const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();
  while (node) {
    const i = node.data.indexOf('™');
    if (i >= 0 && !node.parentElement.classList.contains('tm')) {
      const glyph = node.splitText(i);
      glyph.splitText(1);
      const span = document.createElement('span');
      span.className = 'tm';
      glyph.replaceWith(span);
      span.append(glyph);
      return;
    }
    node = walker.nextNode();
  }
}

function buildSlide(row, index) {
  const cells = [...row.children];
  const word = (cells[0]?.textContent || '').trim().toLowerCase();
  const variant = VARIANTS.includes(word) ? word : 'feature';
  const textCell = cells[3] || cells[cells.length - 1];

  const slide = document.createElement('div');
  slide.className = `hero-slide hero-slide-${variant}`;
  if (index === 0) slide.classList.add('is-active');

  const stage = wrapNode(null, 'slide-stage');
  const main = imageSet(cells[1], 'slide-main-image');
  const second = cells.length > 3 ? imageSet(cells[2], 'slide-second-image') : null;
  if (main) stage.append(main);
  if (second) stage.append(second);

  const content = wrapNode(null, 'slide-content');
  const heading = textCell ? textCell.querySelector('h1, h2, h3, h4, h5, h6') : null;
  const paras = textCell ? [...textCell.querySelectorAll('p')] : [];
  const ctas = paras.filter((p) => p.querySelector('a'));
  const texts = paras.filter((p) => !p.querySelector('a, picture, img'));
  if (heading) {
    markTrademark(heading);
    content.append(wrapNode(heading, 'slide-headline'));
  }
  texts.forEach((p) => content.append(wrapNode(p, 'slide-text')));
  ctas.forEach((p) => {
    const a = p.querySelector('a');
    if (a.title && a.title !== a.textContent) a.setAttribute('aria-label', a.title);
    content.append(wrapNode(p, 'slide-cta'));
  });
  // leftovers: any other authored element stays visible
  if (textCell) {
    [...textCell.children].forEach((n) => {
      if (n.matches('ul, ol, blockquote, pre, table')) content.append(n);
    });
  }
  stage.append(content);
  slide.append(stage);
  return slide;
}

export default function decorate(block) {
  const rows = [...block.children].filter((r) => r.children.length);
  if (!rows.length) return;
  const slides = rows.map((row, i) => buildSlide(row, i));

  const track = document.createElement('div');
  track.className = 'hero-slides';
  track.id = `hero-carousel-${Math.random().toString(36).slice(2, 8)}`;
  track.setAttribute('role', 'region');
  track.setAttribute('aria-label', 'Banner carousel');
  track.append(...slides);

  const controls = document.createElement('div');
  controls.className = 'hero-controls';
  const pause = document.createElement('button');
  pause.type = 'button';
  pause.className = 'hero-pause';
  pause.setAttribute('aria-label', 'Pause automatic slide rotation');
  pause.setAttribute('aria-controls', track.id);
  pause.innerHTML = '<span class="pause-icon" aria-hidden="true">⏸</span><span class="play-icon" aria-hidden="true">▶</span>';
  controls.append(pause);

  const live = document.createElement('span');
  live.className = 'sr-only';
  live.setAttribute('aria-live', 'polite');
  live.textContent = `Showing slide 1 of ${slides.length}`;
  const dots = document.createElement('div');
  dots.className = 'hero-dots';
  dots.setAttribute('role', 'group');
  dots.setAttribute('aria-label', 'Slide navigation');
  const dotButtons = slides.map((s, i) => {
    const d = document.createElement('button');
    d.type = 'button';
    d.className = 'hero-dot';
    d.setAttribute('aria-label', `Go to slide ${i + 1} of ${slides.length}`);
    if (i === 0) d.setAttribute('aria-current', 'true');
    dots.append(d);
    return d;
  });
  track.append(live);
  if (slides.length < 2) {
    controls.hidden = true;
    dots.hidden = true;
  }

  // dots sit below the banner (outside the clipped slide track), as on the source
  block.replaceChildren(controls, track, dots);

  let cur = 0;
  let timer = null;
  let paused = false;
  const go = (k) => {
    cur = (k + slides.length) % slides.length;
    slides.forEach((s, j) => s.classList.toggle('is-active', j === cur));
    dotButtons.forEach((d, j) => {
      if (j === cur) d.setAttribute('aria-current', 'true');
      else d.removeAttribute('aria-current');
    });
    live.textContent = `Showing slide ${cur + 1} of ${slides.length}`;
  };
  const start = () => {
    if (!timer && !paused && slides.length > 1) {
      timer = setInterval(() => go(cur + 1), INTERVAL);
    }
  };
  const stop = () => {
    clearInterval(timer);
    timer = null;
  };
  dotButtons.forEach((d, j) => d.addEventListener('click', () => {
    go(j);
    stop();
    start();
  }));
  pause.addEventListener('click', () => {
    paused = !paused;
    block.classList.toggle('is-paused', paused);
    pause.setAttribute('aria-label', paused ? 'Play automatic slide rotation' : 'Pause automatic slide rotation');
    if (paused) stop();
    else start();
  });
  // source behaviour: autoplay only after real user presence; hover and focus pause it
  ['mousemove', 'touchend'].forEach((ev) => {
    document.addEventListener(ev, start, { once: true, passive: true });
  });
  block.addEventListener('mouseenter', stop);
  block.addEventListener('mouseleave', start);
  block.addEventListener('focusin', stop);
  block.addEventListener('focusout', start);
}
