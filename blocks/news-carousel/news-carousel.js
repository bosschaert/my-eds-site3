/**
 * news-carousel — "What's New": the slick carousel of news cards (slidesToShow 3, arrows,
 * dots, infinite, 500 ms ease — theme scripts.js + slick 1.8) and the "See All" pill
 * (template `section.section-whatsnew`, index-proposed.css § What's New, motion.js § 4).
 *
 * Decode tier: reconstructive. Rows are classified by content, never by index: a row that
 * carries a picture is a card — its picture and its linked paragraph (the title; the card is
 * the link, EW6: the inner anchor is unwrapped once its href is read); a row with a link and
 * no picture is the See All CTA, moved as its paragraph (EW3); any other row degrades to
 * visible default content inside the container (leftovers pass). slick's loop clones
 * (3 prepended + 4 appended) are built on the first arrow/dot interaction: at rest the three
 * originals sit at translate 0 — the same pixels as slick's clones at −3 slides — so the served
 * and rendered word counts stay equal (AI-readability) and no authored text is duplicated in the
 * DOM until the user asks for the wrap-around; clones are presentational: stripInstrumentation
 * (EW4). Arrows and dots are generated controls with generated labels (EW7: no authored text
 * inside a <button>).
 */
const TO_SHOW = 3;
const SPEED = 500;

function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

function stripInstrumentation(node) {
  node.querySelectorAll('[data-prose-index], [data-image-index]').forEach((n) => {
    n.removeAttribute('data-prose-index');
    n.removeAttribute('data-image-index');
  });
  node.removeAttribute('data-prose-index');
  return node;
}

/** the EXISTING authored elements of one cell (#62/#104) */
function cellNodes(cell) {
  let kids = [...cell.children];
  if (kids.length === 1 && kids[0].tagName === 'P' && kids[0].children.length
    && kids[0].querySelector('picture, img')) {
    kids = [...kids[0].childNodes].map((n) => {
      if (n.nodeType === 1) return n;
      // harness-only (EW5): a bare text node beside the image moves into a fresh <p>
      if (n.textContent.trim()) {
        const p = document.createElement('p');
        p.append(n);
        return p;
      }
      return null;
    }).filter(Boolean);
  }
  if (!kids.length && cell.textContent.trim()) {
    // harness-only (EW5): a bare-text cell — its text nodes move, never copied
    const p = document.createElement('p');
    p.append(...cell.childNodes);
    kids = [p];
  }
  return kids;
}

function rowNodes(row) {
  return [...row.children].flatMap(cellNodes);
}

function buildCard(row) {
  const nodes = rowNodes(row);
  const media = nodes.find((n) => n.matches('picture, img'));
  const titleP = nodes.find((n) => n !== media && n.querySelector('a[href]'));
  const link = titleP ? titleP.querySelector('a[href]') : null;

  const card = el('a', 'news-card');
  if (link) {
    card.href = link.href;
    if (link.title) card.title = link.title;
  }
  const img = el('div', 'news-img');
  if (media) img.append(media);
  const title = el('div', 'news-title');
  if (titleP) {
    title.append(titleP);
    if (link) link.replaceWith(...link.childNodes);
  }
  nodes.filter((n) => n !== media && n !== titleP).forEach((n) => title.append(n));
  card.append(img, title);

  const slide = el('div', 'slick-slide');
  const inner = el('div');
  inner.append(card);
  slide.append(inner);
  return slide;
}

/* motion.js § 4 — slick's buildOut / slideHandler, observed on the live site */
function initSlick(slider, slides) {
  const list = slider.querySelector('.slick-list');
  const track = slider.querySelector('.slick-track');
  const count = slides.length;
  let current = 0;
  let animating = false;
  let slideWidth = 0;
  let all = slides;
  let cloned = false;

  slides.forEach((s, i) => {
    s.setAttribute('data-slick-index', String(i));
    s.setAttribute('role', 'tabpanel');
    s.id = `slick-slide0${i}`;
  });
  const dots = [...slider.querySelectorAll('.slick-dots li')];
  // clones prepended → the originals start TO_SHOW slides in; none yet → they start at 0
  const lead = () => (cloned ? TO_SHOW : 0);
  const offset = (pos) => -(pos + lead()) * slideWidth;
  const size = (s, w) => {
    s.style.width = `${w}px`;
    s.style.flex = `0 0 ${w}px`;
    s.style.maxWidth = `${w}px`;
  };
  const setDimensions = () => {
    const w = Math.ceil(list.clientWidth / TO_SHOW);
    if (!w) return;
    slideWidth = w;
    all.forEach((s) => size(s, w));
    track.style.width = `${w * all.length}px`;
    track.style.transition = '';
    track.style.transform = `translate3d(${offset(current)}px, 0px, 0px)`;
  };
  const setClasses = () => {
    all.forEach((s, i) => {
      const live = i >= current + lead() && i < current + lead() + TO_SHOW;
      s.classList.toggle('slick-active', live);
      s.classList.toggle('slick-current', i === current + lead());
      if (!s.classList.contains('slick-cloned')) {
        s.setAttribute('aria-hidden', live ? 'false' : 'true');
        if (live) s.removeAttribute('tabindex');
        else s.setAttribute('tabindex', '-1');
      }
    });
    dots.forEach((li, i) => {
      li.classList.toggle('slick-active', i === current);
      const b = li.querySelector('button');
      if (b) b.setAttribute('aria-selected', String(i === current));
    });
  };
  const clone = (src, index) => {
    const c = stripInstrumentation(src.cloneNode(true));
    c.className = 'slick-slide slick-cloned';
    c.setAttribute('data-slick-index', String(index));
    c.removeAttribute('id');
    c.setAttribute('aria-hidden', 'true');
    c.setAttribute('tabindex', '-1');
    c.removeAttribute('role');
    return c;
  };
  const ensureClones = () => {
    if (cloned) return;
    for (let p = count - 1; p >= count - TO_SHOW; p -= 1) {
      track.prepend(clone(slides[p], p - count));
    }
    for (let q = 0; q < count; q += 1) track.append(clone(slides[q], count + q));
    cloned = true;
    all = [...track.children];
    setDimensions(); // the track jumps to −3 slides without a transition: identical pixels
    setClasses();
    // eslint-disable-next-line no-unused-expressions
    track.offsetHeight; // reflow before the animated move
  };
  const go = (target) => {
    if (animating) return;
    animating = true;
    ensureClones();
    const landing = ((target % count) + count) % count;
    track.style.transition = `transform ${SPEED}ms ease`;
    track.style.transform = `translate3d(${offset(target)}px, 0px, 0px)`;
    window.setTimeout(() => {
      track.style.transition = '';
      current = landing;
      track.style.transform = `translate3d(${offset(current)}px, 0px, 0px)`;
      setClasses();
      animating = false;
    }, SPEED);
  };

  const next = slider.querySelector('.slick-next');
  const prev = slider.querySelector('.slick-prev');
  if (next) {
    next.addEventListener('click', (e) => {
      e.preventDefault();
      go(current + 1);
    });
  }
  if (prev) {
    prev.addEventListener('click', (e) => {
      e.preventDefault();
      go(current - 1);
    });
  }
  dots.forEach((li, i) => {
    li.addEventListener('click', (e) => {
      e.preventDefault();
      if (i !== current) go(i);
    });
  });
  // the section is display:none until it has loaded (aem.js loadSection): size the track when
  // the list gets its layout, and again on every resize (slick's own resize handler)
  const ro = new ResizeObserver(() => setDimensions());
  ro.observe(list);
  setDimensions();
  setClasses();
}

export default function decorate(block) {
  const rows = [...block.children];
  const cardRows = rows.filter((r) => r.querySelector('picture, img'));
  const ctaRows = rows.filter((r) => !cardRows.includes(r) && r.querySelector('a[href]'));
  const otherRows = rows.filter((r) => !cardRows.includes(r) && !ctaRows.includes(r));

  const container = el('div', 'container');
  const row = el('div', 'row justify-content-center');
  const col = el('div', 'col-md-12');
  const slider = el('div', 'news-cards slick-initialized slick-slider slick-dotted');
  const prev = el('button', 'slick-prev slick-arrow', { type: 'button', 'aria-label': 'Previous' });
  prev.textContent = 'Previous';
  const next = el('button', 'slick-next slick-arrow', { type: 'button', 'aria-label': 'Next' });
  next.textContent = 'Next';
  const list = el('div', 'slick-list');
  const track = el('div', 'slick-track');
  const slides = cardRows.map(buildCard);
  track.append(...slides);
  list.append(track);
  const dots = el('ul', 'slick-dots', { role: 'tablist' });
  const dotCount = Math.max(slides.length - TO_SHOW + 1, 1);
  slides.forEach((s, i) => {
    const li = el('li', null, { role: 'presentation' });
    const b = el('button', null, {
      type: 'button',
      role: 'tab',
      id: `slick-slide-control0${i}`,
      'aria-controls': `slick-slide0${i}`,
      'aria-label': `${i + 1} of ${dotCount}`,
    });
    b.textContent = String(i + 1);
    li.append(b);
    dots.append(li);
  });
  slider.append(prev, list, next, dots);
  col.append(slider);
  row.append(col);
  container.append(row);

  // the See All pill: the source's `.row > .col.align-self-center > a.btn.btn-secondary`
  ctaRows.forEach((r) => {
    const ctaRow = el('div', 'row see-all');
    const c = el('div', 'col align-self-center');
    rowNodes(r).forEach((n) => c.append(n));
    ctaRow.append(c);
    container.append(ctaRow);
  });
  otherRows.forEach((r) => {
    const lo = el('div', 'row');
    const c = el('div', 'col');
    rowNodes(r).forEach((n) => c.append(n));
    lo.append(c);
    container.append(lo);
  });
  block.replaceChildren(container);

  if (slides.length > TO_SHOW) {
    initSlick(slider, slides);
  } else {
    slides.forEach((s, i) => {
      s.classList.add('slick-active');
      if (i === 0) s.classList.add('slick-current');
    });
    const first = dots.querySelector('li');
    if (first) first.classList.add('slick-active');
  }
}
