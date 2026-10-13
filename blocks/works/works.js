/**
 * works — sand band: "( Works )" head + intro copy on the left, three linked work
 * entries (photo, title, tag pills) and a white View more pill on the right.
 * Schema: stardust/eds-schema/index.json § works (3 × A.work). Decode tier: reconstructive.
 *
 * Authoring:
 *   - section default content BEFORE the block = intro: <h2> label, <p> title,
 *     <p> body (EW8)
 *   - one block row per work: image | <p><a href>title</a></p>, <ul> tags (one <li> per tag)
 *     (the title link becomes the work link and is unwrapped, EW6)
 *   - section default content AFTER the block = the <p><strong><em><a></a></em></strong></p> pill
 * Card-as-link: the generated <a class="work-meta"> carries the authored href and its
 * ::after stretches over the whole entry (photo included).
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

function takeDefault(wrapper) {
  if (!wrapper || !wrapper.classList.contains('default-content-wrapper')) return [];
  const nodes = [...wrapper.children];
  wrapper.remove();
  return nodes;
}

const isHeading = (n) => /^H[1-6]$/.test(n.tagName);

function buildWork(row) {
  const nodes = [];
  [...row.children].forEach((cell) => {
    [...cell.children].forEach((el) => nodes.push(media(el) || el));
  });
  const work = div('work');
  const mediaBox = div('work-media');
  // the text half is the link; its ::after stretches over the whole entry (EW6)
  const meta = document.createElement('a');
  meta.className = 'work-meta';
  nodes.forEach((n) => {
    if (n.matches('picture, img')) {
      if (!mediaBox.children.length) mediaBox.append(n);
      return;
    }
    if (!n.textContent.trim()) return;
    if (n.matches('ul, ol')) {
      meta.append(wrapNode(n, 'tags'));
      return;
    }
    const link = !meta.href && n.querySelector('a[href]');
    if (link) {
      meta.href = link.getAttribute('href');
      link.replaceWith(...link.childNodes);
      meta.prepend(wrapNode(n, 'work-title'));
      return;
    }
    meta.append(wrapNode(n, 'work-title'));
  });
  work.append(mediaBox, meta);
  return work;
}

export default function decorate(block) {
  const wrapper = block.parentElement;
  const introNodes = takeDefault(wrapper && wrapper.previousElementSibling);
  const footNodes = takeDefault(wrapper && wrapper.nextElementSibling);
  const row = div('works-row');
  const intro = div('works-intro');
  const head = div('sec-head');
  const side = div('works-side');
  const list = div('works-list');
  const more = div('works-more');

  [...block.children].forEach((r) => {
    if (r.querySelector('img') || r.querySelector('ul, ol')) {
      list.append(buildWork(r));
    } else {
      r.querySelectorAll(':scope > div > *').forEach((n) => {
        if (n.querySelector('a')) footNodes.push(n);
        else introNodes.push(n);
      });
    }
  });

  let titleSeen = false;
  const body = div('sec-body');
  introNodes.forEach((n) => {
    if (n.matches('p') && n.querySelector('a')) more.append(n);
    else if (isHeading(n)) head.append(wrapNode(n, 'sec-label'));
    else if (!titleSeen) {
      titleSeen = true;
      head.append(wrapNode(n, 'sec-title'));
    } else body.append(n);
  });
  footNodes.forEach((n) => more.append(n));

  intro.append(head);
  if (body.children.length) intro.append(body);
  side.append(list);
  if (more.children.length) side.append(more);
  row.append(intro, side);
  block.replaceChildren(row);
  reveal([...list.querySelectorAll('.work-media')]);
}
