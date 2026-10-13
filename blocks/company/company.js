/**
 * company — sand band: full-width studio photo, then "( Company )" head + body copy
 * with a white View more pill aligned to the bottom right.
 * Schema: stardust/eds-schema/index.json § company. Decode tier: template-slotted.
 *
 * Authoring (queried by role, never by row index):
 *   - first image = photo
 *   - <h2> = label; link-free <p>s: first = title, the rest = body
 *   - link <p> (<strong><em><a> → accent pill) = CTA
 *
 * Behaviour: the photo blurs + fades in on scroll entry (1800 ms, prototype index.css).
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
      requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('appear-active')));
      io.unobserve(el);
    }
  }));
  els.filter(Boolean).forEach((el) => io.observe(el));
}

export default function decorate(block) {
  const media = [...block.querySelectorAll('img')].map((img) => img.closest('picture') || img);
  const heading = block.querySelector('h1, h2, h3, h4, h5, h6');
  const paras = [...block.querySelectorAll('p')].filter((p) => !p.querySelector('img, picture'));
  const ctas = paras.filter((p) => p.querySelector('a'));
  const texts = paras.filter((p) => !p.querySelector('a') && p.textContent.trim());
  const leftovers = [...block.querySelectorAll(':scope > div > div > :is(ul, ol, table, blockquote)')];

  const inner = div('company-inner');
  const photo = div('company-photo');
  if (media[0]) photo.append(media[0]);
  const row = div('company-row');
  const text = div('company-text');
  const head = div('sec-head');
  if (heading) head.append(wrapNode(heading, 'sec-label'));
  if (texts[0]) head.append(wrapNode(texts[0], 'sec-title'));
  text.append(head);
  if (texts.length > 1 || leftovers.length || media.length > 1) {
    const body = div('sec-body');
    body.append(...texts.slice(1), ...leftovers, ...media.slice(1));
    text.append(body);
  }
  row.append(text);
  if (ctas.length) {
    const more = div('company-more');
    more.append(...ctas);
    row.append(more);
  }
  inner.append(photo, row);
  block.replaceChildren(inner);
  reveal([photo]);
}
