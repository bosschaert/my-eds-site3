/* SORRA replica — interaction layer. Only behaviours observed live (stardust/replica/motion/index*.json):
   hero fade slideshow (Splide: interval 7000, speed 4000, rewind, dots, counter + ring, per-slide title/link,
   zoomOut on the active image), mobile drawer (hamburger ⇄ aria-hidden), WORKS accordion (is-visible).
   R-01 (inconsistency register): autoplay and the zoom pause while the hero is scrolled out of view. */
(function () {
  var INTERVAL = 7000, SPEED = 4000, TICK = 16;
  var root = document.getElementById('front-fv-splide');
  if (root) {
    var slides = Array.prototype.slice.call(root.querySelectorAll('.splide__slide'));
    var dots = Array.prototype.slice.call(root.querySelectorAll('.splide__pagination__page'));
    var current = root.querySelector('.progress-content .current');
    var titles = document.getElementById('slide-titles');
    var ring = root.querySelector('.progress-ring__circle');
    var circ = ring ? 2 * Math.PI * parseFloat(ring.getAttribute('r')) : 0;
    var index = 0, timer = null, ringTimer = null, ringStart = 0, inView = true;
    slides.forEach(function (s) { s.style.transition = 'opacity ' + SPEED + 'ms ease'; });
    function pad(n) { return n < 10 ? '0' + n : String(n); }
    function startRing() {
      if (!ring) return;
      if (ringTimer) clearInterval(ringTimer);
      ringStart = Date.now(); ring.style.strokeDasharray = circ; ring.style.strokeDashoffset = circ;
      ringTimer = setInterval(function () {
        var p = Math.min(100, (Date.now() - ringStart) / INTERVAL * 100);
        ring.style.strokeDashoffset = circ - p / 100 * circ;
        if (p >= 100) clearInterval(ringTimer);
      }, TICK);
    }
    function zoom(img) {
      if (!img) return;
      img.style.transition = 'none'; img.classList.remove('is-zooming'); void img.offsetWidth; img.classList.add('is-zooming');
      requestAnimationFrame(function () { img.style.transition = ''; });
    }
    function render(i) {
      var s = slides[i];
      slides.forEach(function (el, k) {
        el.classList.toggle('is-active', k === i); el.classList.toggle('is-visible', k === i);
        el.classList.toggle('is-prev', k === (i + slides.length - 1) % slides.length);
        el.classList.toggle('is-next', k === (i + 1) % slides.length);
        if (k === i) { el.removeAttribute('inert'); } else { el.setAttribute('inert', ''); }
      });
      dots.forEach(function (d, k) { d.classList.toggle('is-active', k === i); d.setAttribute('aria-selected', k === i ? 'true' : 'false'); });
      if (current) current.textContent = pad(i + 1);
      if (titles) titles.innerHTML = '<h2 class="slide-title-ja">' + (s.dataset.jaTitle || '') + '</h2>'
        + '<a href="' + (s.dataset.url || '#') + '" class="slide-title__link c-underline-arrow">VIEW THIS WORK</a>';
      zoom(s.querySelector('img'));
      startRing();
    }
    function go(i) { index = (i + slides.length) % slides.length; render(index); schedule(); }
    function schedule() {
      if (timer) clearTimeout(timer);
      if (!inView) return;
      timer = setTimeout(function () { go(index + 1); }, INTERVAL);
    }
    dots.forEach(function (d, k) { d.addEventListener('click', function () { go(k); }); });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        inView = entries[0].isIntersecting;
        root.classList.toggle('is-paused', !inView);
        if (inView) schedule(); else if (timer) clearTimeout(timer);
      }, { threshold: 0.2 }).observe(root);
    }
    /* R-02: the mount-time zoom of slide 1 is not replayed; zoomOut runs from the first slide change on. */
    startRing();
    schedule();
  }
  /* mobile drawer */
  var btn = document.getElementById('js-toggleDrawer'), drawer = document.getElementById('js-drawer');
  if (btn && drawer) {
    btn.addEventListener('click', function () {
      var open = drawer.getAttribute('aria-hidden') !== 'false';
      drawer.setAttribute('aria-hidden', open ? 'false' : 'true');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
      btn.closest('.c-hamburger').classList.toggle('--open', open);
      document.documentElement.classList.toggle('is-drawer-open', open);
    });
  }
  /* WORKS accordion (drawer, mobile front-nav, footer) */
  Array.prototype.forEach.call(document.querySelectorAll('.js-catToggleButton'), function (t) {
    t.addEventListener('click', function () {
      var cat = t.nextElementSibling;
      if (cat && cat.classList.contains('js-worksCat')) cat.classList.toggle('is-visible');
    });
  });
})();
