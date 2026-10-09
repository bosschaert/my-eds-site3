/**
 * hidden-section — the home page's personalisation containers ("Votre spécialité",
 * "Vos intérêts"): the live page serves them with the `hidden` attribute (AEM target
 * carousels that never fill for anonymous visitors), so the section is authored for
 * parity and the block CSS hides its whole section. Template-slotted (#95): the
 * prototype's `.section-title--core > h2` + empty `.text` / `.section-inner` as slots.
 * Schema: stardust/eds-schema/fr-startseite.json § page-section (1 text each).
 *
 * Authoring: ONE row, ONE cell: the section <h2>. Any further authored node moves into
 * the text slot (leftovers pass — nothing is dropped, even though nothing is shown).
 * @param {Element} block the block element
 */
function slot(className) {
  const el = document.createElement('div');
  el.className = className;
  return el;
}

export default async function decorate(block) {
  const heading = block.querySelector('h1, h2, h3, h4, h5, h6');
  const title = slot('hidden-section-title');
  const text = slot('hidden-section-text');
  const inner = slot('hidden-section-inner');
  if (heading) title.append(heading);
  block.querySelectorAll(':scope > div > div').forEach((cell) => text.append(...cell.childNodes));
  block.replaceChildren(title, text, inner);
}
