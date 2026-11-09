/**
 * home-scroller — the home page's section scroller (replaces jquery.fullpage.js, source main.js)
 * on the NATIVE document scroll: the 100vh panels stay in normal flow; wheel / keyboard / touch
 * move one panel at a time (scrollingSpeed 1000, 600 ms scroll delay). The panels are the
 * page's sections plus the footer. Also: the section dots + tooltips (labels from each
 * section's Tooltip metadata), body fp-viewing-<n> (0-based, as fullPage), the header's
 * type-white state for panels 3, 5, 6 (fullPage onLeave), section .active while in view (block
 * entrances replay), the footer's full-page TOP button and the copyright year.
 *
 * @ew-exempt FOOTER — the hidden footer dot's aria-label (no authored section to carry it).
 */

const WHITE = [2, 4, 5]; // fullPage onLeave: nextIndex 3, 5, 6 (1-based)
const SPEED = 1000;
const SCROLL_DELAY = 600;

function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - ((-2 * t + 2) ** 3) / 2);

/** live writes #copyYear by script: the copyright's year follows the current year */
function currentYear() {
  const year = String(new Date().getFullYear());
  const apply = () => {
    const p = document.querySelector('footer .copyright');
    if (!p) return false;
    const walker = document.createTreeWalker(p, NodeFilter.SHOW_TEXT);
    let node = walker.nextNode();
    while (node) {
      if (/\b(19|20)\d{2}\b/.test(node.nodeValue)) {
        node.nodeValue = node.nodeValue.replace(/\b(19|20)\d{2}\b/, year);
        return true;
      }
      node = walker.nextNode();
    }
    return true;
  };
  if (apply()) return;
  const footer = document.querySelector('footer');
  if (!footer) return;
  const mo = new MutationObserver(() => {
    if (apply()) mo.disconnect();
  });
  mo.observe(footer, { childList: true, subtree: true });
}

/**
 * @param {Element} widget
 */
export default function decorate(widget) {
  const doc = document.documentElement;
  const { body } = document;
  const main = document.querySelector('main');
  if (!main || doc.classList.contains('fp-native')) return;
  doc.classList.add('fp-native');

  const footer = document.querySelector('body > footer');
  // panels: the non-empty sections (the metadata section is left empty) + the footer
  const sections = [...main.querySelectorAll(':scope > .section')]
    .filter((s) => s.querySelector('.block, .default-content-wrapper'));
  if (footer) sections.push(footer);

  // section dots + tooltips
  const ul = widget.querySelector('.fp-nav ul');
  const navLinks = sections.map((s) => {
    const label = s.dataset.tooltip || (s === footer ? 'FOOTER' : '');
    const li = el('li');
    const a = el('a', '', { href: '#', 'aria-label': label });
    a.append(el('span'));
    li.append(a);
    if (s !== footer && label) {
      const tip = el('div', 'fp-tooltip left');
      tip.textContent = label;
      li.append(tip);
    }
    if (ul) ul.append(li);
    return a;
  });

  let current = -1;
  let animating = false;
  let lockUntil = 0;
  const maxScroll = () => Math.max(0, doc.scrollHeight - window.innerHeight);
  const topOf = (s) => s.getBoundingClientRect().top + window.scrollY;
  const targetOf = (i) => Math.min(topOf(sections[i]), maxScroll());
  const header = () => document.querySelector('header .header');

  const setState = (i) => {
    if (i !== current) {
      if (current >= 0) body.classList.remove(`fp-viewing-${current}`);
      body.classList.add(`fp-viewing-${i}`);
      navLinks.forEach((a, n) => a.classList.toggle('active', n === i));
      current = i;
    }
    const h = header();
    if (h) h.classList.toggle('type-white', WHITE.includes(i));
  };

  // a section keeps .active while any of it is on screen (entrance transitions)
  const markActive = () => {
    const vh = window.innerHeight;
    sections.forEach((s) => {
      const r = s.getBoundingClientRect();
      s.classList.toggle('active', r.bottom > 1 && r.top < vh - 1);
    });
  };

  const indexFromScroll = () => {
    const y = window.scrollY;
    if (y >= maxScroll() - 2) return sections.length - 1;
    const probe = y + window.innerHeight / 2;
    let idx = 0;
    sections.forEach((s, n) => {
      if (s.offsetHeight && topOf(s) <= probe) idx = n; // a still-hidden panel has no box
    });
    return idx;
  };

  const moveTo = (to) => {
    const i = Math.max(0, Math.min(sections.length - 1, to));
    const from = window.scrollY;
    const dest = targetOf(i);
    setState(i);
    if (Math.abs(dest - from) < 1) {
      markActive();
      return;
    }
    animating = true;
    const t0 = performance.now();
    const step = (now) => {
      const p = Math.min(1, (now - t0) / SPEED);
      window.scrollTo({ top: from + (dest - from) * ease(p), behavior: 'instant' });
      if (p < 1) requestAnimationFrame(step);
      else {
        animating = false;
        lockUntil = performance.now() + SCROLL_DELAY;
        markActive();
      }
    };
    requestAnimationFrame(step);
  };
  const move = (dir) => {
    if (animating || performance.now() < lockUntil) return;
    moveTo(indexFromScroll() + dir);
  };
  const menuOpen = () => {
    const h = header();
    return h && h.classList.contains('menu-open');
  };

  window.addEventListener('wheel', (e) => {
    if (e.ctrlKey || menuOpen()) return;
    if (e.target.closest && e.target.closest('header')) return;
    e.preventDefault();
    if (Math.abs(e.deltaY) < 1) return;
    move(e.deltaY > 0 ? 1 : -1);
  }, { passive: false });

  window.addEventListener('keydown', (e) => {
    const t = e.target;
    if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
    const keys = {
      ArrowDown: 1, PageDown: 1, ArrowUp: -1, PageUp: -1,
    };
    if (e.key in keys) {
      e.preventDefault();
      move(keys[e.key]);
    } else if (e.key === ' ') {
      e.preventDefault();
      move(e.shiftKey ? -1 : 1);
    } else if (e.key === 'Home') {
      e.preventDefault();
      moveTo(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      moveTo(sections.length - 1);
    }
  });

  // touch: fullPage touchSensitivity 5 (% of the viewport height)
  let touch = null;
  window.addEventListener('touchstart', (e) => {
    const h = document.querySelector('header');
    if (e.touches.length !== 1 || (h && h.contains(e.target))) {
      touch = null;
      return;
    }
    touch = { x: e.touches[0].clientX, y: e.touches[0].clientY, done: false };
  }, { passive: true });
  window.addEventListener('touchmove', (e) => {
    if (!touch) return;
    const dx = e.touches[0].clientX - touch.x;
    const dy = e.touches[0].clientY - touch.y;
    if (Math.abs(dy) <= Math.abs(dx)) return; // horizontal: the card carousel's
    e.preventDefault();
    if (!touch.done && Math.abs(dy) > window.innerHeight * 0.05) {
      touch.done = true;
      move(dy < 0 ? 1 : -1);
    }
  }, { passive: false });

  navLinks.forEach((a, n) => a.addEventListener('click', (e) => {
    e.preventDefault();
    moveTo(n);
  }));

  // footer TOP button: fullPage moveTo(1)
  document.addEventListener('click', (e) => {
    if (!e.target.closest || !e.target.closest('.fullpg-top-btn')) return;
    e.preventDefault();
    e.stopPropagation();
    moveTo(0);
  }, true);

  window.addEventListener('scroll', () => {
    markActive();
    if (!animating) setState(indexFromScroll());
  }, { passive: true });
  let resizeT;
  window.addEventListener('resize', () => {
    clearTimeout(resizeT);
    resizeT = setTimeout(() => {
      if (!animating && current >= 0 && current < sections.length - 1) {
        window.scrollTo({ top: targetOf(current), behavior: 'instant' });
      }
      markActive();
    }, 150);
  });
  // panels still loading (display: none) or the footer filling in move every offset: re-derive
  // the state whenever the page box changes size, not only on scroll
  const sync = () => {
    if (animating) return;
    setState(indexFromScroll());
    markActive();
  };
  sync();
  if (window.ResizeObserver) new ResizeObserver(sync).observe(document.body);
  window.addEventListener('load', sync);
  currentYear();
}
