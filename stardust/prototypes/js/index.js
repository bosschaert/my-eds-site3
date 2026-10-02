/* Autocolumns masonry (model lifted from the live grid: columns = max(1, floor(W/300)),
   gutter = 1% of the grid width (template tweak TGutter: 12px at 1200, 3.2px at 320), floored tile heights, shortest column first, leftmost on ties) +
   the mobile menu toggle. Behaviour-only; no content is generated here. */
(function () {
  var wrapper = document.querySelector('#projectThumbs .wrapper');
  if (!wrapper) return;
  var tiles = Array.prototype.slice.call(wrapper.querySelectorAll('.project'));
  function layout() {
    var W = wrapper.clientWidth;
    if (!W) return;
    var GUTTER = W / 100;
    var cols = Math.max(1, Math.floor(W / 300));
    var colW = (W - (cols - 1) * GUTTER) / cols;
    var ys = [];
    for (var i = 0; i < cols; i++) ys.push(0);
    tiles.forEach(function (t) {
      var c = 0;
      for (var k = 1; k < cols; k++) if (ys[k] < ys[c] - 0.5) c = k;
      var iw = parseFloat(t.getAttribute('data-w')) || 1;
      var ih = parseFloat(t.getAttribute('data-h')) || 1;
      var h = Math.floor(colW * ih / iw);
      t.style.left = (c * (colW + GUTTER)) + 'px';
      t.style.top = ys[c] + 'px';
      t.style.width = colW + 'px';
      t.style.height = h + 'px';
      t.classList.add('positioned');
      ys[c] += h + GUTTER;
    });
    var H = Math.max.apply(null, ys) - GUTTER;
    wrapper.style.height = (H > 0 ? H : 0) + 'px';
  }
  layout();
  var raf = 0;
  window.addEventListener('resize', function () {
    if (raf) return;
    raf = requestAnimationFrame(function () { raf = 0; layout(); });
  });

  var link = document.querySelector('#mobileMenuLink a');
  if (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      var open = document.body.classList.toggle('menu-open');
      link.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }
})();
