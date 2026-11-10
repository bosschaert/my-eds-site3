/**
 * home-visual — home hero: full-viewport video fade carousel (template-slotted).
 *
 * Authored rows (classified by content, never by index):
 *   text row    the heading (title) + paragraph (lead); a second cell holds the scroll-down image
 *   slide rows  a label paragraph (01, 02, …) + a link to the slide's video file (code origin)
 * Authored nodes are MOVED into the source DOM (mvisual swiper, numbered pagination with
 * progress bars, textbox, scroll-down cue). Behaviour (source main.js, Swiper fade):
 * autoplay advances every 3 s with a 300 ms fade and loops; the active slide's video restarts
 * at 0 and plays muted inline; the active bullet's bar fills over its per-slide duration.
 *
 * @ew-exempt video source links (slide rows) — config consumed as the <video> src, kept hidden.
 */

const DELAY = 3000; // Swiper autoplay default (live never sets a per-slide delay)
const VIDEO = /\.(mp4|webm|m4v|mov)([?#]|$)/i;

function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

function play(video) {
  if (!video) return;
  const p = video.play();
  if (p && p.catch) p.catch(() => {});
}

function startCarousel(block, slides, items) {
  let active = 0;
  let timer = null;
  let playT = null;
  const videoOf = (i) => slides[i] && slides[i].querySelector('video');
  let go;
  const schedule = () => {
    clearTimeout(timer);
    timer = setTimeout(() => go((active + 1) % slides.length), DELAY);
  };
  go = (i) => {
    if (i === active) {
      schedule();
      return;
    }
    slides[active].classList.remove('slide-active');
    slides[i].classList.add('slide-active');
    items.forEach((li, n) => {
      li.classList.toggle('bullet-active', n === i);
      const btn = li.querySelector('button');
      if (n === i) btn.setAttribute('aria-current', 'true');
      else btn.removeAttribute('aria-current');
    });
    // the progress bar restarts on the new bullet (source: slideChangeTransitionEnd)
    block.querySelectorAll('.active-bar').forEach((b) => b.classList.remove('on'));
    const bar = items[i] && items[i].querySelector('.active-bar');
    if (bar) {
      // reflow: the bar was display: none until now
      bar.getBoundingClientRect();
      bar.classList.add('on');
    }
    // slideChangeTransitionStart: the slide's video restarts from 0 and plays
    const v = videoOf(i);
    if (v) {
      try {
        v.currentTime = 0;
      } catch (err) {
        /* media not ready */
      }
    }
    clearTimeout(playT);
    playT = setTimeout(() => play(v), 0);
    active = i;
    schedule();
  };
  items.forEach((li, n) => li.querySelector('button').addEventListener('click', () => go(n)));
  play(videoOf(0));
  schedule();
}

/**
 * @param {Element} block
 */
export default function decorate(block) {
  if (block.querySelector(':scope > .mvisual-swiper')) return; // re-entrant (EW9)
  const rows = [...block.children];
  const isSlide = (row) => [...row.querySelectorAll('a[href]')]
    .some((a) => VIDEO.test(a.getAttribute('href')));
  const slideRows = rows.filter(isSlide);
  const textRow = rows.find((row) => !isSlide(row) && row.querySelector('h1, h2, h3, p'));

  const swiper = el('div', 'mvisual-swiper', { 'aria-roledescription': 'carousel' });
  const wrapper = el('div', 'swiper-wrapper');
  swiper.append(wrapper);
  const textbox = el('div', 'textbox inner');
  const control = el('div', 'control');
  const pagination = el('ul', 'mvisual-pagination slick-dots');
  control.append(pagination);
  textbox.append(control);

  const slides = [];
  const items = [];
  slideRows.forEach((row, i) => {
    const link = [...row.querySelectorAll('a[href]')].find((a) => VIDEO.test(a.getAttribute('href')));
    const linkP = link.closest('p') || link;
    const label = [...row.querySelectorAll('p')].find((p) => !p.contains(link));

    const slide = el('div', `swiper-slide${i === 0 ? ' slide-active' : ''}`, {
      'aria-roledescription': 'slide',
      'aria-label': `${i + 1} / ${slideRows.length}`,
    });
    const bg = el('div', 'bg');
    const video = el('video', 'mv-video', { muted: '', playsinline: '', preload: 'auto' });
    video.muted = true;
    video.src = link.getAttribute('href');
    bg.append(video);
    const src = el('div', 'video-src');
    src.append(linkP);
    slide.append(bg, src);
    wrapper.append(slide);
    slides.push(slide);

    const li = el('li', i === 0 ? 'bullet-active' : '');
    const text = el('span', 'pg-label');
    if (label) text.append(label);
    const bar = el('span', 'bar');
    bar.append(el('span', `active-bar${i === 0 ? ' on' : ''}`));
    const btn = el('button', 'pg-btn', { type: 'button', 'aria-label': `Go to slide ${i + 1}` });
    if (i === 0) btn.setAttribute('aria-current', 'true');
    li.append(text, ' ', bar, btn);
    pagination.append(li);
    items.push(li);
  });

  let scrolldown = null;
  if (textRow) {
    const heading = textRow.querySelector('h1, h2, h3');
    if (heading) {
      const tit = el('div', 'visual-tit show-ani');
      tit.append(heading);
      textbox.append(tit);
    }
    const pic = textRow.querySelector('picture, img');
    const lead = [...textRow.querySelectorAll('p')].find((p) => !p.querySelector('picture, img'));
    if (lead) {
      const text = el('div', 'visual-text show-ani ani-delay');
      text.append(lead);
      textbox.append(text);
    }
    if (pic) {
      scrolldown = el('div', 'scrolldown');
      scrolldown.append(pic.closest('p') || pic);
    }
  }

  block.textContent = '';
  block.append(swiper, textbox);
  if (scrolldown) block.append(scrolldown);
  // title / lead entrance (source: .swiper_active on init)
  requestAnimationFrame(() => requestAnimationFrame(() => block.classList.add('swiper-active')));
  if (slides.length) startCarousel(block, slides, items);
}
