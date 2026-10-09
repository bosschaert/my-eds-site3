/* Sub-navigation initial state (list.theme.js, class List.init → showActiveItemInCenter): the active item is centred in the
   horizontal scroller on load — r = li.offsetLeft - ul.width/2 + li.width/2; ul.scroll({ left: r, behavior: 'smooth' }).
   Measured on live: scrollLeft 178 at 360 (active "À propos de l’ATTR" centred, Lexia metrics: offsetLeft 278, width 160);
   at 1440 the list does not overflow (clamps to 0). The live clientlib computes with the webfont already applied, so the
   computation waits for document.fonts.ready here (a deferred script otherwise reads fallback-font metrics → 145px).
   The arrow buttons / sticky variants of the component are not on this template (no --show-arrows / --sticky modifier). */
(function () {
  function centre() {
    document.querySelectorAll('.sub-nav__list').forEach(function (ul) {
      var li = ul.querySelector('.sub-nav__item--active');
      if (!li) return;
      var r = li.offsetLeft - ul.getBoundingClientRect().width / 2 + li.getBoundingClientRect().width / 2;
      ul.scroll({ left: r, behavior: 'smooth' });
    });
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(centre); else centre();
})();
