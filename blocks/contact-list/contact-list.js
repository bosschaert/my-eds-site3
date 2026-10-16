/**
 * contact-list — the source c-contact person cards (portrait | name, job title, phone / e-mail
 * links with label icons).
 *
 * Content: one row per person — [<p><img></p>, <p><strong>name</strong></p><p>job</p>…<ul>
 * <li><a href="tel:…|mailto:…">…</a></li></ul>]. Variant has-bg (gray card).
 * Decoration (template-slotted): each row becomes `.contact-list-person` with an image column
 * and a text column; the authored <p>/<picture>/<a> nodes are MOVED (EW1); each list item gets
 * its label icon (phone for tel:, e-mail for mailto:) as chrome. Re-entrant (EW9).
 */
function el(tag, className, ...kids) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  node.append(...kids);
  return node;
}

async function iconFactory() {
  try {
    const { uIcon } = await import('../../scripts/utils.js');
    return uIcon;
  } catch (e) {
    return (name, classes = '') => el('i', `u-icon ${classes}`.trim());
  }
}

export default async function decorate(block) {
  if (block.querySelector('.contact-list-person')) return;
  const uIcon = await iconFactory();
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const imgCell = cells.find((c) => c.querySelector('picture, img') && !c.querySelector('ul'));
    const textCell = cells.find((c) => c !== imgCell) || el('div');
    const media = el('div', 'contact-list-media');
    if (imgCell) media.append(...imgCell.childNodes);
    const text = el('div', 'contact-list-text');
    text.append(...textCell.childNodes);
    text.querySelectorAll('ul').forEach((ul) => {
      ul.className = 'contact-list-items';
      [...ul.children].forEach((li) => {
        li.className = 'contact-list-item';
        const a = li.querySelector('a[href]');
        const href = a ? a.getAttribute('href') : '';
        let name = '';
        if (href.startsWith('tel:')) name = 'phone';
        else if (href.startsWith('mailto:')) name = 'email';
        const value = el('div', 'contact-list-value', ...li.childNodes);
        if (a && name === 'email') a.classList.add('contact-list-email');
        const label = el('div', 'contact-list-label');
        if (name) label.append(uIcon(name, 'mr-2'));
        li.append(label, value);
      });
    });
    row.replaceWith(el('div', 'contact-list-person', media, text));
  });
}
