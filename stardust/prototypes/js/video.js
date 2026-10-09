/* Kaltura poster box (captured state): the live embed script sizes .cmp-video__player to a 16:9 box of its own width
   (inline style height: 664px at 1440, 203px at 360 — Math.round(width * 9 / 16)). Initial state needs computing, so this
   is the one sanctioned JS for the module; no player is loaded (dynamic-features row 8: poster + play affordance only). */
(function () {
  var players = document.querySelectorAll('.video__player');
  if (!players.length) return;
  function size() {
    players.forEach(function (p) { p.style.height = Math.round(p.clientWidth * 9 / 16) + 'px'; });
  }
  size();
  window.addEventListener('resize', size);
})();
