/**
 * news-carousel — the "What's New" slick carousel: 3 cards per view, infinite loop, arrows + dots.
 * Rows: one card each — an image cell and a cell with the title link (the card's href).
 * The card is a link: the authored anchor's href (and title) move to the card, the anchor is
 * unwrapped and its paragraph + picture are moved in. Infinite looping uses slick's presentational
 * clones (the last 3 cards before, all cards after): instrumentation stripped, aria-hidden, inert.
 */

const CLONES_BEFORE = 3;
const PER_VIEW = 3;
const INSTRUMENTATION = /^data-(aue|richtext|prose)/;

function stripInstrumentation(root) {
  [root, ...root.querySelectorAll('*')].forEach((el) => {
    [...el.attributes].forEach((attr) => {
      if (INSTRUMENTATION.test(attr.name)) el.removeAttribute(attr.name);
    });
  });
}

function buildCard(row) {
  const link = row.querySelector('a[href]');
  const picture = row.querySelector('picture') || row.querySelector('img');
  const card = document.createElement('a');
  card.className = 'news-card';
  const imgBox = document.createElement('div');
  imgBox.className = 'news-card-img';
  const titleBox = document.createElement('div');
  titleBox.className = 'news-card-title';
  if (link) {
    card.href = link.getAttribute('href');
    if (link.title) card.title = link.title;
    const holder = link.closest('p') || link.parentElement;
    link.replaceWith(...link.childNodes);
    titleBox.append(holder);
  }
  if (picture) {
    const pictureHolder = picture.closest('p');
    imgBox.append(picture);
    if (pictureHolder && !pictureHolder.textContent.trim() && !pictureHolder.children.length) {
      pictureHolder.remove();
    }
  }
  [...row.querySelectorAll('p, h1, h2, h3, h4, h5, h6')].forEach((el) => {
    if (el.textContent.trim()) titleBox.append(el);
  });
  card.append(imgBox, titleBox);
  const slide = document.createElement('div');
  slide.className = 'news-carousel-slide';
  slide.append(card);
  return slide;
}

function cloneSlide(slide) {
  const clone = slide.cloneNode(true);
  stripInstrumentation(clone);
  clone.classList.add('news-carousel-clone');
  clone.setAttribute('aria-hidden', 'true');
  clone.querySelectorAll('a, button').forEach((el) => el.setAttribute('tabindex', '-1'));
  return clone;
}

function arrow(dir, label) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = `news-carousel-arrow news-carousel-${dir}`;
  button.setAttribute('aria-label', label);
  button.textContent = label;
  return button;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .news-carousel-viewport')) return;

  const slides = [...block.children].map((row) => {
    const slide = buildCard(row);
    row.remove();
    return slide;
  });
  const count = slides.length;
  const viewport = document.createElement('div');
  viewport.className = 'news-carousel-viewport';
  const track = document.createElement('div');
  track.className = 'news-carousel-track';
  viewport.append(track);

  const before = count > 1 ? slides.slice(-Math.min(CLONES_BEFORE, count)).map(cloneSlide) : [];
  const after = count > 1 ? slides.map(cloneSlide) : [];
  track.append(...before, ...slides, ...after);

  const prev = arrow('prev', 'Previous');
  const next = arrow('next', 'Next');
  const dots = document.createElement('ul');
  dots.className = 'news-carousel-dots';
  dots.setAttribute('role', 'tablist');
  // slick's dot labels, verbatim from the source: "<n> of <pages>" with pages = ceil(count / 3)
  const pages = Math.ceil(count / PER_VIEW);
  const dotItems = slides.map((_, i) => {
    const li = document.createElement('li');
    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('aria-label', `${i + 1} of ${pages}`);
    button.textContent = String(i + 1);
    li.append(button);
    dots.append(li);
    return li;
  });

  block.append(prev, viewport, next, dots);
  if (count < 2) {
    prev.hidden = true;
    next.hidden = true;
    dots.hidden = true;
    return;
  }

  const offset = before.length;
  let pos = offset;
  let busy = false;
  const place = (animate) => {
    track.style.transition = animate ? 'transform 500ms ease' : 'none';
    // a slide is a third of the track's width: percentages keep the offset right at any size
    track.style.transform = `translate3d(calc(${-pos} * 100% / ${PER_VIEW}), 0, 0)`;
  };
  const mark = () => dotItems.forEach((li, i) => {
    li.classList.toggle('is-active', i === (pos - offset + count) % count);
  });
  const settle = () => {
    if (pos >= offset + count) pos -= count;
    if (pos < offset) pos += count;
    place(false);
    busy = false;
  };
  const go = (target) => {
    if (busy || target === pos) return;
    busy = true;
    pos = target;
    place(true);
    mark();
    track.addEventListener('transitionend', settle, { once: true });
  };
  place(false);
  mark();
  prev.addEventListener('click', () => go(pos - 1));
  next.addEventListener('click', () => go(pos + 1));
  dotItems.forEach((li, i) => li.querySelector('button').addEventListener('click', () => go(offset + i)));
}
