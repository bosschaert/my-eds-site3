/* balbriggan replica — page behaviours observed on the source: header compaction after 100px,
   nav toggles, 3-up news rail with dots/arrows. */
(() => {
  const header = document.querySelector('.site-header');
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 100);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  header.querySelector('.site-header__toggle').addEventListener('click', (e) => {
    const open = header.classList.toggle('is-open');
    e.currentTarget.setAttribute('aria-expanded', String(open));
  });
  header.querySelectorAll('.has-sub > a').forEach((a) => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const li = a.parentElement;
      const open = !li.classList.contains('is-open');
      header.querySelectorAll('.has-sub.is-open').forEach((o) => { o.classList.remove('is-open'); o.firstElementChild.setAttribute('aria-expanded', 'false'); });
      li.classList.toggle('is-open', open);
      a.setAttribute('aria-expanded', String(open));
    });
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.has-sub')) header.querySelectorAll('.has-sub.is-open').forEach((o) => o.classList.remove('is-open'));
  });

  document.querySelectorAll('.news__rail').forEach((rail) => {
    const track = rail.querySelector('.news__track');
    const slides = [...track.children];
    const dots = rail.querySelector('.news__dots');
    const per = Number(rail.dataset.perView) || 3;
    let index = 0;
    slides.forEach((_, i) => {
      const li = document.createElement('li');
      li.innerHTML = `<button type="button" role="tab" aria-label="${i + 1} of ${slides.length - per + 1}">${i + 1}</button>`;
      li.firstElementChild.addEventListener('click', () => go(i));
      dots.append(li);
    });
    function go(i) {
      index = (i + slides.length) % slides.length;
      const shift = Math.min(index, Math.max(0, slides.length - per));
      track.style.transform = `translateX(${-shift * (100 / per)}%)`;
      [...dots.children].forEach((d, k) => d.classList.toggle('is-active', k === index));
    }
    rail.querySelector('.news__arrow--prev').addEventListener('click', () => go(index - 1));
    rail.querySelector('.news__arrow--next').addEventListener('click', () => go(index + 1));
    go(0);
  });
})();
