/* ==========================================================================
   Doosan Bobcat — HOME (/en) behaviour (replica)
   Replaces jquery.fullpage.js + Swiper (source: main.js) on a NATIVE document
   scroll: 100vh sections stay in normal flow; wheel / keyboard / touch move
   one section at a time (scrollingSpeed 1000), #fp-nav dots + tooltips,
   #header.type_white for destination sections 3, 5, 6 (onLeave), body
   fp-viewing-<n> (0-based, as fullPage), section .active for entrances.
   Hero: fade carousel, autoplay advancing per slide, numbered pagination
   with progress bar. Products: drag carousel + hover background swap.
   ========================================================================== */
(() => {
  const doc = document.documentElement;
  const body = document.body;
  const header = document.getElementById('header');
  const wrap = document.getElementById('fullpage');
  if (!wrap) return;
  doc.classList.add('fp-native');

  /* ---------------- section scroller ---------------- */
  const sections = [...wrap.children].filter((el) => el.classList.contains('section'));
  const navLinks = [...document.querySelectorAll('#fp-nav a')];
  const WHITE = [2, 4, 5]; // fullPage onLeave: nextIndex 3, 5, 6 (1-based)
  const SPEED = 1000;
  const SCROLL_DELAY = 600; // fullPage: wheel input ignored until the move settles
  let current = -1;
  let animating = false;
  let lockUntil = 0;

  const maxScroll = () => Math.max(0, doc.scrollHeight - window.innerHeight);
  const targetOf = (i) => Math.min(sections[i].offsetTop, maxScroll());

  const setState = (i) => {
    if (i === current) return;
    if (current >= 0) body.classList.remove(`fp-viewing-${current}`);
    body.classList.add(`fp-viewing-${i}`);
    navLinks.forEach((a, n) => a.classList.toggle('active', n === i));
    if (header) header.classList.toggle('type_white', WHITE.includes(i));
    current = i;
  };

  // section in view → .active (entrance transitions); a section keeps it while any of it is on screen
  const markActive = () => {
    const vh = window.innerHeight;
    sections.forEach((s) => {
      const r = s.getBoundingClientRect();
      s.classList.toggle('active', r.bottom > 1 && r.top < vh - 1);
    });
  };

  const indexFromScroll = () => {
    const y = window.scrollY;
    if (y >= maxScroll() - 2) return sections.length - 1 - (sections[sections.length - 1].offsetHeight > 0 ? 0 : 1);
    const probe = y + window.innerHeight / 2;
    let idx = 0;
    sections.forEach((s, n) => { if (s.offsetTop <= probe) idx = n; });
    return idx;
  };

  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const moveTo = (i) => {
    i = Math.max(0, Math.min(sections.length - 1, i));
    const from = window.scrollY;
    const to = targetOf(i);
    setState(i);
    if (Math.abs(to - from) < 1) { markActive(); return; }
    animating = true;
    const t0 = performance.now();
    const step = (now) => {
      const p = Math.min(1, (now - t0) / SPEED);
      window.scrollTo({ top: from + (to - from) * ease(p), behavior: 'instant' });
      if (p < 1) requestAnimationFrame(step);
      else { animating = false; lockUntil = performance.now() + SCROLL_DELAY; markActive(); }
    };
    requestAnimationFrame(step);
  };
  const move = (dir) => {
    if (animating || performance.now() < lockUntil) return;
    const here = indexFromScroll();
    moveTo(here + dir);
  };

  window.addEventListener('wheel', (e) => {
    if (e.ctrlKey || (header && header.classList.contains('menu_open'))) return;
    if (e.target.closest && e.target.closest('#header')) return;
    e.preventDefault();
    if (Math.abs(e.deltaY) < 1) return;
    move(e.deltaY > 0 ? 1 : -1);
  }, { passive: false });

  window.addEventListener('keydown', (e) => {
    const t = e.target;
    if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
    const keys = { ArrowDown: 1, PageDown: 1, ArrowUp: -1, PageUp: -1 };
    if (e.key in keys) { e.preventDefault(); move(keys[e.key]); }
    else if (e.key === ' ') { e.preventDefault(); move(e.shiftKey ? -1 : 1); }
    else if (e.key === 'Home') { e.preventDefault(); moveTo(0); }
    else if (e.key === 'End') { e.preventDefault(); moveTo(sections.length - 1); }
  });

  // touch: fullPage touchSensitivity 5 (% of the viewport height)
  let touch = null;
  window.addEventListener('touchstart', (e) => {
    if (e.touches.length !== 1 || (header && header.contains(e.target))) { touch = null; return; }
    touch = { x: e.touches[0].clientX, y: e.touches[0].clientY, done: false };
  }, { passive: true });
  window.addEventListener('touchmove', (e) => {
    if (!touch) return;
    const dx = e.touches[0].clientX - touch.x;
    const dy = e.touches[0].clientY - touch.y;
    if (Math.abs(dy) <= Math.abs(dx)) return; // horizontal: leave it to the card carousel
    e.preventDefault();
    if (!touch.done && Math.abs(dy) > window.innerHeight * 0.05) { touch.done = true; move(dy < 0 ? 1 : -1); }
  }, { passive: false });

  navLinks.forEach((a, n) => a.addEventListener('click', (e) => { e.preventDefault(); moveTo(n); }));

  // footer TOP button: fullPage moveTo(1) (capture phase — keeps canon's generic handler out)
  const topBtn = document.querySelector('.fullpg_top_btn');
  if (topBtn) {
    document.addEventListener('click', (e) => {
      if (!topBtn.contains(e.target)) return;
      e.preventDefault();
      e.stopPropagation();
      moveTo(0);
    }, true);
  }

  window.addEventListener('scroll', () => {
    markActive();
    if (!animating) setState(indexFromScroll());
  }, { passive: true });
  let resizeT;
  window.addEventListener('resize', () => {
    clearTimeout(resizeT);
    resizeT = setTimeout(() => { if (!animating && current >= 0 && current < sections.length - 1) window.scrollTo({ top: targetOf(current), behavior: 'instant' }); markActive(); }, 150);
  });
  setState(indexFromScroll());
  markActive();

  /* ---------------- hero: fade carousel (Swiper effect 'fade', autoplay) ---------------- */
  const visual = document.querySelector('.visual_section');
  if (visual) {
    visual.classList.add('swiper_active');
    const slides = [...visual.querySelectorAll('.mvisual_swiper .swiper-slide')];
    const dots = [...visual.querySelectorAll('.mvisual_pagination .pg_btn')];
    const DELAY = 3000; // Swiper autoplay default (per-slide delay attribute never set on live)
    let active = 0;
    let timer = null;
    let playT = null;
    const videoOf = (i) => slides[i] && slides[i].querySelector('video');
    const schedule = () => {
      clearTimeout(timer);
      timer = setTimeout(() => go((active + 1) % slides.length), DELAY);
    };
    const go = (i) => {
      if (i === active) { schedule(); return; }
      slides[active].classList.remove('swiper-slide-active');
      slides[i].classList.add('swiper-slide-active');
      dots.forEach((d, n) => { d.classList.toggle('swiper-pagination-bullet-active', n === i); if (n === i) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current'); });
      // progress bar restarts on the new bullet (source: slideChangeTransitionEnd)
      visual.querySelectorAll('.active_bar').forEach((b) => b.classList.remove('on'));
      const bar = dots[i] && dots[i].querySelector('.active_bar');
      if (bar) { void bar.offsetWidth; bar.classList.add('on'); } // reflow: the bar was display:none until now
      // slideChangeTransitionStart: the slide's video restarts from 0 and plays
      const v = videoOf(i);
      if (v) { try { v.currentTime = 0; } catch (err) { /* media not ready */ } }
      clearTimeout(playT);
      playT = setTimeout(() => { if (v) { const p = v.play(); if (p && p.catch) p.catch(() => {}); } }, 0);
      active = i;
      schedule();
    };
    dots.forEach((d, n) => d.addEventListener('click', () => go(n)));
    const first = videoOf(0);
    if (first) { const p = first.play(); if (p && p.catch) p.catch(() => {}); }
    schedule();
  }

  /* ---------------- products: drag carousel (Swiper slidesPerView per breakpoint) ---------------- */
  const pc = document.querySelector('.product_card_swiper');
  if (pc) {
    const track = pc.querySelector('.swiper-wrapper');
    const cards = [...track.children];
    const bgs = [...document.querySelectorAll('.product_section .bg_wrap .bg')];
    const DRAG_SPEED = 1200;
    let index = 0;
    let offset = 0;
    // Swiper snapGrid: slide offsets below maxTranslate, then maxTranslate itself
    const snaps = () => {
      const m = Math.max(0, track.scrollWidth - pc.clientWidth);
      const s = cards.map((c) => c.offsetLeft - cards[0].offsetLeft).filter((p) => p < m - 1);
      s.push(m);
      return s;
    };
    const setX = (x, ms) => {
      track.style.transitionDuration = `${ms}ms`;
      track.style.transform = x ? `translate3d(${-x}px,0,0)` : '';
      offset = x;
    };
    const snap = (i) => {
      const s = snaps();
      index = Math.max(0, Math.min(s.length - 1, i));
      setX(s[index], DRAG_SPEED);
    };
    let drag = null;
    let moved = false;
    pc.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      drag = { x: e.clientX, y: e.clientY, start: offset, id: e.pointerId, axis: null };
      moved = false;
    });
    window.addEventListener('pointermove', (e) => {
      if (!drag || e.pointerId !== drag.id) return;
      const dx = e.clientX - drag.x;
      const dy = e.clientY - drag.y;
      if (!drag.axis && Math.abs(dx) + Math.abs(dy) > 5) drag.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
      if (drag.axis !== 'x') return;
      moved = true;
      pc.classList.add('is_dragging');
      const s = snaps();
      const last = s[s.length - 1];
      let x = drag.start - dx;
      if (x < 0) x /= 3; else if (x > last) x = last + (x - last) / 3; // resistance at the edges
      setX(x, 0);
    });
    const end = (e) => {
      if (!drag || (e && e.pointerId !== drag.id)) return;
      pc.classList.remove('is_dragging');
      if (moved) {
        const dx = offset - drag.start;
        const pos = snaps();
        let i;
        if (Math.abs(dx) > 50) i = dx > 0 ? index + 1 : index - 1;
        else i = pos.reduce((b, p, n) => (Math.abs(p - offset) < Math.abs(pos[b] - offset) ? n : b), 0);
        snap(i);
      }
      drag = null;
    };
    window.addEventListener('pointerup', end);
    window.addEventListener('pointercancel', end);
    pc.addEventListener('click', (e) => { if (moved) { e.preventDefault(); moved = false; } }, true);
    pc.addEventListener('dragstart', (e) => e.preventDefault());

    // productBg(): hover → body.type_white, every card .card_hover, matching background
    const desktop = window.matchMedia('(min-width: 1240px)');
    cards.forEach((card, n) => card.addEventListener('mouseenter', () => {
      body.classList.add('type_white');
      cards.forEach((c) => c.classList.add('card_hover'));
      bgs.forEach((b, k) => b.classList.toggle('active', k === n));
    }));
    pc.addEventListener('mouseleave', () => {
      body.classList.remove('type_white');
      cards.forEach((c) => c.classList.remove('card_hover'));
      bgs.forEach((b) => b.classList.remove('active'));
    });
    desktop.addEventListener && desktop.addEventListener('change', () => snap(0));
  }
})();
