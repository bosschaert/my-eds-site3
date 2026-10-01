/**
 * hero — the balbriggan.ie home hero: an autoplaying muted Vimeo mp4 under the #009bd9
 * multiply overlay and a white card holding the page title and the "Learn More" pill
 * (stardust/prototypes/index-proposed.template.html `section.section-hero`,
 * index-proposed.css § Hero; dynamic-features.md #3 = embed passthrough of the Vimeo file).
 *
 * Decode tier: template-slotted. The prototype's inner DOM is rebuilt as EMPTY slot
 * containers (.hero-media > .overlay-body > .herotransform, .vimeo-container, .hero-overlay)
 * and the authored nodes are MOVED in by role (EW1): the heading — any level; the page
 * authors it as the single <h1> — then every CTA paragraph (EW3), then any other authored
 * element (leftovers pass) into .herotransform. The video is authored as a plain link in the
 * section's default content (David's Model D1: an embed URL is never a block cell); the block
 * adopts that paragraph (EW8), reads its href into <video><source src> and keeps the paragraph
 * INSIDE the <video> as its fallback content — still the author's editable element, rendered
 * only where the video element is unsupported.
 */
const VIDEO_RE = /\.(mp4|webm|ogv|mov)(\?|#|$)/i;

function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

/** cell-level collector (#62/#104): the EXISTING authored elements of every cell */
function collectNodes(block) {
  const out = [];
  block.querySelectorAll(':scope > div > div').forEach((cell) => {
    let kids = [...cell.children];
    if (kids.length === 1 && kids[0].tagName === 'P' && kids[0].children.length
      && kids[0].querySelector('picture, img')) {
      kids = [...kids[0].childNodes].map((n) => {
        if (n.nodeType === 1) return n;
        // harness-only (EW5): a bare text node beside the image moves into a fresh <p>
        if (n.textContent.trim()) {
          const p = document.createElement('p');
          p.append(n);
          return p;
        }
        return null;
      }).filter(Boolean);
    }
    if (kids.length) out.push(...kids);
    else if (cell.textContent.trim()) {
      // harness-only (EW5): a bare-text cell — its text nodes move, never copied
      const p = document.createElement('p');
      p.append(...cell.childNodes);
      out.push(p);
    }
  });
  return out;
}

function linkOf(node) {
  return node.matches('a[href]') ? node : node.querySelector('a[href]');
}

const isVideoLink = (n) => {
  const a = linkOf(n);
  return !!a && VIDEO_RE.test(a.getAttribute('href') || '');
};

/** the video link paragraph: authored in the block, or as default content of the section */
function findVideo(block, nodes) {
  const own = nodes.find(isVideoLink);
  if (own) return own;
  const section = block.closest('.section') || block.parentElement;
  if (!section) return null;
  const p = [...section.querySelectorAll('p')].find((n) => !block.contains(n) && isVideoLink(n));
  if (p && p.parentElement && p.parentElement.children.length === 1
    && p.parentElement.classList.contains('default-content-wrapper')) {
    // EW8: the emptied default-content wrapper goes once its only child has moved
    const wrapper = p.parentElement;
    window.requestAnimationFrame(() => {
      if (!wrapper.children.length) wrapper.remove();
    });
  }
  return p || null;
}

export default function decorate(block) {
  const nodes = collectNodes(block);
  const heading = nodes.find((n) => /^H[1-6]$/.test(n.tagName));
  const videoP = findVideo(block, nodes);
  const ctas = nodes.filter((n) => n !== heading && n !== videoP && linkOf(n));
  const rest = nodes.filter((n) => n !== heading && n !== videoP && !ctas.includes(n));

  const media = el('div', 'hero-media');
  const overlay = el('div', 'overlay-body');
  const card = el('div', 'herotransform');
  if (heading) card.append(heading);
  card.append(...ctas, ...rest);
  overlay.append(card);
  media.append(overlay);

  if (videoP) {
    const src = linkOf(videoP).href;
    const ext = (src.match(VIDEO_RE) || [])[1] || 'mp4';
    const container = el('div', 'vimeo-container');
    const video = el('video', 'vimeo-hero', {
      autoplay: '', muted: '', loop: '', playsinline: '',
    });
    video.muted = true;
    video.append(el('source', null, { type: `video/${ext}`, src }), videoP);
    container.append(video);
    media.append(container);
  }
  media.append(el('div', 'hero-overlay'));
  block.replaceChildren(media);
}
