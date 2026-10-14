/**
 * newsletter — blue sign-up band: heading + intro line, then the source's Gravity Forms
 * newsletter form (First/Last/Email, GDPR consent, Subscribe) rebuilt as a native form.
 *
 * Schema: stardust/eds-schema/index.json → sections[6] (heading, body; repeat
 * LI.newsletter__field ×3; consent text).
 * Decode tier: template-slotted.
 *
 * Interim endpoint (stardust/dynamic-features.md row 3, owner decision pending): a top-level
 * POST of the same Gravity Forms fields to the source origin's non-AJAX handler.
 *
 * Authoring:
 *   - <h2> heading, then <p> intro line
 *   - <ul> field labels in order (First Name / Last Name / Email)
 *   - <p> consent statement (moved into the consent <label>, stays editable)
 *   - <p> submit label (short, last)
 *
 * @ew-exempt <li> field labels and the submit label — form controls (EW5 category c): the
 *   texts become <label>/placeholder/value of native inputs
 */

const ACTION = 'https://balbriggan.ie/#gf_1';
const FIELDS = [
  { name: 'input_1', id: 'input_1_1', type: 'text' },
  { name: 'input_2', id: 'input_1_2', type: 'text' },
  { name: 'input_3', id: 'input_1_3', type: 'email' },
];
const HIDDEN = {
  is_submit_1: '1',
  gform_submit: '1',
  gform_unique_id: '',
  state_1: 'WyJbXSIsImIwNTZiMDAxYTg5MzY4ZDcxMjZjODQ0YWMzODVkMTI3Il0=',
  gform_target_page_number_1: '0',
  gform_source_page_number_1: '1',
  gform_field_values: '',
};

function collectNodes(block) {
  const out = [];
  block.querySelectorAll(':scope > div > div').forEach((cell) => {
    const kids = [...cell.children];
    if (kids.length) out.push(...kids);
    // HARNESS-ONLY fallback (EW5): bare text cell — move its text nodes into a <p>
    else if (cell.textContent.trim()) {
      const p = document.createElement('p');
      p.append(...cell.childNodes);
      out.push(p);
    }
  });
  return out;
}

function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

function buildField(field, labelText) {
  const li = el('li', 'newsletter-field');
  const label = el('label', '', { for: field.id });
  label.textContent = labelText;
  const star = el('span');
  star.textContent = '*';
  label.append(star);
  const input = el('input', '', {
    name: field.name,
    id: field.id,
    type: field.type,
    placeholder: labelText,
    required: '',
  });
  li.append(label, input);
  return li;
}

export default function decorate(block) {
  const nodes = collectNodes(block);
  const heading = nodes.find((n) => /^H[1-6]$/.test(n.tagName));
  const list = nodes.find((n) => n.tagName === 'UL' || n.tagName === 'OL');
  const listIdx = list ? nodes.indexOf(list) : -1;
  const paras = nodes.filter((n) => n.tagName === 'P');
  const introParas = list ? paras.filter((p) => nodes.indexOf(p) < listIdx) : paras.slice(0, 1);
  const afterList = paras.filter((p) => !introParas.includes(p));
  const consent = afterList[0] || null;
  const submitPara = afterList.length > 1 ? afterList[afterList.length - 1] : null;

  const container = el('div', 'newsletter-container');
  const intro = el('div', 'newsletter-intro');
  if (heading) intro.append(heading);
  intro.append(...introParas);

  const form = el('form', 'newsletter-form', {
    method: 'post',
    action: ACTION,
    enctype: 'multipart/form-data',
  });
  const fields = el('ul', 'newsletter-fields');
  const labels = list ? [...list.children].map((li) => li.textContent.trim()) : [];
  FIELDS.forEach((f, i) => fields.append(buildField(f, labels[i] || '')));

  if (consent) {
    const li = el('li', 'newsletter-consent');
    const box = el('input', '', {
      name: 'input_4.1',
      id: 'choice_1_4_1',
      type: 'checkbox',
      value: consent.textContent.trim(),
      required: '',
    });
    const label = el('label', '', { for: 'choice_1_4_1' });
    label.append(consent);
    li.append(box, document.createTextNode(' '), label);
    fields.append(li);
  }

  const submit = el('div', 'newsletter-submit');
  submit.append(el('input', '', {
    type: 'submit',
    value: submitPara ? submitPara.textContent.trim() : 'Subscribe',
  }));
  Object.entries(HIDDEN).forEach(([name, value]) => {
    submit.append(el('input', '', { type: 'hidden', name, value }));
  });
  form.append(fields, submit);

  const leftovers = nodes.filter((n) => n !== heading && n !== list && n !== consent
    && n !== submitPara && !introParas.includes(n));
  container.append(intro, form, ...leftovers);
  block.replaceChildren(container);
}
