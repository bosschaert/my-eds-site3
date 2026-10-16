/**
 * webform — the source TYPO3 form framework form (c-webforms: legend, step tabs, floating-label
 * fields, consent copy + checkbox, "next step" button). Dynamic-features row 12 (contact-forms,
 * needs-backend): the UI is rebuilt natively; no form handler endpoint exists yet, so submit
 * validates the required fields and then shows the "no backend connected" notice.
 *
 * Content (rows, form order):
 *   [<p>text</p>]                — legend / free text (consent copy)
 *   [<ul><li>step</li>…</ul>]    — step tabs (first active)
 *   [<p>label</p>, <p>type</p>]  — field: textarea | text | email | select | checkbox (+ required)
 *   [<p>label</p>, <p>submit</p>] — submit button
 * @ew-exempt the type cell is form configuration, not displayed text.
 * Decoration: labels are MOVED into <label> elements (EW1); inputs are chrome. Re-entrant (EW9).
 */
function el(tag, className, ...kids) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  node.append(...kids);
  return node;
}

let uid = 0;

export default function decorate(block) {
  if (block.querySelector('form')) return;
  uid += 1;
  const form = el('form', 'webform-form');
  form.noValidate = true;
  const actions = el('div', 'webform-actions');
  const notice = el('p', 'webform-notice');
  notice.setAttribute('role', 'status');
  notice.hidden = true;
  [...block.children].forEach((row, i) => {
    const cells = [...row.children];
    const id = `webform-${uid}-${i}`;
    if (cells.length < 2) {
      const cell = cells[0] || row;
      const ul = cell.querySelector('ul');
      if (ul) {
        const steps = el('div', 'webform-steps');
        [...ul.children].forEach((li, k) => {
          steps.append(el('div', `webform-step${k ? '' : ' is-active'}`, ...li.childNodes));
        });
        form.append(steps);
      } else if (!form.children.length) {
        form.append(el('div', 'webform-legend', ...cell.childNodes));
      } else {
        form.append(el('div', 'webform-text', ...cell.childNodes));
      }
      return;
    }
    const [labelCell, typeCell] = cells;
    const [type, flag] = typeCell.textContent.trim().toLowerCase().split(/\s+/);
    const labelP = labelCell.querySelector('p') || labelCell;
    if (type === 'submit') {
      const btn = el('button', 'c-button webform-submit', ...labelP.childNodes);
      btn.type = 'submit';
      actions.append(btn);
      return;
    }
    const wrap = el('div', 'webform-group');
    if (type === 'checkbox') {
      const input = el('input');
      input.type = 'checkbox';
      input.id = id;
      input.name = id;
      input.required = flag === 'required';
      const label = el('label', 'webform-check-label', input, el('span', '', ...labelP.childNodes));
      label.htmlFor = id;
      wrap.classList.add('is-check');
      wrap.append(label);
    } else {
      const input = el(type === 'textarea' ? 'textarea' : 'input', 'webform-control');
      if (type === 'textarea') input.classList.add('is-large');
      else input.type = type === 'email' ? 'email' : 'text';
      input.id = id;
      input.name = id;
      input.required = flag === 'required';
      const label = el('label', 'webform-label is-dynamic', ...labelP.childNodes);
      label.htmlFor = id;
      const sync = () => {
        label.classList.toggle('is-active', document.activeElement === input || !!input.value);
      };
      input.addEventListener('focus', sync);
      input.addEventListener('blur', () => {
        input.classList.add('is-touched');
        sync();
      });
      wrap.append(label, el('div', 'webform-input', input));
    }
    form.append(wrap);
  });
  form.append(actions, notice);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    form.querySelectorAll('input, textarea').forEach((f) => f.classList.add('is-touched'));
    if (!form.checkValidity()) return;
    notice.textContent = 'No backend connected — this form cannot be sent yet.';
    notice.hidden = false;
  });
  block.replaceChildren(form);
}
