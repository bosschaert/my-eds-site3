/* Shared motion layer — behaviours OBSERVED on live (stardust/replica/motion/fr-startseite.json,
   stardust/replica/motion/fr-startseite-therapiegebiete-cvrm-herzinsuffizienz.json), nothing inferred.
   Live class names are reused for the toggled states so the capture/observe instruments stay symmetric:
   - nav parent click (level-0 AND level-1, observed on the therapy-area page): megamenu.js toggleSubmenuItem —
     other open parents in the SAME <ul> close, the item toggles `open` (+aria-expanded), its arrow icon swaps
     icon-arrow-down <-> icon-arrow-up when it has one, its group gets `open-col-3` (megamenu.js column class).
   - window scroll: megamenu.js closeAllNavItems — every `.open` item closes and its arrow flips back (observed:
     icon-arrow-down re-added at scrollY 6 on the therapy-area page). The hamburger (mobile) state is exempt there.
   - search icon click: toggles `searchbox-enabled` on the search box (the only observed transition: background-color .5s).
   - social features icon click (socialfeatures.js, data-user-signed-in="false"): showPopup → body gains `popup-open`
     and the request-to-sign-in wrapper loses `hidden` (observed after the favorite click; share has
     data-share-allowed-anonymous="false" so it takes the same branch); the close icon reverses both (hidePopup).
   Not implemented (not observed to fire): nav-link hover on the Contactez-nous anchor, primary CTA hover,
   card/teaser hover, social icon hover, footer-link hover, document click-outside close, level-2 expansion. */
(function () {
  var parents = document.querySelectorAll('.main-nav__item--parent');
  function toggleArrows(li) {
    var icon = li.querySelector(':scope > .main-nav__content .main-nav__icon');
    if (icon) { icon.classList.toggle('icon-arrow-down'); icon.classList.toggle('icon-arrow-up'); }
  }
  function close(li) {
    if (!li.classList.contains('open')) return;
    li.classList.remove('open');
    li.setAttribute('aria-expanded', 'false');
    toggleArrows(li);
  }
  function open(li) {
    li.classList.add('open');
    li.setAttribute('aria-expanded', 'true');
    toggleArrows(li);
    var group = li.querySelector(':scope > .main-nav__group');
    if (group) group.classList.add('open-col-3');
  }
  parents.forEach(function (li) {
    var content = li.querySelector(':scope > .main-nav__content');
    if (!content) return;
    content.addEventListener('click', function () {
      var ul = li.closest('ul');
      if (ul) ul.querySelectorAll(':scope > .main-nav__item--parent.open').forEach(function (o) { if (o !== li) close(o); });
      if (li.classList.contains('open')) close(li); else open(li);
    });
  });
  var burger = document.querySelector('.main-nav__burger');
  window.addEventListener('scroll', function () {
    if (burger && burger.classList.contains('open')) return;
    document.querySelectorAll('.main-nav__item.open').forEach(close);
  });
  var search = document.querySelector('.site-search');
  var icon = document.querySelector('.site-search__icon');
  if (search && icon) {
    icon.addEventListener('click', function () {
      var on = !search.classList.contains('searchbox-enabled');
      search.classList.toggle('searchbox-enabled', on);
      var input = search.querySelector('#search-text-box');
      if (on && input) input.focus();
    });
  }
  document.querySelectorAll('.social__base').forEach(function (base) {
    var signin = base.querySelector('.social__popup--signin');
    var share = base.querySelector('.social__popup--share');
    function showPopup(el) { if (!el) return; document.body.classList.add('popup-open'); el.classList.remove('hidden'); }
    function hidePopup(el) { if (!el) return; document.body.classList.remove('popup-open'); el.classList.add('hidden'); }
    base.querySelectorAll('.social__icon').forEach(function (ic) {
      var handler = function (e) {
        e.preventDefault();
        var item = ic.closest('.social__item');
        var isShare = item && item.classList.contains('social__item--share');
        if (isShare && ic.dataset.shareAllowedAnonymous === 'true') showPopup(share); else showPopup(signin);
      };
      ic.addEventListener('click', handler);
      ic.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') handler(e); });
    });
    base.querySelectorAll('.social__popup .social__glyph--close').forEach(function (x) {
      x.addEventListener('click', function () { hidePopup(x.closest('.social__popup')); });
    });
  });
})();
