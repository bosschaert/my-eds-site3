import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * Header block — template-slotted (stardust/eds-conversion-log.md § Delivery design notes).
 * Loads /nav and MOVES the authored brand heading into #logo and the single authored
 * list into the one nav (#mobileNav > .wrapper > nav#topNav); CSS `order` swaps the
 * list between its mobile position (above the Menu toggle) and its desktop position
 * (under the logo) — no clone.
 * @ew-exempt Menu — block-owned toggle label of the mobile navigation
 * @param {Element} block The header block element
 */

function markCurrent(list) {
  const here = window.location.pathname.replace(/\/+$/, '') || '/';
  list.querySelectorAll('a[href]').forEach((a) => {
    let target;
    try {
      target = new URL(a.getAttribute('href'), window.location.href);
    } catch (e) {
      return;
    }
    if (target.origin !== window.location.origin) return;
    const path = target.pathname.replace(/\/+$/, '') || '/';
    if (path === here) a.setAttribute('aria-current', 'page');
  });
}

function buildToggle(mobileNav) {
  const wrapper = document.createElement('div');
  wrapper.id = 'mobileMenuLink';
  const link = document.createElement('a');
  link.href = '#mobileNav';
  link.setAttribute('role', 'button');
  link.setAttribute('aria-controls', 'mobileNav');
  link.setAttribute('aria-expanded', 'false');
  link.textContent = 'Menu';
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const open = document.body.classList.toggle('menu-open');
    link.setAttribute('aria-expanded', open ? 'true' : 'false');
    mobileNav.setAttribute('aria-hidden', open ? 'false' : 'true');
  });
  wrapper.append(link);
  return wrapper;
}

export default async function decorate(block) {
  if (block.querySelector(':scope > #header')) return;

  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);
  if (!fragment) return;

  const header = document.createElement('div');
  header.id = 'header';

  const mobileNav = document.createElement('div');
  mobileNav.id = 'mobileNav';
  const mobileNavWrapper = document.createElement('div');
  mobileNavWrapper.className = 'wrapper';
  mobileNavWrapper.id = 'mobileNavWrapper';
  const nav = document.createElement('nav');
  nav.className = 'main-nav';
  nav.id = 'topNav';
  mobileNavWrapper.append(nav);
  mobileNav.append(mobileNavWrapper);

  const logo = document.createElement('div');
  logo.id = 'logo';

  // the brand heading is authored in the page document (its single <h1>, served
  // server-side for SEO) in a `brand` section; /nav may still carry it as a fallback
  const pageBrandSection = document.querySelector('main > .section.brand');
  const brand = (pageBrandSection && pageBrandSection.querySelector('h1, h2, h3'))
    || fragment.querySelector('h1, h2, h3');
  const list = fragment.querySelector('ul');
  if (brand) logo.append(brand);
  if (pageBrandSection && !pageBrandSection.querySelector('h1, h2, h3, p, img, ul')) pageBrandSection.remove();
  if (list) {
    markCurrent(list);
    nav.append(list);
  }

  // leftovers pass: anything else authored in /nav stays visible under the logo
  const leftovers = document.createElement('div');
  leftovers.className = 'header-extra';
  fragment.querySelectorAll(':scope > .section > div > *').forEach((el) => {
    if (el.matches('.section-metadata, .metadata')) return;
    leftovers.append(el);
  });

  header.append(mobileNav, buildToggle(mobileNav), logo);
  if (leftovers.children.length) header.append(leftovers);

  const divider = document.createElement('div');
  divider.className = 'page-divider';

  block.textContent = '';
  block.append(header, divider);
  block.querySelectorAll('img').forEach((img) => {
    img.loading = 'eager';
  });
}
