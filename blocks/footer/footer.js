import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * Doosan Bobcat footer — template-slotted from the authored /footer document.
 *
 * Document shape (classified by content, never by index):
 *   sitemap section   heading + list pairs, one per column; a list with nested lists is the
 *                     Products column (group link + item links)
 *   bottom section    the h2 logo link, the copyright paragraph, then heading + list pairs:
 *                     the footer links (hidden heading) and, last, Related Sites (dropdown)
 * Authored nodes are MOVED into the canon chrome DOM; the block adds classes and
 * presentational wrappers only.
 *
 * @ew-exempt TOP button label and the external-link icon alt ("View a new window") —
 *   presentational chrome the block builds, not authored copy.
 */

const MEDIA = `${window.hlx.codeBasePath}/blocks/footer/media`;

function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

function hideText(host) {
  const span = el('span', 'hide');
  [...host.childNodes].forEach((n) => {
    if (n.nodeType === Node.TEXT_NODE) span.append(n);
  });
  host.append(span);
}

function unwrapParagraphs(root) {
  root.querySelectorAll('li > p').forEach((p) => p.replaceWith(...p.childNodes));
}

/** heading + following list pairs inside one section */
function pairs(section) {
  const out = [];
  const nodes = [...section.querySelectorAll('h2, h3, h4, h5, h6, ul, ol')]
    .filter((n) => !n.closest('li'));
  nodes.forEach((n, i) => {
    if (/^H[3-6]$/.test(n.tagName) && nodes[i + 1] && /^(UL|OL)$/.test(nodes[i + 1].tagName)) {
      out.push({ heading: n, list: nodes[i + 1] });
    }
  });
  return out;
}

function buildSitemap(section) {
  const top = el('div', 'ft-top');
  const sitemap = el('div', 'sitemap inner');
  pairs(section).forEach(({ heading, list }) => {
    unwrapParagraphs(list);
    const article = el('article');
    const cont = el('div', 'item-cont');
    if (list.querySelector('ul, ol')) {
      article.classList.add('arti-product');
      list.classList.add('groups');
      [...list.children].forEach((li) => {
        const title = li.querySelector(':scope > a');
        if (title) title.classList.add('group-title');
        const items = li.querySelector(':scope > ul, :scope > ol');
        if (items) items.classList.add('group-items');
      });
    }
    heading.classList.add('item-title');
    cont.append(list);
    article.append(heading, cont);
    sitemap.append(article);
  });
  top.append(sitemap);
  return top;
}

function buildTopButton() {
  const home = document.body.classList.contains('index');
  const btn = el('a', home ? 'top-btn fullpg-top-btn' : 'top-btn posi-fixed fadeout', {
    href: '#header',
  });
  if (home) {
    btn.append(el('img', '', { src: `${MEDIA}/top_btn.png`, alt: 'Back to top' }));
    return btn;
  }
  const progress = el('span', 'progress');
  const canvas = el('canvas');
  progress.append(canvas);
  const text = el('span', 'text');
  text.textContent = 'TOP';
  btn.append(progress, text);

  // source scroll_circle_button(): fixed while above the footer, faded in the first half
  // viewport; circle-progress ring (thickness 3, start -90deg, fill #005eb8)
  const doc = document.documentElement;
  const ctx = canvas.getContext('2d');
  const draw = (value) => {
    if (!ctx) return;
    const size = progress.offsetWidth || 65;
    const ratio = window.devicePixelRatio || 1;
    if (canvas.width !== size * ratio) {
      canvas.width = size * ratio;
      canvas.height = size * ratio;
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;
    }
    const r = size / 2;
    const t = 3;
    const start = -Math.PI / 2;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.clearRect(0, 0, size, size);
    ctx.lineWidth = t;
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(0, 0, 0, .1)';
    ctx.arc(r, r, r - t / 2, start, start + Math.PI * 2);
    ctx.stroke();
    if (value > 0) {
      ctx.beginPath();
      ctx.strokeStyle = '#005eb8';
      ctx.arc(r, r, r - t / 2, start, start + Math.PI * 2 * value);
      ctx.stroke();
    }
  };
  const onScroll = () => {
    const y = window.scrollY;
    const vh = window.innerHeight;
    const max = doc.scrollHeight - vh;
    const footer = btn.closest('footer');
    const footH = footer ? footer.offsetHeight : 0;
    btn.classList.toggle('posi-fixed', y < doc.scrollHeight - vh - footH);
    btn.classList.toggle('fadeout', y < vh / 2);
    draw(max > 0 ? Math.min(1, y / max) : 0);
  };
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  requestAnimationFrame(onScroll);
  return btn;
}

function buildBottom(section) {
  const bottom = el('div', 'ft-bottom');
  const inner = el('div', 'inner');
  const left = el('div', 'left-con');
  const right = el('div', 'right-con');

  const logo = section.querySelector('h2');
  if (logo) {
    logo.classList.add('ft-logo');
    const a = logo.querySelector('a');
    if (a) hideText(a);
    left.append(logo);
  }
  const copyright = [...section.querySelectorAll('p')].find((p) => !p.closest('li') && !p.querySelector('a'));
  if (copyright) {
    copyright.classList.add('copyright');
    // the source writes the current year into #copyYear by script
    const year = copyright.textContent.match(/^(\D*)\d{4}(.*)$/);
    if (year) {
      const span = el('span', '', { id: 'copyYear' });
      span.textContent = new Date().getFullYear();
      copyright.replaceChildren(year[1], span, year[2]);
    }
    left.append(copyright);
  }

  const groups = pairs(section);
  const related = groups.length > 1 ? groups.pop() : null;
  groups.forEach(({ heading, list }) => {
    unwrapParagraphs(list);
    const link = el('div', 'ft-link');
    heading.classList.add('hide');
    list.classList.add('ft-info');
    const items = [...list.children];
    if (items.length) items[items.length - 1].classList.add('last');
    list.querySelectorAll('a[href^="http"]').forEach((a) => {
      const ico = el('span', 'ico ico-link');
      ico.append(el('img', '', { src: `${MEDIA}/ico_ft_link.png`, alt: 'View a new window' }));
      a.append(' ', ico);
    });
    link.append(heading, list);
    right.append(link);
  });
  if (related) {
    unwrapParagraphs(related.list);
    const site = el('div', 'ft-site');
    site.append(related.heading, related.list);
    site.addEventListener('click', () => site.classList.toggle('open'));
    document.addEventListener('click', (e) => {
      if (!site.contains(e.target)) site.classList.remove('open');
    });
    right.append(site);
  }

  inner.append(left, right);
  bottom.append(inner);
  return bottom;
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);
  if (!fragment) return;

  const sections = [...fragment.querySelectorAll(':scope > .section')];
  const bottomSection = sections.find((s) => s.querySelector('h2'));
  const sitemapSection = sections.find((s) => s !== bottomSection && pairs(s).length);

  block.textContent = '';
  const wrap = el('div', 'footer-wrap');
  wrap.append(buildTopButton());
  if (sitemapSection) wrap.append(buildSitemap(sitemapSection));
  if (bottomSection) wrap.append(buildBottom(bottomSection));
  block.append(wrap);
}
