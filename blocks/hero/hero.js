/**
 * hero — home lead band: rotating full-bleed photo slides, eyebrow, the page <h1>,
 * lead copy and one pill CTA over a bottom shade and the decorative wave.
 * Schema: stardust/eds-schema/index.json § hero. Decode tier: template-slotted.
 *
 * Authoring (queried, never indexed — tolerates one cell or many rows):
 *   - every <img>/<picture> = one slide (authored order = rotation order)
 *   - the link-free <p> BEFORE the heading = eyebrow
 *   - the heading (<h1>) = title
 *   - link-free <p>s AFTER the heading = lead
 *   - link <p>s (<strong><a> → primary pill) = CTA
 * The wave is decorative (block CSS asset hero-wave.webp).
 *
 * Behaviour (prototype index.js): cut to the next slide every 8 s; each incoming
 * slide settles from scale 1.03 → 1 over 10 s and fades in; the title reveals
 * blur(11px) → 0 over 1800 ms. Skipped under prefers-reduced-motion.
 */

function wrapNode(node, className) {
  const w = document.createElement('div');
  w.className = className;
  w.append(node);
  return w;
}

const div = (className) => {
  const d = document.createElement('div');
  d.className = className;
  return d;
};

const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function activate(el) {
  requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('appear-active')));
}

// appear-on-scroll: elements already in view at first observation stay as rendered
// (prototype: `appear-active` added synchronously); the rest blur + fade in on entry.
function reveal(els) {
  if (!('IntersectionObserver' in window) || reduceMotion()) return;
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    const el = e.target;
    if (!el.dataset.appearSeen) {
      el.dataset.appearSeen = 'true';
      el.classList.add('appear');
      if (e.isIntersecting) {
        el.classList.add('appear-active');
        io.unobserve(el);
      }
      return;
    }
    if (e.isIntersecting) {
      activate(el);
      io.unobserve(el);
    }
  }));
  els.filter(Boolean).forEach((el) => io.observe(el));
}

function rotate(block, slides) {
  if (slides.length < 2 || reduceMotion()) return;
  let i = 0;
  const timer = setInterval(() => {
    if (!block.isConnected) {
      clearInterval(timer);
      return;
    }
    const prev = slides[i];
    i = (i + 1) % slides.length;
    const next = slides[i];
    next.classList.add('appear');
    next.classList.remove('appear-active');
    next.dataset.pos = 'current';
    prev.dataset.pos = 'next';
    activate(next);
  }, 8000);
}

export default function decorate(block) {
  const media = [...block.querySelectorAll('img')].map((img) => img.closest('picture') || img);
  const heading = block.querySelector('h1, h2, h3, h4, h5, h6');
  const paras = [...block.querySelectorAll('p')].filter((p) => !p.querySelector('img, picture'));
  const ctas = paras.filter((p) => p.querySelector('a'));
  const texts = paras.filter((p) => !p.querySelector('a'));
  const order = [...block.querySelectorAll('*')];
  const before = (a, b) => order.indexOf(a) < order.indexOf(b);
  const eyebrow = heading ? texts.find((p) => before(p, heading)) : null;
  const leads = texts.filter((p) => p !== eyebrow);
  const leftovers = [...block.querySelectorAll(':scope > div > div > :is(ul, ol, table, blockquote)')];

  const slidesBox = div('hero-slides');
  slidesBox.setAttribute('aria-hidden', 'true');
  const slides = media.map((m, idx) => {
    const slide = div('hero-slide');
    slide.dataset.pos = idx === 0 ? 'current' : 'next';
    m.querySelectorAll('img').forEach((img) => { img.loading = 'eager'; });
    if (m.tagName === 'IMG') m.loading = 'eager';
    slide.append(m);
    slidesBox.append(slide);
    return slide;
  });

  const wave = div('hero-wave');
  const body = div('hero-body');
  const inner = div('hero-inner');
  if (eyebrow) inner.append(wrapNode(eyebrow, 'hero-eyebrow'));
  let title = null;
  if (heading) {
    title = wrapNode(heading, 'hero-title');
    inner.append(title);
  }
  if (leads.length) {
    const lead = div('hero-lead');
    lead.append(...leads);
    inner.append(lead);
  }
  if (ctas.length) {
    const actions = div('hero-cta');
    actions.append(...ctas);
    inner.append(actions);
  }
  if (leftovers.length) inner.append(...leftovers);
  body.append(inner, div('hero-shade'));

  block.replaceChildren(slidesBox, wave, body);

  reveal([slides[0], title]);
  rotate(block, slides);
}
