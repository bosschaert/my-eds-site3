/**
 * notice block — the single fixed composition of https://www.example.com/.
 *
 * Authored rows are either `| lang | content |` (two cells) or `| content |`
 * (one cell). The first cell of a two-cell row is a BCP-47 language code that
 * configures `lang`/`dir` on the content elements and is never rendered.
 * @ew-exempt language code cell — configuration, never displayed
 */

const RTL_LANGUAGES = ['ar', 'he', 'fa', 'ur'];

/**
 * Returns true when a paragraph consists of nothing but a single link.
 * @param {Element} el candidate element
 * @returns {boolean}
 */
function isBareLink(el) {
  return el.matches('p')
    && el.children.length === 1
    && el.firstElementChild.matches('a')
    && el.textContent.trim() === el.firstElementChild.textContent.trim();
}

/**
 * Decorates the notice block. Authored elements are moved (never cloned,
 * retagged or rebuilt) into two wrappers: `.notice-text` for paragraphs and
 * `.notice-cta` for bare link lines. Re-entrant: once decorated no authored
 * rows remain, so a second call changes nothing.
 * @param {Element} block the notice block element
 */
export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')]
    .filter((row) => !row.matches('.notice-text, .notice-cta'));
  if (!rows.length) return;

  const text = document.createElement('div');
  text.className = 'notice-text';
  const cta = document.createElement('div');
  cta.className = 'notice-cta';

  rows.forEach((row) => {
    const cells = [...row.children];
    if (!cells.length) return;
    const content = cells[cells.length - 1];
    const code = cells.length > 1 ? cells[0].textContent.trim().toLowerCase() : '';

    if (!content.children.length) {
      const p = document.createElement('p');
      p.append(...content.childNodes);
      content.append(p);
    }

    [...content.children].forEach((el) => {
      if (code) {
        el.lang = code;
        if (RTL_LANGUAGES.includes(code.split('-')[0])) el.dir = 'rtl';
      }
      if (isBareLink(el)) {
        cta.append(el);
      } else {
        text.append(el);
      }
    });
  });

  rows.forEach((row) => row.remove());
  if (text.children.length) block.append(text);
  if (cta.children.length) block.append(cta);
}
