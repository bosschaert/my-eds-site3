/**
 * departure — the farewell section: visually hidden h2, eyebrow, opening, open-doors note,
 * blessing, Gujarati blessing, arrivals link, "now" note; portrait with its thanks line.
 * Schema: stardust/eds-schema/index.json sections[6] (departure). Tier: template-slotted.
 *
 * Authoring rows (positional):
 *   1. h2 (visually hidden, as on the source)
 *   2. paragraphs: eyebrow, opening, doors-open, blessing, Gujarati blessing,
 *      arrivals link (bare link paragraph), now-note (prose with an inline link)
 *   3. portrait image
 *   4. thanks paragraph (under the portrait)
 */

function wrapNode(node, className) {
  const w = document.createElement('div');
  w.className = className;
  w.append(node);
  return w;
}

const SEQUENCE = ['eyebrow', 'opening', 'doors-open', 'blessing', 'guj-blessing'];

const isLinkOnly = (p) => {
  const a = p.querySelector('a');
  return !!a && p.textContent.trim() === a.textContent.trim();
};

export default function decorate(block) {
  const heading = block.querySelector('h1, h2, h3');
  const media = block.querySelector('picture, img');
  const picture = media ? media.closest('picture') || media : null;
  // the thanks line sits under the portrait: every paragraph authored after the portrait
  // (its own row, or the portrait's own cell) belongs to the portrait column
  const rows = [...block.children];
  const picRow = picture ? rows.findIndex((row) => row.contains(picture)) : -1;
  const cells = rows.flatMap((row) => [...row.children]);
  const mediaCell = picture ? cells.find((cell) => cell.contains(picture)) : null;
  const all = [...block.querySelectorAll('p')].filter((p) => !p.querySelector('picture, img'));
  const thanks = all.filter((p) => {
    if (picRow < 0) return false;
    const r = rows.findIndex((row) => row.contains(p));
    return r > picRow || (mediaCell && mediaCell.contains(p));
  });
  const prose = all.filter((p) => !thanks.includes(p));

  const frag = document.createDocumentFragment();
  if (heading) frag.append(wrapNode(heading, 'departure-heading'));
  const layout = document.createElement('div');
  layout.className = 'farewell';
  const copy = document.createElement('div');
  copy.className = 'farewell-copy';
  let seq = 0;
  prose.forEach((p) => {
    let role = 'farewell-p';
    if (isLinkOnly(p)) {
      role = 'arriving';
    } else if (p.querySelector('a')) {
      role = 'now-note';
    } else if (seq < SEQUENCE.length) {
      role = SEQUENCE[seq];
      seq += 1;
    }
    copy.append(wrapNode(p, role));
  });
  layout.append(copy);
  if (picture || thanks.length) {
    const portrait = document.createElement('div');
    portrait.className = 'portrait-wrap';
    if (picture) portrait.append(wrapNode(picture, 'portrait'));
    thanks.forEach((p) => portrait.append(wrapNode(p, 'thanks')));
    layout.append(portrait);
  }
  frag.append(layout);
  block.replaceChildren(frag);
}
