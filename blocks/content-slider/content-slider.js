/**
 * content-slider — the source c-content-slider (Glide: perView 1 / 2 / 3 / 4 below 767 / 1023 /
 * 1279 / above, gap 32px, arrows step one slide and wrap, pointer swipe, is-active slide).
 *
 * Content: one row per slide, in order.
 *   teaser slide — an image cell + a text cell (heading, text, link): rendered as a teaser card
 *                  (the teaser block is loaded on it, same DOM / CSS as the teaser grid);
 *   other slide  — any content (rich text, headings) kept as authored;
 *   empty row    — an empty slide (the source keeps empty slides as gaps in the track).
 * captureState: the first slide is active on load.
 * Reconstructive decode: authored cells are MOVED into the slides (EW1), re-entrant (EW9).
 */
// icons via the foundation helper; dynamic so the block also installs where /scripts/ cannot be
// resolved (local structural harness) — there the bare icon box is used
async function iconFactory() {
  try {
    const { uIcon } = await import('../../scripts/utils.js');
    return uIcon;
  } catch (e) {
    return (name, classes = '', tag = 'i') => {
      const box = document.createElement(tag);
      box.className = `u-icon ${classes}`.trim();
      const span = document.createElement('span');
      span.className = `icon icon-${name}`;
      box.append(span);
      return box;
    };
  }
}

const GAP = 32;
const perViewFor = (w) => {
  if (w < 767) return 1;
  if (w < 1023) return 2;
  if (w < 1279) return 3;
  return 4;
};

function el(tag, className) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

function isTeaserRow(row) {
  const cells = [...row.children];
  return cells.length >= 2 && !!row.querySelector('picture, img') && !!row.querySelector('a[href]');
}

// media variant (cluster-hub content-slider-media.mjs): a slide row = the cells of a textmedia
// CE ([image, text] or [text, image] = image below) rendered through the text-media block
function mediaSlide(row, slide, ce) {
  const cells = [...row.children].filter((c) => c.textContent.trim() || c.querySelector('img'));
  row.remove();
  if (!cells.length) return { slide };
  const below = !cells[0].querySelector('img, picture');
  const media = el('div', `text-media${below ? ' image-below' : ''} block`);
  media.dataset.blockName = 'text-media';
  media.dataset.blockStatus = 'initialized';
  cells.forEach((cell) => {
    const r = el('div');
    r.append(cell);
    media.append(r);
  });
  ce.append(media);
  slide.append(ce);
  return { slide, teaser: media };
}

function buildSlide(row, media) {
  const slide = el('li', 'content-slider-slide');
  const ce = el('div', 'content-slider-item');
  if (media) return mediaSlide(row, slide, ce);
  if (isTeaserRow(row)) {
    const teaser = el('div', 'teaser block');
    teaser.dataset.blockName = 'teaser';
    teaser.dataset.blockStatus = 'initialized';
    teaser.append(row);
    ce.append(teaser);
    slide.append(ce);
    return { slide, teaser };
  }
  const body = el('div', 'content-slider-text s-richtext');
  [...row.children].forEach((cell) => body.append(...cell.childNodes));
  row.remove();
  if (body.textContent.trim() || body.querySelector('img, picture')) {
    ce.append(body);
    slide.append(ce);
  }
  return { slide };
}

export default async function decorate(block) {
  // dynamics row 4: image-linked media open in the foundation lightbox (source data-lightbox)
  block.querySelectorAll('a[href]').forEach((a) => {
    if (/\.(jpe?g|png|gif|webp|avif)(\?|$)/i.test(a.getAttribute('href')) && a.querySelector('img, picture')) a.dataset.lightbox = 'content-slider';
  });
  if (block.querySelector('.content-slider-track')) return;
  const uIcon = await iconFactory();
  const media = block.classList.contains('media');
  const built = [...block.children].map((row) => buildSlide(row, media));
  const slides = built.map((b) => b.slide);

  const track = el('div', 'content-slider-track');
  const list = el('ul', 'content-slider-slides');
  list.append(...slides);
  track.append(list);

  const controls = el('div', 'content-slider-controls');
  const prev = uIcon('chevron-right', 'content-slider-arrow is-left', 'button');
  prev.type = 'button';
  prev.setAttribute('aria-label', 'Show previous item');
  const next = uIcon('chevron-right', 'content-slider-arrow is-right', 'button');
  next.type = 'button';
  next.setAttribute('aria-label', 'Show next item');
  controls.append(prev, next);
  block.replaceChildren(track, controls);

  const teasers = built.filter((b) => b.teaser).map((b) => b.teaser);
  if (teasers.length) {
    try {
      const { loadBlock } = await import('../../scripts/aem.js');
      await Promise.all(teasers.map((t) => loadBlock(t)));
    } catch (e) {
      // structural harness without /scripts/: teaser slides stay as authored rows
    }
  }

  let index = 0;
  let slideW = 0;
  const move = (animate = true) => {
    list.style.transitionDuration = animate ? '' : '0ms';
    list.style.transform = `translate3d(${-index * (slideW + GAP)}px, 0px, 0px)`;
    slides.forEach((s, i) => s.classList.toggle('is-active', i === index));
  };
  const layout = () => {
    const pv = perViewFor(window.innerWidth);
    slideW = track.clientWidth / pv - (GAP * (pv - 1)) / pv;
    list.style.width = `${(slideW + GAP) * slides.length}px`;
    slides.forEach((s, i) => {
      s.style.width = `${slideW}px`;
      s.style.marginLeft = i === 0 ? '' : `${GAP / 2}px`;
      s.style.marginRight = i === slides.length - 1 ? '' : `${GAP / 2}px`;
    });
    move(false);
  };
  const go = (dir) => {
    const last = slides.length - 1;
    if (dir > 0) index = index >= last ? 0 : index + 1;
    else index = index <= 0 ? last : index - 1;
    move();
  };
  prev.addEventListener('click', () => go(-1));
  next.addEventListener('click', () => go(1));

  let startX = null;
  track.addEventListener('pointerdown', (e) => { startX = e.clientX; });
  window.addEventListener('pointerup', (e) => {
    if (startX === null) return;
    const dx = e.clientX - startX;
    startX = null;
    if (Math.abs(dx) > 80) go(dx < 0 ? 1 : -1);
  });

  // off-track slide images never intersect themselves: load them all when the slider nears view
  const eager = () => list.querySelectorAll('img[loading="lazy"]').forEach((img) => {
    img.loading = 'eager';
  });
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        io.disconnect();
        eager();
      }
    }, { rootMargin: '300px 0px' });
    io.observe(block);
  } else eager();

  // sections are hidden until loaded: lay out whenever the track gets / changes its width
  let lastW = -1;
  const relayout = () => {
    if (!track.clientWidth || track.clientWidth === lastW) return;
    lastW = track.clientWidth;
    layout();
  };
  if ('ResizeObserver' in window) new ResizeObserver(relayout).observe(track);
  relayout();
  let t;
  window.addEventListener('resize', () => {
    clearTimeout(t);
    t = setTimeout(layout, 100);
  });
}
