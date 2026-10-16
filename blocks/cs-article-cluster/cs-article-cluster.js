/**
 * cs-article-cluster — stories article cluster (source c-cs-article-cluster + constories cards).
 *
 * Content (rows classified by content, never by index):
 *   heading  — a row with an h1/h2 and no link (strong part bold, rest light)
 *   featured — image cell | text cell whose CTA is a bold link (a.button): eyebrow <p>, heading,
 *              teaser <p>, CTA → single image left (scale on focus), sticky teaser right
 *   card     — image cell (renditions: 2 → >= 767 | < 767, 1 → all) | text cell with a plain
 *              link: eyebrow <p>, heading, teaser <p>, CTA <p> → card-as-link grid item
 *   more     — a text-only row (no heading, no link): the "More articles" button; every card
 *              row after it is hidden until the button is activated (constories load-more,
 *              cards authored from the captured endpoint response)
 * Variant wide-first: the first card spans 2/3 at >= 1279 (source col-lg-8).
 * Card-as-link (EW6): the teaser <a> takes the CTA href, the inner anchor is unwrapped.
 * Authored nodes are MOVED (EW1); the "More articles" text stays in its <p> inside a
 * role=button wrapper (EW7); re-entrant (EW9).
 */
/** source u-icon box with /icons/<name>.svg — same markup as scripts/utils.js
 *  uIcon(name, classes) with createIcon's img mode, inlined so the block has no module import */
function uIcon(name, classes) {
  const box = document.createElement('i');
  box.className = `u-icon ${classes}`;
  const icon = document.createElement('span');
  icon.className = `icon icon-${name}`;
  const img = document.createElement('img');
  img.src = `${(window.hlx && window.hlx.codeBasePath) || ''}/icons/${name}.svg`;
  img.alt = '';
  img.loading = 'lazy';
  icon.append(img);
  box.append(icon);
  return box;
}

function wrap(className, tag = 'div') {
  const el = document.createElement(tag);
  el.className = className;
  return el;
}

function cellElements(cell) {
  return [...cell.childNodes].map((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      if (!node.textContent.trim()) return null;
      const p = document.createElement('p');
      p.append(node);
      return p;
    }
    return node.nodeType === Node.ELEMENT_NODE ? node : null;
  }).filter(Boolean);
}

/** bold+light headings: the light text part sits in a <span> beside the <strong> (source
 *  `<strong>Bold </strong><span>light</span>`); the authored text node itself is moved */
function spanLightParts(heading) {
  if (!heading.querySelector('strong')) return;
  [...heading.childNodes].forEach((node) => {
    if (node.nodeType !== Node.TEXT_NODE || !node.textContent.trim()) return;
    const span = document.createElement('span');
    node.replaceWith(span);
    span.append(node);
  });
}

function unwrapLink(a) {
  a.replaceWith(...a.childNodes);
}

function picture(cell) {
  const box = wrap('cs-article-cluster-picture');
  const pics = [...cell.querySelectorAll('picture, img:not(picture img)')];
  pics.forEach((pic, i) => {
    const slot = wrap('cs-article-cluster-rendition');
    if (pics.length > 1) slot.classList.add(i === 0 ? 'is-lg' : 'is-sm');
    slot.append(pic);
    box.append(slot);
  });
  return box;
}

/** text cell → teaser <a> (eyebrow, title, text, CTA); returns { teaser, ctaP } */
function teaserFrom(cells, featured) {
  const teaser = wrap('cs-article-cluster-teaser', 'a');
  const textCell = cells.find((c) => c.querySelector('a[href]')) || cells[cells.length - 1];
  const imageCell = cells.find((c) => c !== textCell && c.querySelector('picture, img'));
  const link = textCell.querySelector('a[href]');
  teaser.href = link.href;
  if (!featured && imageCell) teaser.append(picture(imageCell));
  const body = wrap('cs-article-cluster-body');
  // inter-element whitespace as in source markup: the teaser link's accessible name / textContent
  // keeps word breaks between eyebrow, title, text and CTA
  const add = (el) => body.append(...(body.childNodes.length ? [' ', el] : [el]));
  let seenTitle = false;
  cellElements(textCell).forEach((node) => {
    if (node.contains(link)) {
      const box = featured ? wrap('cs-article-cluster-cta') : wrap('cs-article-cluster-link');
      if (featured) {
        const btn = wrap('c-button');
        btn.append(node);
        box.append(btn);
      } else {
        box.append(uIcon('chevron-right', 'is-sm has-bg'), node);
      }
      unwrapLink(link);
      add(box);
    } else if (/^H[1-6]$/.test(node.tagName)) {
      const t = wrap('cs-article-cluster-title');
      t.append(node);
      add(t);
      seenTitle = true;
    } else {
      const cls = seenTitle ? 'cs-article-cluster-text' : 'cs-article-cluster-eyebrow';
      const box = wrap(cls);
      box.append(node);
      add(box);
    }
  });
  teaser.append(body);
  return { teaser, imageCell };
}

function observeFocus(box) {
  if (!('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => e.target.classList.toggle('has-focus', e.isIntersecting));
  }, { root: null, rootMargin: '-50% 0% -50% 0%', threshold: 0 });
  io.observe(box);
}

export default function decorate(block) {
  if (block.querySelector('.cs-article-cluster-grid')) return;
  const head = wrap('cs-article-cluster-head');
  const featuredRow = wrap('cs-article-cluster-featured');
  const grid = wrap('cs-article-cluster-grid');
  let more = null;
  let cardIndex = 0;

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const link = row.querySelector('a[href]');
    if (!link && row.querySelector('h1, h2')) {
      row.querySelectorAll('h1, h2').forEach(spanLightParts);
      cells.forEach((c) => head.append(...cellElements(c)));
    } else if (link && link.closest('.button-wrapper, strong')) {
      const { teaser, imageCell } = teaserFrom(cells, true);
      const mediaCol = wrap('cs-article-cluster-featured-media');
      if (imageCell) {
        const pic = picture(imageCell);
        mediaCol.append(pic);
        observeFocus(pic);
      }
      const textCol = wrap('cs-article-cluster-featured-text');
      const sticky = wrap('cs-article-cluster-sticky');
      const length = wrap('cs-article-cluster-text-length');
      teaser.classList.add('is-featured');
      length.append(teaser);
      sticky.append(length);
      textCol.append(sticky);
      featuredRow.append(mediaCol, textCol);
    } else if (link) {
      const { teaser } = teaserFrom(cells, false);
      const item = wrap('cs-article-cluster-item');
      if (cardIndex === 0 && block.classList.contains('wide-first')) item.classList.add('is-wide');
      if (more) item.classList.add('is-more');
      item.hidden = !!more;
      item.append(teaser);
      grid.append(item);
      cardIndex += 1;
    } else if (!more && row.textContent.trim() && !row.querySelector('picture, img')) {
      more = wrap('cs-article-cluster-more');
      const btn = wrap('c-button');
      btn.setAttribute('role', 'button');
      btn.tabIndex = 0;
      cells.forEach((c) => btn.append(...cellElements(c)));
      more.append(btn);
    } else {
      cells.forEach((c) => head.append(...cellElements(c)));
    }
    row.remove();
  });

  if (more) {
    grid.querySelector('.is-more')?.before(more);
    if (!more.parentElement) grid.append(more);
    const btn = more.querySelector('.c-button');
    const reveal = () => {
      grid.querySelectorAll('.cs-article-cluster-item.is-more').forEach((item) => {
        item.hidden = false;
      });
      more.remove();
    };
    btn.addEventListener('click', reveal);
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        reveal();
      }
    });
  }

  if (head.childNodes.length) block.append(head);
  if (featuredRow.childNodes.length) block.append(featuredRow);
  if (grid.childNodes.length) block.append(grid);
}
