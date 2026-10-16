/**
 * hero-stage-slider — the source stage hero c-heroteaser-fixed (slider with dots / arrows, or a
 * single fixed slide). Shared by the hub (en-investors) and home (en) templates.
 *
 * Content: one row per slide — [image cell, text cell].
 *   image cell: 1–3 pictures = art-directed renditions, source order (3: >= 1279 | 767–1278 |
 *               < 767; 2: >= 767 | < 767; 1: every width).
 *   text cell:  1st paragraph = title, 2nd = description (a paragraph wholly in <em> gets the
 *               white highlight box, source u-padded-text), link paragraphs = CTA buttons.
 * Variant: text-white (white slide text; black default).
 * Behaviour (live Glide): autoplay 8s, pause on hover, 1000ms track slide, texts re-enter 300ms
 * after the slide, arrows >= 1025, dots; a single slide shows neither.
 * Template-slotted decode: authored pictures / text / links are MOVED (EW1); re-entrant (EW9).
 */
async function iconFactory() {
  try {
    const { createIcon } = await import('../../scripts/utils.js');
    return createIcon;
  } catch (e) {
    return (name) => {
      const span = document.createElement('span');
      span.className = `icon icon-${name}`;
      return span;
    };
  }
}

const RANGES = {
  1: [['lg', 'md', 'sm']],
  2: [['lg', 'md'], ['sm']],
  3: [['lg'], ['md'], ['sm']],
};

function el(tag, className, ...kids) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  node.append(...kids);
  return node;
}

function textLine(p, cls) {
  const line = el('div', cls);
  const em = p.querySelector(':scope > em');
  if (em && em.textContent.trim() === p.textContent.trim()) {
    line.append(el('span', 'u-padded-text', ...em.childNodes));
  } else {
    line.append(...p.childNodes);
  }
  return line;
}

function buildSlide(row, createIcon, withContentRow) {
  const cells = [...row.children];
  const pictures = [...row.querySelectorAll('picture, img:not(picture img)')];
  const textCell = cells.find((c) => !c.querySelector('picture, img') && c.textContent.trim())
    || (cells.length > 1 ? cells[cells.length - 1] : null);
  const slide = el('div', 'hero-stage-slider-slide');

  const media = el('div', 'hero-stage-slider-media');
  const ranges = RANGES[Math.min(pictures.length, 3)] || [];
  pictures.slice(0, 3).forEach((pic, i) => {
    const slot = el('div', 'hero-stage-slider-rendition');
    (ranges[i] || []).forEach((r) => slot.classList.add(`is-${r}`));
    slot.append(pic);
    media.append(slot);
  });
  slide.append(media);

  if (textCell && textCell.textContent.trim()) {
    const text = el('div', 'hero-stage-slider-text');
    let paras = [...textCell.querySelectorAll('p, h1, h2, h3, h4, h5, h6')]
      .filter((p) => !p.querySelector('a[href]') && p.textContent.trim());
    // a single-paragraph cell arrives unwrapped (text directly in the cell)
    if (!paras.length && !textCell.querySelector('a[href]')) paras = [textCell];
    const links = [...textCell.querySelectorAll('a[href]')];
    if (paras[0]) text.append(textLine(paras[0], 'hero-stage-slider-title u-text-h1 mb-0 is-active'));
    if (paras[1]) text.append(textLine(paras[1], 'hero-stage-slider-description mt-2 is-active'));
    if (links.length) {
      // live: the CTA box only gets .is-active after the first slide change (hidden until then)
      const box = el('div', 'hero-stage-slider-links mt-2');
      links.forEach((a) => {
        const label = el('span', '', ...a.childNodes);
        a.className = 'hero-stage-slider-link c-button';
        a.closest('p')?.classList.remove('button-wrapper');
        // AdmiralCloud clip (source span.c-button, play icon) → play; others chevron
        const isVideo = /^https?:\/\/video\.continental\.com\//.test(a.href);
        const icon = el('i', 'u-icon mr-2', createIcon(isVideo ? 'play' : 'chevron-right'));
        a.replaceChildren(icon, label);
        box.append(a);
      });
      text.append(box);
    }
    const col = el('div', 'col', text);
    const container = el('div', 'container ml-0 mr-0', el('div', 'row', col));
    slide.append(el('div', 'hero-stage-slider-content-container', el('div', 'hero-stage-slider-content', container)));
  } else if (withContentRow) {
    // variant content-row (cluster-hub hero-content-row.mjs, ro-ro-cariera): an image-only slide
    // whose source still renders the empty content container below the image under 1023px
    // (padding + empty CTA row + margin = 74px)
    const text = el('div', 'hero-stage-slider-text', el('div', 'hero-stage-slider-links mt-2'));
    const container = el('div', 'container ml-0 mr-0', el('div', 'row', el('div', 'col', text)));
    slide.append(el('div', 'hero-stage-slider-content-container is-empty', el('div', 'hero-stage-slider-content', container)));
  }
  return slide;
}

function arrowButton(dir, label, createIcon) {
  const b = el('button', `hero-stage-slider-arrow is-${dir}`, createIcon('chevron-right'));
  b.type = 'button';
  b.setAttribute('aria-label', label);
  return b;
}

function bindSlider(block, track, slides, dots, arrows) {
  const texts = block.querySelectorAll('.hero-stage-slider-title, .hero-stage-slider-description, .hero-stage-slider-links');
  let index = 0;
  track.style.width = `${slides.length * 100}%`;
  slides.forEach((s) => { s.style.width = `${100 / slides.length}%`; });
  const place = (animate) => {
    track.style.transition = animate ? '' : 'none';
    track.style.transform = `translate3d(${(-index * 100) / slides.length}%, 0, 0)`;
    slides.forEach((s, i) => s.classList.toggle('is-active', i === index));
    dots.forEach((d, i) => d.classList.toggle('is-active', i === index));
  };
  const go = (to) => {
    let next;
    if (to === '>') next = (index + 1) % slides.length;
    else if (to === '<') next = (index - 1 + slides.length) % slides.length;
    else next = Number(to);
    if (next === index) return;
    texts.forEach((t) => t.classList.remove('is-active'));
    index = next;
    place(true);
    setTimeout(() => texts.forEach((t) => t.classList.add('is-active')), 1000);
  };
  place(false);
  let timer = null;
  let hovered = false;
  const restart = () => {
    clearInterval(timer);
    timer = setInterval(() => { if (!hovered) go('>'); }, 8000);
  };
  const [prev, next] = arrows.querySelectorAll('button');
  prev.addEventListener('click', () => { go('<'); restart(); });
  next.addEventListener('click', () => { go('>'); restart(); });
  dots.forEach((d, i) => d.addEventListener('click', () => { go(i); restart(); }));
  block.addEventListener('mouseenter', () => { hovered = true; });
  block.addEventListener('mouseleave', () => { hovered = false; });
  // swipe (Glide swipeable)
  let startX = null;
  track.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', (e) => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    startX = null;
    if (Math.abs(dx) > 80) { go(dx < 0 ? '>' : '<'); restart(); }
  });
  restart();
  const arrowsBySize = () => {
    const w = window.innerWidth;
    let cls = null;
    if (w > 1660) cls = 'arrows-lg';
    else if (w > 1024) cls = 'arrows-md';
    arrows.classList.remove('arrows-md', 'arrows-lg');
    arrows.style.display = cls ? 'block' : 'none';
    if (cls) arrows.classList.add(cls);
  };
  arrowsBySize();
  window.addEventListener('resize', arrowsBySize);
}

export default async function decorate(block) {
  if (block.querySelector('.hero-stage-slider-track')) return;
  const createIcon = await iconFactory();
  const slides = [...block.children].map((row) => {
    const slide = (row.querySelector('picture, img') || row.textContent.trim())
      ? buildSlide(row, createIcon, block.classList.contains('content-row')) : null;
    row.remove();
    return slide;
  }).filter(Boolean);
  if (!slides.length) return;

  const strip = el('div', 'hero-stage-slider-slides', ...slides);
  block.append(el('div', 'hero-stage-slider-track', strip));
  if (slides.length < 2) {
    slides[0].classList.add('is-active');
    // single stage (no slide change ever happens): the CTA box shows at once, as on the source
    // single c-heroteaser-fixed (cluster-content: corporate-governance, lieferanten, …)
    slides[0].querySelector('.hero-stage-slider-links')?.classList.add('is-active');
    return;
  }
  block.classList.add('is-slider');
  const arrows = el(
    'div',
    'hero-stage-slider-arrows arrows-md',
    arrowButton('prev', 'Show previous item', createIcon),
    arrowButton('next', 'Show next item', createIcon),
  );
  const dots = slides.map(() => el('div', 'hero-stage-slider-dot'));
  block.append(arrows, el('div', 'hero-stage-slider-dots', ...dots));
  bindSlider(block, strip, slides, dots, arrows);
}
