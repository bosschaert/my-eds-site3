/* content detail page behaviours (canon.js owns the chrome):
   - c-content-slider: Glide-like slider (perView 1/2/3/4 at <767/<1023/<1279/else, gap 32px),
     arrows step one slide, swipe on pointer drag, is-active on the current slide
   - page options share: GLightbox content modal (overlay fade + zoom-in slide), close via x / overlay / Esc */
(() => {
  const GAP = 32;
  const perViewFor = (w) => (w < 767 ? 1 : w < 1023 ? 2 : w < 1279 ? 3 : 4);

  document.querySelectorAll('[data-content-slider]').forEach((root) => {
    const track = root.querySelector('.c-content-slider__track');
    const list = root.querySelector('.c-content-slider__slides');
    const slides = [...list.children];
    let index = 0; let slideW = 0;

    const layout = () => {
      const pv = perViewFor(window.innerWidth);
      slideW = track.clientWidth / pv - (GAP * (pv - 1)) / pv;
      list.style.width = `${(slideW + GAP) * slides.length}px`;
      slides.forEach((s, i) => {
        s.style.width = `${slideW}px`;
        s.style.marginLeft = i === 0 ? '' : `${GAP / 2}px`;
        s.style.marginRight = i === slides.length - 1 ? '' : `${GAP / 2}px`;
      });
      move(false);
    };
    const move = (animate = true) => {
      list.style.transitionDuration = animate ? '' : '0ms';
      list.style.transform = `translate3d(${-index * (slideW + GAP)}px, 0px, 0px)`;
      slides.forEach((s, i) => s.classList.toggle('is-active', i === index));
    };
    const go = (dir) => {
      const last = slides.length - 1;
      if (dir === '>') index = index >= last ? 0 : index + 1;
      else if (dir === '<') index = index <= 0 ? last : index - 1;
      move();
    };
    root.querySelectorAll('[data-slider-dir]').forEach((b) => b.addEventListener('click', () => go(b.dataset.sliderDir)));

    let startX = null;
    track.addEventListener('pointerdown', (e) => { startX = e.clientX; });
    window.addEventListener('pointerup', (e) => {
      if (startX === null) return;
      const dx = e.clientX - startX; startX = null;
      if (Math.abs(dx) > 80) go(dx < 0 ? '>' : '<');
    });

    // slide images load when the slider nears the viewport (off-track slides never intersect themselves)
    const restore = (el) => { ['srcset', 'src'].forEach((a) => { if (el.dataset[a]) { el.setAttribute(a, el.dataset[a]); delete el.dataset[a]; } }); };
    const loadAll = () => list.querySelectorAll('img').forEach((img) => {
      if (!img.dataset.src && !img.dataset.srcset) return;
      img.addEventListener('load', () => { img.classList.remove('is-lazy-loading'); img.classList.add('is-lazy-loaded'); }, { once: true });
      img.classList.add('entered', 'is-lazy-loading');
      img.parentElement.querySelectorAll('source').forEach(restore); restore(img);
    });
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { io.disconnect(); loadAll(); } }, { rootMargin: '300px 0px' });
      io.observe(root);
    } else loadAll();

    layout();
    let t; window.addEventListener('resize', () => { clearTimeout(t); t = setTimeout(layout, 100); });
  });

  // share: GLightbox "content" type — the inline share window is moved into a modal slide
  const open = document.querySelector('[data-share-open]');
  const win = document.querySelector('[data-share-window]');
  if (open && win) {
    const home = win.parentElement; const anchor = win.nextSibling;
    let box = null;
    const close = () => {
      if (!box) return;
      win.hidden = true; home.insertBefore(win, anchor);
      box.remove(); box = null;
      document.documentElement.classList.remove('glightbox-open'); document.body.classList.remove('glightbox-open');
    };
    const show = () => {
      if (box) return;
      box = document.createElement('div');
      box.className = 'glightbox-container glightbox-clean';
      box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); box.tabIndex = -1;
      box.innerHTML = '<div class="goverlay"></div><div class="gcontainer"><div class="gslider"><div class="gslide"><div class="gslide-inner-content"><div class="ginner-container"><div class="gslide-media"><div class="ginlined-content"></div></div></div></div></div></div><button class="gnext gbtn" type="button" aria-label="Next"></button><button class="gprev gbtn" type="button" aria-label="Previous"></button></div>';
      win.hidden = false; box.querySelector('.ginlined-content').appendChild(win);
      document.body.appendChild(box);
      document.documentElement.classList.add('glightbox-open'); document.body.classList.add('glightbox-open');
      // GLightbox state sequence: type → overlay fade → slide loaded/current + zoom-in; single slide hides prev/next
      box.classList.add('glightbox--type-content');
      box.querySelector('.goverlay').classList.add('gfadeIn');
      box.querySelector('.gslide-media').classList.add('gslide-inline');
      box.querySelector('.gslide').classList.add('loaded', 'current', 'gzoomIn');
      box.querySelectorAll('.gbtn').forEach((b) => b.classList.add('disabled', 'glightbox-button-hidden'));
      box.querySelector('.goverlay').addEventListener('click', close);
      box.querySelector('.gslide').addEventListener('click', (e) => { if (e.target.closest('.gslide-media') === null) close(); });
      box.focus();
    };
    open.addEventListener('click', show);
    open.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(); } });
    win.querySelector('[data-share-close]')?.addEventListener('click', close);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  }
})();
