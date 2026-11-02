/**
 * category-tiles — a feature image with tagline + CTA beside a 2x2 grid of linked category tiles.
 *
 * Authoring rows:
 *   feature row (the row with a plain text paragraph): image cell (desktop <img>, then mobile
 *     <img>), text cell (tagline paragraph, CTA link paragraph - the feature image links there too)
 *   tile rows (any number): image cell (desktop <img>, then mobile <img>), link paragraph
 *     (link text = tile title; link title = accessible name of the whole tile)
 * Rows are classified by content, never by position.
 * @ew-exempt none
 */

function wrapNode(node, className, tag = 'div') {
  const w = document.createElement(tag);
  w.className = className;
  if (node) w.append(node);
  return w;
}

function mediaOf(el) {
  return [...el.querySelectorAll('picture, img')].filter((n) => !(n.tagName === 'IMG' && n.closest('picture')));
}

/** desktop rendition first, mobile second (one image serves both) */
function imageSet(media, className) {
  const set = wrapNode(null, className);
  if (media.length === 1) {
    set.append(wrapNode(media[0], 'img-all'));
  } else {
    media.forEach((m, i) => set.append(wrapNode(m, i === 0 ? 'img-desktop' : 'img-mobile')));
  }
  return set;
}

function linkLabel(a) {
  return a.title && a.title !== a.textContent ? a.title : '';
}

function buildTile(row) {
  const link = row.querySelector('a');
  const tile = document.createElement(link ? 'a' : 'div');
  tile.className = 'tile';
  tile.append(imageSet(mediaOf(row), 'tile-image'));
  if (link) {
    tile.href = link.href;
    const label = linkLabel(link);
    if (label) tile.setAttribute('aria-label', label);
    const par = link.closest('p');
    const title = wrapNode(par || link, 'tile-title');
    link.replaceWith(...link.childNodes);
    tile.append(title);
  }
  // leftovers: other authored text in the row stays visible
  [...row.querySelectorAll('p, h2, h3, h4, ul, ol')].forEach((n) => {
    if (!tile.contains(n) && n.textContent.trim()) tile.append(n);
  });
  return tile;
}

function buildFeature(row) {
  const hero = wrapNode(null, 'feature');
  const paras = [...row.querySelectorAll('p')];
  const cta = paras.find((p) => p.querySelector('a'));
  const texts = paras.filter((p) => !p.querySelector('a, picture, img') && p.textContent.trim());
  const media = mediaOf(row);
  const a = cta ? cta.querySelector('a') : null;
  const imageLink = document.createElement(a ? 'a' : 'div');
  imageLink.className = 'feature-image';
  if (a) {
    imageLink.href = a.href;
    const label = linkLabel(a);
    if (label) {
      imageLink.setAttribute('aria-label', label);
      a.setAttribute('aria-label', label);
    }
  }
  imageLink.append(imageSet(media, 'feature-media'));
  const content = wrapNode(null, 'feature-content');
  texts.forEach((p) => content.append(wrapNode(p, 'feature-tagline')));
  if (cta) content.append(wrapNode(cta, 'feature-cta'));
  [...row.querySelectorAll('h2, h3, h4, ul, ol')].forEach((n) => content.append(n));
  hero.append(imageLink, content);
  return hero;
}

export default function decorate(block) {
  const rows = [...block.children];
  const isFeature = (row) => [...row.querySelectorAll('p')]
    .some((p) => !p.querySelector('a, picture, img') && p.textContent.trim());
  const featureRow = rows.find(isFeature);
  const container = wrapNode(null, 'tiles-container');
  const grid = wrapNode(null, 'tiles-grid');
  rows.filter((r) => r !== featureRow && r.querySelector('a, picture, img'))
    .forEach((r) => grid.append(buildTile(r)));
  container.append(grid);
  if (featureRow) container.append(buildFeature(featureRow));
  block.replaceChildren(container);
}
