/**
 * Header block — myastrazeneca.ch (FR) chrome, template-slotted from the /nav document.
 *
 * /nav sections (default content only):
 *   1 = brand: the logo link (<p><a><picture>…</picture></a></p>)
 *   2 = the mega-menu list: one nested <ul> (level-0 → level-3), parents are list items
 *       whose label (text, <p> or <a>) is followed by a nested <ul>
 *   3 = tools: a <ul> of language links (DE / EN / FR / IT), a <p><a> account link and a
 *       <p> carrying the search label
 *
 * decorate() builds the prototype's `.lang-nav` + `.site-header` DOM as EMPTY slot wrappers
 * and MOVES the authored nodes into them (EW1 — nothing is rebuilt from text). The stock
 * hamburger / escape / focus-out machinery is kept and restyled. Observed live behaviours,
 * ported from stardust/prototypes/js/motion.js: a parent's click toggles `open` on its item
 * (siblings in the same list close, the level-0 arrow flips), a window scroll closes every
 * open item (the mobile burger state is exempt), the search icon toggles `searchbox-enabled`.
 * The header search ships NON-functional (stardust/dynamic-features.md row 3): the form
 * never submits. Nav decode matches `:scope > a, :scope > p > a` — the pipeline wraps a list
 * item's trigger in a <p> (#98).
 *
 * @ew-exempt search label — it is the input's accessible name (aria-labelledby), hidden
 *   exactly like the live <label> (display:none)
 */
import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// the source's own burger breakpoint (megamenu.css: ≤ 1023 burger, ≥ 1024 inline list)
const isDesktop = window.matchMedia('(min-width: 1024px)');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

/**
 * Creates an element with a class list and attributes.
 * @param {string} tag tag name
 * @param {string} [className] class attribute
 * @param {Object} [attrs] attributes
 * @returns {HTMLElement}
 */
function create(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
  return node;
}

/**
 * Opens or closes one mega-menu item (motion.js open()/close()).
 * @param {Element} li the .main-nav-item
 * @param {boolean} open target state
 */
function setOpen(li, open) {
  li.classList.toggle('open', open);
  const content = li.querySelector(':scope > .main-nav-content');
  if (content) content.setAttribute('aria-expanded', open ? 'true' : 'false');
  const icon = li.querySelector(':scope > .main-nav-content .main-nav-icon');
  if (icon) {
    icon.classList.toggle('glyph-arrow-down', !open);
    icon.classList.toggle('glyph-arrow-up', open);
  }
  if (open) {
    // megamenu.js column class — added on open, never removed (as observed)
    const group = li.querySelector(':scope > ul');
    if (group) group.classList.add('open-col-3');
  }
}

/**
 * Closes every open mega-menu item (megamenu.js closeAllNavItems).
 * @param {Element} nav the nav element
 */
function closeAll(nav) {
  nav.querySelectorAll('.main-nav-item.open').forEach((li) => setOpen(li, false));
}

/**
 * Toggles one item; other open items in the same list close first.
 * @param {Element} li the .main-nav-item
 */
function toggleItem(li) {
  li.parentElement.querySelectorAll(':scope > .main-nav-item.open').forEach((other) => {
    if (other !== li) setOpen(other, false);
  });
  setOpen(li, !li.classList.contains('open'));
}

/**
 * Closes the open mega-menu item (desktop) or the nav menu (mobile) on Escape.
 * @param {KeyboardEvent} e keydown event
 */
function closeOnEscape(e) {
  if (e.code !== 'Escape') return;
  const nav = document.getElementById('nav');
  if (!nav) return;
  const openItem = nav.querySelector('.main-nav-item.open');
  if (openItem && isDesktop.matches) {
    closeAll(nav);
    const content = openItem.querySelector(':scope > .main-nav-content');
    if (content) content.focus();
  } else if (!isDesktop.matches) {
    // eslint-disable-next-line no-use-before-define
    toggleMenu(nav, false);
    const button = nav.querySelector('.nav-hamburger button');
    if (button) button.focus();
  }
}

/**
 * Closes the open mega-menu item (desktop) or the nav menu (mobile) when focus leaves the nav.
 * @param {FocusEvent} e focusout event
 */
function closeOnFocusLost(e) {
  const nav = e.currentTarget;
  if (nav.contains(e.relatedTarget)) return;
  if (isDesktop.matches) {
    closeAll(nav);
  } else {
    // eslint-disable-next-line no-use-before-define
    toggleMenu(nav, false);
  }
}

/**
 * Toggles the entire nav (mobile burger); on desktop the list is always expanded.
 * @param {Element} nav the nav element
 * @param {*} forceExpanded optional forced state
 */
function toggleMenu(nav, forceExpanded = null) {
  const expanded = forceExpanded !== null
    ? !forceExpanded
    : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  // the desktop nav is always expanded, so aria-expanded only applies to the mobile menu
  if (isDesktop.matches) nav.removeAttribute('aria-expanded');
  else nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  closeAll(nav);
  if (button) {
    const opening = !expanded && !isDesktop.matches;
    button.setAttribute('aria-expanded', opening ? 'true' : 'false');
    button.setAttribute('aria-label', opening ? 'Fermer la navigation' : 'Ouvrir la navigation');
  }
  if (!expanded || isDesktop.matches) {
    window.addEventListener('keydown', closeOnEscape);
    nav.addEventListener('focusout', closeOnFocusLost);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
    nav.removeEventListener('focusout', closeOnFocusLost);
  }
}

/**
 * Decorates one authored list item as a mega-menu item (recursing into its sub-list).
 * The label nodes (text, <p>, <a>) MOVE into a `.main-nav-content` wrapper; a trigger
 * wrapped in a pipeline <p> is unwrapped (#98).
 * @param {Element} li authored list item
 * @param {number} level 0–3
 */
function decorateItem(li, level) {
  li.classList.add('main-nav-item', `main-nav-item-l${level}`);
  const group = li.querySelector(':scope > ul');
  const content = create('div', 'main-nav-content');
  [...li.childNodes].forEach((node) => {
    if (node !== group) content.append(node);
  });
  const wrapped = content.querySelector(':scope > p');
  const onlyChild = wrapped && content.children.length === 1;
  if (onlyChild && !content.textContent.replace(wrapped.textContent, '').trim()) {
    wrapped.replaceWith(...wrapped.childNodes);
  }
  // a bare text label gets the source's <span> so the label box reads like live
  if (!content.children.length && content.textContent.trim()) {
    const label = create('span', 'main-nav-label');
    label.append(...content.childNodes);
    content.append(label);
  }
  li.prepend(content);
  if (group) {
    li.classList.add('main-nav-parent');
    group.classList.add('main-nav-group', `main-nav-group-l${level + 1}`);
    content.setAttribute('role', 'button');
    content.setAttribute('tabindex', '0');
    content.setAttribute('aria-expanded', 'false');
    if (level === 0) {
      const icon = create('span', 'main-nav-icon glyph glyph-arrow-down', {
        'aria-hidden': 'true',
      });
      content.append(' ', icon);
    }
    content.addEventListener('click', () => toggleItem(li));
    content.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleItem(li);
      }
    });
    [...group.children].forEach((child) => decorateItem(child, level + 1));
  } else if (level === 1 && content.querySelector('a')) {
    li.classList.add('main-nav-viewall');
  }
}

/**
 * Builds the language strip around the authored language list.
 * @param {Element|null} list the authored <ul> of language links
 * @returns {HTMLElement}
 */
function buildLangNav(list) {
  const strip = create('div', 'lang-nav');
  const inner = create('div', 'lang-nav-nav');
  if (list) {
    list.classList.add('lang-nav-list');
    const items = [...list.children];
    const segment = window.location.pathname.split('/')[1];
    const pathOf = (li) => {
      const link = li.querySelector('a');
      return link ? new URL(link.href, window.location).pathname.split('/')[1] : null;
    };
    let active = segment ? items.find((li) => pathOf(li) === segment) : null;
    if (!active) {
      active = items.find((li) => {
        const link = li.querySelector('a');
        return link && new URL(link.href, window.location).origin === window.location.origin;
      });
    }
    if (active) active.classList.add('lang-nav-item-active');
    inner.append(list);
  }
  strip.append(inner);
  return strip;
}

/**
 * Builds the header search box (collapsed 40px state as captured); the authored label <p>
 * moves in as the sr-only accessible name. Submit is prevented (row 3: no results page).
 * @param {Element|null} labelP the authored search label paragraph
 * @returns {HTMLElement}
 */
function buildSearch(labelP) {
  const search = create('div', 'site-search');
  const box = create('div', 'site-search-box', { role: 'search' });
  const inner = create('div', 'site-search-inner');
  const form = create('form', 'site-search-form', { autocomplete: 'off', action: '#' });
  form.addEventListener('submit', (e) => e.preventDefault());
  const labelText = labelP ? labelP.textContent.trim() : 'Rechercher';
  const input = create('input', 'site-search-input', {
    id: 'search-text-box',
    type: 'text',
    placeholder: labelText,
  });
  if (labelP) {
    const labelWrap = create('div', 'site-search-label', { id: 'search-text-label' });
    labelWrap.append(labelP);
    form.append(labelWrap);
    input.setAttribute('aria-labelledby', 'search-text-label');
  } else {
    input.setAttribute('aria-label', labelText);
  }
  const field = create('div', 'site-search-field');
  const icon = create('button', 'site-search-icon glyph glyph-search', {
    type: 'button',
    'aria-label': labelText,
    'aria-expanded': 'false',
  });
  const clear = create('span', 'site-search-clear');
  const clearLink = create('button', 'site-search-clear-link', {
    type: 'button',
    'aria-label': 'Effacer',
  });
  const clearIcon = create('i', 'glyph glyph-times site-search-clear-text hidden', {
    'aria-hidden': 'true',
  });
  icon.addEventListener('click', () => {
    const on = !search.classList.contains('searchbox-enabled');
    search.classList.toggle('searchbox-enabled', on);
    icon.setAttribute('aria-expanded', on ? 'true' : 'false');
    if (on) input.focus({ preventScroll: reduceMotion.matches });
  });
  input.addEventListener('input', () => {
    clearIcon.classList.toggle('hidden', !input.value);
  });
  clearLink.addEventListener('click', () => {
    input.value = '';
    clearIcon.classList.add('hidden');
    input.focus({ preventScroll: reduceMotion.matches });
  });
  clearLink.append(clearIcon);
  clear.append(clearLink);
  field.append(icon, input, clear);
  form.append(field);
  inner.append(form);
  box.append(inner);
  search.append(box);
  return search;
}

/**
 * Loads and decorates the header: lang strip + site header slotted from /nav.
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);
  block.textContent = '';
  if (!fragment) return;

  // the authored sections in order (the empty section left by the metadata block is skipped)
  const wrappers = [...fragment.children]
    .filter((section) => section.firstElementChild)
    .map((section) => section.querySelector('.default-content-wrapper') || section);
  const [brand, menu, tools] = wrappers;

  const nav = create('nav', 'site-chrome', {
    id: 'nav',
    'aria-label': 'Navigation principale',
  });

  // language strip (.languagenavigation)
  const langList = tools ? tools.querySelector('ul') : null;
  nav.append(buildLangNav(langList));

  // header row (.cmp-experiencefragment--customMenu)
  const header = create('div', 'site-header');
  const inner = create('div', 'site-header-inner');
  const grid = create('div', 'site-header-grid');

  const logo = create('div', 'site-header-logo nav-brand');
  if (brand) {
    const img = create('div', 'img');
    [...brand.children].forEach((child) => img.append(child));
    logo.append(img);
  }

  const navCol = create('div', 'site-header-nav nav-sections');
  const mainNav = create('div', 'main-nav');
  const navNav = create('div', 'main-nav-nav');
  if (menu) {
    const list = menu.querySelector('ul');
    if (list) {
      list.classList.add('main-nav-list');
      [...list.children].forEach((li) => decorateItem(li, 0));
      navNav.append(list);
    }
  }
  const hamburger = create('div', 'nav-hamburger');
  const burger = create('button', 'main-nav-burger', {
    type: 'button',
    'aria-controls': 'nav',
    'aria-expanded': 'false',
    'aria-label': 'Ouvrir la navigation',
  });
  burger.append(create('span', 'nav-hamburger-icon'));
  burger.addEventListener('click', () => toggleMenu(nav));
  hamburger.append(burger);
  mainNav.append(navNav, hamburger);
  navCol.append(mainNav);

  const account = create('div', 'site-header-account nav-tools');
  const row = create('div', 'site-header-account-row');
  const user = create('div', 'site-header-user');
  if (tools) {
    const paragraphs = [...tools.querySelectorAll(':scope > p')];
    const accountP = paragraphs.find((p) => p.querySelector('a'));
    const labelP = paragraphs.find((p) => !p.querySelector('a') && p.textContent.trim());
    if (accountP) {
      const btn = create('div', 'btn btn-secondary');
      const link = accountP.querySelector('a');
      if (link && !link.children.length) {
        // the source wraps the button label in <span class="btn__text">
        const text = create('span', 'btn-text');
        text.append(...link.childNodes);
        link.append(text);
      }
      btn.append(accountP);
      user.append(btn);
    }
    row.append(user, buildSearch(labelP));
  } else {
    row.append(user);
  }
  account.append(row);

  grid.append(logo, navCol, account);
  inner.append(grid);
  header.append(inner);
  nav.append(header);

  // megamenu.js closeAllNavItems on scroll — the open mobile burger is exempt
  window.addEventListener('scroll', () => {
    if (!isDesktop.matches && nav.getAttribute('aria-expanded') === 'true') return;
    closeAll(nav);
  }, { passive: true });

  nav.setAttribute('aria-expanded', 'false');
  toggleMenu(nav, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, isDesktop.matches));

  const navWrapper = create('div', 'nav-wrapper');
  navWrapper.append(nav);
  block.append(navWrapper);
}
