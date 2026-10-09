/**
 * vivo-stamp — the source's revision stamp (`#last-vivo-id > .text > #vivo-id-wrap`,
 * "Revision date MM/YYYY CH-NNNNN"), absolutely positioned at the right edge of the 1180px
 * container below the last band. Template-slotted (#95); the authored <p> MOVES in (EW1).
 * Schema: stardust/eds-schema/fr-startseite.json (the stamp sits after the prototype's last
 * <section>, one text).
 *
 * Authoring: ONE row, ONE cell, the stamp paragraph(s).
 * @param {Element} block the block element
 */
export default async function decorate(block) {
  const text = document.createElement('div');
  text.className = 'vivo-text';
  const wrap = document.createElement('div');
  wrap.className = 'vivo-wrap';
  block.querySelectorAll(':scope > div > div').forEach((cell) => wrap.append(...cell.childNodes));
  text.append(wrap);
  block.replaceChildren(text);
}
