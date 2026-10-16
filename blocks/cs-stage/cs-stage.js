/**
 * cs-stage — stories intro + latest-article stage (source c-cs-stage).
 *
 * Content (one cell per row, classified by content, any order):
 *   intro — h1/h2 (bold part in <strong>) + subtitle <p>                         (optional)
 *   media — picture renditions, source order: 3 → >= 1279 | 767–1278 | < 767,
 *           2 → >= 767 | < 767, 1 → every width
 *   text  — label <p>, title heading (h3), popup text <p>, CTA link <p> (a.button)
 * The CTA href also feeds the presentational full-stage overlay link (source
 * c-cs-stage__overlay: aria-hidden, not focusable). The popup slides in on hover/focus-within
 * (CSS only). Template-slotted decode: authored nodes are MOVED (EW1), re-entrant (EW9).
 */
const RANGES = {
  1: [['xl', 'md', 'sm']],
  2: [['xl', 'md'], ['sm']],
  3: [['xl'], ['md'], ['sm']],
};
const QUERIES = {
  xl: '(width >= 1279px)',
  md: '(767px <= width < 1279px)',
  sm: '(width < 767px)',
};

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

export default function decorate(block) {
  if (block.querySelector('.cs-stage-article')) return;
  const intro = wrap('cs-stage-intro');
  const article = wrap('cs-stage-article', 'article');
  const media = wrap('cs-stage-picture');
  const titleBox = wrap('cs-stage-title-box');
  const label = wrap('cs-stage-label');
  const title = wrap('cs-stage-title');
  const popup = wrap('cs-stage-popup');
  const text = wrap('cs-stage-text');
  const cta = wrap('cs-stage-cta');
  let href = '';

  [...block.children].forEach((row) => {
    [...row.children].forEach((cell) => {
      const nodes = cellElements(cell);
      const hasText = nodes.some((n) => n.textContent.trim());
      if (!hasText && cell.querySelector('picture, img')) {
        const pics = [...cell.querySelectorAll('picture, img:not(picture img)')];
        const ranges = RANGES[Math.min(pics.length, 3)] || [];
        pics.forEach((pic, i) => {
          const slot = wrap('cs-stage-rendition');
          const r = ranges[i] || [];
          r.forEach((name) => slot.classList.add(`is-${name}`));
          const img = pic.querySelector('img') || pic;
          if (r.some((name) => window.matchMedia(QUERIES[name]).matches)) img.loading = 'eager';
          slot.append(pic);
          media.append(slot);
        });
        return;
      }
      if (cell.querySelector('h1, h2')) {
        cell.querySelectorAll('h1, h2').forEach(spanLightParts);
        intro.append(...nodes);
        return;
      }
      let seenTitle = false;
      nodes.forEach((node) => {
        const link = node.matches('a[href]') ? node : node.querySelector('a[href]');
        if (/^H[1-6]$/.test(node.tagName)) {
          title.append(node);
          seenTitle = true;
        } else if (link && node.textContent.trim() === link.textContent.trim()) {
          href = href || link.href;
          cta.append(node);
        } else if (!seenTitle) {
          label.append(node);
        } else {
          text.append(node);
        }
      });
    });
    row.remove();
  });

  if (label.childNodes.length) titleBox.append(label);
  if (title.childNodes.length) titleBox.append(title);
  if (text.childNodes.length) popup.append(text);
  if (cta.childNodes.length) popup.append(cta);
  if (media.childNodes.length) article.append(media);
  if (titleBox.childNodes.length) article.append(titleBox);
  if (popup.childNodes.length) article.append(popup);
  if (href) {
    const overlay = wrap('cs-stage-overlay', 'a');
    overlay.href = href;
    overlay.tabIndex = -1;
    overlay.setAttribute('aria-hidden', 'true');
    article.append(overlay);
  }
  if (intro.childNodes.length) block.append(intro);
  block.append(article);
}
