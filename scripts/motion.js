/*
 * motion.js — shared trigger layer for the behaviours observed on the source site
 * (the motion rules live in styles/styles.css): clip-y line reveals, hr draw, editor
 * paragraph fade, case-title reveal, marquee visibility, mail button reveal.
 * Blocks call observeReveals(block) once they have decorated.
 */
const SELECTORS = '.clip-y, .hr, .editor.js-iv-c, .pickup, .pickup-li, .ui-btn-mail';
let io;

function reveal(el) {
  el.setAttribute('data-shown', '1');
  if (el.classList.contains('pickup')) {
    el.classList.add('entered');
    el.querySelectorAll('.mq-t').forEach((t) => t.setAttribute('data-visible', '1'));
  }
  if (el.classList.contains('pickup-li')) {
    const a = el.querySelector('.pickup-a');
    if (a) a.classList.add('selected');
  }
}

function observer() {
  if (!io) {
    io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        reveal(e.target);
        io.unobserve(e.target);
      });
    }, { threshold: 0.15 });
  }
  return io;
}

/**
 * Observes every reveal target under root (and root itself when it is one) and marks it
 * data-shown="1" the first time it intersects the viewport.
 * @param {Element|Document} [root] subtree to scan (default: the document)
 */
export function observeReveals(root = document) {
  const o = observer();
  const targets = [...root.querySelectorAll(SELECTORS)];
  if (root.matches && root.matches(SELECTORS)) targets.unshift(root);
  targets.forEach((target) => o.observe(target));
}

export default observeReveals;
