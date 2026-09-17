import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const isDesktop = window.matchMedia('(min-width: 801px)');

function setMenuState(nav, open) {
  nav.setAttribute('aria-expanded', String(open));
  const button = nav.querySelector('.nav-hamburger button');
  button.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  document.body.style.overflowY = open && !isDesktop.matches ? 'hidden' : '';
}

function closeDropdowns(nav, except) {
  nav.querySelectorAll('.nav-drop[aria-expanded="true"]').forEach((item) => {
    if (item !== except) item.setAttribute('aria-expanded', 'false');
  });
}

function decorateDropdowns(nav) {
  nav.querySelectorAll('.nav-sections li').forEach((item) => {
    const trigger = item.querySelector(':scope > a, :scope > p > a');
    const triggerParagraph = trigger?.parentElement?.tagName === 'P' ? trigger.parentElement : null;
    if (triggerParagraph) triggerParagraph.replaceWith(trigger);
    if (!item.querySelector(':scope > ul') || !trigger) return;

    item.classList.add('nav-drop');
    item.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-haspopup', 'true');
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      const open = item.getAttribute('aria-expanded') === 'true';
      closeDropdowns(nav, item);
      item.setAttribute('aria-expanded', String(!open));
    });
  });
}

function decorateBrand(nav) {
  const link = nav.querySelector('.nav-brand a');
  if (!link) return;
  link.classList.remove('button', 'primary', 'secondary', 'accent');
  link.closest('.button-wrapper')?.classList.remove('button-wrapper');
  const logo = document.createElement('img');
  logo.src = '/img/balbriggan/logo.svg';
  logo.alt = '';
  link.prepend(logo);
}

function bindScrollState(block) {
  const host = block.closest('header');
  const update = () => {
    const compact = window.scrollY > 20;
    block.classList.toggle('is-scrolled', compact);
    host?.classList.toggle('is-scrolled', compact);
  };
  window.addEventListener('scroll', update, { passive: true });
  update();
}

export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  ['brand', 'sections', 'tools'].forEach((name, index) => {
    nav.children[index]?.classList.add(`nav-${name}`);
  });

  decorateBrand(nav);
  decorateDropdowns(nav);

  const hamburger = document.createElement('div');
  hamburger.className = 'nav-hamburger';
  hamburger.innerHTML = '<button type="button" aria-controls="nav" aria-label="Open navigation"><span></span><span></span><span></span></button>';
  hamburger.addEventListener('click', () => {
    setMenuState(nav, nav.getAttribute('aria-expanded') !== 'true');
  });
  nav.prepend(hamburger);

  nav.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    closeDropdowns(nav);
    setMenuState(nav, false);
    hamburger.querySelector('button').focus();
  });

  isDesktop.addEventListener('change', () => setMenuState(nav, false));
  setMenuState(nav, false);

  const wrapper = document.createElement('div');
  wrapper.className = 'nav-wrapper';
  wrapper.append(nav);
  block.append(wrapper);
  bindScrollState(block);
}
