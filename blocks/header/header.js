import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import {
  createIcon,
  uIcon,
  throttle,
  setSticky,
  stripInstrumentation,
  loadChromeFragment,
  fragmentSections,
  itemLink,
  getCart,
} from '../../scripts/utils.js';

/**
 * Header (o-header chrome): fixed meta bar (logo, country / language / cart / search /
 * burger), in-flow main navigation, mega dropdown, mobile off-canvas menu.
 * Content: /<locale>/nav — sections: brand | tools | menu labels | one per nav item (h2).
 * Template-slotted: authored nodes are moved into the chrome template; the off-canvas
 * tree is a presentational clone of the nav items (EW4).
 * @ew-exempt search placeholder and aria-labels are attributes read from authored link text
 */

const el = (tag, className, ...children) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  children.filter(Boolean).forEach((c) => node.append(c));
  return node;
};

const isDesktop = window.matchMedia('(min-width: 1023px)');

function moveChildren(from, to) {
  while (from.firstChild) to.append(from.firstChild);
  return to;
}

/* ---------- meta bar ---------- */

function buildLogo(brand) {
  const a = brand && brand.querySelector('a');
  const logo = a || el('a');
  if (!a) logo.href = '/';
  logo.className = 'header-logo';
  if (!logo.title) logo.title = logo.textContent.trim();
  const label = moveChildren(logo, el('span', 'label-hidden'));
  logo.append(
    createIcon('logo'),
    el('div', 'header-slogan', createIcon('slogan')),
    label,
  );
  return logo;
}

function countryCode(href) {
  const seg = new URL(href, window.location).pathname.split('/').filter(Boolean)[0] || '';
  const m = seg.match(/^[a-z]{2}-([a-z]{2})$/);
  return m ? m[1] : null;
}

function buildCountry(a) {
  a.className = 'country-button';
  const hidden = el('div', 'visually-hidden');
  hidden.textContent = a.title || '';
  a.removeAttribute('title');
  const label = moveChildren(a, el('span', 'country-label'));
  const code = countryCode(a.href);
  if (code) {
    a.append(
      hidden,
      el('span', 'u-icon country-icon-sm', createIcon(`flag-1x1-${code}`, { img: true })),
      el('i', 'u-icon is-sm country-icon-lg', createIcon(`flag-4x3-${code}`, { img: true })),
      label,
    );
  } else {
    a.append(
      hidden,
      el('span', 'u-icon country-icon-sm', createIcon('globe')),
      el('i', 'u-icon is-sm country-icon-lg', createIcon('globe')),
      label,
    );
  }
  return el('div', 'header-meta-item', a);
}

function buildGlobal(a) {
  a.className = 'global-button';
  const label = moveChildren(a, el('span', 'global-button-text'));
  a.append(
    el('span', 'u-icon global-icon-sm', createIcon('globe')),
    el('i', 'u-icon is-sm global-icon-lg', createIcon('globe')),
    label,
  );
  return el('div', 'header-meta-item is-global', a, el('div', 'global-button-spacer'));
}

function buildLanguage(ul) {
  const items = [...ul.children];
  const current = items.find((li) => !itemLink(li));
  if (!current || items.length < 2) return null;
  const button = el('a', 'lang-menu-button');
  button.href = '#';
  button.setAttribute('role', 'button');
  button.setAttribute('aria-label', 'Show Language Menu');
  button.setAttribute('aria-expanded', 'false');
  moveChildren(current, button);
  button.append(' ');
  button.append(uIcon('chevron-down', 'is-xs ml-1', 'span'));
  current.remove();
  ul.className = 'c-list-clean';
  [...ul.children].forEach((li) => {
    li.className = 'lang-menu-item';
    const a = itemLink(li);
    if (a) {
      a.className = 'lang-menu-link';
      if (a.parentElement !== li) a.parentElement.replaceWith(a);
    }
  });
  const dropdown = el('div', 'lang-menu-dropdown', ul);
  const menu = el('div', 'lang-menu', button, dropdown);
  button.addEventListener('click', (e) => {
    e.preventDefault();
    const open = !button.classList.contains('is-active');
    button.classList.toggle('is-active', open);
    dropdown.classList.toggle('is-visible', open);
    button.setAttribute('aria-expanded', String(open));
  });
  return el('div', 'header-meta-item is-lang', menu);
}

function buildCart(a) {
  a.className = 'cart-toggle';
  a.setAttribute('role', 'button');
  a.setAttribute('aria-label', a.textContent.trim());
  const label = moveChildren(a, el('span', 'label-hidden'));
  const count = el('span', 'cart-items');
  a.append(count, el('span', 'u-icon', createIcon('folder')), label);
  const update = () => {
    const n = getCart().length;
    count.textContent = n ? String(n) : '';
    count.classList.toggle('is-active', n > 0);
  };
  update();
  document.addEventListener('download-cart-change', update);
  a.addEventListener('click', (e) => {
    e.preventDefault();
    document.dispatchEvent(new CustomEvent('download-cart-open'));
  });
  return el('div', 'header-meta-item is-cart', a);
}

let queryIndex = null;
async function searchIndex(term) {
  if (!queryIndex) {
    queryIndex = fetch('/query-index.json')
      .then((r) => (r.ok ? r.json() : { data: [] }))
      .then((j) => j.data || [])
      .catch(() => []);
  }
  const rows = await queryIndex;
  const t = term.toLowerCase();
  return rows.filter((r) => (r.title || '').toLowerCase().includes(t)).slice(0, 5);
}

function buildSearch(link, extras) {
  const form = el('form', 'quicksearch-form');
  form.action = link.getAttribute('href');
  form.method = 'get';
  form.setAttribute('role', 'search');
  const input = el('input', 'quicksearch-input');
  input.type = 'text';
  input.name = 'q';
  input.autocomplete = 'off';
  input.placeholder = link.textContent.trim();
  input.setAttribute('aria-label', link.textContent.trim());
  const label = link.title || link.textContent.trim();
  const submit = el('button', 'quicksearch-submit', uIcon('search', 'has-bg is-link', 'span'));
  submit.type = 'submit';
  submit.setAttribute('aria-label', label);

  const container = el('div', 'suggest-container');
  const { header, list, labels } = extras;
  let frequent = null;
  if (header && list) {
    header.className = 'suggest-header';
    list.className = 'frequent-list';
    [...list.children].forEach((li) => { li.className = 'frequent-link'; });
    frequent = el('div', 'suggest-box', header, list);
    container.append(frequent);
  }
  const suggestions = el('ul', 'suggestion-list');
  const results = el('ul', 'top-result-list');
  const [l1, l2] = labels;
  if (l1) l1.className = 'suggest-header';
  if (l2) l2.className = 'suggest-header';
  const auto = el(
    'div',
    'suggest-box',
    el(
      'div',
      'row',
      el('div', 'col-lg-4', l1, suggestions),
      el('div', 'col-lg-8', l2, results),
    ),
  );
  container.append(auto);
  form.append(container, el('div', 'quicksearch-form-content', input, submit));

  const toggle = el(
    'button',
    'quicksearch-toggle',
    el('span', 'u-icon quicksearch-toggle-icon', createIcon('search')),
    el('span', 'u-icon quicksearch-toggle-icon', createIcon('close')),
  );
  toggle.type = 'button';
  toggle.setAttribute('aria-label', label);
  toggle.addEventListener('click', () => {
    const open = !toggle.classList.contains('is-active');
    toggle.classList.toggle('is-active', open);
    form.classList.toggle('is-visible', open);
    if (open) input.focus();
  });

  const showBox = (box) => {
    [frequent, auto].forEach((b) => b && b.classList.toggle('is-visible', b === box));
  };
  input.addEventListener('focus', () => showBox(input.value ? auto : frequent));
  input.addEventListener('blur', () => setTimeout(() => showBox(null), 200));
  input.addEventListener('input', throttle(async () => {
    const term = input.value.trim();
    if (term.length < 2) {
      showBox(frequent);
      return;
    }
    const rows = await searchIndex(term);
    results.replaceChildren(...rows.map((r) => {
      const a = el('a');
      a.href = r.path;
      a.textContent = r.title;
      return el('li', 'top-result', a);
    }));
    showBox(rows.length ? auto : null);
  }, 300));

  link.closest('p').remove();
  return el('div', 'header-meta-item', el('div', 'quicksearch', form, toggle));
}

/* ---------- navigation ---------- */

let uid = 0;
const nextId = () => {
  uid += 1;
  return `oc-${uid}`;
};

/** Parse one nav item section: h2 link, optional alt title (h3), text paragraphs, tree. */
function parseItem(section) {
  const h2 = section.querySelector('h2');
  const link = h2 && h2.querySelector('a');
  const h3 = section.querySelector('h3');
  const texts = [...section.children].filter((c) => c.tagName === 'P');
  const tree = section.querySelector(':scope > ul');
  return {
    h2, link, h3, texts, tree,
  };
}

/** Off-canvas list tree (presentational clone of the authored tree). */
function buildOffcanvasLists(items, langLabel, langList) {
  const lists = [];
  const makeList = (id, hidden) => {
    const list = el('div', `nav-list has-background-gray offcanvas-anim${hidden ? ' is-hidden' : ''}`);
    list.dataset.offcanvasTarget = id;
    lists.push(list);
    return list;
  };
  const makeLink = (a, trigger) => {
    const clone = stripInstrumentation(a.cloneNode(true));
    clone.className = 'nav-list-link offcanvas-content';
    clone.removeAttribute('title');
    const span = moveChildren(clone, el('span'));
    clone.append(span);
    if (trigger) {
      clone.dataset.offcanvasTrigger = trigger;
      clone.append(uIcon('chevron-down', 'is-xs is-indented'));
    }
    return clone;
  };
  const addTree = (ul, selfLink, id) => {
    const list = makeList(id, true);
    list.append(el('div', 'nav-list-item', makeLink(selfLink)));
    [...ul.children].forEach((li) => {
      const a = itemLink(li);
      if (!a) return;
      const sub = li.querySelector(':scope > ul');
      const subId = sub ? nextId() : null;
      list.append(el('div', 'nav-list-item', makeLink(a, subId)));
      if (sub) addTree(sub, a, subId);
    });
  };
  const root = makeList('root', false);
  items.forEach(({ link, tree }) => {
    if (!link) return;
    const id = tree ? nextId() : null;
    root.append(el('div', 'nav-list-item', makeLink(link, id)));
    if (tree) addTree(tree, link, id);
  });
  if (langLabel && langList) {
    const trigger = el('a', 'nav-list-link offcanvas-content');
    trigger.href = '#';
    trigger.dataset.offcanvasTrigger = 'language';
    trigger.append(moveChildren(langLabel, el('span')), uIcon('chevron-down', 'is-xs is-indented'));
    langLabel.remove();
    root.append(el('div', 'nav-list-item is-secondary', trigger));
    const list = makeList('language', true);
    [...langList.children].forEach((li) => {
      const a = itemLink(li);
      if (a) {
        a.className = 'nav-list-link offcanvas-content';
        list.append(el('div', 'nav-list-item', a));
      } else {
        list.append(el('div', 'nav-list-item', moveChildren(li, el('div', 'nav-list-link offcanvas-content'))));
      }
    });
    langList.remove();
  }
  return lists;
}

function buildOffcanvas(items, menuSection, toggle, overlay) {
  const ps = menuSection ? [...menuSection.querySelectorAll(':scope > p')] : [];
  const langList = menuSection ? menuSection.querySelector(':scope > ul') : null;
  const [backP, langP] = ps;
  const back = el('a', 'offcanvas-backlink offcanvas-content is-hidden');
  back.href = '#';
  back.append(uIcon('chevron-right', 'is-xs mr-1'));
  if (backP) {
    back.append(moveChildren(backP, el('span')));
    backP.remove();
  }
  const lists = buildOffcanvasLists(items, langP, langList);
  const panel = el('div', 'offcanvas', back, el('div', 'position-relative', ...lists));

  const listOf = (id) => lists.find((l) => l.dataset.offcanvasTarget === id);
  const stack = [];
  let current = listOf('root');
  const show = (next) => {
    if (!next || next === current) return;
    const prev = current;
    current = next;
    prev.classList.add('is-fade-out');
    next.classList.remove('is-hidden');
    next.classList.add('is-fade-in');
    requestAnimationFrame(() => requestAnimationFrame(() => next.classList.remove('is-fade-in')));
    setTimeout(() => {
      prev.classList.add('is-hidden');
      prev.classList.remove('is-fade-out');
    }, 150);
    back.classList.toggle('is-hidden', stack.length === 0);
  };
  const setOpen = (open) => {
    panel.classList.toggle('is-visible', open);
    toggle.classList.toggle('is-active', open);
    toggle.setAttribute('aria-expanded', String(open));
    overlay.classList.toggle('is-visible', open);
  };
  toggle.addEventListener('click', () => setOpen(!panel.classList.contains('is-visible')));
  overlay.addEventListener('click', () => setOpen(false));
  panel.addEventListener('click', (e) => {
    const a = e.target.closest('[data-offcanvas-trigger]');
    if (!a) return;
    const next = listOf(a.dataset.offcanvasTrigger);
    if (!next) return;
    e.preventDefault();
    stack.push(current);
    show(next);
  });
  back.addEventListener('click', (e) => {
    e.preventDefault();
    show(stack.pop());
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && panel.classList.contains('is-visible')) setOpen(false);
  });
  return panel;
}

function buildDesktopNav(items, overlay) {
  const nav = el('ul', 'main-nav is-corporate');
  const content = el('div', 'nav-dropdown-content container');
  const dropdown = el('div', 'nav-dropdown', content);
  const triggers = [];
  const rows = [];

  items.forEach((item) => {
    const { link, h3, texts } = item;
    if (!link) return;
    // dropdown row (title + text + columns), built before the nav link moves
    const title = h3 && h3.querySelector('a')
      ? h3.querySelector('a')
      : stripInstrumentation(link.cloneNode(true));
    title.removeAttribute('class');
    const text = el('div', 'nav-dropdown-text');
    texts.forEach((p) => {
      p.querySelectorAll('a').forEach((a) => {
        if (a.getAttribute('href').startsWith('/')) a.className = 'link-internal';
      });
      text.append(p);
    });
    const cols = el('div', 'row');
    if (item.tree) {
      [...item.tree.children].forEach((li) => {
        const a = itemLink(li);
        if (!a) return;
        const col = el('div', 'nav-dropdown-col', el('div', 'nav-dropdown-item-title', a));
        const sub = li.querySelector(':scope > ul');
        if (sub) {
          const list = el('ul', 'c-list-clean nav-dropdown-list');
          [...sub.children].forEach((sli) => {
            const sa = itemLink(sli);
            if (sa) list.append(el('li', '', sa));
          });
          col.append(list);
        }
        cols.append(col);
      });
    }
    const row = el(
      'div',
      'row nav-dropdown-items',
      el('div', 'nav-dropdown-intro', el('div', 'nav-dropdown-title', title), text),
      el('div', 'nav-dropdown-cols', cols),
    );
    rows.push(row);
    content.append(row);

    // main-nav link: the authored h2 link (a dropdown trigger when it has a tree)
    link.className = 'main-nav-link';
    if (!link.title) link.title = link.textContent.trim();
    if (item.tree) {
      link.setAttribute('role', 'button');
      link.setAttribute('aria-expanded', 'false');
      link.dataset.navIndex = String(rows.length - 1);
      triggers.push(link);
    }
    nav.append(el('li', 'main-nav-item', link));
    item.h2.remove();
  });

  const closeBtn = el('div', 'nav-dropdown-close', createIcon('chevron-down'));
  closeBtn.setAttribute('role', 'button');
  closeBtn.setAttribute('aria-label', 'Close');
  dropdown.append(closeBtn);
  const close = () => {
    dropdown.classList.remove('is-visible');
    overlay.classList.remove('is-visible');
    rows.forEach((r) => r.classList.remove('is-visible'));
    triggers.forEach((t) => {
      t.classList.remove('is-active');
      t.setAttribute('aria-expanded', 'false');
    });
  };
  triggers.forEach((t) => t.addEventListener('click', (e) => {
    e.preventDefault();
    const wasActive = t.classList.contains('is-active');
    close();
    if (wasActive) return;
    rows[Number(t.dataset.navIndex)].classList.add('is-visible');
    t.classList.add('is-active');
    t.setAttribute('aria-expanded', 'true');
    dropdown.classList.add('is-visible');
    overlay.classList.add('is-visible');
  }));
  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', close);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
  isDesktop.addEventListener('change', close);
  return { nav, dropdown };
}

/* ---------- decorate ---------- */

export default async function decorate(block) {
  const fragment = await loadChromeFragment('nav', getMetadata('nav'), loadFragment);
  if (!fragment) return;
  const sections = fragmentSections(fragment);
  const items = sections.filter((s) => s.querySelector(':scope > h2'));
  const others = sections.filter((s) => !items.includes(s));
  const [brand, tools, menu] = others;

  const overlay = el('div', 'nav-overlay');
  const metaItems = el('div', 'header-meta-items');

  // tools (classified by content, order kept as authored)
  if (tools) {
    const children = [...tools.children];
    let searchLink = null;
    const extras = { header: null, list: null, labels: [] };
    children.forEach((node, i) => {
      const a = node.tagName === 'P' ? node.querySelector('a') : null;
      const href = a ? a.getAttribute('href') : '';
      if (a && href.includes('country-selector')) {
        metaItems.append(buildCountry(a));
        node.remove();
      } else if (a && href.endsWith('#download-cart')) {
        metaItems.append(buildCart(a));
        node.remove();
      } else if (a && /search|\/suche\b/.test(href) && !searchLink) {
        searchLink = a;
      } else if (a && !searchLink) {
        metaItems.append(buildGlobal(a));
        node.remove();
      } else if (node.tagName === 'UL' && !searchLink) {
        const lang = buildLanguage(node);
        if (lang) metaItems.append(lang);
      } else if (node.tagName === 'P' && node.querySelector('strong') && searchLink) {
        extras.header = node.querySelector('strong');
        if (children[i + 1] && children[i + 1].tagName === 'UL') extras.list = children[i + 1];
      } else if (node.tagName === 'P' && searchLink) {
        extras.labels.push(node);
      }
    });
    if (searchLink) metaItems.append(buildSearch(searchLink, extras));
  }

  const toggle = el(
    'button',
    'offcanvas-toggle',
    el('span', 'u-icon', createIcon('menu')),
    el('span', 'u-icon', createIcon('close')),
  );
  toggle.type = 'button';
  toggle.setAttribute('aria-label', 'main navigation');
  toggle.setAttribute('aria-expanded', 'false');
  metaItems.append(el('div', 'header-meta-item header-burger', toggle));

  const parsed = items.map(parseItem);
  const offcanvas = buildOffcanvas(parsed, menu, toggle, overlay);
  const { nav, dropdown } = buildDesktopNav(parsed, overlay);

  const bar = el(
    'div',
    'header-bar is-visible',
    el('div', 'header-meta', el('div', 'header-meta-content container', buildLogo(brand), metaItems)),
    el(
      'div',
      'header-navigation',
      el('div', 'header-navigation-content container', nav.children.length ? nav : null),
    ),
  );
  block.replaceChildren(bar, dropdown, offcanvas, overlay);

  // sticky morph: scrollY > header bar height (throttled 300ms, as the source)
  const host = block.closest('header') || block;
  host.classList.toggle('no-main-nav', !nav.children.length);
  const check = () => {
    const on = Math.floor(window.scrollY) > bar.offsetHeight;
    host.classList.toggle('is-sticky', on);
    setSticky(on);
  };
  check();
  document.addEventListener('scroll', throttle(check, 300));
}
