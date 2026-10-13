/**
 * about — full-bleed photo backdrop under a dark blurred veil: "( About )" label,
 * title, body copy and a pill CTA beside a portrait photo, then a four-photo collage.
 * Schema: stardust/eds-schema/index.json § about. Decode tier: template-slotted.
 *
 * Authoring (queried by role, never by row index):
 *   - images in authored order: 1 = backdrop, 2 = portrait photo, 3–6 = collage a–d
 *   - <h2> = label; link-free <p>s: first = title, the rest = body
 *   - link <p> (<strong><a> → primary pill) = CTA
 *
 * Behaviour (prototype index.js/index.css): backdrop settles scale 1.1 → 1 over 4 s;
 * photo and collage blur + fade in on scroll entry (per-element durations in CSS).
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

function mediaBox(m, className) {
  const box = div(className);
  if (m) box.append(m);
  return box;
}

export default function decorate(block) {
  const media = [...block.querySelectorAll('img')].map((img) => img.closest('picture') || img);
  const heading = block.querySelector('h1, h2, h3, h4, h5, h6');
  const paras = [...block.querySelectorAll('p')].filter((p) => !p.querySelector('img, picture'));
  const ctas = paras.filter((p) => p.querySelector('a'));
  const texts = paras.filter((p) => !p.querySelector('a') && p.textContent.trim());
  const leftovers = [...block.querySelectorAll(':scope > div > div > :is(ul, ol, table, blockquote)')];
  const [bgM, photoM, aM, bM, cM, dM] = media;

  const bg = mediaBox(bgM, 'about-bg');
  const veil = div('about-veil');
  const inner = div('about-inner');
  const top = div('about-top');
  const text = div('about-text');
  if (heading) text.append(wrapNode(heading, 'sec-label'));
  if (texts[0]) text.append(wrapNode(texts[0], 'sec-title'));
  if (texts.length > 1) {
    const body = div('about-body');
    body.append(...texts.slice(1));
    text.append(body);
  }
  if (leftovers.length) text.append(...leftovers);
  if (ctas.length) {
    const more = div('about-more');
    more.append(...ctas);
    text.append(more);
  }
  const photo = mediaBox(photoM, 'about-photo');
  top.append(text, photo);

  const collage = div('collage');
  const ca = mediaBox(aM, 'collage-a');
  const cb = mediaBox(bM, 'collage-b');
  collage.append(ca, cb);
  const row = div('collage-row');
  const cc = mediaBox(cM, 'collage-c');
  const cd = mediaBox(dM, 'collage-d');
  row.append(cc, cd);
  // any further authored images join the last collage row rather than vanish
  media.slice(6).forEach((m) => row.append(mediaBox(m, 'collage-extra')));

  inner.append(top, collage, row);
  veil.append(inner);
  block.replaceChildren(bg, veil);

  reveal([bg, photo, ca, cb, cc, cd]);
}
