import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// the source navbar expands at bootstrap's xl step
const isDesktop = window.matchMedia('(min-width: 1200px)');
const SCROLL_COMPACT = 100;
const COLLAPSE_MS = 350;

const el = (tag, className, attrs = {}) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
};

/**
 * Moves the authored child nodes of an element into a visually hidden span (keeps the
 * accessible name, shows a decorative glyph instead).
 * @param {Element} a the authored link
 */
function hideLabel(a) {
  const label = el('span', 'sr-only');
  label.append(...a.childNodes);
  a.append(label);
}

/**
 * Unwraps pipeline-added paragraphs/emphasis around a list item's link (#98).
 * @param {Element} li list item
 */
function unwrapLink(li) {
  const wrap = li.querySelector(':scope > p, :scope > strong, :scope > em');
  const a = wrap && wrap.querySelector('a');
  if (a && wrap.textContent.trim() === a.textContent.trim()) wrap.replaceWith(a);
}

const SOCIAL = ['facebook', 'twitter', 'linkedin', 'instagram'];

/**
 * Decorates an authored social link list: glyph span + hidden label.
 * @param {Element} ul authored list
 */
function decorateSocial(ul) {
  ul.className = 'social';
  ul.querySelectorAll(':scope > li').forEach((li) => {
    unwrapLink(li);
    const a = li.querySelector('a');
    if (!a) return;
    const network = SOCIAL.find((n) => a.href.includes(n)) || '';
    a.removeAttribute('title');
    hideLabel(a);
    a.prepend(el('span', `social-icon ${network}`, { 'aria-hidden': 'true' }));
  });
}

/**
 * Animates the drawer like bootstrap's collapse (height, 350ms ease).
 * @param {Element} root header root
 * @param {Element} panel the collapsible panel
 * @param {boolean} open target state
 */
function animateDrawer(root, panel, open) {
  const p = panel;
  const run = String(Number(p.dataset.run || 0) + 1);
  p.dataset.run = run;
  const done = () => {
    if (p.dataset.run !== run) return; // a newer toggle owns the panel
    p.classList.remove('is-collapsing');
    p.style.height = '';
    if (!open) root.classList.remove('is-open');
  };
  if (open) root.classList.add('is-open');
  const full = `${p.scrollHeight}px`;
  p.style.height = open ? '0px' : full;
  p.classList.add('is-collapsing');
  p.getBoundingClientRect();
  p.style.height = open ? full : '0px';
  p.addEventListener('transitionend', done, { once: true });
  setTimeout(done, COLLAPSE_MS + 100);
}

/**
 * Builds the main nav: nested lists become click dropdowns, the emphasised link the CTA pill.
 * @param {Element} ul authored list
 */
function decorateMainNav(ul) {
  ul.className = 'nav-list nav-list-main';
  ul.querySelectorAll(':scope > li').forEach((li) => {
    const sub = li.querySelector(':scope > ul');
    if (!sub) {
      const cta = li.querySelector(':scope > strong, :scope > p > strong, a.button');
      if (cta) li.classList.add('nav-cta');
      unwrapLink(li);
      const a = li.querySelector('a');
      if (a) {
        a.className = '';
        a.removeAttribute('title');
      }
      return;
    }
    li.classList.add('has-sub');
    sub.className = 'subnav';
    sub.querySelectorAll(':scope > li').forEach(unwrapLink);
    const trigger = el('a', 'subnav-toggle', {
      href: '#', role: 'button', 'aria-haspopup': 'true', 'aria-expanded': 'false',
    });
    // move the authored label nodes (inside a <p> on delivery, bare text in the harness)
    [...li.childNodes].filter((n) => n !== sub).forEach((n) => {
      if (n.nodeName === 'P') {
        trigger.append(...n.childNodes);
        n.remove();
      } else if (n.nodeType === Node.TEXT_NODE && !n.textContent.trim()) n.remove();
      else trigger.append(n);
    });
    li.prepend(trigger);
  });
}

/**
 * loads and decorates the header
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);
  if (!fragment) return;
  const sections = [...fragment.querySelectorAll(':scope > .section')];
  const [brandSection, topSection, mainSection] = sections;

  const root = el('div', 'site-header');
  const main = document.querySelector('main');
  if (main && !main.id) main.id = 'content';
  const skip = el('a', 'skip-link', { href: '#content' });
  skip.textContent = 'Skip to content';

  const bar = el('nav', 'site-header-bar', { 'aria-label': 'Site' });
  const brand = brandSection && brandSection.querySelector('a');
  if (brand) {
    brand.className = 'site-header-brand';
    brand.removeAttribute('title');
    hideLabel(brand);
    brand.prepend(el('img', 'site-header-logo', {
      src: `${window.hlx.codeBasePath}/blocks/header/balbriggan-logo.svg`,
      alt: '',
      width: '283',
      height: '96',
    }));
    bar.append(brand);
  }

  const navs = el('div', 'site-header-navs');
  const top = el('div', 'site-header-top');
  if (topSection) {
    const [links, social] = topSection.querySelectorAll('ul');
    if (links) {
      links.className = 'nav-list nav-list-top';
      links.querySelectorAll(':scope > li').forEach(unwrapLink);
      top.append(links);
    }
    if (social) {
      decorateSocial(social);
      top.append(social);
    }
  }

  const primary = el('div', 'site-header-primary');
  const toggle = el('button', 'site-header-toggle', {
    type: 'button', 'aria-label': 'Toggle navigation', 'aria-expanded': 'false',
  });
  toggle.append(el('span'));
  const panel = el('div', 'site-header-main');
  const mainList = mainSection && mainSection.querySelector('ul');
  if (mainList) {
    decorateMainNav(mainList);
    panel.append(mainList);
  }
  primary.append(toggle, panel);
  navs.append(top, primary);
  bar.append(navs);
  root.append(skip, bar);

  // sticky header compacts after 100px of scroll
  const onScroll = () => root.classList.toggle('is-scrolled', window.scrollY > SCROLL_COMPACT);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // mobile drawer
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    animateDrawer(root, panel, open);
  });

  // dropdowns: click / Enter toggles, Escape and a click outside close
  const closeAll = (except) => {
    root.querySelectorAll('.has-sub.is-open').forEach((li) => {
      if (li === except) return;
      li.classList.remove('is-open');
      li.querySelector('.subnav-toggle').setAttribute('aria-expanded', 'false');
    });
  };
  root.querySelectorAll('.subnav-toggle').forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const li = trigger.parentElement;
      const open = !li.classList.contains('is-open');
      closeAll(li);
      li.classList.toggle('is-open', open);
      trigger.setAttribute('aria-expanded', String(open));
    });
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.site-header .has-sub')) closeAll();
  });
  root.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const openLi = root.querySelector('.has-sub.is-open');
    if (openLi) {
      closeAll();
      openLi.querySelector('.subnav-toggle').focus();
    } else if (!isDesktop.matches && root.classList.contains('is-open')) {
      toggle.setAttribute('aria-expanded', 'false');
      animateDrawer(root, panel, false);
      toggle.focus();
    }
  });
  isDesktop.addEventListener('change', () => {
    closeAll();
    root.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  });

  block.textContent = '';
  block.append(root);
}
