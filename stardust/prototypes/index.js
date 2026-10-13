// Interaction parity for the home archetype — only behaviours observed on the live page
// (stardust/replica/motion/index*.json): hero auto-rotation every 8 s, appear-on-scroll reveal
// (`appear` → `appear-active`), mobile menu dialog (`modal-ready`).
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const activate = (el) => requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('appear-active')));

  // hero: cut to the next slide every 8 s (sd-carousel data-interval-duration=8000); each slide settles from scale 1.03 over 10 s
  const slides = [...document.querySelectorAll('.hero__slide')];
  if (slides.length > 1 && !reduce) {
    let i = 0;
    setInterval(() => {
      const prev = slides[i];
      i = (i + 1) % slides.length;
      const next = slides[i];
      next.classList.add('appear');
      next.classList.remove('appear-active');
      next.dataset.pos = 'current';
      prev.dataset.pos = 'next';
      activate(next);
    }, 8000);
  }

  // appear: blur + fade in when the element enters the viewport
  const targets = document.querySelectorAll('.hero__slide[data-pos="current"], .hero__title, .about__bg, .post__media, .about__photo, .collage > *, .collage__row > *, .card__media, .work__media, .company__photo');
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting) { activate(e.target); io.unobserve(e.target); }
    }), { rootMargin: '0px', threshold: 0 });
    targets.forEach((el) => {
      el.classList.add('appear');
      if (el.getBoundingClientRect().top < innerHeight) el.classList.add('appear-active');
      else io.observe(el);
    });
  }

  // mobile menu
  const dialog = document.getElementById('menu');
  const close = () => { dialog.classList.remove('modal-ready'); setTimeout(() => dialog.close(), 400); };
  document.querySelector('.site-header__burger')?.addEventListener('click', () => {
    dialog.showModal();
    requestAnimationFrame(() => requestAnimationFrame(() => dialog.classList.add('modal-ready')));
  });
  dialog?.querySelector('.menu-dialog__close')?.addEventListener('click', close);
  dialog?.querySelectorAll('a').forEach((a) => a.addEventListener('click', close));
})();
