/* Motion layer for the Balbriggan home archetype.
   Every behaviour below FIRED on the live site during runtime observation
   (stardust/replica/motion/index.json, index-1440b.json, index-360.json); nothing is inferred from
   static classes. Mechanisms mirror the live ones (theme scripts.js, Bootstrap 4 collapse/dropdown,
   slick 1.8 with slidesToShow 3 / dots / arrows, speed 500 ease, infinite), never a look-alike.
   Dead on live and therefore NOT implemented: `#main-menu … .nav-link:hover {color:#fff}` (style.css
   L112 — its selector `#main-menu.navbar-dark` never matches; the probe measured no hover change).
   Inert at t=0 so the static capture is unchanged: the nav morph only past scrollY 100, the carousel
   opens on the same three slides the static markup shows, collapse/dropdown wait for a click. */
(function () {
  'use strict';

  /* 1. Sticky-nav morph — theme scripts.js: $(window).scroll → scrollTop() > 100 ? add : remove .scrolled.
        Observed at 1440 and 360 (class mutation on div.sticky-nav; logo width/height transition 0.3s). */
  var stickies = document.querySelectorAll('.sticky-nav');
  function morph() {
    var y = window.pageYOffset || document.documentElement.scrollTop;
    for (var i = 0; i < stickies.length; i += 1) stickies[i].classList.toggle('scrolled', y > 100);
  }
  window.addEventListener('scroll', morph, { passive: true });
  morph();

  /* 2. Bootstrap 4 collapse (navbar toggler) — observed at 360: .collapse → .collapsing (height .35s ease)
        → .collapse.show, and back. */
  Array.prototype.forEach.call(document.querySelectorAll('[data-toggle="collapse"]'), function (btn) {
    var target = document.querySelector(btn.getAttribute('data-target') || ('#' + btn.getAttribute('aria-controls')));
    if (!target) return;
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      if (target.classList.contains('collapsing')) return;
      var show = !target.classList.contains('show');
      btn.setAttribute('aria-expanded', String(show));
      btn.classList.toggle('collapsed', !show);
      function settle() {
        target.removeEventListener('transitionend', settle);
        target.classList.remove('collapsing');
        target.classList.add('collapse');
        if (show) target.classList.add('show');
        target.style.height = '';
      }
      if (show) {
        target.classList.remove('collapse');
        target.classList.add('collapsing');
        target.style.height = '0px';
        var h = target.scrollHeight;
        target.addEventListener('transitionend', settle);
        requestAnimationFrame(function () { target.style.height = h + 'px'; });
      } else {
        target.style.height = target.getBoundingClientRect().height + 'px';
        void target.offsetHeight; /* reflow, as Bootstrap's Util.reflow */
        target.classList.add('collapsing');
        target.classList.remove('collapse', 'show');
        target.addEventListener('transitionend', settle);
        requestAnimationFrame(function () { target.style.height = ''; });
      }
    });
  });

  /* 3. Bootstrap 4 dropdown — observed at 1440 and 360: click on a.dropdown-toggle adds .show to the
        li.dropdown and its ul.dropdown-menu (aria-expanded true); a second click, an outside click or
        Escape removes it; opening one closes the others. */
  var toggles = Array.prototype.slice.call(document.querySelectorAll('[data-toggle="dropdown"]'));
  function setOpen(toggle, open) {
    var li = toggle.parentNode;
    var menu = li.querySelector('.dropdown-menu');
    li.classList.toggle('show', open);
    if (menu) menu.classList.toggle('show', open);
    toggle.setAttribute('aria-expanded', String(open));
  }
  function closeAll(except) {
    toggles.forEach(function (t) { if (t !== except) setOpen(t, false); });
  }
  toggles.forEach(function (t) {
    t.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      var open = !t.parentNode.classList.contains('show');
      closeAll(t);
      setOpen(t, open);
      if (open) t.focus(); /* Bootstrap 4 Dropdown.toggle() focuses the toggle — the observed outline-* transitions on the nav-link */
    });
  });
  document.addEventListener('click', function () { closeAll(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeAll(); });

  /* 4. slick carousel (.news-cards) — theme scripts.js: slidesToShow 3, dots, arrows; slick defaults
        slidesToScroll 1, infinite, speed 500, cssEase 'ease'. Observed at 1440 and 360: click on
        .slick-next / .slick-prev / a dot → transform transition 0.5s on .slick-track, slick-current /
        slick-active rotate over slides (clones included), li.slick-active moves on the dots.
        Layout mirrors slick's buildOut: 3 clones prepended, 4 appended (11 slides), slide width
        ceil(listWidth / 3) px inline, track = width × 11, start at translate3d(-3 × width). */
  Array.prototype.forEach.call(document.querySelectorAll('.news-cards.slick-slider'), function (slider) {
    var list = slider.querySelector('.slick-list');
    var track = slider.querySelector('.slick-track');
    if (!list || !track) return;
    var slides = Array.prototype.slice.call(track.children);
    var count = slides.length;
    var toShow = 3;
    var speed = 500;
    var current = 0;
    var animating = false;
    if (count <= toShow) return; /* slick would not clone or move */

    slides.forEach(function (s, i) {
      s.setAttribute('data-slick-index', String(i));
      s.setAttribute('role', 'tabpanel');
      s.id = 'slick-slide0' + i;
    });
    function clone(src, index) {
      var c = src.cloneNode(true);
      c.className = 'slick-slide slick-cloned';
      c.setAttribute('data-slick-index', String(index));
      c.id = '';
      c.setAttribute('aria-hidden', 'true');
      c.setAttribute('tabindex', '-1');
      c.removeAttribute('role');
      return c;
    }
    for (var p = count - 1; p >= count - toShow; p -= 1) track.insertBefore(clone(slides[p], p - count), track.firstChild);
    for (var q = 0; q < count; q += 1) track.appendChild(clone(slides[q], count + q));
    var all = Array.prototype.slice.call(track.children); /* 11 */

    var dots = Array.prototype.slice.call(slider.querySelectorAll('.slick-dots li'));
    var prev = slider.querySelector('.slick-prev');
    var next = slider.querySelector('.slick-next');
    var slideWidth = 0;

    function offset(pos) { return -(pos + toShow) * slideWidth; }
    function setDimensions() {
      slideWidth = Math.ceil(list.clientWidth / toShow);
      all.forEach(function (s) {
        /* the stylesheet's 33.3333% flex-basis is relative to the (now 11-slide) track — pin the slide like slick's inline width */
        s.style.width = slideWidth + 'px';
        s.style.flex = '0 0 ' + slideWidth + 'px';
        s.style.maxWidth = slideWidth + 'px';
      });
      track.style.width = (slideWidth * all.length) + 'px';
      track.style.transition = '';
      track.style.transform = 'translate3d(' + offset(current) + 'px, 0px, 0px)';
    }
    function setClasses() {
      all.forEach(function (s, i) {
        var live = i >= current + toShow && i < current + 2 * toShow;
        s.classList.toggle('slick-active', live);
        s.classList.toggle('slick-current', i === current + toShow);
        if (!s.classList.contains('slick-cloned')) {
          s.setAttribute('aria-hidden', live ? 'false' : 'true');
          if (live) s.removeAttribute('tabindex'); else s.setAttribute('tabindex', '-1');
        }
      });
      dots.forEach(function (li, i) {
        li.classList.toggle('slick-active', i === current);
        var b = li.querySelector('button');
        if (b) b.setAttribute('aria-selected', String(i === current));
      });
    }
    function go(target) {
      if (animating) return;
      animating = true;
      var landing = ((target % count) + count) % count; /* wrap like slick's infinite mode */
      track.style.transition = 'transform ' + speed + 'ms ease';
      track.style.transform = 'translate3d(' + offset(target) + 'px, 0px, 0px)';
      window.setTimeout(function () {
        track.style.transition = '';
        current = landing;
        track.style.transform = 'translate3d(' + offset(current) + 'px, 0px, 0px)';
        setClasses();
        animating = false;
      }, speed);
    }
    if (next) next.addEventListener('click', function (e) { e.preventDefault(); go(current + 1); });
    if (prev) prev.addEventListener('click', function (e) { e.preventDefault(); go(current - 1); });
    dots.forEach(function (li, i) {
      li.addEventListener('click', function (e) { e.preventDefault(); if (i !== current) go(i); });
    });
    window.addEventListener('resize', setDimensions);
    setDimensions();
    setClasses();
  });
})();
