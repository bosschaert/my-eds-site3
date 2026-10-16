/**
 * Shared runtime helpers for the continental.com replica (foundation layer).
 * Blocks import from here; see stardust/runtime-contract.json for the contract.
 */

/**
 * Throttle with leading + trailing call (lodash.throttle semantics, maxWait = wait),
 * as the source bundle wraps its scroll handlers.
 * @param {Function} fn callback
 * @param {number} ms wait in milliseconds
 * @returns {Function} throttled function
 */
export function throttle(fn, ms) {
  let last = 0;
  let timer = null;
  return (...args) => {
    const now = Date.now();
    const remaining = ms - (now - last);
    if (remaining <= 0) {
      clearTimeout(timer);
      timer = null;
      last = now;
      fn(...args);
    } else if (!timer) {
      timer = setTimeout(() => {
        last = Date.now();
        timer = null;
        fn(...args);
      }, remaining);
    }
  };
}

const svgCache = {};

/**
 * Fetches /icons/<name>.svg once and returns a fresh inline SVG element.
 * @param {string} name icon name (file name under /icons without extension)
 * @returns {Promise<SVGElement|null>}
 */
export async function loadSvg(name) {
  if (!svgCache[name]) {
    const base = (window.hlx && window.hlx.codeBasePath) || '';
    svgCache[name] = fetch(`${base}/icons/${name}.svg`)
      .then((resp) => (resp.ok ? resp.text() : ''))
      .then((text) => {
        if (!text) return null;
        const doc = new DOMParser().parseFromString(text, 'image/svg+xml');
        const svg = doc.querySelector('svg');
        if (!svg) return null;
        svg.querySelectorAll('script').forEach((s) => s.remove());
        return svg;
      })
      .catch(() => null);
  }
  const svg = await svgCache[name];
  if (!svg) return null;
  const node = document.importNode(svg, true);
  node.removeAttribute('id');
  node.removeAttribute('class');
  node.setAttribute('aria-hidden', 'true');
  node.setAttribute('focusable', 'false');
  return node;
}

/**
 * Creates an icon element `<span class="icon icon-<name>">` and fills it with the
 * inline SVG (currentColor) asynchronously. Multi-colour icons (flags) use an <img>.
 * @param {string} name icon name
 * @param {object} [opts]
 * @param {boolean} [opts.img] render as <img> instead of inline SVG
 * @param {string} [opts.tag] wrapper tag (default span)
 * @param {string} [opts.className] extra classes on the wrapper
 * @returns {HTMLElement}
 */
export function createIcon(name, opts = {}) {
  const wrap = document.createElement(opts.tag || 'span');
  wrap.className = `icon icon-${name}`;
  if (opts.className) wrap.className += ` ${opts.className}`;
  if (opts.img) {
    const img = document.createElement('img');
    const base = (window.hlx && window.hlx.codeBasePath) || '';
    img.src = `${base}/icons/${name}.svg`;
    img.alt = '';
    img.loading = 'lazy';
    wrap.append(img);
  } else {
    loadSvg(name).then((svg) => {
      if (svg && !wrap.querySelector('svg')) wrap.append(svg);
    });
  }
  return wrap;
}

/**
 * Wraps an icon in the source's `.u-icon` box (`<i class="u-icon …">`).
 * @param {string} name icon name
 * @param {string} [classes] extra u-icon modifier classes (e.g. 'is-xs ml-1')
 * @param {string} [tag] wrapper tag (default i)
 * @returns {HTMLElement}
 */
export function uIcon(name, classes = '', tag = 'i') {
  const box = document.createElement(tag);
  box.className = `u-icon${classes ? ` ${classes}` : ''}`;
  box.append(createIcon(name));
  return box;
}

/**
 * Removes Universal Editor instrumentation from presentational clones (EW4).
 * @param {Element} el element (modified in place)
 * @returns {Element}
 */
export function stripInstrumentation(el) {
  [el, ...el.querySelectorAll('*')].forEach((node) => {
    [...node.attributes].forEach(({ name }) => {
      if (name.startsWith('data-aue-') || name.startsWith('data-richtext-')) {
        node.removeAttribute(name);
      }
    });
  });
  return el;
}

/* ---- sticky header state (set by the header block, readable by every block) ---- */
const stickyListeners = new Set();
let stickyState = false;

/**
 * Subscribes to the sticky-header state ("is-sticky" morph: scrollY > header height).
 * The callback runs immediately with the current state, then on every change.
 * @param {Function} cb (isSticky: boolean) => void
 * @returns {Function} unsubscribe
 */
export function onStickyChange(cb) {
  stickyListeners.add(cb);
  cb(stickyState);
  return () => stickyListeners.delete(cb);
}

/**
 * Sets the sticky-header state (header block only).
 * @param {boolean} on sticky
 */
export function setSticky(on) {
  if (on === stickyState) return;
  stickyState = on;
  document.body.classList.toggle('header-is-sticky', on);
  stickyListeners.forEach((cb) => cb(on));
}

/**
 * Equalizes heights of a group of elements (min-height = tallest member), re-run on resize.
 * Source behaviour: [data-equalize-height] groups.
 * @param {Element[]|NodeList} elements group members
 * @returns {Function} re-run function
 */
export function equalizeHeights(elements) {
  const els = [...elements];
  const run = () => {
    els.forEach((el) => { el.style.minHeight = ''; });
    const h = Math.max(0, ...els.map((el) => el.offsetHeight));
    els.forEach((el) => { el.style.minHeight = `${h}px`; });
  };
  run();
  let timer;
  window.addEventListener('resize', () => {
    clearTimeout(timer);
    timer = setTimeout(run, 300);
  });
  return run;
}

/**
 * Count-up animation (fact-box numbers): 0 -> target over 2000ms once the element
 * is fully inside the viewport (source: throttled 250ms scroll check).
 * @param {HTMLElement} el element whose text is replaced by the counter
 * @param {object} opts
 * @param {number} opts.to target value
 * @param {number} [opts.decimals] decimals
 * @param {string} [opts.locale] number locale (e.g. en-US, de-DE)
 * @param {boolean} [opts.separator] use thousands separator (default true)
 */
export function countUp(el, {
  to, decimals = 0, locale = 'en-US', separator = true,
}) {
  const factor = 10 ** decimals;
  const format = (v) => (separator
    ? v.toLocaleString(locale, { minimumFractionDigits: decimals })
    : String(v));
  let done = false;
  const run = () => {
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const u = Math.min((ts - start) / 2000, 1);
      el.textContent = format(Math.floor(u * to * factor) / factor);
      if (u < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const check = () => {
    if (done || el.offsetParent === null) return;
    const bottom = el.getBoundingClientRect().y + el.offsetHeight;
    if (bottom < window.innerHeight - 10) {
      done = true;
      run();
    }
  };
  check();
  document.addEventListener('scroll', throttle(check, 250));
}

/**
 * Returns the locale root of the current page ('/en/...' -> 'en', '/' -> 'en').
 * @returns {string}
 */
export function getLocale() {
  const seg = window.location.pathname.split('/').filter(Boolean)[0] || '';
  return /^[a-z]{2}(-[a-z]{2})?$/.test(seg) ? seg : 'en';
}

/* ---- download cart store (client-only; dynamic feature #3) ---- */
const CART_KEY = 'download-cart';

/**
 * Returns the download-cart items ([{href, title}]).
 * @returns {Array<{href: string, title: string}>}
 */
export function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveCart(items) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  } catch (e) {
    // storage unavailable
  }
  document.dispatchEvent(new CustomEvent('download-cart-change', { detail: { items } }));
}

/**
 * Adds or removes a file in the download cart; fires `download-cart-change` on document.
 * @param {{href: string, title: string}} item file
 * @param {boolean} [add] force add (true) / remove (false); toggles when omitted
 * @returns {boolean} whether the item is in the cart afterwards
 */
export function toggleCartItem(item, add) {
  const items = getCart();
  const idx = items.findIndex((i) => i.href === item.href);
  const want = add === undefined ? idx < 0 : add;
  if (want && idx < 0) items.push({ href: item.href, title: item.title });
  if (!want && idx >= 0) items.splice(idx, 1);
  saveCart(items);
  return want;
}

/**
 * Loads a chrome fragment (nav / footer): the `nav`/`footer` metadata path when set,
 * else /<locale root>/<name>, falling back to /en/<name>.
 * @param {string} name 'nav' | 'footer'
 * @param {string} metaPath value of the page's metadata row (may be empty)
 * @param {Function} loadFragment the fragment loader
 * @returns {Promise<HTMLElement|null>}
 */
export async function loadChromeFragment(name, metaPath, loadFragment) {
  const candidates = [];
  if (metaPath) candidates.push(new URL(metaPath, window.location).pathname);
  candidates.push(`/${getLocale()}/${name}`, `/en/${name}`);
  const unique = [...new Set(candidates)];
  for (let i = 0; i < unique.length; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    const fragment = await loadFragment(unique[i]);
    if (fragment) return fragment;
  }
  return null;
}

/**
 * The content sections of a decorated fragment, minus empty / metadata-only ones.
 * @param {HTMLElement} fragment fragment main
 * @returns {HTMLElement[]} the default-content wrappers (or sections) in order
 */
export function fragmentSections(fragment) {
  return [...fragment.querySelectorAll(':scope > .section')]
    .map((s) => s.querySelector(':scope > .default-content-wrapper') || s)
    .filter((s) => !s.querySelector('.metadata') && s.textContent.trim() !== '');
}

/**
 * The link of a list item (`li > a` or the pipeline's `li > p > a`).
 * @param {HTMLElement} li list item
 * @returns {HTMLAnchorElement|null}
 */
export function itemLink(li) {
  return li.querySelector(':scope > a, :scope > p > a');
}
