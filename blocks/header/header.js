/*
 * Header block — the live balbriggan.ie sticky Bootstrap navbar, template-slotted (#95).
 * Authored /nav document: section 1 = brand (logo link), section 2 = main menu list (a nested
 * list is a dropdown, an emphasised item is the yellow nav button), section 3 = tools (top menu
 * list, then the social list). Authored nodes are MOVED into the template (EW1); the generated
 * wrappers carry the layout classes (EW2); the hamburger is the only <button> (EW7).
 * Mechanics reproduce the live theme: sticky header morph (.scrolled past 100px, 300ms logo
 * shrink in CSS), Bootstrap-4 collapse for the hamburger (.collapsing, height 350ms) and
 * Bootstrap-4 click dropdowns (one open at a time, outside click closes).
 * @ew-exempt <ul> social labels (Facebook, Twitter, LinkedIn, Instagram) — icon-only anchor
 *   on live; the label moves to aria-label
 * stardust-foundation-marker: header-v3
 */
import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const SCROLL_THRESHOLD = 100;
const COLLAPSE_MS = 350;
const SOCIAL_HOSTS = /facebook|twitter|x\.com|linkedin|instagram|youtube/i;

const SOCIAL_ICONS = [
  [/facebook/i, 'facebook'],
  [/twitter|x\.com/i, 'twitter'],
  [/linkedin/i, 'linkedin'],
  [/instagram/i, 'instagram'],
  [/youtube/i, 'youtube'],
];

/**
 * Live social anchors are icon-only: the authored label becomes the anchor's aria-label and a
 * FontAwesome <i class="fa fa-<network>"> glyph is the only content (no text node left behind).
 */
function iconifySocialLinks(list) {
  list.querySelectorAll('a[href]').forEach((a) => {
    const label = a.textContent.trim();
    if (label && !a.hasAttribute('aria-label')) a.setAttribute('aria-label', label);
    const [, name] = SOCIAL_ICONS.find(([re]) => re.test(a.href)) || [];
    a.textContent = '';
    if (name) {
      const icon = document.createElement('i');
      icon.className = `fa fa-${name}`;
      icon.setAttribute('aria-hidden', 'true');
      a.append(icon);
    }
  });
}

function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
  return node;
}

/** top-level lists of a fragment section (nested lists belong to their parent item) */
function topLevelLists(section) {
  if (!section) return [];
  const lists = [...section.querySelectorAll('ul, ol')];
  return lists.filter((list) => !list.parentElement.closest('ul, ol'));
}

/** every link of the list points at a social network */
function isSocialList(list) {
  const links = [...list.querySelectorAll('a[href]')];
  return links.length > 0 && links.every((a) => SOCIAL_HOSTS.test(a.href));
}

/** the pipeline wraps an item's trigger link in <p> on live (#98): normalise to <li><a>…<ul> */
function unwrapListParagraphs(list) {
  list.querySelectorAll('li > p').forEach((p) => p.replaceWith(...p.childNodes));
}

/** forces a layout flush between the two height writes of the collapse transition */
function reflow(node) {
  return node.offsetHeight;
}

/** Bootstrap-4 collapse state machine: collapse -> collapsing (height 0 -> scrollHeight) -> show */
function wireCollapse(button, target) {
  let busy = false;
  button.addEventListener('click', () => {
    if (busy) return;
    busy = true;
    const showing = target.classList.contains('show');
    if (!showing) {
      target.classList.remove('collapse');
      target.classList.add('collapsing');
      target.style.height = '0px';
      button.classList.remove('collapsed');
      button.setAttribute('aria-expanded', 'true');
      reflow(target);
      target.style.height = `${target.scrollHeight}px`;
      setTimeout(() => {
        target.classList.remove('collapsing');
        target.classList.add('collapse', 'show');
        target.style.height = '';
        busy = false;
      }, COLLAPSE_MS);
    } else {
      target.style.height = `${target.getBoundingClientRect().height}px`;
      reflow(target);
      target.classList.add('collapsing');
      target.classList.remove('collapse', 'show');
      button.classList.add('collapsed');
      button.setAttribute('aria-expanded', 'false');
      target.style.height = '';
      setTimeout(() => {
        target.classList.remove('collapsing');
        target.classList.add('collapse');
        busy = false;
      }, COLLAPSE_MS);
    }
  });
}

function closeDropdowns(menu, except = null) {
  menu.querySelectorAll('a[aria-expanded="true"]').forEach((trigger) => {
    if (trigger !== except) trigger.setAttribute('aria-expanded', 'false');
  });
}

/** Bootstrap-4 dropdowns: click toggles the trigger's aria-expanded, one open at a time */
function wireDropdowns(menu) {
  menu.querySelectorAll('li').forEach((item) => {
    const submenu = [...item.children].find((child) => child.matches('ul, ol'));
    const trigger = [...item.children].find((child) => child.matches('a'));
    if (!submenu || !trigger) return;
    trigger.setAttribute('role', 'button');
    trigger.setAttribute('aria-haspopup', 'true');
    trigger.setAttribute('aria-expanded', 'false');
    submenu.setAttribute('role', 'menu');
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const open = trigger.getAttribute('aria-expanded') === 'true';
      closeDropdowns(menu, trigger);
      trigger.setAttribute('aria-expanded', open ? 'false' : 'true');
    });
  });
  document.addEventListener('click', () => closeDropdowns(menu));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDropdowns(menu);
  });
}

/** live theme: .scrolled once the page is scrolled past 100px; the morph itself is CSS */
function wireScrollMorph(block) {
  const morph = () => {
    block.classList.toggle('scrolled', window.scrollY > SCROLL_THRESHOLD);
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

  block.textContent = '';
  // sections by role, in authored order; the metadata section delivers as an empty div — skip it
  const sections = [...fragment.children].filter((section) => section.children.length > 0);
  const [brandSection, menuSection, toolsSection] = sections;

  const nav = el('nav', 'navbar navbar-expand-xl navbar-dark', { 'aria-label': 'Main navigation' });
  const container = el('div', 'container-fluid');
  nav.append(container);

  // brand: the authored logo link moves as its paragraph
  const brand = el('div', 'navbar-brand');
  if (brandSection) {
    const link = brandSection.querySelector('a[href]');
    const media = brandSection.querySelector('picture, img');
    if (link && media && !link.contains(media)) link.prepend(media);
    const carrier = link || media;
    if (carrier) brand.append(carrier.closest('p') || carrier);
  }

  // tools: top menu list + social list
  const navs = el('div', 'navs');
  const topnav = el('div', 'topnav');
  const topMenu = el('div', 'top-menu collapse navbar-collapse');
  const social = el('div', 'list-social');
  const toolLists = topLevelLists(toolsSection);
  const socialList = toolLists.find(isSocialList);
  const topList = toolLists.find((list) => list !== socialList);
  if (topList) {
    unwrapListParagraphs(topList);
    topMenu.append(topList);
  }
  if (socialList) {
    unwrapListParagraphs(socialList);
    iconifySocialLinks(socialList);
    social.append(socialList);
  }
  topnav.append(topMenu, social);

  // main menu behind the hamburger below the xl breakpoint
  const primary = el('div', 'primarynav');
  const toggler = el('button', 'navbar-toggler collapsed', {
    type: 'button',
    'aria-controls': 'navbar-nav-dropdown',
    'aria-expanded': 'false',
    'aria-label': 'Toggle navigation',
  });
  toggler.append(el('span', 'navbar-toggler-icon'));
  const mainMenu = el('div', 'main-menu collapse navbar-collapse', { id: 'navbar-nav-dropdown' });
  const [menuList] = topLevelLists(menuSection);
  if (menuList) {
    unwrapListParagraphs(menuList);
    wireDropdowns(menuList);
    mainMenu.append(menuList);
  }
  primary.append(toggler, mainMenu);
  navs.append(topnav, primary);
  container.append(brand, navs);

  // leftovers: any authored element no slot consumed stays visible in default styling
  const leftovers = [...fragment.querySelectorAll('.default-content-wrapper > *')];
  if (leftovers.length) {
    const extra = el('div', 'nav-extra');
    leftovers.forEach((node) => extra.append(node));
    container.append(extra);
  }

  wireCollapse(toggler, mainMenu);
  const wrapper = el('div', 'sticky-nav');
  wrapper.append(nav);
  block.append(wrapper);
  wireScrollMorph(block);
}
