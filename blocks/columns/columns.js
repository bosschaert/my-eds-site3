/*
 * columns — recreation of the pillar-page membership row
 * (WordPress .wp-block-columns.pillar-membership, gated prototype
 * stardust/prototypes/community-development-proposed.html).
 *
 * Authored composition: ONE row, THREE cells — chair photo / "Chair" h4 + p /
 * "Members" h4 + lists. The prototype nests them as
 *   lead column (40 %) → chair row (photo 40 % | text 60 %)   |   members column
 * so decorate() builds that inner DOM as empty slot containers and MOVES the
 * authored cells into them by role (node-slotting: the h4/p/ul/picture nodes
 * are never cloned, rebuilt or read back as text). Cells are classified by
 * content (the cell holding the picture, the cell holding lists, the remaining
 * text cell); any other row shape falls back to plain equal columns.
 */

const MEMBERSHIP = 'columns-membership';

function classify(cells) {
  const image = cells.find((cell) => cell.querySelector('picture, img'));
  const members = cells.find((cell) => cell !== image && cell.querySelector('ul, ol'));
  const text = cells.find((cell) => cell !== image && cell !== members);
  return { image, text, members };
}

function slotMembership(row, { image, text, members }) {
  const lead = document.createElement('div');
  lead.className = `${MEMBERSHIP}-lead`;
  const chair = document.createElement('div');
  chair.className = 'columns-chair';
  image.classList.add('columns-chair-image');
  text.classList.add('columns-chair-text');
  members.classList.add('columns-members');
  chair.append(image, text);
  lead.append(chair);
  row.prepend(lead);
  row.classList.add(MEMBERSHIP);
}

export default function decorate(block) {
  // re-entrant: a decorated block is left untouched
  if (block.querySelector(`.${MEMBERSHIP}`)) return;
  const rows = [...block.children];
  const first = rows[0];
  block.classList.add(`columns-${first ? first.children.length : 0}-cols`);
  rows.forEach((row) => {
    const cells = [...row.children];
    const roles = classify(cells);
    if (cells.length === 3 && roles.image && roles.text && roles.members) {
      slotMembership(row, roles);
    }
  });
}
