/**
 * bumper — the page's legal line (Terms of Service / Privacy Policy), right-aligned
 * at the bottom of the article. Template-slotted: the authored paragraph(s) MOVE into
 * a <nav> (EW1–EW10, never copied). Register R-01: the source's Report Abuse control
 * and the empty cookie anchor are omitted on the ENCODE side.
 * Schema: stardust/eds-schema/webpage-dyft29wzo0qlk.json sections[8].
 *
 * Authoring rows (authors omit and add cells): the link paragraph(s).
 */

export default function decorate(block) {
  if (block.querySelector(':scope > nav')) return; // re-entrant (EW9)
  const nav = document.createElement('nav');
  nav.className = 'bumper-nav';
  nav.setAttribute('aria-label', 'Adobe links');
  [...block.querySelectorAll(':scope > div > div > *')].forEach((el) => nav.append(el));
  // bare text left in a cell (harness-only, EW5): move the nodes, never copy text
  [...block.querySelectorAll(':scope > div > div')]
    .filter((cell) => cell.textContent.trim())
    .forEach((cell) => {
      const p = document.createElement('p');
      p.append(...cell.childNodes);
      nav.append(p);
    });
  block.replaceChildren(nav);
}
