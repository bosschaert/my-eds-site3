import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width (source page switches at 960px)
const isDesktop = window.matchMedia('(min-width: 960px)');

const OPEN_LABEL = 'メニューを開く';
const CLOSE_LABEL = 'メニューを閉じる';

function el(tag, className) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

/**
 * Normalizes an authored nav list (EW1: authored nodes are moved, never rebuilt):
 * - live DECODE (#98): a list item's trigger link arrives wrapped in <p> — unwrap it;
 * - an item that carries a nested list is an accordion/dropdown parent: its title text
 *   (bare text node on the harness, <p> on live) is kept as the first child, and the item
 *   gets the aria-expanded state the mobile accordion toggles.
 * @param {Element} list the authored <ul>
 * @param {Boolean} accordion attach the mobile accordion toggle to parent titles
 */
function prepareList(list, accordion) {
  if (!list) return;
  list.querySelectorAll(':scope > li').forEach((item) => {
    const sub = item.querySelector(':scope > ul');
    const p = item.querySelector(':scope > p');
    if (p && !sub) {
      p.replaceWith(...p.childNodes);
      return;
    }
    if (!sub) return;
    let title = item.querySelector(':scope > p, :scope > span');
    if (!title) {
      title = el('span');
      const leading = [...item.childNodes]
        .filter((n) => n !== sub && n.nodeType === Node.TEXT_NODE);
      leading.forEach((n) => title.append(n));
      item.prepend(title);
    }
    prepareList(sub, false);
    item.setAttribute('aria-expanded', 'false');
    if (accordion) {
      title.addEventListener('click', () => {
        const expanded = item.getAttribute('aria-expanded') === 'true';
        item.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      });
    }
  });
}

function stripIds(node) {
  node.querySelectorAll('[id]').forEach((n) => n.removeAttribute('id'));
  return node;
}

/**
 * Opens or closes the drawer (source behaviour: hamburger ⇄ aria-hidden on the drawer,
 * aria-expanded + label on the button, is-drawer-open on <html>).
 * @param {Element} nav The header root
 * @param {Element} drawer The drawer element
 * @param {*} forceOpen Optional param to force the drawer state when not null
 */
function toggleMenu(nav, drawer, forceOpen = null) {
  const wasOpen = nav.getAttribute('aria-expanded') === 'true';
  const open = (forceOpen !== null ? forceOpen : !wasOpen) && !isDesktop.matches;
  const button = nav.querySelector('.c-hamburger button');
  document.body.style.overflowY = open ? 'hidden' : '';
  nav.setAttribute('aria-expanded', open ? 'true' : 'false');
  drawer.setAttribute('aria-hidden', open ? 'false' : 'true');
  button.setAttribute('aria-expanded', open ? 'true' : 'false');
  button.setAttribute('aria-label', open ? CLOSE_LABEL : OPEN_LABEL);
  document.documentElement.classList.toggle('is-drawer-open', open);
  // collapse the drawer on escape keypress
  // eslint-disable-next-line no-use-before-define
  if (open) window.addEventListener('keydown', closeOnEscape);
  // eslint-disable-next-line no-use-before-define
  else window.removeEventListener('keydown', closeOnEscape);
}

function closeOnEscape(e) {
  if (e.code !== 'Escape') return;
  const nav = document.getElementById('nav');
  const drawer = document.getElementById('nav-drawer');
  if (!nav || !drawer) return;
  toggleMenu(nav, drawer, false);
  nav.querySelector('.c-hamburger button').focus();
}

/**
 * loads and decorates the header: the source chrome DOM is built as empty slots and the
 * authored /nav elements (logo link, menu list, Instagram + CONTACT links) are moved into them
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);
  if (!fragment) return;

  block.textContent = '';
  const sections = [...fragment.querySelectorAll(':scope > .section')];
  const [brandSection, listSection, toolsSection] = sections;
  const brandLink = brandSection
    ? brandSection.querySelector('a') || brandSection.querySelector('picture, img') : null;
  const navList = listSection ? listSection.querySelector('ul') : null;
  const toolLinks = toolsSection ? [...toolsSection.querySelectorAll('a')] : [];
  const snsLink = toolLinks.find((a) => a.querySelector('img'));
  const contactLink = toolLinks.find((a) => !a.querySelector('img'));

  // header row template
  const nav = el('div', 'l-header');
  nav.id = 'nav';
  nav.setAttribute('aria-expanded', 'false');
  const inner = el('div', 'l-header-inner');
  const brand = el('div', 'l-header-logo nav-brand');
  const right = el('div', 'l-header-right');
  const menu = el('nav', 'l-global-menu nav-sections');
  const sns = el('div', 'c-sns-link-container nav-tools');
  const snsItem = el('div', 'c-sns-link');
  const contact = el('div', 'button-contact');
  const hamburger = el('div', 'c-hamburger nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav-drawer" aria-expanded="false"
      aria-label="${OPEN_LABEL}">
      <span class="c-hamburger-inner"><span class="inner-line line1"></span>
      <span class="inner-line line2"></span></span>
    </button>`;
  sns.append(snsItem);
  right.append(menu, sns, contact, hamburger);
  inner.append(brand, right);

  // drawer template (TOP + the same menu + the Instagram link): presentational clones (EW4)
  const drawer = el('div', 'l-drawer');
  drawer.id = 'nav-drawer';
  drawer.setAttribute('aria-hidden', 'true');
  const drawerInner = el('div', 'l-drawer-inner');
  const drawerNav = el('div', 'l-drawer-inner-nav');
  const drawerMenu = el('nav', 'l-global-menu drawer-menu');
  const drawerSns = el('div', 'c-sns-link-container');
  const drawerSnsItem = el('div', 'c-sns-link');
  drawerSns.append(drawerSnsItem);
  drawerNav.append(drawerMenu, drawerSns);
  drawerInner.append(drawerNav);
  drawer.append(drawerInner);

  // slot the authored nodes
  // the source marks the header logo as the page's only <h1> (h1 > a > img): the authored
  // link node is slotted into an h1 wrapper, its paragraph wrapper dropped (EW4 node-slot)
  if (brandLink) {
    const heading = el('h1');
    heading.append(brandLink);
    brand.append(heading);
  }
  if (navList) {
    const clone = stripIds(navList.cloneNode(true));
    drawerMenu.append(clone);
    prepareList(clone, true);
    menu.append(navList);
    prepareList(navList, false);
  }
  if (snsLink) {
    const snsNode = snsLink.closest('p') || snsLink;
    drawerSnsItem.append(stripIds(snsNode.cloneNode(true)));
    snsItem.append(snsNode);
  }
  if (contactLink) contact.append(contactLink.closest('p') || contactLink);

  hamburger.addEventListener('click', () => toggleMenu(nav, drawer));
  nav.append(inner, drawer);
  // prevent mobile nav behavior on window resize
  toggleMenu(nav, drawer, false);
  isDesktop.addEventListener('change', () => toggleMenu(nav, drawer, false));

  const navWrapper = el('div', 'nav-wrapper');
  navWrapper.append(nav);
  block.append(navWrapper);
}
