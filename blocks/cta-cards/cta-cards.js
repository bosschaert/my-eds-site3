/**
 * cta-cards — the source's `teaser--image-top-text-bottom` cards (.cmp-teaser) of the PATTRNS
 * template and the plain `.image` blocks that share its column grids: image on top (desktop +
 * mobile rendition), body below (title, copy, a primary CTA pinned to the bottom). Reconstructive
 * (#95): ONE ROW PER CARD, cells in any split, classified by content — never by index (#42); the
 * DA-flattened single-cell shape is decoded by segmenting on the most frequent heading tag (#52).
 * Schema: stardust/eds-schema/fr-startseite-therapiegebiete-cvrm-see-the-pattrns-about-
 * amylodosis-attr.json § sec (2-column card wraps, the 3-column centred grid, image blocks).
 *
 * Row contents: picture(s) — the DESKTOP image first, the MOBILE image (< 768px) second, each
 * optionally wrapped in its link (the link moves with the picture) — then the card title as
 * <h4> (plain or linked), copy <p>/<ul>/<ol>, the CTA as <p><strong><a>…</a></strong></p>
 * (a.button.primary before decorate runs; the <p> moves, EW3). A row holding only pictures is an
 * image card (the source's plain .image component — stats infographics). An <h5>/<h6> authored
 * BEFORE the card title is the source's teaser pretitle (cmp-teaser__pretitle, Lexia 14/16 with
 * a −10px top margin — the symptomes sibling carries an EMPTY one that keeps its line box).
 * Variants (block classes, 1:1 with the source modifiers):
 *   cols-2   two columns from 768px (container--2-column-wrap: gap 20px, 50% − 10px)
 *   cols-3   three centred columns from 768px (container--3-column-wrap + --content-center)
 *   plain    no tinted body (the card without teaser--bgColor-supporting-1)
 *   border   1px border (teaser--border-base)
 *   center   centred, shrink-wrapped body children (teaser--text-center)
 *   flush    the section carries no vertical padding (default: container--tb-space, 20px)
 *   space-md the section carries container--tb-space-md (20px, 40px from 768px)
 * The section head above the grid is DEFAULT CONTENT, styled in place by this block's CSS
 * (centred core title with the title--b-space-md gap below it); a footnote authored after the
 * grid in the same section is default content too (the source .text--small, 12/20).
 * @param {Element} block the block element
 */
const HEADINGS = 'h1, h2, h3, h4, h5, h6';
const TITLES = 'h1, h2, h3, h4';
const PRETITLES = 'h5, h6';

function slot(tag, className) {
  const el = document.createElement(tag);
  el.className = className;
  return el;
}

/** Every image of a text-less node (a cell may hold two pictures in ONE <p>, #104),
 *  each moved with its wrapping link when the source links the image. */
function mediaIn(node) {
  if (node.matches('picture, img')) return [node.closest('a') || node];
  return [...node.querySelectorAll('picture, img')]
    .filter((el) => !(el.tagName === 'IMG' && el.closest('picture')))
    .map((el) => el.closest('a') || el);
}

function isMedia(node) {
  return mediaIn(node).length > 0 && !node.textContent.trim();
}

function isCta(node) {
  return node.tagName === 'P' && !!node.querySelector('a.button, strong > a, em > a')
    && node.textContent.trim() === (node.querySelector('a') || node).textContent.trim();
}

/** Flat authored nodes of a row: cell children, pictures unwrapped from their <p>. */
function rowNodes(row) {
  const out = [];
  row.querySelectorAll(':scope > div').forEach((cell) => {
    const kids = [...cell.children];
    if (kids.length) out.push(...kids);
    else if (cell.textContent.trim()) {
      // harness-only (EW5): a bare-text cell — move the text node into a <p>, never copy it
      const p = document.createElement('p');
      p.append(...cell.childNodes);
      out.push(p);
    }
  });
  return out;
}

function buildCard(group) {
  const item = slot('div', 'card-item');
  const card = slot('article', 'card');
  const media = slot('div', 'card-media');
  const body = slot('div', 'card-body');
  const [desktopPic, mobilePic] = group.pics;
  if (desktopPic) {
    const d = slot('div', 'card-media-desktop');
    const img = slot('div', 'img');
    img.append(desktopPic);
    d.append(img);
    media.append(d);
  }
  if (mobilePic) {
    const m = slot('div', 'card-media-mobile');
    const img = slot('div', 'img');
    img.append(mobilePic);
    m.append(img);
    media.append(m);
  } else if (desktopPic) {
    media.classList.add('card-media-single');
  }
  if (group.pretitle) {
    const pre = slot('div', 'card-pretitle');
    pre.append(group.pretitle);
    body.append(pre);
  }
  if (group.heading) {
    const title = slot('div', 'card-title');
    title.append(group.heading);
    body.append(title);
  }
  if (group.rest.length) {
    const desc = slot('div', 'card-desc');
    desc.append(...group.rest);
    body.append(desc);
  }
  if (group.ctas.length) {
    const action = slot('div', 'card-action');
    action.append(...group.ctas);
    body.append(action);
  }
  if (media.firstElementChild) card.append(media);
  if (body.firstElementChild) card.append(body);
  else card.classList.add('card-image');
  item.append(card);
  return item;
}

/** One group per authored row: pictures → media, first heading → title (an h5/h6 ahead of
 *  the title → pretitle), CTAs → action. */
function groupFromNodes(nodes) {
  const group = {
    pics: [], pretitle: null, heading: null, rest: [], ctas: [],
  };
  const hasTitle = nodes.some((n) => n.matches(TITLES));
  nodes.forEach((node) => {
    if (isMedia(node)) {
      group.pics.push(...mediaIn(node));
      return;
    }
    if (!group.heading && !group.pretitle && hasTitle && node.matches(PRETITLES)) {
      group.pretitle = node;
      return;
    }
    if (!group.heading && node.matches(HEADINGS)) {
      group.heading = node;
      return;
    }
    if (isCta(node)) {
      group.ctas.push(node);
      return;
    }
    group.rest.push(node);
  });
  return group;
}

/** DA-flattened shape (#52/#76): segment one cell's flat siblings on the card heading tag. */
function segmentFlat(nodes) {
  const counts = {};
  nodes.filter((n) => n.matches(HEADINGS)).forEach((n) => {
    counts[n.tagName] = (counts[n.tagName] || 0) + 1;
  });
  const tag = Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0];
  const groups = [];
  let pending = [];
  let current = null;
  const open = (heading) => {
    current = {
      pics: pending, heading, rest: [], ctas: [],
    };
    pending = [];
    groups.push(current);
  };
  nodes.forEach((node) => {
    if (isMedia(node)) {
      const openCard = current && !current.rest.length && !current.ctas.length;
      if (openCard) current.pics.push(...mediaIn(node));
      else pending.push(...mediaIn(node));
      return;
    }
    if (node.tagName === tag) {
      open(node);
      return;
    }
    if (!current) open(null);
    if (isCta(node)) current.ctas.push(node);
    else current.rest.push(node);
  });
  if (pending.length) {
    if (current) current.pics.push(...pending);
    else {
      groups.push({
        pics: pending, heading: null, rest: [], ctas: [],
      });
    }
  }
  return groups;
}

export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;
  let groups;
  const flat = rows.length === 1 && rows[0].children.length === 1
    && rows[0].querySelectorAll(HEADINGS).length > 1;
  if (flat) groups = segmentFlat(rowNodes(rows[0]));
  else groups = rows.map((row) => groupFromNodes(rowNodes(row)));

  const grid = slot('div', 'card-row');
  groups.forEach((g) => grid.append(buildCard(g)));
  block.replaceChildren(grid);
}
