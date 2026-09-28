/**
 * Header — template-slotted replica of the balbriggan.ie navbar (stardust/prototypes
 * index-proposed.template.html `nav.navbar`, canon.css § Navbar, motion.js § 1–3).
 *
 * Content comes from the authored /nav document. Its sections are classified by role,
 * never by index: the section carrying an icon/picture is the brand, the list with a nested
 * list is the main menu (four dropdowns), the list whose links all point at social hosts is
 * the social row, the remaining list is the top menu, and a paragraph with a link is the
 * "Get Involved" CTA. Authored nodes are MOVED into the prototype's DOM (EW1/EW3).
 *
 * Behaviour mirrors what was observed on the live site (motion.js): the `.scrolled` morph
 * past 100px, the Bootstrap 4 collapse state machine (.collapsing, height transition .35s)
 * on the mobile toggler, and the dropdown click state machine (`.show` on the item and its
 * menu, aria-expanded on the toggle; a second click, an outside click or Escape closes).
 * The expand breakpoint is the source's navbar-expand-xl (1200px).
 */
import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const isDesktop = window.matchMedia('(min-width: 1200px)');
const COLLAPSE_MS = 350;

const SOCIAL_HOSTS = [
  ['facebook.com', 'facebook'],
  ['twitter.com', 'twitter'],
  ['x.com', 'twitter'],
  ['linkedin.com', 'linkedin'],
  ['instagram.com', 'instagram'],
];

function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

function socialNetwork(href) {
  try {
    const host = new URL(href, window.location.href).hostname.replace(/^www\./, '');
    const hit = SOCIAL_HOSTS.find(([h]) => host === h || host.endsWith(`.${h}`));
    return hit ? hit[1] : null;
  } catch (e) {
    return null;
  }
}

function isSocialList(ul) {
  const links = [...ul.querySelectorAll('a[href]')];
  return links.length > 0 && links.every((a) => socialNetwork(a.getAttribute('href')));
}

/** the pipeline wraps a list item's trigger link in a <p> on live: normalise to <li><a> */
function triggerLink(li) {
  const a = li.querySelector(':scope > a, :scope > p > a');
  if (a && a.parentElement.tagName === 'P') {
    const p = a.parentElement;
    p.replaceWith(...p.childNodes);
  }
  return a;
}

function classify(sections) {
  const roles = {};
  sections.forEach((section) => {
    const ul = section.querySelector('ul');
    if (!roles.brand && section.querySelector('.icon, picture, img')) roles.brand = section;
    else if (!roles.main && ul && ul.querySelector('li ul')) roles.main = section;
    else if (!roles.social && ul && isSocialList(ul)) roles.social = section;
    else if (!roles.top && ul) roles.top = section;
    else if (!roles.cta && section.querySelector('a[href]')) roles.cta = section;
  });
  return roles;
}

/** the source renders each social link as `a.social-icon > i.fa` with no text node */
function decorateSocialList(ul) {
  ul.classList.add('list-inline', 'list-social');
  [...ul.children].forEach((li) => {
    li.classList.add('list-inline-item');
    const a = triggerLink(li);
    if (!a) return;
    const network = socialNetwork(a.getAttribute('href'));
    a.classList.add('social-icon');
    // the source anchors carry no text: the authored label becomes the accessible name
    const label = a.textContent.trim();
    if (label && !a.hasAttribute('aria-label')) a.setAttribute('aria-label', label);
    a.replaceChildren();
    if (network) a.append(el('i', `fa fa-${network}`, { 'aria-hidden': 'true' }));
  });
  return ul;
}

function decorateTopMenu(ul) {
  ul.classList.add('navbar-nav', 'ml-auto', 'align-items-center', 'top-menu');
  [...ul.children].forEach((li) => {
    li.classList.add('menu-item', 'nav-item');
    const a = triggerLink(li);
    if (a) a.classList.add('nav-link');
  });
  return ul;
}

function decorateMainMenu(ul) {
  ul.classList.add('navbar-nav', 'ml-auto', 'align-items-center', 'main-menu');
  [...ul.children].forEach((li, i) => {
    li.classList.add('menu-item', 'nav-item');
    const a = triggerLink(li);
    const sub = li.querySelector(':scope > ul');
    if (!a) return;
    a.classList.add('nav-link');
    if (!sub) return;
    const id = `menu-item-dropdown-${i + 1}`;
    li.classList.add('menu-item-has-children', 'dropdown');
    a.classList.add('dropdown-toggle');
    a.id = id;
    a.setAttribute('aria-haspopup', 'true');
    a.setAttribute('aria-expanded', 'false');
    sub.classList.add('dropdown-menu');
    sub.setAttribute('aria-labelledby', id);
    [...sub.children].forEach((item) => {
      item.classList.add('menu-item', 'nav-item');
      const link = triggerLink(item);
      if (link) link.classList.add('dropdown-item');
    });
  });
  return ul;
}

/* motion.js § 3 — Bootstrap 4 dropdown state machine */
function wireDropdowns(menu) {
  const toggles = [...menu.querySelectorAll('.dropdown-toggle')];
  const setOpen = (toggle, open) => {
    const li = toggle.parentNode;
    const sub = li.querySelector('.dropdown-menu');
    li.classList.toggle('show', open);
    if (sub) sub.classList.toggle('show', open);
    toggle.setAttribute('aria-expanded', String(open));
  };
  const closeAll = (except) => {
    toggles.forEach((t) => {
      if (t !== except) setOpen(t, false);
    });
  };
  toggles.forEach((t) => {
    t.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const open = !t.parentNode.classList.contains('show');
      closeAll(t);
      setOpen(t, open);
      if (open) t.focus();
    });
  });
  document.addEventListener('click', () => closeAll());
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAll();
  });
  return closeAll;
}

/* motion.js § 2 — Bootstrap 4 collapse (.collapse → .collapsing → .collapse.show) */
function wireCollapse(button, target) {
  let timer = 0;
  const settle = (show) => {
    window.clearTimeout(timer);
    target.classList.remove('collapsing');
    target.classList.add('collapse');
    target.classList.toggle('show', show);
    target.style.height = '';
  };
  const toggle = () => {
    if (target.classList.contains('collapsing')) return;
    const show = !target.classList.contains('show');
    button.setAttribute('aria-expanded', String(show));
    button.classList.toggle('collapsed', !show);
    const onEnd = () => {
      target.removeEventListener('transitionend', onEnd);
      settle(show);
    };
    target.addEventListener('transitionend', onEnd);
    // reduced-motion (no transition) never fires transitionend: settle by the clock
    timer = window.setTimeout(onEnd, COLLAPSE_MS + 50);
    if (show) {
      target.classList.remove('collapse');
      target.classList.add('collapsing');
      target.style.height = '0px';
      const h = target.scrollHeight;
      window.requestAnimationFrame(() => {
        target.style.height = `${h}px`;
      });
    } else {
      target.style.height = `${target.getBoundingClientRect().height}px`;
      // reflow, as Bootstrap's Util.reflow
      // eslint-disable-next-line no-unused-expressions
      target.offsetHeight;
      target.classList.add('collapsing');
      target.classList.remove('collapse', 'show');
      window.requestAnimationFrame(() => {
        target.style.height = '';
      });
    }
  };
  button.addEventListener('click', (e) => {
    e.preventDefault();
    toggle();
  });
  return () => {
    button.setAttribute('aria-expanded', 'false');
    button.classList.add('collapsed');
    settle(false);
  };
}

/* motion.js § 1 — theme scripts.js: scrollTop() > 100 ? add : remove .scrolled */
function wireStickyMorph(wrapper) {
  const morph = () => {
    const y = window.pageYOffset || document.documentElement.scrollTop;
    wrapper.classList.toggle('scrolled', y > 100);
  };
  window.addEventListener('scroll', morph, { passive: true });
  morph();
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);
  if (!fragment) return;

  const roles = classify([...fragment.children]);

  // the prototype's chrome DOM, with empty slots
  const wrapper = el('div', 'sticky-nav');
  const skip = el('a', 'skip-link sr-only sr-only-focusable', { href: '#content' });
  skip.textContent = 'Skip to content';
  const nav = el('nav', 'navbar navbar-expand-xl navbar-dark', { 'aria-label': 'Main' });
  const inner = el('div', 'navbar-inner');
  const navs = el('div', 'navs');
  const topnav = el('div', 'topnav');
  const topCollapse = el('div', 'collapse navbar-collapse');
  const primarynav = el('div', 'primarynav');
  const toggler = el('button', 'navbar-toggler collapsed', {
    type: 'button',
    'aria-controls': 'navbar-nav-dropdown',
    'aria-expanded': 'false',
    'aria-label': 'Toggle navigation',
  });
  toggler.append(el('span', 'navbar-toggler-icon'));
  const mainCollapse = el('div', 'collapse navbar-collapse', { id: 'navbar-nav-dropdown' });

  // brand: the authored logo link
  const brandLink = roles.brand && roles.brand.querySelector('a[href]');
  if (brandLink) {
    brandLink.classList.add('navbar-brand', 'custom-logo-link');
    brandLink.setAttribute('rel', 'home');
    const img = brandLink.querySelector('img');
    if (img) {
      img.classList.add('img-fluid');
      img.alt = 'Our Balbriggan logo';
      img.loading = 'eager';
      img.removeAttribute('width');
      img.removeAttribute('height');
    }
    inner.append(brandLink);
  }

  // top menu + social row
  if (roles.top) topCollapse.append(decorateTopMenu(roles.top.querySelector('ul')));
  topnav.append(topCollapse);
  if (roles.social) topnav.append(decorateSocialList(roles.social.querySelector('ul')));

  // main menu (dropdowns) + the CTA as the last item
  let mainMenu = null;
  if (roles.main) {
    mainMenu = decorateMainMenu(roles.main.querySelector('ul'));
    if (roles.cta) {
      const ctaLink = roles.cta.querySelector('a[href]');
      const li = el('li', 'btn-nav menu-item nav-item');
      ctaLink.classList.add('nav-link');
      li.append(ctaLink.closest('p') || ctaLink);
      mainMenu.append(li);
    }
    mainCollapse.append(mainMenu);
  }
  primarynav.append(toggler, mainCollapse);
  navs.append(topnav, primarynav);
  inner.append(navs);
  nav.append(inner);
  wrapper.append(skip, nav);

  // the skip link targets the page's main content, as the source's #content did
  const main = document.querySelector('main');
  if (main && !main.id) main.id = 'content';

  block.replaceChildren(wrapper);

  wireStickyMorph(wrapper);
  const resetCollapse = wireCollapse(toggler, mainCollapse);
  const closeDropdowns = mainMenu ? wireDropdowns(mainMenu) : () => {};
  isDesktop.addEventListener('change', () => {
    resetCollapse();
    closeDropdowns();
  });
}
