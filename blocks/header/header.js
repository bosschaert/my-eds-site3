import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * Header (hydroflask.com replica chrome) - decodes the authored /nav document.
 *
 * Nav document contract (sections, in order; empty sections are ignored):
 *   1. promo strip   - one <p> per slide: message text + link
 *   2. brand         - <p><a href="/"><img alt></a></p>
 *   3. utility       - <ul> of links + <p> locale label, then the store switcher panel:
 *                      <h3> title, then <p> region + <ul> of links (<strong>country</strong> lang)
 *   4. main nav      - <ul>: plain-text items open the mega panel whose <h2> matches the item text
 *                      (fallback: document order); linked items are plain links
 *   5. account panel - <p> links (**bold** = primary)
 *   6+ mega panels   - <h2> title, optional <p> "shop all" link, then <h3> + <ul> groups
 *                      (first group = featured, the rest = columns), then promo tiles:
 *                      desktop <img>, optional mobile <img>, then ONE
 *                      <p><a><strong>title</strong> text <em>cta label</em></a></p>
 *                      (the link href links the whole tile)
 *   recognised by content, anywhere after the brand:
 *     search   - the section linking into the store search (/catalogsearch/): the open search
 *                panel, <p><strong>group title</strong></p> followed by a <ul> of links (chips)
 *                or by cards (<p><a><img></a></p> then <p> title / cta links)
 *     minicart - a heading section without links: the (empty) cart drawer, <h2> title + <p>s
 *   Any link text ending in "(opens in a new tab)" keeps that hint for screen readers only and
 *   opens in a new tab.
 *
 * Editability: authored nodes are MOVED into the layout, never rebuilt; wrappers carry the
 * layout classes. Re-entrant: decorate() rebuilds from the fragment each run.
 * @ew-exempt none
 */

const DESKTOP = window.matchMedia('(min-width: 1024px)');
const PROMO_INTERVAL = 5000;
const HOVER_CLOSE_DELAY = 150;
const NEW_WINDOW = /\s*\(opens in a new (?:window|tab)\)\s*$/i;

/* inline glyphs (the source draws these as inline svg) */
const SVGS = {
  chevron: '<svg viewBox="0 0 8 5" fill="none" aria-hidden="true"><path d="M1 1L4 4L7 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  caret: '<svg viewBox="0 0 8 5" width="8" height="5" fill="none" aria-hidden="true"><path d="M4.01629 4.12558C3.81959 4.32999 3.49242 4.32999 3.29572 4.12558L0.140604 0.846687C-0.165056 0.529036 0.0600628 -7.51481e-07 0.500892 -7.12943e-07L6.81112 -1.61285e-07C7.25195 -1.22747e-07 7.47707 0.529036 7.17141 0.846687L4.01629 4.12558Z" fill="currentColor"/></svg>',
  back: '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M10 4L6 8L10 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M10.5 2a8.5 8.5 0 0 1 6.68 13.76l3.65 3.65a1 1 0 0 1-1.41 1.42l-3.66-3.65A8.5 8.5 0 1 1 10.5 2Zm0 2a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13Z"/></svg>',
  clear: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M5.3 5.3a1 1 0 0 1 1.4 0L12 10.6l5.3-5.3a1 1 0 1 1 1.4 1.4L13.4 12l5.3 5.3a1 1 0 0 1-1.4 1.4L12 13.4l-5.3 5.3a1 1 0 0 1-1.4-1.4l5.3-5.3-5.3-5.3a1 1 0 0 1 0-1.4Z"/></svg>',
};

function svg(name, cls = '') {
  const t = document.createElement('template');
  t.innerHTML = SVGS[name];
  const node = t.content.firstElementChild;
  if (cls) node.classList.add(cls);
  return node;
}

function el(tag, attrs = {}, ...kids) {
  const e = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === 'class') e.className = v;
    else e.setAttribute(k, v);
  });
  e.append(...kids.filter(Boolean));
  return e;
}

function icon(name, cls = '') {
  const img = el('img', {
    src: `${window.hlx.codeBasePath}/icons/${name}.svg`,
    alt: '',
    'aria-hidden': 'true',
    width: 24,
    height: 24,
  });
  if (cls) img.className = cls;
  return img;
}

/** wrap an authored node in a layout wrapper (the node itself is moved, not copied) */
function wrap(node, cls, tag = 'div') {
  const w = el(tag, { class: cls });
  if (node) w.append(node);
  return w;
}

/** moves the bare (non-element) leading nodes of `p` into a span, keeping them in place */
function wrapLeadingText(p, cls) {
  const lead = [];
  [...p.childNodes].some((n) => {
    if (n.nodeType === Node.ELEMENT_NODE && n.tagName === 'A') return true;
    lead.push(n);
    return false;
  });
  if (!lead.length || p.querySelector(`:scope > .${cls}`)) return;
  const span = el('span', { class: cls });
  p.prepend(span);
  span.append(...lead);
}

function contentOf(section) {
  const wrapper = section.querySelector('.default-content-wrapper') || section;
  return [...wrapper.children];
}

function norm(text) {
  return text.replace(/\s+/g, ' ').trim().toLowerCase();
}

/**
 * authored "(opens in a new tab)" hints: split off the link's last text node into a visually
 * hidden span (the authored text node is split, never rebuilt); image-only links take their
 * authored title as the accessible name
 */
function decorateLinks(root) {
  root.querySelectorAll('a').forEach((a) => {
    if (!a.textContent.trim() && a.title && a.querySelector('img')) a.setAttribute('aria-label', a.title);
    const last = a.lastChild;
    if (!last || last.nodeType !== Node.TEXT_NODE) return;
    const m = NEW_WINDOW.exec(last.textContent);
    if (!m) return;
    const hint = last.splitText(m.index);
    const span = el('span', { class: 'sr-only' });
    hint.replaceWith(span);
    span.append(hint);
    a.target = '_blank';
    a.rel = 'noopener';
  });
}

/* ---------------- promo strip ---------------- */

function buildPromo(block, section) {
  const paras = section ? contentOf(section).filter((n) => n.tagName === 'P') : [];
  if (!paras.length) return null;
  const track = el('div', { class: 'promo-track' });
  paras.forEach((p) => {
    wrapLeadingText(p, 'promo-text');
    track.append(wrap(p, 'promo-slide'));
  });
  // the source server-renders its second slide as the active one
  let active = Math.min(1, paras.length - 1);
  track.children[active].classList.add('is-active');
  const promo = el('div', { class: 'promo', role: 'region', 'aria-label': 'Promotions' }, track);

  if (paras.length > 1) {
    // auto-rotating glider: starts with the first real user signal, 5 s interval
    const start = () => {
      if (block.promoTimer) return;
      block.promoTimer = setInterval(() => {
        if (!promo.isConnected) {
          clearInterval(block.promoTimer);
          return;
        }
        active = (active + 1) % paras.length;
        [...track.children].forEach((s, i) => s.classList.toggle('is-active', i === active));
      }, PROMO_INTERVAL);
    };
    ['mousemove', 'touchend'].forEach((ev) => {
      document.addEventListener(ev, start, { once: true, passive: true });
    });
  }
  return promo;
}

/* ---------------- mega panels ---------------- */

function parseMega(section) {
  const nodes = contentOf(section);
  const mega = {
    heading: null, shopAll: null, groups: [], ads: [],
  };
  let group = null;
  let ad = null;
  nodes.forEach((n) => {
    const pic = n.matches('picture, img') ? n : n.querySelector('picture, img');
    if (!mega.heading && n.tagName === 'H2') {
      mega.heading = n;
    } else if (/^H[3-6]$/.test(n.tagName)) {
      group = { heading: n, lists: [] };
      mega.groups.push(group);
      ad = null;
    } else if ((n.tagName === 'UL' || n.tagName === 'OL') && group && !ad) {
      group.lists.push(n);
    } else if (pic) {
      if (!ad || ad.texts.length || ad.cta) {
        ad = { pictures: [], texts: [], cta: null };
        mega.ads.push(ad);
      }
      ad.pictures.push(n);
    } else if (ad) {
      if (n.querySelector('a')) ad.cta = n;
      else ad.texts.push(n);
    } else if (!group && n.tagName === 'P' && n.querySelector('a') && !mega.shopAll) {
      mega.shopAll = n;
    } else if (group) {
      group.lists.push(n);
    }
  });
  return mega;
}

function buildAd(ad, panelKind) {
  const section = el('section', { class: `mega-ad mega-ad-${panelKind}` });
  const anchor = ad.cta && ad.cta.querySelector('a');
  const link = el('a', { class: 'mega-ad-link' });
  if (anchor) {
    link.href = anchor.href;
    if (anchor.title) link.setAttribute('aria-label', anchor.title);
    // EW6: unwrap the authored inner anchor; its paragraph stays (editable) inside the tile link
    anchor.replaceWith(...anchor.childNodes);
  }
  const [desktop, mobile] = ad.pictures;
  link.append(wrap(desktop, mobile ? 'mega-ad-image mega-ad-image-desktop' : 'mega-ad-image'));
  if (mobile) link.append(wrap(mobile, 'mega-ad-image mega-ad-image-mobile'));
  ad.pictures.slice(2).forEach((p) => link.append(wrap(p, 'mega-ad-image')));
  const content = el('span', { class: 'mega-ad-content' });
  ad.texts.forEach((t) => {
    content.append(wrap(t, t.querySelector('strong') ? 'mega-ad-title' : 'mega-ad-desc'));
  });
  if (ad.cta) content.append(wrap(ad.cta, 'mega-ad-cta'));
  link.append(content);
  section.append(link);
  return section;
}

function buildMega(section, id, trigger, labelText) {
  const m = parseMega(section);
  const panel = el('div', {
    class: 'mega', id, role: 'region',
  });
  if (trigger.id) panel.setAttribute('aria-labelledby', trigger.id);

  const close = el('button', { type: 'button', class: 'mega-close', 'aria-label': 'Close menu' }, icon('close'));
  panel.append(el('div', { class: 'mega-drawer-header' }, close));

  const back = el('button', { type: 'button', class: 'mega-back', 'aria-label': 'Back to main menu' }, svg('back'));
  back.append('Back');
  const titleRow = el('div', { class: 'mega-title-row' }, back);
  if (m.heading) titleRow.append(wrap(m.heading, 'mega-heading'));
  if (m.shopAll) titleRow.append(wrap(m.shopAll, 'mega-shop-all'));
  panel.append(titleRow);

  const kind = m.groups.length ? 'featured' : 'tiles';
  const body = el('div', { class: `mega-panel mega-panel-${kind}` });
  const shopAllHref = m.shopAll && m.shopAll.querySelector('a') && m.shopAll.querySelector('a').href;

  const [featured, ...columns] = m.groups;
  if (featured) {
    const f = el('div', { class: 'mega-featured' }, wrap(featured.heading, 'mega-featured-label'));
    featured.lists.forEach((list) => {
      if (list.tagName === 'UL' || list.tagName === 'OL') {
        list.querySelectorAll(':scope > li').forEach((li) => {
          const a = li.querySelector('a');
          // the panel's "shop all" link repeats as the first featured item on desktop only
          if (a && shopAllHref && a.href === shopAllHref) li.classList.add('mega-desktop-only');
        });
      }
      f.append(wrap(list, 'mega-featured-list'));
    });
    body.append(f);
  }
  if (columns.length) {
    const cols = el('div', { class: 'mega-columns' });
    columns.forEach((g) => {
      const col = el('div', { class: 'mega-column' });
      const title = g.heading.textContent.trim();
      // the source's L2 trigger repeats the column title (presentational copy, hidden)
      const copy = el('span', { class: 'mega-l2-label', 'aria-hidden': 'true' });
      copy.textContent = title;
      const toggle = el('button', {
        type: 'button', class: 'mega-l2-toggle', 'aria-expanded': 'false', 'aria-label': `${title} in ${labelText}`,
      }, copy, svg('caret'));
      const head = el('div', { class: 'mega-col-heading' }, g.heading, toggle);
      const links = el('div', { class: 'mega-links' }, ...g.lists);
      const flip = (e) => {
        if (DESKTOP.matches || e.target.closest('a')) return;
        const open = !col.classList.contains('is-open');
        col.classList.toggle('is-open', open);
        toggle.setAttribute('aria-expanded', String(open));
      };
      head.addEventListener('click', flip);
      col.append(head, links);
      cols.append(col);
    });
    body.append(cols);
  }
  if (m.ads.length) {
    const ads = el('div', { class: 'mega-ads' });
    m.ads.forEach((ad) => ads.append(buildAd(ad, kind === 'tiles' ? 'tile' : 'paid')));
    body.append(ads);
  }
  panel.append(body);
  return { panel, close, back };
}

/* ---------------- main nav ---------------- */

function buildNav(bar, navSection, megaSections) {
  const nav = el('nav', { class: 'nav', 'aria-label': 'Main navigation' });
  const drawerClose = el('button', { type: 'button', class: 'mega-close', 'aria-label': 'Close menu' }, icon('close'));
  nav.append(el('div', { class: 'nav-drawer-header' }, drawerClose));
  const list = navSection ? contentOf(navSection).find((n) => n.tagName === 'UL') : null;
  if (!list) return { nav, items: [], drawerClose };
  list.classList.add('nav-list');
  nav.append(list);

  const remaining = [...megaSections];
  const byHeading = (text) => remaining.find((s) => {
    const h = s.querySelector('h2');
    return h && norm(h.textContent) === text;
  });
  const items = [];
  [...list.children].forEach((li, i) => {
    li.classList.add('nav-item');
    const link = li.querySelector(':scope > a, :scope > p > a');
    if (link) {
      const p = link.parentElement.tagName === 'P' ? link.parentElement : null;
      if (p) p.replaceWith(link); // #98: delivered shape wraps the link in a <p>
      link.classList.add('nav-link');
      return;
    }
    const sub = li.querySelector(':scope > ul');
    const labelText = norm([...li.childNodes].filter((n) => n !== sub).map((n) => n.textContent).join(''));
    const section = byHeading(labelText) || remaining[0];
    if (!section) return;
    remaining.splice(remaining.indexOf(section), 1);

    // move the authored label (text node or <p>) into the trigger row
    const label = el('span', { class: 'nav-label', id: `nav-label-${i}` });
    label.append(...[...li.childNodes].filter((n) => n !== sub));
    const labelName = label.textContent.trim();
    const chevron = el('button', {
      type: 'button',
      class: 'nav-toggle',
      'aria-expanded': 'false',
      'aria-controls': `nav-mega-${i}`,
      'aria-label': labelName,
    }, svg('chevron', 'nav-chevron'));
    const row = el('div', { class: 'nav-link' }, label, chevron);
    const { panel, close, back } = buildMega(section, `nav-mega-${i}`, label, labelName);
    li.replaceChildren(row, panel);
    if (sub) panel.append(sub);
    items.push({
      li, row, chevron, panel, close, back,
    });
  });
  return { nav, items, drawerClose };
}

/* ---------------- header assembly ---------------- */

/** the open search panel's suggested content (authored "search" section) */
function buildSearchContent(section) {
  const content = el('div', { class: 'search-content' });
  if (!section) return content;
  let group = null;
  let card = null;
  contentOf(section).forEach((n) => {
    const isTitle = n.tagName === 'P' && !n.querySelector('a, img') && n.querySelector('strong');
    if (isTitle || !group) {
      group = { box: el('div', { class: 'search-group' }), cards: 0, texts: 0 };
      content.append(group.box);
      card = null;
      if (isTitle) {
        group.box.append(wrap(n, 'search-group-title'));
        return;
      }
    }
    if (n.tagName === 'UL' || n.tagName === 'OL') {
      n.querySelectorAll('a').forEach((a) => a.prepend(svg('search', 'search-chip-icon')));
      group.box.classList.add('search-group-chips');
      group.box.append(wrap(n, 'search-chips'));
      card = null;
    } else if (n.querySelector('picture, img')) {
      card = el('div', { class: 'search-card' }, wrap(n, 'search-card-image'));
      group.cards += 1;
      group.box.append(card);
    } else if (card) {
      card.append(wrap(n, card.children.length === 1 ? 'search-card-title' : 'search-card-link'));
      if (card.children.length > 2) group.box.classList.add('search-group-tiles');
    } else {
      group.box.append(n);
    }
  });
  [...content.children].forEach((g) => {
    if (g.querySelector('.search-card') && !g.classList.contains('search-group-tiles')) g.classList.add('search-group-rows');
    const cards = [...g.querySelectorAll(':scope > .search-card')];
    if (cards.length) {
      const list = el('div', { class: 'search-cards' }, ...cards);
      g.append(list);
    }
  });
  return content;
}

function buildSearch() {
  const input = el('input', {
    id: 'header-search-input',
    type: 'search',
    name: 'q',
    placeholder: 'I am searching for...',
    autocomplete: 'off',
  });
  const label = el('label', { class: 'sr-only', for: 'header-search-input' }, 'I am searching for...');
  const form = el(
    'form',
    {
      class: 'search-form',
      action: 'https://www.hydroflask.com/catalogsearch/result/',
      method: 'get',
      role: 'search',
    },
    label,
    input,
    el('button', { type: 'submit', class: 'search-submit', title: 'Search' }, svg('search')),
    el('button', { type: 'reset', class: 'search-clear', title: 'Clear' }, svg('clear')),
  );
  return el('div', { class: 'search', id: 'header-search', hidden: '' }, el('div', { class: 'search-inner' }, form));
}

/** a slide-in panel (locale, minicart) built around authored nodes */
function buildDrawer(nodes, cls, id, closeLabel) {
  const heading = nodes.find((n) => /^H[1-6]$/.test(n.tagName));
  if (heading) heading.id = `${id}-title`;
  const close = el('button', { type: 'button', class: 'drawer-close', 'aria-label': closeLabel }, icon('close'));
  const head = el('div', { class: 'drawer-head' }, heading ? wrap(heading, 'drawer-title') : null, close);
  const body = el('div', { class: 'drawer-body' });
  const panel = el('div', {
    class: `drawer ${cls}`, id,
  }, head, body);
  if (heading) panel.setAttribute('aria-labelledby', heading.id);
  else panel.setAttribute('aria-label', closeLabel.replace(/^Close /, ''));
  let group = null;
  nodes.filter((n) => n !== heading).forEach((n) => {
    if (cls === 'locale-panel') {
      if (n.tagName === 'P' || !group) {
        group = el('div', { class: 'locale-region' });
        body.append(group);
      }
      group.append(wrap(n, n.tagName === 'P' ? 'locale-region-title' : 'locale-region-list'));
    } else {
      body.append(wrap(n, 'drawer-text'));
    }
  });
  return { panel, close };
}

/** focus once the opening panel is visible (a visibility transition starts hidden) */
function focusSoon(target) {
  if (target) setTimeout(() => target.focus({ preventScroll: true }), 50);
}

function setExpanded(btn, open) {
  btn.setAttribute('aria-expanded', String(open));
}

export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);
  if (!fragment) return;

  if (block.promoTimer) {
    clearInterval(block.promoTimer);
    block.promoTimer = null;
  }
  decorateLinks(fragment);

  const all = [...fragment.querySelectorAll(':scope > .section')]
    .filter((s) => s.textContent.trim() || s.querySelector('picture, img'));
  const searchSection = all.find((s) => s.querySelector('a[href*="/catalogsearch/"]'));
  const cartSection = all.find((s) => s.querySelector('h1, h2, h3') && !s.querySelector('a'));
  const sections = all.filter((s) => s !== searchSection && s !== cartSection);
  const megaSections = sections.filter((s) => s.querySelector('h2'));
  const plain = sections.filter((s) => !s.querySelector('h2'));
  const brandSection = plain.find((s) => s.querySelector('picture, img'));
  const others = plain.filter((s) => s !== brandSection);
  const brandIndex = plain.indexOf(brandSection);
  // before the brand: promo; after it: utility, main nav, account (document order)
  const promoSection = brandIndex > 0 ? plain[0] : null;
  const [utilitySection, navSection, accountSection] = others.filter((s) => s !== promoSection);

  const bar = el('div', { class: 'header-bar' });
  const inner = el('div', { class: 'header-inner' });
  bar.append(inner);

  // logo
  const brand = brandSection ? contentOf(brandSection) : [];
  inner.append(el('div', { class: 'header-logo' }, ...brand));

  // utility row: links + store switcher (the flag is the button, the authored label stays editable)
  const utility = el('div', { class: 'header-utility' });
  const localeBtn = el('button', {
    type: 'button',
    class: 'locale-toggle',
    'aria-label': 'Store switcher',
    'aria-expanded': 'false',
    'aria-controls': 'header-locale-panel',
  }, el('span', { class: 'locale-image' }, el('span', { class: 'locale-flag flag-us', 'aria-hidden': 'true' })));
  let localeRow = null;
  const localeNodes = [];
  if (utilitySection) {
    contentOf(utilitySection).forEach((n) => {
      if (localeRow) {
        localeNodes.push(n); // the store switcher panel
      } else if (n.tagName === 'UL' && !utility.querySelector('.utility-nav')) {
        utility.append(el('nav', { class: 'utility-nav', 'aria-label': 'Utility navigation' }, n));
      } else {
        localeRow = el('div', { class: 'locale' }, localeBtn, wrap(n, 'locale-title'));
        utility.append(localeRow);
      }
    });
  }
  inner.append(utility);

  // main row
  const row = el('div', { class: 'header-row' });
  const { nav, items, drawerClose } = buildNav(bar, navSection, megaSections);
  row.append(nav, el('div', { class: 'header-spacer' }));

  const searchBtn = el('button', {
    type: 'button', class: 'header-search', 'aria-label': 'Open Search', 'aria-controls': 'header-search', 'aria-expanded': 'false',
  }, icon('search', 'icon-open'), icon('close', 'icon-close'));
  const accountBtn = el('button', {
    type: 'button', class: 'header-account', 'aria-label': 'My account', 'aria-expanded': 'false', 'aria-controls': 'header-account-panel',
  }, icon('account', 'icon-open'), icon('close', 'icon-close'));
  const accountPanel = el('nav', {
    class: 'account', id: 'header-account-panel', 'aria-label': 'My account',
  });
  if (accountSection) {
    // paragraphs: signed-out links; a list: signed-in links (shown by a store session only)
    const nodes = contentOf(accountSection);
    accountPanel.append(el('div', { class: 'account-links' }, ...nodes.filter((n) => n.tagName !== 'UL')));
    nodes.filter((n) => n.tagName === 'UL').forEach((ul) => {
      accountPanel.append(el('div', { class: 'account-links account-signed-in', hidden: '' }, ul));
    });
  }
  const cart = el(
    'button',
    {
      type: 'button', class: 'header-cart-btn', title: 'Cart', 'aria-expanded': 'false', 'aria-controls': 'header-minicart',
    },
    el('span', { class: 'sr-only' }, 'My minicart, cart is empty'),
    el('span', { class: 'header-cart' }, icon('cart'), el('span', { class: 'header-cart-count' }, '0')),
  );
  const burger = el('button', { type: 'button', 'aria-label': 'Open menu', 'aria-expanded': 'false' }, icon('menu'));
  row.append(el(
    'div',
    { class: 'header-actions' },
    searchBtn,
    el('div', { class: 'header-account-wrap' }, accountBtn, accountPanel),
    cart,
    el('div', { class: 'header-hamburger' }, burger),
  ));
  inner.append(row);

  const search = buildSearch();
  search.querySelector('.search-inner').append(buildSearchContent(searchSection));
  bar.append(search);

  const backdrop = el('div', { class: 'header-backdrop', 'aria-hidden': 'true' });
  const locale = buildDrawer(localeNodes, 'locale-panel', 'header-locale-panel', 'Close');
  const minicart = buildDrawer(cartSection ? contentOf(cartSection) : [], 'minicart', 'header-minicart', 'Close minicart');
  bar.append(backdrop, locale.panel, minicart.panel);

  /* ---- behaviour ---- */
  // the drawer (< 1024px) carries the utility links + store switcher below the main nav
  const placeUtility = () => {
    if (DESKTOP.matches) inner.insertBefore(utility, row);
    else nav.append(utility);
  };
  placeUtility();
  DESKTOP.addEventListener('change', placeUtility);

  const isOpen = (btn) => btn.getAttribute('aria-expanded') === 'true';
  const syncLock = () => {
    const locked = bar.classList.contains('is-drawer-open') || isOpen(searchBtn) || isOpen(localeBtn);
    document.body.style.overflowY = locked ? 'hidden' : '';
    const drawer = bar.classList.contains('is-drawer-open');
    backdrop.classList.toggle('is-open', drawer || isOpen(localeBtn) || isOpen(cart));
    backdrop.classList.toggle('is-slow', isOpen(cart) || isOpen(localeBtn));
  };

  let closeTimer = null;
  const closeAll = (except) => items.forEach((it) => {
    if (it === except) return;
    it.li.classList.remove('is-open');
    setExpanded(it.chevron, false);
  });
  const open = (it, state) => {
    clearTimeout(closeTimer);
    closeAll(it);
    it.li.classList.toggle('is-open', state);
    setExpanded(it.chevron, state);
  };
  const closeDrawer = () => {
    closeAll();
    bar.classList.remove('is-drawer-open');
    setExpanded(burger, false);
    syncLock();
  };
  items.forEach((it) => {
    // desktop: click opens (hover may already have); mobile: click toggles the drawer panel
    it.row.addEventListener('click', () => {
      open(it, DESKTOP.matches || !it.li.classList.contains('is-open'));
    });
    // desktop: hover opens the mega menu; leaving the item (trigger + panel) closes it
    it.li.addEventListener('mouseenter', () => {
      if (DESKTOP.matches) open(it, true);
    });
    it.li.addEventListener('mouseleave', () => {
      if (!DESKTOP.matches) return;
      clearTimeout(closeTimer);
      closeTimer = setTimeout(() => open(it, false), HOVER_CLOSE_DELAY);
    });
    it.back.addEventListener('click', () => {
      open(it, false);
      it.chevron.focus();
    });
    it.close.addEventListener('click', closeDrawer);
  });
  drawerClose.addEventListener('click', closeDrawer);
  burger.addEventListener('click', () => {
    const state = !bar.classList.contains('is-drawer-open');
    if (!state) {
      closeDrawer();
      return;
    }
    bar.classList.add('is-drawer-open');
    setExpanded(burger, true);
    syncLock();
    // focus moves into the drawer, so Tab continues inside it
    focusSoon(drawerClose);
  });
  bar.addEventListener('focusout', (e) => {
    if (DESKTOP.matches && !nav.contains(e.relatedTarget)) closeAll();
  });

  // header panels: search, account, store switcher, minicart
  const panels = [
    { btn: searchBtn, panel: search, focus: () => search.querySelector('input') },
    { btn: accountBtn, panel: accountPanel, cls: true },
    {
      btn: localeBtn, panel: locale.panel, cls: true, dialog: true, focus: () => locale.close,
    },
    {
      btn: cart, panel: minicart.panel, cls: true, dialog: true, focus: () => minicart.close,
    },
  ];
  const setPanel = (p, state) => {
    setExpanded(p.btn, state);
    if (p.cls) p.panel.classList.toggle('is-open', state);
    else p.panel.hidden = !state;
    // a drawer is a modal dialog only while it is open
    if (p.dialog && state) {
      p.panel.setAttribute('role', 'dialog');
      p.panel.setAttribute('aria-modal', 'true');
    } else if (p.dialog) {
      p.panel.removeAttribute('role');
      p.panel.removeAttribute('aria-modal');
    }
    syncLock();
  };
  const closePanels = (except) => panels.forEach((p) => {
    if (p !== except && isOpen(p.btn)) setPanel(p, false);
  });
  panels.forEach((p) => {
    p.btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const state = !isOpen(p.btn);
      closePanels(p);
      if (state && p.btn === localeBtn) closeDrawer();
      setPanel(p, state);
      if (state && p.focus) focusSoon(p.focus());
    });
  });
  if (localeRow) localeRow.addEventListener('click', (e) => { if (!localeBtn.contains(e.target)) localeBtn.click(); });
  [locale, minicart].forEach((d, i) => d.close.addEventListener('click', () => {
    const p = panels[i + 2];
    setPanel(p, false);
    p.btn.focus({ preventScroll: true });
  }));
  backdrop.addEventListener('click', () => {
    closePanels();
    closeDrawer();
  });
  // Tab stays inside an open modal panel (store switcher, minicart, mobile drawer)
  const trapIn = () => {
    if (isOpen(localeBtn)) return locale.panel;
    if (isOpen(cart)) return minicart.panel;
    return bar.classList.contains('is-drawer-open') ? nav : null;
  };
  // Escape closes the open panel / drawer / mega menu and returns focus to its trigger
  document.addEventListener('keydown', (e) => {
    if (!block.isConnected) return;
    if (e.key === 'Tab') {
      const box = trapIn();
      if (!box) return;
      const focusables = [...box.querySelectorAll('a[href], button, input')]
        .filter((f) => f.getClientRects().length && getComputedStyle(f).visibility !== 'hidden');
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const inside = box.contains(document.activeElement);
      if (!inside || (e.shiftKey && document.activeElement === first)) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
      return;
    }
    if (e.key !== 'Escape') return;
    const p = panels.find((x) => isOpen(x.btn));
    if (p) {
      setPanel(p, false);
      p.btn.focus({ preventScroll: true });
      return;
    }
    if (bar.classList.contains('is-drawer-open')) {
      closeDrawer();
      burger.focus({ preventScroll: true });
      return;
    }
    const current = items.find((it) => it.li.classList.contains('is-open'));
    closeAll();
    if (current) current.chevron.focus();
  }, true);
  // a pointer press outside closes the account panel and the mega menus (capture: nothing on the
  // page can swallow it)
  document.addEventListener('pointerdown', (e) => {
    if (!block.isConnected) return;
    const acc = panels[1];
    const t = e.target;
    const inAccount = accountPanel.contains(t) || accountBtn.contains(t);
    if (isOpen(acc.btn) && !inAccount) setPanel(acc, false);
    if (DESKTOP.matches && !nav.contains(t)) closeAll();
  }, true);

  const promo = buildPromo(block, promoSection);
  block.replaceChildren(bar);
  if (promo) block.append(promo);
}
