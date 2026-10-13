/**
 * news-list — "( News )" head + View all pill on the left, three latest post cards
 * (thumbnail, category dot, title, date) on the right.
 * Schema: stardust/eds-schema/index.json § news (3 × A.post). Decode tier: reconstructive.
 *
 * Authoring:
 *   - section default content before the block = head: <h2> label, <p> title,
 *     <p><em><a></a></em></p> pill CTA (reabsorbed, EW8)
 *   - one block row per post: image | <p> category, <p><a href>title</a></p>, <p> date
 *     (the title link becomes the card link and is unwrapped, EW6)
 * Card-as-link: the generated <a class="post-meta"> carries the authored href and its
 * ::after stretches over the whole card (thumbnail included).
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

// the section's leading default content (head), reabsorbed into the block (EW8)
function takeHead(block) {
  const wrapper = block.parentElement && block.parentElement.previousElementSibling;
  if (!wrapper || !wrapper.classList.contains('default-content-wrapper')) return [];
  const nodes = [...wrapper.children];
  wrapper.remove();
  return nodes;
}

function buildHead(nodes) {
  const head = div('news-head');
  const secHead = div('sec-head');
  const more = div('news-more');
  nodes.forEach((n) => {
    if (n.matches('p') && n.querySelector('a')) more.append(n);
    else if (/^H[1-6]$/.test(n.tagName)) secHead.append(wrapNode(n, 'sec-label'));
    else secHead.append(wrapNode(n, 'news-title'));
  });
  if (secHead.children.length) head.append(secHead);
  if (more.children.length) head.append(more);
  return head;
}

function buildPost(row) {
  const nodes = [];
  [...row.children].forEach((cell) => {
    [...cell.children].forEach((el) => {
      const m = media(el);
      if (m) nodes.push(m);
      else nodes.push(el);
    });
  });
  const post = div('post');
  const mediaBox = div('post-media');
  // the text half is the link; its ::after stretches over the whole card (EW6)
  const meta = document.createElement('a');
  meta.className = 'post-meta';
  const cat = div('post-cat');
  cat.append(document.createElement('i'));
  const text = div('post-text');
  let titleSeen = false;
  nodes.forEach((n) => {
    if (n.matches('picture, img')) {
      if (!mediaBox.children.length) mediaBox.append(n);
      return;
    }
    if (!n.textContent.trim()) return;
    const link = n.matches('a[href]') ? n : n.querySelector('a[href]');
    if (link && !titleSeen) {
      titleSeen = true;
      meta.href = link.getAttribute('href');
      link.replaceWith(...link.childNodes);
      text.prepend(wrapNode(n, 'post-title'));
    } else if (!titleSeen && cat.children.length === 1) {
      // category = the text before the title
      cat.append(n);
    } else {
      // date (and any further text) = after the title
      text.append(wrapNode(n, 'post-date'));
    }
  });
  meta.append(cat, text);
  post.append(mediaBox, meta);
  return post;
}

export default function decorate(block) {
  const headNodes = takeHead(block);
  const rows = [...block.children];
  const row = div('news-row');
  const list = div('news-items');
  rows.forEach((r) => {
    if (r.querySelector('img') || r.querySelector('a[href]')) list.append(buildPost(r));
    else headNodes.push(...r.querySelectorAll(':scope > div > *'));
  });
  row.append(buildHead(headNodes), list);
  block.replaceChildren(row);
  reveal([...list.querySelectorAll('.post-media')]);
}
