/**
 * hero-teaser — the source c-heroteaser hero (variant `small`: static picture, no overlay).
 *
 * Content: one row per picture rendition (art direction, source <picture> order):
 *   3 pictures → width >= 1023 | 767–1022 | < 767; 2 → >= 1023 | < 1023; 1 → every width.
 * Any other row (headings, text, CTA links) is moved into `.hero-teaser-content`
 * (for the larger single-slide hero variants; styled by the variant that needs it).
 * Template-slotted decode: authored <picture>/<p>/<h*> nodes are MOVED (EW1), re-entrant (EW9).
 */
const RANGES = {
  1: [['lg', 'md', 'sm']],
  2: [['lg'], ['md', 'sm']],
  3: [['lg'], ['md'], ['sm']],
};

export default function decorate(block) {
  if (block.querySelector('.hero-teaser-picture')) return;
  const pictures = [...block.querySelectorAll('picture, img:not(picture img)')];
  const media = document.createElement('div');
  media.className = 'hero-teaser-picture';
  const ranges = RANGES[Math.min(pictures.length, 3)] || [];
  pictures.forEach((pic, i) => {
    const slot = document.createElement('div');
    slot.className = 'hero-teaser-rendition';
    (ranges[i] || []).forEach((r) => slot.classList.add(`is-${r}`));
    slot.append(pic);
    media.append(slot);
  });

  const content = document.createElement('div');
  content.className = 'hero-teaser-content';
  [...block.children].forEach((row) => {
    [...row.children].forEach((cell) => {
      [...cell.childNodes].forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE && !node.textContent.trim()
          && !node.querySelector('img, picture')) return;
        if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) return;
        if (node.nodeType === Node.TEXT_NODE) {
          const p = document.createElement('p');
          p.append(node);
          content.append(p);
        } else {
          content.append(node);
        }
      });
    });
    row.remove();
  });

  block.append(media);
  if (content.childNodes.length) block.append(content);
}
