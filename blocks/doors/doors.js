/**
 * doors — the four reading-room doors of #rooms (.r24-doors): image | title, long line,
 * short line (mobile), rhythm. Each door is one link.
 * Schema: stardust/eds-schema/index.json sections[3] repeats[0] (A.reading-door × 4).
 * Decode tier: reconstructive — one row per door, classified by content.
 *
 * Authoring rows (one per door): image | h3 (linked) + paragraphs long, short, rhythm.
 * EW6: the authored anchor inside the title is unwrapped after its href moves to the card.
 */

function wrapNode(node, className) {
  const w = document.createElement('div');
  w.className = className;
  w.append(node);
  return w;
}

const ROLES = {
  3: ['door-long', 'door-short', 'door-rhythm'],
  2: ['door-long', 'door-rhythm'],
  1: ['door-long'],
};

function buildDoor(row) {
  const media = row.querySelector('picture, img');
  const picture = media ? media.closest('picture') || media : null;
  const heading = row.querySelector('h1, h2, h3, h4');
  const link = row.querySelector('a[href]');
  const paragraphs = [...row.querySelectorAll('p')].filter((p) => !p.querySelector('picture, img'));
  if (!picture && !heading && !paragraphs.length) return null;

  const door = document.createElement(link ? 'a' : 'div');
  door.className = 'reading-door';
  if (link) door.href = link.href;
  if (picture) door.append(wrapNode(picture, 'door-media'));
  if (heading) door.append(wrapNode(heading, 'door-title'));
  const roles = ROLES[Math.min(paragraphs.length, 3)] || ROLES[1];
  paragraphs.forEach((p, i) => door.append(wrapNode(p, roles[Math.min(i, roles.length - 1)])));
  if (link) {
    // EW6: no nested anchors on the published page; the indexed heading/paragraph survives
    door.querySelectorAll('a').forEach((a) => a.replaceWith(...a.childNodes));
  }
  return door;
}

export default function decorate(block) {
  const rows = [...block.children];
  const grid = document.createElement('div');
  grid.className = 'doors-grid';
  rows.forEach((row) => {
    const door = buildDoor(row);
    if (door) grid.append(door);
  });
  block.replaceChildren(grid);
}
