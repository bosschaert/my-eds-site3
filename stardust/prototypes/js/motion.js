/* Skerries Mills — shared motion layer. Mirrors only behaviour observed on the live page:
   scroll reveal (IntersectionObserver adding animate-fadeIn / animate-fadeInY, removed on exit),
   header "scrolling" state at scrollY >= header height, mobile menu toggle, and the two
   looping autoplay carousels (attractions, testimonials; 5500 ms, Swiper-equivalent geometry). */
(() => {
  const reveal = (selector, cls) => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add(cls);
        else e.target.classList.remove(cls);
      });
    });
    document.querySelectorAll(selector).forEach((el) => {
      el.classList.add('opacity-0');
      io.observe(el);
    });
  };

  const header = () => {
    const h = document.querySelector('.sm-header');
    if (!h) return;
    const threshold = h.offsetHeight;
    const update = () => h.classList.toggle('scrolling', window.scrollY >= threshold);
    window.addEventListener('scroll', update, { passive: true });
    update();
  };

  const mobileMenu = () => {
    const btn = document.getElementById('menu-btn');
    const menu = document.getElementById('menu');
    if (!btn || !menu) return;
    btn.addEventListener('click', () => {
      btn.classList.toggle('open');
      menu.classList.toggle('flex');
    });
    menu.querySelectorAll('.toggle_child').forEach((t) => {
      t.addEventListener('click', () => t.parentElement.classList.toggle('show_children'));
    });
  };

  const LAYOUTS = {
    attractions: [[1224, 4.2, 40], [1024, 3.2, 40], [768, 2.2, 15], [340, 1, 5], [0, 1, 0]],
    reviews: [[1024, 3, 40], [768, 3, 5], [340, 1, 5], [0, 1, 0]],
  };
  const SPEED = 300;

  const carousel = (track) => {
    const kind = track.dataset.carousel;
    const rail = track.querySelector('.sm-track__rail');
    const slides = [...rail.children];
    const count = slides.length;
    const dotsEl = track.querySelector('.sm-dots');
    const section = track.closest('section');
    let real = 0; // index of the leading (active) slide
    let moved = false; // Swiper keeps one slide before the active one only after the first advance
    let busy = false;
    let timer;

    const layout = () => {
      const w = window.innerWidth;
      const [, spv, gap] = LAYOUTS[kind].find(([min]) => w >= min);
      const width = (track.clientWidth - gap * (spv - 1)) / spv;
      return { spv, gap, width };
    };

    // Swiper loop: one slide sits before the active one; order rail as [active-1, active, …].
    const order = () => {
      const { gap, width } = layout();
      const before = moved ? 1 : 0;
      for (let i = 0; i < count; i += 1) {
        const s = slides[(real - before + i + count) % count];
        s.style.width = `${width}px`;
        s.style.marginRight = `${gap}px`;
        rail.appendChild(s);
      }
      rail.style.transitionDuration = '0ms';
      rail.style.transform = `translate3d(${-(width + gap) * before}px, 0, 0)`;
      fitHeight();
      paint();
    };

    const fitHeight = () => {
      if (kind !== 'reviews') return;
      const { spv } = layout();
      let max = 0;
      for (let i = 0; i < Math.ceil(spv); i += 1) {
        const s = slides[(real + i) % count];
        max = Math.max(max, s.offsetHeight);
      }
      rail.style.height = `${max}px`;
    };

    // live (Swiper) state classes, kept so behaviour stays observable with the same names
    const paint = () => {
      slides.forEach((s, i) => {
        s.classList.toggle('swiper-slide-active', i === real);
        s.classList.toggle('swiper-slide-next', i === (real + 1) % count);
        s.classList.toggle('swiper-slide-prev', moved && i === (real - 1 + count) % count);
      });
      if (!dotsEl) return;
      [...dotsEl.children].forEach((d, i) => d.classList.toggle('swiper-pagination-bullet-active', i === real));
    };

    const go = (dir) => {
      if (busy) return;
      busy = true;
      const { gap, width } = layout();
      if (!moved && dir < 0) { moved = true; order(); }
      const before = moved ? 1 : 0;
      rail.style.transitionDuration = `${SPEED}ms`;
      rail.style.transform = `translate3d(${-(width + gap) * (before + dir)}px, 0, 0)`;
      if (kind === 'reviews') {
        const next = (real + dir + count) % count;
        const { spv } = layout();
        let max = 0;
        for (let i = 0; i < Math.ceil(spv); i += 1) max = Math.max(max, slides[(next + i) % count].offsetHeight);
        rail.style.height = `${max}px`;
      }
      window.setTimeout(() => {
        moved = true;
        real = (real + dir + count) % count;
        order();
        busy = false;
      }, SPEED);
    };

    const schedule = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => { go(1); schedule(); }, Number(track.dataset.autoplay) || 5500);
    };

    if (dotsEl) {
      slides.forEach((_, i) => {
        const b = document.createElement('span');
        b.addEventListener('click', () => { real = i; moved = true; order(); });
        dotsEl.appendChild(b);
      });
    }
    section?.querySelector('.sm-arrow--next')?.addEventListener('click', () => go(1));
    section?.querySelector('.sm-arrow--prev')?.addEventListener('click', () => go(-1));
    window.addEventListener('resize', order);
    window.addEventListener('load', fitHeight);
    document.fonts?.ready.then(fitHeight);
    order();
    schedule();
  };

  const init = () => {
    mobileMenu();
    header();
    document.querySelectorAll('.sm-track[data-carousel]').forEach(carousel);
    reveal('.js-show-on-scroll', 'animate-fadeIn');
    reveal('.js-show-on-scroll-img', 'animate-fadeInY');
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
