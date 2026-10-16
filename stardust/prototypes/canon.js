/* continental.com replica — shared chrome + module behaviour (canon).
   Only behaviours observed on the live site (stardust/replica/motion/en.json)
   with mechanics/thresholds lifted from the live bundle:
   - sticky header: [data-sticky-header-class] get .is-sticky when floor(scrollY) > header.offsetHeight (scroll, throttled 300ms)
   - scroll-to-top: .is-visible when innerHeight < scrollY (throttled 300ms); click -> smooth scroll to top
   - hero slider (Glide): autoplay 8000ms, hoverpause, 1000ms track animation, text re-enter via .is-active
   - hero arrows: .arrows--md when innerWidth > 1024, .arrows--lg when > 1660, else hidden
   - language menu toggle, main-nav mega dropdown, footer accordion (<767)
   - lazy teaser images: entered / is-lazy-loading / is-lazy-loaded within 300px of the viewport; spinner placeholder fades
   - ip-redirect banner wrapper: .is-hidden while the header is sticky
   - equalize heights: [data-equalize-height] groups get min-height = tallest member (load + resize)
   - fact-box count-up: 0 -> data-count-to over 2000ms when the number enters the viewport (throttled 250ms)
   - canon-menu: mobile off-canvas navigation (burger) with drill-down lists (observed at 360) */
(() => {
  // live bundle wraps scroll handlers in lodash.throttle (leading + trailing, maxWait = wait)
  const throttle = (fn, ms) => {
    let last = 0; let t = null;
    return () => {
      const now = Date.now(); const rem = ms - (now - last);
      if (rem <= 0) { clearTimeout(t); t = null; last = now; fn(); }
      else if (!t) t = setTimeout(() => { last = Date.now(); t = null; fn(); }, rem);
    };
  };

  /* ---- sticky header ---- */
  const header = document.querySelector('header.o-header');
  const stickyTargets = document.querySelectorAll('[data-sticky-header-class]');
  const ipBanner = document.querySelector('.c-ip-redirect-banner__wrapper');
  const checkSticky = () => {
    if (!header) return;
    const on = Math.floor(window.scrollY) > header.offsetHeight;
    stickyTargets.forEach((n) => n.classList.toggle('is-sticky', on));
    if (ipBanner) ipBanner.classList.toggle('is-hidden', on);
  };
  checkSticky();
  document.addEventListener('scroll', throttle(checkSticky, 300));

  /* ---- scroll to top ---- */
  const toTop = document.querySelector('.c-scroll-to-top__button');
  if (toTop) {
    toTop.addEventListener('click', (e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
    window.addEventListener('scroll', throttle(() => toTop.classList.toggle('is-visible', window.innerHeight < window.scrollY), 300));
  }

  /* ---- language menu ---- */
  document.querySelectorAll('.c-language-menu').forEach((m) => {
    const b = m.querySelector('.c-language-menu__button');
    const d = m.querySelector('.c-language-menu__dropdown');
    if (!b || !d) return;
    b.addEventListener('click', () => { b.classList.toggle('is-active'); d.classList.toggle('is-visible'); });
  });

  /* ---- main navigation mega dropdown ---- */
  const dd = document.querySelector('.c-main-nav__dropdown');
  const overlay = document.querySelector('.c-main-nav__dropdown-overlay');
  if (dd) {
    const rows = dd.querySelectorAll('.c-main-nav__dropdown-items');
    const btns = document.querySelectorAll('.c-main-nav__link[data-nav-index]');
    const close = () => {
      dd.classList.remove('is-visible'); if (overlay) overlay.classList.remove('is-visible');
      rows.forEach((r) => r.classList.remove('is-visible')); btns.forEach((x) => x.classList.remove('is-active'));
    };
    btns.forEach((b) => b.addEventListener('click', () => {
      const wasActive = b.classList.contains('is-active');
      close();
      if (wasActive) return;
      const row = rows[Number(b.dataset.navIndex)];
      if (row) row.classList.add('is-visible');
      b.classList.add('is-active'); dd.classList.add('is-visible'); if (overlay) overlay.classList.add('is-visible');
    }));
    const cb = dd.querySelector('.c-main-nav__dropdown-close-button');
    if (cb) cb.addEventListener('click', close);
    if (overlay) overlay.addEventListener('click', close);
  }

  /* ---- canon-menu: mobile off-canvas navigation (observed at 360, stardust/replica/motion/en-360-menu.json) ----
     burger click: .c-offcanvas + overlay .is-visible, toggle .is-active (click again / overlay closes).
     drill-down: a link with [data-offcanvas-menu-trigger=X] (it carries a chevron) opens list
     [data-offcanvas-menu-target=X] instead of navigating — the current list gets .is-fade-out, the next
     .is-fade-in (150ms slide/fade), then the old one .is-hidden; the backlink un-hides and points at the
     parent list; "Back" at the root re-hides the backlink. */
  const oc = document.querySelector('.c-offcanvas');
  const ocToggle = document.querySelector('.c-offcanvas__toggle-button');
  if (oc && ocToggle) {
    const ocOverlay = document.querySelector('.c-main-nav__dropdown-overlay');
    const back = oc.querySelector('.c-offcanvas__backlink');
    const listOf = (id) => oc.querySelector(`.c-navigation-list[data-offcanvas-menu-target="${id}"]`);
    const stack = [];
    let current = listOf('root');
    const show = (next) => {
      if (!next || next === current) return;
      const prev = current; current = next;
      prev.classList.add('is-fade-out');
      next.classList.remove('is-hidden'); next.classList.add('is-fade-in');
      requestAnimationFrame(() => requestAnimationFrame(() => next.classList.remove('is-fade-in')));
      setTimeout(() => { prev.classList.add('is-hidden'); prev.classList.remove('is-fade-out'); }, 150);
      if (back) back.classList.toggle('is-hidden', stack.length === 0);
    };
    const setOpen = (open) => {
      oc.classList.toggle('is-visible', open); ocToggle.classList.toggle('is-active', open);
      if (ocOverlay) ocOverlay.classList.toggle('is-visible', open);
    };
    ocToggle.addEventListener('click', () => setOpen(!oc.classList.contains('is-visible')));
    if (ocOverlay) ocOverlay.addEventListener('click', () => setOpen(false));
    oc.querySelectorAll('.c-navigation-list [data-offcanvas-menu-trigger]').forEach((a) => a.addEventListener('click', (e) => {
      const next = listOf(a.dataset.offcanvasMenuTrigger);
      if (!next) return;
      e.preventDefault(); stack.push(current); show(next);
    }));
    if (back) back.addEventListener('click', (e) => { e.preventDefault(); show(stack.pop()); });
  }

  /* ---- footer accordion (mobile) ---- */
  document.querySelectorAll('.o-footer-navigation__header').forEach((h) => h.addEventListener('click', () => {
    if (window.innerWidth >= 767) return;
    const c = h.parentElement.querySelector('.o-footer-navigation__content');
    const pm = h.querySelector('.u-icon__plus-minus');
    if (c) c.classList.toggle('is-visible');
    if (pm) pm.classList.toggle('is-active');
  }));

  /* ---- hero slider ---- */
  document.querySelectorAll('[data-hero-slider]').forEach((root) => {
    const track = root.querySelector('.c-heroteaser-fixed__slides');
    const slides = [...root.querySelectorAll('.c-heroteaser-fixed__slide')];
    const dots = [...root.querySelectorAll('.c-heroteaser__dot')];
    const arrows = root.querySelector('.c-heroteaser-fixed__arrows');
    const texts = root.querySelectorAll('.c-heroteaser__title, .c-heroteaser__description, .c-heroteaser__links');
    let index = Math.max(0, slides.findIndex((s) => s.classList.contains('is-active')));
    // Glide sizing: the slide strip is n viewports wide, each slide 1/n of it
    track.style.width = `${slides.length * 100}%`;
    slides.forEach((s) => { s.style.width = `${100 / slides.length}%`; });
    const place = (animate) => {
      track.style.transition = animate ? '' : 'none';
      track.style.transform = `translate3d(${(-index * 100) / slides.length}%, 0, 0)`;
      slides.forEach((s, i) => s.classList.toggle('is-active', i === index));
      dots.forEach((d, i) => d.classList.toggle('is-active', i === index));
    };
    const go = (to) => {
      if (slides.length < 2) return;
      const next = to === '>' ? (index + 1) % slides.length : to === '<' ? (index - 1 + slides.length) % slides.length : Number(String(to).replace('=', ''));
      if (next === index) return;
      texts.forEach((t) => t.classList.remove('is-active'));
      index = next; place(true);
      setTimeout(() => texts.forEach((t) => t.classList.add('is-active')), 1000);
    };
    place(false);
    root.querySelectorAll('[data-hero-dir]').forEach((c) => c.addEventListener('click', () => { go(c.dataset.heroDir); restart(); }));
    let timer = null; let hovered = false;
    const restart = () => { clearInterval(timer); timer = setInterval(() => { if (!hovered) go('>'); }, 8000); };
    root.addEventListener('mouseenter', () => { hovered = true; });
    root.addEventListener('mouseleave', () => { hovered = false; });
    restart();
    const arrowsBySize = () => {
      if (!arrows) return;
      arrows.classList.remove('arrows--md', 'arrows--lg');
      const w = window.innerWidth; const cls = w > 1660 ? 'arrows--lg' : w > 1024 ? 'arrows--md' : null;
      arrows.style.display = cls ? 'block' : 'none';
      if (cls) arrows.classList.add(cls);
    };
    arrowsBySize(); window.addEventListener('resize', arrowsBySize);
  });

  /* ---- lazy images (vanilla-lazyload classes: entered -> is-lazy-loading -> is-lazy-loaded; 300px threshold) ---- */
  const lazyImgs = [...document.querySelectorAll('img.c-image__embed-item.is-lazy-loaded')]
    .filter((img) => img.getBoundingClientRect().top > window.innerHeight + 300);
  if (lazyImgs.length && 'IntersectionObserver' in window) {
    const defer = (el) => { ['srcset', 'src'].forEach((a) => { if (el.hasAttribute(a)) { el.dataset[a] = el.getAttribute(a); el.removeAttribute(a); } }); };
    const restore = (el) => { ['srcset', 'src'].forEach((a) => { if (el.dataset[a]) { el.setAttribute(a, el.dataset[a]); delete el.dataset[a]; } }); };
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const img = e.target; io.unobserve(img);
      img.classList.add('entered', 'is-lazy-loading');
      img.addEventListener('load', () => { img.classList.remove('is-lazy-loading'); img.classList.add('is-lazy-loaded'); }, { once: true });
      img.parentElement.querySelectorAll('source').forEach(restore); restore(img);
    }), { rootMargin: '300px 0px' });
    lazyImgs.forEach((img) => { img.classList.remove('is-lazy-loaded'); img.parentElement.querySelectorAll('source').forEach(defer); defer(img); io.observe(img); });
  }

  /* ---- equalize heights ([data-equalize-height] groups: min-height = tallest member; re-run on resize) ---- */
  const equalize = () => {
    const groups = {};
    document.querySelectorAll('[data-equalize-height]').forEach((el) => {
      el.removeAttribute('style');
      (groups[el.dataset.equalizeHeight] ||= []).push(el.offsetHeight);
    });
    Object.keys(groups).forEach((g) => {
      const h = Math.max(...groups[g]);
      document.querySelectorAll(`[data-equalize-height="${g}"]`).forEach((el) => { el.style.minHeight = `${h}px`; });
    });
  };
  equalize();
  let eqTimer; window.addEventListener('resize', () => { clearTimeout(eqTimer); eqTimer = setTimeout(equalize, 300); });

  /* ---- fact-box count-up ---- */
  const counters = document.querySelectorAll('[data-count-to]');
  const runCount = (el) => {
    const to = Number(el.dataset.countTo); const dec = Number(el.dataset.countDecimals || 0); const f = 10 ** dec;
    const loc = (el.dataset.countLocale || 'en-US').replace('_', '-');
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const u = Math.min((ts - start) / 2000, 1);
      const v = Math.floor(u * to * f) / f;
      el.textContent = el.dataset.countTsdsep === '0' ? String(v) : v.toLocaleString(loc, { minimumFractionDigits: dec });
      if (u < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const checkCounters = () => counters.forEach((el) => {
    const bottom = el.getBoundingClientRect().y + el.offsetHeight;
    if (el.offsetParent !== null && el.dataset.countDone === '0' && bottom < window.innerHeight - 10) { el.dataset.countDone = '1'; runCount(el); }
  });
  checkCounters();
  document.addEventListener('scroll', throttle(checkCounters, 250));
})();
