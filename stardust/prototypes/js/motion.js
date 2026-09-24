// motion.js — shared motion layer: the three mechanisms motion-observe recorded as firing on the live page.
(function () {
  // 1. Sticky header morph (live theme scripts.js): .scrolled past 100px of scroll, same element morphing in place.
  var wrap = document.getElementById('wrapper-navbar');
  if (wrap) {
    var morph = function () { wrap.classList.toggle('scrolled', (window.pageYOffset || document.documentElement.scrollTop) > 100); };
    window.addEventListener('scroll', morph, { passive: true });
    morph();
  }

  // 2. Bootstrap 4 collapse (mobile menu): collapse → collapsing (height 0 → scrollHeight, .35s) → collapse show, and back.
  document.querySelectorAll('.navbar-toggler[aria-controls]').forEach(function (btn) {
    var target = document.getElementById(btn.getAttribute('aria-controls'));
    if (!target) return;
    var busy = false;
    btn.addEventListener('click', function () {
      if (busy) return;
      busy = true;
      var showing = target.classList.contains('show');
      if (!showing) {
        target.classList.remove('collapse');
        target.classList.add('collapsing');
        target.style.height = '0px';
        btn.classList.remove('collapsed');
        btn.setAttribute('aria-expanded', 'true');
        void target.offsetHeight;
        target.style.height = target.scrollHeight + 'px';
        setTimeout(function () {
          target.classList.remove('collapsing');
          target.classList.add('collapse', 'show');
          target.style.height = '';
          busy = false;
        }, 350);
      } else {
        target.style.height = target.getBoundingClientRect().height + 'px';
        void target.offsetHeight;
        target.classList.add('collapsing');
        target.classList.remove('collapse', 'show');
        btn.classList.add('collapsed');
        btn.setAttribute('aria-expanded', 'false');
        target.style.height = '';
        setTimeout(function () {
          target.classList.remove('collapsing');
          target.classList.add('collapse');
          busy = false;
        }, 350);
      }
    });
  });

  // 3. Bootstrap 4 dropdown: click toggles .show on the toggle's parent li and its ul.dropdown-menu; one open at a time; outside click closes.
  var closeAll = function (except) {
    document.querySelectorAll('.dropdown-menu.show').forEach(function (menu) {
      if (menu === except) return;
      menu.classList.remove('show');
      var li = menu.parentElement; if (li) li.classList.remove('show');
      var tg = li && li.querySelector('.dropdown-toggle'); if (tg) tg.setAttribute('aria-expanded', 'false');
    });
  };
  document.querySelectorAll('.dropdown-toggle').forEach(function (tg) {
    tg.addEventListener('click', function (e) {
      e.preventDefault();
      var li = tg.parentElement;
      var menu = li && li.querySelector('.dropdown-menu');
      if (!menu) return;
      var open = menu.classList.contains('show');
      closeAll(menu);
      menu.classList.toggle('show', !open);
      li.classList.toggle('show', !open);
      tg.setAttribute('aria-expanded', String(!open));
      e.stopPropagation();
    });
  });
  document.addEventListener('click', function () { closeAll(null); });
})();
