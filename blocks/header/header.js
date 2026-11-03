import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/* source scripts.js: the header gets `.scrolled` past 100px of scroll, at every width */
const SCROLL_THRESHOLD = 100;

function el(tag, className) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

/**
 * The SVG logos are delivered in a <picture> whose first sources are raster webp renditions;
 * drop those so the browser keeps the vector, as on the source.
 * @param {Element} scope container holding the picture
 */
function keepVector(scope) {
  scope.querySelectorAll('picture').forEach((picture) => {
    const img = picture.querySelector('img');
    if (!img || !/\.svg(\?|$)/.test(img.getAttribute('src') || '')) return;
    picture.querySelectorAll('source[type="image/webp"]').forEach((source) => source.remove());
  });
}

/**
 * Unwraps a <p> the pipeline puts around list-item content, keeping its child nodes.
 * @param {Element} li list item
 */
function unwrapParagraphs(li) {
  li.querySelectorAll(':scope > p').forEach((p) => p.replaceWith(...p.childNodes));
  [...li.childNodes].forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) node.remove();
  });
}

/**
 * Social list: authored `:facebook:` icons become FontAwesome glyphs.
 * @param {Element} ul authored list
 */
function decorateSocial(ul) {
  ul.classList.add('list-social');
  ul.querySelectorAll('span.icon').forEach((span) => {
    const name = [...span.classList].find((c) => c.startsWith('icon-')).substring(5);
    const glyph = el('i', `fa fa-${name}`);
    span.replaceWith(glyph);
  });
}

function closeDropdowns(scope, except) {
  scope.querySelectorAll('.nav-item.is-open').forEach((li) => {
    if (li === except) return;
    li.classList.remove('is-open');
    const toggle = li.querySelector(':scope > .dropdown-toggle');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
  });
}

/**
 * Primary menu item: a trigger (authored text or link) with a nested list becomes a dropdown;
 * a strong link becomes the "Get Involved" pill.
 * @param {Element} li authored list item
 * @param {Element} menu the primary menu
 */
function decorateMenuItem(li, menu) {
  li.classList.add('nav-item');
  unwrapParagraphs(li);
  const sub = li.querySelector(':scope > ul');
  if (sub) {
    li.classList.add('has-dropdown');
    let toggle = li.querySelector(':scope > a');
    if (!toggle) {
      toggle = el('a');
      toggle.href = '#';
      toggle.append(...[...li.childNodes].filter((node) => node !== sub));
      li.prepend(toggle);
    }
    toggle.classList.add('nav-link', 'dropdown-toggle');
    toggle.setAttribute('aria-haspopup', 'true');
    toggle.setAttribute('aria-expanded', 'false');
    sub.classList.add('dropdown-menu');
    sub.querySelectorAll('a').forEach((a) => a.classList.add('dropdown-item'));
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      closeDropdowns(menu, li);
      const open = li.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    return;
  }
  const link = li.querySelector('a');
  if (!link) return;
  // a strong/em link is the CTA pill (decorateButtons may already have turned it into a.button)
  if (link.closest('strong, em') || link.classList.contains('button')) li.classList.add('nav-item-cta');
  link.classList.remove('button', 'primary', 'secondary', 'accent');
  link.classList.add('nav-link');
}

/**
 * loads and decorates the header
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  if (block.querySelector(':scope > .navbar')) return;

  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);
  if (!fragment) return;
  keepVector(fragment);

  const lists = [...fragment.querySelectorAll('.default-content-wrapper > ul')];
  const socialList = lists.find((ul) => ul.querySelector('.icon'));
  const menuList = lists.find((ul) => ul.querySelector(':scope > li ul, strong, em, a.button'));
  const topList = lists.find((ul) => ul !== socialList && ul !== menuList);
  const brand = [...fragment.querySelectorAll('a')].find((a) => a.querySelector('img'));
  const skip = [...fragment.querySelectorAll('a')].find((a) => a.getAttribute('href').startsWith('#'));

  block.textContent = '';

  if (skip) {
    skip.className = 'skip-link';
    const target = document.querySelector('main');
    if (target && !target.id) target.id = skip.getAttribute('href').substring(1);
    block.append(skip);
  }

  const navbar = el('nav', 'navbar');
  const inner = el('div', 'navbar-inner');
  navbar.append(inner);

  if (brand) {
    brand.className = 'navbar-brand';
    if (new URL(brand.href, window.location).pathname === window.location.pathname) {
      brand.setAttribute('aria-current', 'page');
    }
    inner.append(brand);
  }

  const navs = el('div', 'navs');
  const topnav = el('div', 'topnav');
  if (topList) {
    const collapse = el('div', 'topnav-collapse');
    topList.classList.add('topnav-menu');
    topList.querySelectorAll(':scope > li').forEach((li) => {
      unwrapParagraphs(li);
      li.classList.add('nav-item');
      const a = li.querySelector('a');
      if (a) a.classList.add('nav-link');
    });
    collapse.append(topList);
    topnav.append(collapse);
  }
  if (socialList) {
    decorateSocial(socialList);
    topnav.append(socialList);
  }
  navs.append(topnav);

  const primary = el('div', 'primarynav');
  if (menuList) {
    const toggler = el('button', 'navbar-toggler');
    toggler.type = 'button';
    toggler.setAttribute('aria-label', 'Toggle navigation');
    toggler.setAttribute('aria-expanded', 'false');
    toggler.setAttribute('aria-controls', 'main-menu');
    toggler.append(el('span', 'navbar-toggler-icon'));
    menuList.classList.add('main-menu');
    menuList.id = 'main-menu';
    menuList.querySelectorAll(':scope > li').forEach((li) => decorateMenuItem(li, menuList));
    toggler.addEventListener('click', () => {
      const open = menuList.classList.toggle('is-open');
      toggler.setAttribute('aria-expanded', String(open));
    });
    primary.append(toggler, menuList);

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.has-dropdown')) closeDropdowns(menuList);
    });
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Escape') closeDropdowns(menuList);
    });
  }
  navs.append(primary);
  inner.append(navs);
  block.append(navbar);

  const onScroll = () => block.classList.toggle('scrolled', window.scrollY > SCROLL_THRESHOLD);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}
