/**
 * News carousel — reconstructive rows from stardust/eds-schema/index.json.
 * Each authored row is one card: media cell, then linked h3 cell.
 */
export default function decorate(block) {
  const rows = [...block.children].filter((row) => row.querySelector('h3, h4'));
  const allNewsParagraph = [...block.querySelectorAll('p')].find(
    (paragraph) => paragraph.querySelector('a') && !paragraph.closest('h3, h4'),
  );
  const track = document.createElement('div');
  track.className = 'news-track';

  rows.forEach((row) => {
    const media = row.querySelector('picture, img');
    const heading = row.querySelector('h3, h4');
    if (!heading) return;
    const authoredLink = heading.querySelector('a');
    const card = document.createElement(authoredLink ? 'a' : 'article');
    card.className = 'news-card';
    if (authoredLink) {
      card.href = authoredLink.href;
      authoredLink.replaceWith(...authoredLink.childNodes);
    }
    if (media) {
      const mediaWrap = document.createElement('div');
      mediaWrap.className = 'news-media';
      mediaWrap.append(media);
      card.append(mediaWrap);
    }
    const title = document.createElement('div');
    title.className = 'news-title';
    title.append(heading);
    card.append(title);
    track.append(card);
  });

  const previous = document.createElement('button');
  previous.className = 'carousel-arrow carousel-prev';
  previous.type = 'button';
  previous.setAttribute('aria-label', 'Previous news item');

  const next = document.createElement('button');
  next.className = 'carousel-arrow carousel-next';
  next.type = 'button';
  next.setAttribute('aria-label', 'Next news item');

  const dots = document.createElement('div');
  dots.className = 'carousel-dots';
  dots.setAttribute('aria-hidden', 'true');
  rows.forEach((_, index) => {
    const dot = document.createElement('span');
    if (index === 0) dot.className = 'active';
    dots.append(dot);
  });

  let active = 0;
  const updateDots = () => {
    [...dots.children].forEach((dot, index) => dot.classList.toggle('active', index === active));
  };
  next.addEventListener('click', () => {
    const first = track.firstElementChild;
    if (first) track.append(first);
    active = (active + 1) % rows.length;
    updateDots();
  });
  previous.addEventListener('click', () => {
    const last = track.lastElementChild;
    if (last) track.prepend(last);
    active = (active - 1 + rows.length) % rows.length;
    updateDots();
  });

  const controls = document.createElement('div');
  controls.className = 'carousel-controls';
  controls.append(previous, next);

  const allNews = document.createElement('div');
  allNews.className = 'all-news';
  if (allNewsParagraph) allNews.append(allNewsParagraph);

  const wrap = document.createElement('div');
  wrap.className = 'news-wrap';
  wrap.append(track, controls, dots, allNews);
  block.replaceChildren(wrap);
}
