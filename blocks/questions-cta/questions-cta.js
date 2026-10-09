/**
 * questions-cta — a title / copy / CTA band of the PATTRNS template: the source's sections made
 * only of `.title` (section-title--core, --center), `.text` (text--center) and `.button`
 * (button--center) modules — the tinted "Vous avez des questions ?" band with its mail CTA, and
 * the title-only / title + copy bands between the page's components. Template-slotted (#95):
 * empty slot wrappers, the authored nodes MOVED in by role (EW1): every heading → its own
 * .cta-title, CTA paragraphs (a.button / <strong><a>) → .cta-action, everything else → .cta-text.
 * Schema: stardust/eds-schema/fr-startseite-therapiegebiete-cvrm-see-the-pattrns-about-
 * amylodosis-attr.json § sec (title-only sections and the questions band).
 *
 * Authoring — ONE row, cells in any split (classified by content, never by index, #42):
 *   headings (h3 section titles, h4 sub-titles), copy <p>/<ul>/<ol>, the CTA as
 *   <p><strong><a>…</a></strong></p> (decorateButtons makes it a.button.primary; the <p> moves,
 *   EW3)
 * Variants (block classes, 1:1 with the source modifiers):
 *   space-md     container--tb-space-md: 20px, 40px from 768px (default container--tb-space 20px)
 *   text-center  text--center: centred copy (default left, as canon .text)
 *   left         the title without title--center (left-aligned)
 * The tinted ground is the SECTION style `tinted` (foundation vocabulary).
 * @param {Element} block the block element
 */
const HEADINGS = 'h1, h2, h3, h4, h5, h6';

function slot(className) {
  const el = document.createElement('div');
  el.className = className;
  return el;
}

function isCta(node) {
  return node.tagName === 'P' && !!node.querySelector('a.button, strong > a, em > a')
    && node.textContent.trim() === (node.querySelector('a') || node).textContent.trim();
}

export default async function decorate(block) {
  const nodes = [];
  block.querySelectorAll(':scope > div > div').forEach((cell) => {
    const kids = [...cell.children];
    if (kids.length) nodes.push(...kids);
    else if (cell.textContent.trim()) {
      // harness-only (EW5): bare-text cell — move the text node into a <p>, never copy it
      const p = document.createElement('p');
      p.append(...cell.childNodes);
      nodes.push(p);
    }
  });

  const out = [];
  let text = null;
  let action = null;
  nodes.forEach((node) => {
    if (node.matches(HEADINGS)) {
      const title = slot('cta-title');
      title.append(node);
      out.push(title);
      text = null;
      return;
    }
    if (isCta(node)) {
      if (!action) {
        action = slot('cta-action');
        out.push(action);
      }
      action.append(node);
      return;
    }
    if (!text) {
      text = slot('cta-text');
      out.push(text);
    }
    text.append(node);
  });
  block.replaceChildren(...out);
}
