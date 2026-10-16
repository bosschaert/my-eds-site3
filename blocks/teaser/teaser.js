/**
 * teaser — the source c-teaser card grid (is-layout-default: 16:9 image, h4-style header,
 * short text, "find out more" link; the whole card is the link).
 *
 * Content: one row per card. Cells (any split): a picture / image, a heading (card header),
 * paragraphs (card text) and one link — its href / title become the card link, its text the
 * link label. A row without content is skipped.
 * Variants (grid columns >= 1023; 2 columns 767–1022, 1 below):
 *   cols-4 (source col-md-3) | cols-3 (col-md-4, default) | cols-2 (col-sm-6 only) |
 *   wide-narrow (first card col-md-8, then col-md-4).
 * Additive variants (hub template):
 *   image-layout — source is-layout-image: text over the image (white + shadow; text-black for
 *                  black text), CTA shown as a c-button; default layout below 577px.
 *   single       — the card fills the block (block placed beside another, e.g. content-list).
 *   with-embed   — a row whose only plain link is a URL-display link (text = href) becomes an
 *                  iframe slot (source third-party widget column, e.g. EquityStory chart) with
 *                  the row's other paragraphs (buttons) below it.
 * Link icon follows the target (source): .pdf/.zip → download, other host → external, else chevron.
 * Reconstructive decode: authored picture / heading / paragraphs / link are MOVED (EW1);
 * re-entrant (EW9). Used inside content-slider slides through loadBlock (same DOM).
 */
// icons via the foundation helper; dynamic so the block also installs where /scripts/ cannot be
// resolved (local structural harness) — there the bare icon box is used
async function iconFactory() {
  try {
    const { uIcon } = await import('../../scripts/utils.js');
    return uIcon;
  } catch (e) {
    return (name, classes = '', tag = 'i') => {
      const box = document.createElement(tag);
      box.className = `u-icon ${classes}`.trim();
      const span = document.createElement('span');
      span.className = `icon icon-${name}`;
      box.append(span);
      return box;
    };
  }
}

function el(tag, className) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

// source c-teaser__link icon follows the target: file download, external site, or internal page
function linkIcon(href) {
  if (/\.(pdf|zip)([?#]|$)/i.test(href)) return 'download-single';
  try {
    const url = new URL(href, window.location.href);
    if (url.origin !== window.location.origin && url.hostname !== 'www.continental.com') {
      return 'link-external';
    }
  } catch (e) {
    // relative / malformed → internal
  }
  return 'chevron-right';
}

function buildCard(row, uIcon) {
  const picture = row.querySelector('picture') || row.querySelector('img');
  const heading = row.querySelector('h1, h2, h3, h4, h5, h6');
  const link = [...row.querySelectorAll('a[href]')].pop();
  if (!picture && !heading && !link) return null;

  // EW6: the card is the link — read href / title, unwrap the authored anchor, move its <p>
  const card = el(link ? 'a' : 'div', 'teaser-card');
  if (link) {
    card.href = link.getAttribute('href');
    if (link.title) card.title = link.title;
  }
  const cta = link ? (link.closest('p') || link) : null;

  const content = el('div', 'teaser-content');
  if (heading) {
    heading.className = 'teaser-header u-text-h4';
    content.append(heading);
  }
  const text = el('div', 'teaser-text s-richtext');
  [...row.querySelectorAll('p')].forEach((p) => {
    if (cta && p.contains(cta)) return;
    if (p === cta) return;
    if (picture && p.contains(picture)) return;
    if (!p.textContent.trim()) return;
    text.append(p);
  });
  if (text.children.length) content.append(text);
  if (link) {
    const more = el('div', 'teaser-link is-link mt-3');
    let label = cta;
    if (cta === link) {
      label = el('span');
      label.append(...link.childNodes);
      link.remove();
    } else {
      link.replaceWith(...link.childNodes);
    }
    // variant video: the source keeps the chevron for the external video host
    const video = row.closest('.teaser')?.classList.contains('video');
    const icon = video ? 'chevron-right' : linkIcon(link.getAttribute('href') || '');
    more.append(uIcon(icon, 'is-sm has-bg mr-1'), label);
    content.append(more);
  }

  if (picture) {
    const media = el('div', 'teaser-image');
    const img = picture.tagName === 'IMG' ? picture : picture.querySelector('img');
    if (img) img.classList.add('teaser-img');
    media.append(picture);
    // variant video: source c-teaser__image-overlay-icon (play button, chrome)
    if (row.closest('.teaser')?.classList.contains('video')) {
      const overlay = el('div', 'teaser-play');
      overlay.append(uIcon('play', 'has-bg is-xl'));
      media.append(overlay);
    }
    card.append(media);
  }
  card.append(content);
  return card;
}

function buildEmbed(row, uIcon) {
  const frameLink = [...row.querySelectorAll('a[href]')]
    .find((a) => a.textContent.trim() === a.getAttribute('href'));
  if (!frameLink || row.querySelector('picture, img, h1, h2, h3, h4, h5, h6')) return null;
  const embed = el('div', 'teaser-embed');
  const frame = el('iframe', 'teaser-embed-frame');
  frame.src = frameLink.href;
  frame.setAttribute('scrolling', 'no');
  frame.title = frameLink.title || frameLink.textContent.trim();
  frame.loading = 'lazy';
  // the frame stays inline in a block box (source: the line box adds the descender gap)
  const box = el('div', 'teaser-embed-box');
  box.append(frame);
  embed.append(box);
  (frameLink.closest('p') || frameLink).remove();
  const rest = [...row.querySelectorAll('p')].filter((p) => p.textContent.trim());
  if (rest.length) {
    const below = el('div', 'teaser-embed-links');
    rest.forEach((p) => {
      // source CTA: a.c-button.mb-0 with a chevron u-icon
      p.querySelectorAll('a.button').forEach((a) => {
        const label = el('span');
        label.append(...a.childNodes);
        a.className = 'c-button mb-0';
        a.append(uIcon('chevron-right', 'mr-2'), label);
      });
    });
    below.append(...rest);
    embed.append(below);
  }
  return embed;
}

function addButtonLink(card, uIcon) {
  const link = card.querySelector('.teaser-link.is-link');
  if (!link) return;
  const label = el('span', 'is-button-label');
  label.textContent = link.textContent.trim();
  const button = el('div', 'c-button mb-0');
  button.append(uIcon('chevron-right', 'mr-2'), label);
  const box = el('div', 'teaser-link is-button mt-3');
  box.append(button);
  link.before(box);
}

export default async function decorate(block) {
  if (block.querySelector('.teaser-item')) return;
  const uIcon = await iconFactory();
  const withEmbed = block.classList.contains('with-embed');
  const imageLayout = block.classList.contains('image-layout');
  const items = [...block.children].map((row) => {
    const embed = withEmbed ? buildEmbed(row, uIcon) : null;
    if (embed) {
      row.remove();
      const slot = el('div', 'teaser-item is-embed');
      slot.append(embed);
      return slot;
    }
    const card = buildCard(row, uIcon);
    if (card && imageLayout) addButtonLink(card, uIcon);
    row.remove();
    if (!card) return null;
    const item = el('div', 'teaser-item');
    item.append(card);
    return item;
  }).filter(Boolean);
  block.append(...items);
}
