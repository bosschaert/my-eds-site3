/**
 * service-cards — "( Service )" head, three linked service cards (photo, number,
 * title, description, accent rule) and a right-aligned View more pill.
 * Schema: stardust/eds-schema/index.json § service (3 × A.card). Decode tier: reconstructive.
 *
 * Authoring:
 *   - section default content BEFORE the block = head: <h2> label, <p> title (EW8)
 *   - one block row per card: image | <p> number, <h3><a href>title</a></h3>, <p> description
 *     (the title link becomes the card link and is unwrapped, EW6)
 *   - section default content AFTER the block = the <p><em><a></a></em></p> pill (EW8)
 * Card-as-link: the generated <a class="card-foot"> carries the authored href and its
 * ::after stretches over the whole card (photo included).
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

const media = (el) => {
  const img = el.matches('img') ? el : el.querySelector('img');
  return img ? img.closest('picture') || img : null;
};

// a sibling default-content wrapper of the block's wrapper, reabsorbed (EW8)
function takeDefault(wrapper) {
  if (!wrapper || !wrapper.classList.contains('default-content-wrapper')) return [];
  const nodes = [...wrapper.children];
  wrapper.remove();
  return nodes;
}

const isHeading = (n) => /^H[1-6]$/.test(n.tagName);

function buildCard(row) {
  const nodes = [];
  [...row.children].forEach((cell) => {
    [...cell.children].forEach((el) => nodes.push(media(el) || el));
  });
  const card = div('card');
  const mediaBox = div('card-media');
  // the text half is the link; its ::after stretches over the whole card (EW6)
  const foot = document.createElement('a');
  foot.className = 'card-foot';
  const num = div('card-num');
  const text = div('card-text');
  nodes.forEach((n) => {
    if (n.matches('picture, img')) {
      if (!mediaBox.children.length) mediaBox.append(n);
      return;
    }
    if (!n.textContent.trim()) return;
    if (isHeading(n) && !text.querySelector('.card-title')) {
      const link = n.querySelector('a[href]');
      if (link) {
        foot.href = link.getAttribute('href');
        link.replaceWith(...link.childNodes);
      }
      text.append(wrapNode(n, 'card-title'));
    } else if (!num.children.length && !text.children.length && /^\s*\d+\s*$/.test(n.textContent)) {
      num.append(n);
    } else {
      const link = !foot.href && n.querySelector('a[href]');
      if (link) {
        foot.href = link.getAttribute('href');
        link.replaceWith(...link.childNodes);
      }
      text.append(wrapNode(n, 'card-desc'));
    }
  });
  text.append(div('card-line'));
  foot.append(num, text);
  card.append(mediaBox, foot);
  return card;
}

export default function decorate(block) {
  const wrapper = block.parentElement;
  const headNodes = takeDefault(wrapper && wrapper.previousElementSibling);
  const footNodes = takeDefault(wrapper && wrapper.nextElementSibling);
  const inner = div('service-inner');
  const head = div('sec-head service-head');
  const cards = div('service-grid');
  const more = div('service-more');

  [...block.children].forEach((r) => {
    if (r.querySelector('img') || r.querySelector('h1, h2, h3, h4, h5, h6')) {
      cards.append(buildCard(r));
    } else {
      r.querySelectorAll(':scope > div > *').forEach((n) => {
        if (n.querySelector('a')) footNodes.push(n);
        else headNodes.push(n);
      });
    }
  });
  headNodes.forEach((n) => {
    if (n.matches('p') && n.querySelector('a')) more.append(n);
    else if (isHeading(n)) head.append(wrapNode(n, 'sec-label'));
    else head.append(wrapNode(n, 'sec-title'));
  });
  footNodes.forEach((n) => more.append(n));

  inner.append(head, cards);
  if (more.children.length) inner.append(more);
  block.replaceChildren(inner);
  reveal([...cards.querySelectorAll('.card-media')]);
}
