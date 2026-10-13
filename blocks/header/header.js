import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/*
 * Header — template-slotted chrome of current-design.jp (prototype `header.site-header`
 * + the full-screen `dialog.menu-dialog`). Authored /nav document, three sections:
 *   1. brand  — a paragraph holding the logo link (<a href="/"><img></a>)
 *   2. links  — one <ul>; each <li> = JP link + EN twin paragraph
 *   3. tools  — the Instagram link and the Contact CTA (<strong><a>)
 *   4. menu   — the mobile menu dialog: one <ul> (JP link + EN twin per <li>) followed by
 *               the social link paragraphs (live labels differ from the desktop nav)
 * Authored elements are MOVED into the layout (EW1). The logo twin is a presentational clone,
 * instrumentation stripped (EW4).
 */

const INDEX_ATTRS = ['data-prose-index', 'data-image-index', 'data-block-index'];

function stripInstrumentation(root) {
  if (root.nodeType !== Node.ELEMENT_NODE) return root;
  [root, ...root.querySelectorAll('*')].forEach((node) => {
    INDEX_ATTRS.forEach((attr) => node.removeAttribute(attr));
  });
  return root;
}

function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

/**
 * Splits an authored <li> into its link and the twin (EN) nodes that follow it.
 * Accepts <li><p><a/></p><p>EN</p></li> (delivered), <li><a/><p>EN</p></li> and
 * <li><a/> EN</li>.
 */
function readItem(li) {
  const link = li.querySelector('a');
  if (!link) return null;
  const linkHost = link.closest('p') && li.contains(link.closest('p')) ? link.closest('p') : link;
  const twinNodes = [];
  [...li.childNodes].forEach((node) => {
    if (node === linkHost) return;
    if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'P') {
      twinNodes.push(...node.childNodes);
    } else if (node.nodeType === Node.ELEMENT_NODE || node.textContent.trim()) {
      twinNodes.push(node);
    }
  });
  return { link, twinNodes };
}

/** Turns an authored <li> into the prototype's navlink (label + hover twin), moving nodes. */
function decorateItem(li, itemClass = 'site-header-item') {
  const item = readItem(li);
  if (!item) return;
  const { link, twinNodes } = item;

  const label = el('span', 'navlink-label');
  label.append(...link.childNodes);
  const twin = el('span', 'navlink-label navlink-label-twin');
  if (twinNodes.length) twin.append(...twinNodes);
  else {
    twin.setAttribute('aria-hidden', 'true');
    twin.append(...[...label.childNodes].map((n) => stripInstrumentation(n.cloneNode(true))));
  }
  link.classList.add('navlink');
  if (itemClass === 'site-header-item') link.append(label, twin);
  else {
    const labels = el('span', 'menu-dialog-labels');
    labels.append(label, twin);
    link.append(labels);
  }
  li.className = itemClass;
  li.replaceChildren(link);
}

/** Builds the menu dialog from the authored menu section (moved, not rebuilt). */
function buildDialog(menuSection) {
  const dialog = el('dialog', 'menu-dialog', { id: 'menu', 'aria-label': 'メニュー' });
  const list = el('div', 'menu-dialog-list');
  const ul = menuSection?.querySelector('ul');
  if (ul) {
    [...ul.children].forEach((li) => decorateItem(li, 'menu-dialog-item'));
    list.append(ul);
  }
  const social = el('div', 'menu-dialog-social');
  const socialLinks = menuSection
    ? [...menuSection.querySelectorAll('a')].filter((a) => !a.closest('ul')) : [];
  socialLinks.forEach((a) => social.append(a.closest('p') || a));
  list.append(social);
  const bar = el('div', 'menu-dialog-bar');
  const close = el('button', 'menu-dialog-close', {
    type: 'button', 'aria-label': 'メニューを閉じる',
  });
  close.append(el('i'), el('i'));
  bar.append(close);
  dialog.append(bar, list);
  return { dialog, close };
}

function wireDialog(dialog, close, burger) {
  const hide = () => {
    dialog.classList.remove('modal-ready');
    burger.setAttribute('aria-expanded', 'false');
    setTimeout(() => { if (dialog.open) dialog.close(); }, 400);
  };
  burger.addEventListener('click', () => {
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
    burger.setAttribute('aria-expanded', 'true');
    requestAnimationFrame(() => requestAnimationFrame(() => dialog.classList.add('modal-ready')));
  });
  close.addEventListener('click', hide);
  dialog.addEventListener('cancel', (e) => { e.preventDefault(); hide(); });
  dialog.querySelectorAll('a').forEach((a) => a.addEventListener('click', hide));
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

  fragment.querySelectorAll('.metadata').forEach((meta) => {
    meta.closest('div:not(.metadata)')?.remove();
  });
  const sections = [...fragment.querySelectorAll(':scope > .section')]
    .filter((s) => s.textContent.trim() || s.querySelector('img, picture'));
  const brandSection = sections
    .find((s) => s.querySelector('img, picture') && !s.querySelector('ul')) || sections[0];
  const listSections = sections.filter((s) => s !== brandSection && s.querySelector('ul'));
  const [navSection, menuSection] = listSections;
  const toolSection = sections.find((s) => s !== brandSection && !listSections.includes(s));

  const header = el('div', 'site-header', { id: 'header' });

  // brand: move the authored logo paragraph, add the hover twin (presentational clone)
  const brand = el('div', 'site-header-brand');
  const logoP = brandSection?.querySelector('p:has(img), p:has(picture)')
    || brandSection?.querySelector('a, picture, img');
  if (logoP) {
    brand.append(logoP);
    const logoLink = brand.querySelector('a') || brand;
    logoLink.classList.add('site-header-logo');
    const media = logoLink.querySelector('picture') || logoLink.querySelector('img');
    if (media) {
      const twin = stripInstrumentation(media.cloneNode(true));
      twin.setAttribute('aria-hidden', 'true');
      twin.querySelectorAll('img').forEach((img) => { img.alt = ''; });
      if (twin.tagName === 'IMG') twin.alt = '';
      twin.classList.add('site-header-logo-twin');
      media.after(twin);
    }
  }

  // nav: the authored <ul> (editable unit) + the Instagram link, in the pill bar
  const nav = el('nav', 'site-header-nav', { 'aria-label': 'メイン' });
  const menu = el('div', 'site-header-menu');
  const ul = navSection?.querySelector('ul');
  if (ul) {
    [...ul.children].forEach((li) => decorateItem(li));
    menu.append(ul);
  }

  const contact = el('div', 'site-header-contact');
  const toolLinks = toolSection ? [...toolSection.querySelectorAll('a')] : [];
  toolLinks.forEach((a) => {
    const host = a.closest('p') || a;
    if (/instagram\.com/.test(a.href)) {
      a.classList.add('site-header-insta');
      menu.append(host);
    } else {
      a.classList.remove('button', 'primary', 'secondary', 'accent');
      const label = el('span', 'site-header-contact-label');
      label.append(...a.childNodes);
      a.append(label, el('i'));
      contact.append(host);
    }
  });
  nav.append(menu);

  const burger = el('button', 'site-header-burger', {
    type: 'button', 'aria-label': 'メニュー', 'aria-controls': 'menu', 'aria-expanded': 'false',
  });
  const bars = el('span');
  bars.append(el('i'), el('i'));
  burger.append(bars);

  header.append(brand, nav, contact, burger);
  const { dialog, close } = buildDialog(menuSection);
  wireDialog(dialog, close, burger);

  block.replaceChildren(header, dialog);
}
