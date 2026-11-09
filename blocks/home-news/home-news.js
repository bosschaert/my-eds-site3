/**
 * home-news — home Media Center panel: news list + YouTube channel box.
 *
 * Authored rows (classified by content, never by index):
 *   head row     heading + description, then a heading holding the "view all" links
 *   news rows    (repeat group) a category cell, then a cell with the date paragraphs (year.month,
 *                day) and the linked title — the whole item links there (EW6: the inner anchor
 *                is unwrapped after its href is read)
 *   banner row   the YouTube heading + text, the banner background image, and the channel list:
 *                one item per channel — its link, then the optional region text (card-as-link)
 */

function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

/** EW6: read the href, then unwrap the anchor (its children stay in place) */
function unwrapLink(a) {
  const href = a.getAttribute('href');
  a.replaceWith(...a.childNodes);
  return href;
}

function wrapIn(className, ...nodes) {
  const w = el('div', className);
  w.append(...nodes);
  return w;
}

function buildNewsItem(row) {
  const link = row.querySelector('a[href]');
  const titleP = link.closest('p') || link;
  const titleCell = [...row.children].find((c) => c.contains(link));
  const dateParts = [...titleCell.querySelectorAll('p')].filter((p) => p !== titleP);
  const catParts = [...row.children].filter((c) => c !== titleCell)
    .flatMap((c) => [...c.querySelectorAll('p')]);

  const item = el('a', 'item', { href: unwrapLink(link) });
  const category = el('div', 'category');
  category.append(...catParts);
  const date = el('div', 'date');
  const [ym, ...day] = dateParts;
  if (ym) date.append(wrapIn('ym', ym));
  if (day.length) date.append(wrapIn('day', ...day));
  const title = wrapIn('title', titleP);
  const ico = el('span', 'ico');
  ico.append(el('span', 'btnset arrow'));
  item.append(category, date, title, ico);
  return item;
}

/** one channel list item: the link's own text is the name, the text after it the region */
function buildChannel(li) {
  const link = li.querySelector('a[href]');
  const item = el('a', 'item', { href: link.getAttribute('href') });
  const text = el('div', 'text');
  const name = el('span', 'name');
  const after = [];
  let n = link.nextSibling;
  while (n) {
    after.push(n);
    n = n.nextSibling;
  }
  [...li.childNodes].filter((c) => c !== link && !after.includes(c)).forEach((c) => name.append(c));
  name.append(link);
  unwrapLink(link);
  text.append(name);
  const region = after.filter((c) => c.nodeType !== Node.TEXT_NODE || c.nodeValue.trim());
  if (region.length) {
    const small = el('span', 'small');
    small.append(...after);
    text.append(small);
  }
  item.append(text, el('span', 'ico ico-link'));
  li.append(item);
  return item;
}

/**
 * @param {Element} block
 */
export default function decorate(block) {
  if (block.querySelector(':scope > .section-cont')) return; // re-entrant (EW9)
  const rows = [...block.children];
  const headRow = rows.find((row) => row.querySelector('h1, h2'));
  const bannerRow = rows.find((row) => row !== headRow && row.querySelector('h3, h4')
    && row.querySelector('ul, ol'));
  const newsRows = rows.filter((row) => row !== headRow && row !== bannerRow
    && row.querySelector('a[href]'));

  const cont = el('div', 'section-cont inner');
  const media = el('div', 'media');
  const titleWrap = el('div', 'main-title-wrap row-1');
  const news = el('div', 'news');
  if (headRow) {
    const heading = headRow.querySelector('h1, h2');
    titleWrap.append(wrapIn('main-title', heading));
    [...headRow.querySelectorAll('p')].forEach((p) => titleWrap.append(wrapIn('main-title-desc', p)));
    const viewAll = [...headRow.querySelectorAll('h3, h4, h5, h6')].find((h) => h.querySelector('a'));
    if (viewAll) {
      viewAll.querySelectorAll('a').forEach((a) => {
        const ico = el('span', 'ico');
        a.append(' ', ico);
      });
      news.append(wrapIn('news-title', viewAll));
    }
  }
  const list = el('div', 'news-list');
  newsRows.forEach((row) => list.append(buildNewsItem(row)));
  news.append(list);
  media.append(titleWrap, news);

  const youtube = el('div', 'youtube');
  const linkList = el('div', 'link-list');
  if (bannerRow) {
    const banner = el('div', 'banner');
    const pic = bannerRow.querySelector('picture, img');
    if (pic) banner.append(wrapIn('banner-bg', pic.closest('p') || pic));
    const heading = bannerRow.querySelector('h3, h4');
    banner.append(wrapIn('banner-title', heading));
    [...bannerRow.querySelectorAll('p')].filter((p) => !p.querySelector('picture, img, a'))
      .forEach((p) => banner.append(wrapIn('banner-text', p)));
    youtube.append(banner);
    const channels = bannerRow.querySelector('ul, ol');
    if (channels) {
      linkList.append(channels);
      [...channels.children].forEach((li, i) => buildChannel(li).classList.toggle('first', i === 0));
    }
  }
  youtube.append(linkList);

  cont.append(media, youtube);
  block.textContent = '';
  block.append(cont);
}
