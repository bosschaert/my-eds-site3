/* Interaction parity — only behaviours observed on the live page (stardust/replica/motion/index.json). */
(() => {
  // promo strip: auto-rotating glider (observed idle class mutations active/left/right)
  const track = document.querySelector('.hf-promo__track');
  if (track) {
    let i = 1;
    const n = track.children.length;
    let rotating = false;
    const rotate = () => { if (rotating) return; rotating = true; setInterval(() => { i = (i + 1) % n; [...track.children].forEach((sl, j) => sl.classList.toggle('is-active', j === i)); }, 5000); };
    // starts with the first real user signal, like the hero (keeps automated captures on the server-rendered slide)
    ['mousemove', 'touchend'].forEach((ev) => document.addEventListener(ev, rotate, { once: true, passive: true }));
  }

  // hero banner: dots, pause/play, autoplay every 6.5 s once a real user is present (source SLIDE_INTERVAL_MS)
  const banner = document.querySelector('.hf-banner');
  if (banner) {
    const slides = [...banner.querySelectorAll('.hf-banner__slide')];
    const dots = [...banner.querySelectorAll('.hf-banner__dot')];
    const live = banner.querySelector('.hf-banner__announce');
    const pause = banner.querySelector('.hf-banner__pause');
    let cur = 0; let timer = null; let paused = false;
    const load = (s) => s.querySelectorAll('[data-src],[data-srcset]').forEach((el) => {
      if (el.dataset.src) { el.src = el.dataset.src; el.removeAttribute('data-src'); }
      if (el.dataset.srcset) { el.srcset = el.dataset.srcset; el.removeAttribute('data-srcset'); }
    });
    const go = (k) => {
      cur = (k + slides.length) % slides.length;
      load(slides[cur]);
      slides.forEach((s, j) => s.classList.toggle('is-active', j === cur));
      dots.forEach((d, j) => (j === cur ? d.setAttribute('aria-current', 'true') : d.removeAttribute('aria-current')));
      if (live) live.textContent = `Showing slide ${cur + 1} of ${slides.length}`;
    };
    const start = () => { if (!timer && !paused) timer = setInterval(() => go(cur + 1), 6500); };
    const stop = () => { clearInterval(timer); timer = null; };
    dots.forEach((d, j) => d.addEventListener('click', () => { go(j); stop(); start(); }));
    pause?.addEventListener('click', () => {
      paused = !paused;
      banner.classList.toggle('is-paused', paused);
      pause.setAttribute('aria-label', paused ? 'Play automatic slide rotation' : 'Pause automatic slide rotation');
      if (paused) stop(); else start();
    });
    // source: autoplay only after real user presence (mousemove / touchend); hover and focus pause it
    ['mousemove', 'touchend'].forEach((ev) => document.addEventListener(ev, start, { once: true, passive: true }));
    banner.addEventListener('mouseenter', stop);
    banner.addEventListener('mouseleave', start);
    banner.addEventListener('focusin', stop);
    banner.addEventListener('focusout', start);
  }

  // header: mega menu (L1 click), mobile drawer + L2 accordions, search and account panels
  const header = document.querySelector('.hf-header');
  if (header) {
    const items = [...header.querySelectorAll('.hf-nav__item')];
    const closeAll = (except) => items.forEach((li) => {
      if (li === except) return;
      li.classList.remove('is-open');
      li.querySelector('.hf-nav__link')?.setAttribute('aria-expanded', 'false');
    });
    items.forEach((li) => {
      const btn = li.querySelector('button.hf-nav__link');
      if (!btn) return;
      btn.addEventListener('click', () => {
        const open = !li.classList.contains('is-open');
        closeAll(li);
        li.classList.toggle('is-open', open);
        btn.setAttribute('aria-expanded', String(open));
      });
      li.querySelector('.hf-mega__back')?.addEventListener('click', () => { li.classList.remove('is-open'); btn.focus(); });
    });
    header.querySelectorAll('.hf-mega__close').forEach((b) => b.addEventListener('click', () => {
      closeAll(); header.classList.remove('is-drawer-open');
    }));
    header.querySelectorAll('.hf-mega__l2-trigger').forEach((t) => t.addEventListener('click', () => {
      const col = t.closest('.hf-mega__column');
      const open = !col.classList.contains('is-open');
      col.classList.toggle('is-open', open);
      t.setAttribute('aria-expanded', String(open));
    }));
    header.querySelector('.hf-header__hamburger button')?.addEventListener('click', () => header.classList.toggle('is-drawer-open'));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeAll(); });

    const toggle = (btn, panel) => btn?.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', String(open));
      panel.hidden = !open;
      if (open) panel.querySelector('input')?.focus();
    });
    toggle(header.querySelector('.hf-header__search'), header.querySelector('.hf-search'));
    toggle(header.querySelector('.hf-header__account'), header.querySelector('.hf-account'));
  }

  // newsletter: no backend connected yet (owner decision D4)
  document.querySelector('.hf-footer__form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    if (btn) btn.textContent = 'Thanks!';
  });
})();
