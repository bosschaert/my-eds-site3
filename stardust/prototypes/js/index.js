/* Home page behaviour, lifted from the source theme scripts:
 * - header gets `.scrolled` past 100px of scroll (scripts.js `$(window).scroll`);
 * - Bootstrap dropdowns and the mobile toggler open on click;
 * - the news carousel (slick: slidesToShow 3, infinite, arrows, dots). Infinite looping uses slick's
 *   aria-hidden clones (last 3 before, all 4 after) as on the source; the track jumps back across them. */
(() => {
  const header = document.querySelector('.site-header');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 100);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const closeAll = (except) => {
    document.querySelectorAll('.nav-item.is-open').forEach((li) => {
      if (li === except) return;
      li.classList.remove('is-open');
      li.querySelector('.dropdown-toggle').setAttribute('aria-expanded', 'false');
    });
  };
  document.querySelectorAll('.dropdown-toggle').forEach((toggle) => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      const li = toggle.closest('.nav-item');
      closeAll(li);
      const open = li.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  });
  document.addEventListener('click', (e) => { if (!e.target.closest('.has-dropdown')) closeAll(); });

  const toggler = document.querySelector('.navbar__toggler');
  const menu = document.getElementById('main-menu');
  toggler.addEventListener('click', () => {
    const open = menu.classList.toggle('is-open');
    toggler.setAttribute('aria-expanded', String(open));
  });

  document.querySelectorAll('[data-carousel]').forEach((root) => {
    const track = root.querySelector('.news__track');
    const dots = [...root.querySelectorAll('.news__dots li')];
    const slides = [...track.children];
    const before = slides.findIndex((el) => !el.classList.contains('news__slide--clone'));
    const count = slides.filter((el) => !el.classList.contains('news__slide--clone')).length;
    let pos = before;
    let busy = false;
    const slideWidth = () => slides[0].getBoundingClientRect().width;
    const place = (animate) => {
      track.style.transition = animate ? 'transform 500ms ease' : 'none';
      track.style.transform = `translate3d(${-pos * slideWidth()}px, 0, 0)`;
    };
    const mark = () => dots.forEach((d, i) => d.classList.toggle('is-active', i === (pos - before + count) % count));
    const go = (target) => {
      if (busy || target === pos) return;
      busy = true;
      pos = target;
      place(true);
      mark();
      track.addEventListener('transitionend', () => {
        if (pos >= before + count) pos -= count;
        if (pos < before) pos += count;
        place(false);
        busy = false;
      }, { once: true });
    };
    place(false);
    window.addEventListener('resize', () => place(false));
    root.querySelector('.news__arrow--prev').addEventListener('click', () => go(pos - 1));
    root.querySelector('.news__arrow--next').addEventListener('click', () => go(pos + 1));
    dots.forEach((dot, i) => dot.querySelector('button').addEventListener('click', () => go(before + i)));
  });
})();
