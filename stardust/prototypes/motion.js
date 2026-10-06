// motion.js — trigger layer for the FIRED behaviours only (see motion.css). No frameworks, no other behaviour.
(function () {
  var shown = function (el) { el.setAttribute('data-shown', '1'); };
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target;
      shown(el);
      if (el.classList.contains('pickup')) {
        el.classList.add('entered');
        el.querySelectorAll('.mq-t').forEach(function (t) { t.setAttribute('data-visible', '1'); });
      }
      if (el.classList.contains('pickup-li')) { var a = el.querySelector('.pickup-a'); if (a) a.classList.add('selected'); }
      io.unobserve(el);
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.clip-y, .hr, .editor.js-iv-c, .pickup, .pickup-li, .ui-btn-mail').forEach(function (el) { io.observe(el); });
  var mail = document.querySelector('.ui-btn-mail');
  if (mail) mail.addEventListener('click', function (ev) {
    ev.preventDefault();
    var addr = (mail.querySelector('.label .t') || {}).textContent || '';
    if (navigator.clipboard && addr) navigator.clipboard.writeText(addr.trim()).catch(function () {});
    mail.classList.add('copied');
  });
})();
