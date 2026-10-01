/**
 * newsletter — the blue "Newsletter" band: heading + intro copy and the Gravity Forms legacy
 * sign-up form (three text fields in thirds, GDPR consent checkbox, Subscribe) rebuilt as
 * captured (template `section.section-newsletter`, index-proposed.css § Newsletter). Interim
 * it POSTs to the source's own handler with the captured field names (input_1, input_2,
 * input_3, input_4.1, the Akismet honeypot) so submissions keep landing in the existing inbox
 * — dynamic-features.md #1, owner decision pending.
 *
 * Decode tier: template-slotted (a fixed composition). Authored nodes move by role (EW1):
 * the heading and the paragraph beside it into the text row; the long text-only paragraph
 * (the consent sentence) into the checkbox's label; the list of field names configures the
 * three inputs; the remaining short paragraph is the submit label. Any other authored
 * element stays visible in the text row (leftovers pass).
 *
 * @ew-exempt <ul> field names — config: form-control label + placeholder text of the three
 *   inputs (label[for] and placeholder attributes)
 * @ew-exempt <p> submit label — config: form-control text (input[type=submit] value)
 */
const FORM_ACTION = 'https://balbriggan.ie/#gf_1';
const FORM_ID = 1;

function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

/** cell-level collector (#62/#104): the EXISTING authored elements of every cell */
function collectNodes(block) {
  const out = [];
  block.querySelectorAll(':scope > div > div').forEach((cell) => {
    const kids = [...cell.children];
    if (kids.length) out.push(...kids);
    else if (cell.textContent.trim()) {
      // harness-only (EW5): a bare-text cell — its text nodes move, never copied
      const p = document.createElement('p');
      p.append(...cell.childNodes);
      out.push(p);
    }
  });
  return out;
}

const textOf = (node) => (node ? node.textContent.replace(/\s+/g, ' ').trim() : '');

function requiredMark() {
  const outer = el('span', 'gfield-required');
  const inner = el('span', 'gfield-required gfield-required-asterisk');
  inner.textContent = '*';
  outer.append(inner);
  return outer;
}

/** one Gravity Forms text/email field: label (hidden by the theme) + input, name input_N */
function buildField(name, index, count) {
  const n = index + 1;
  const id = `input_${FORM_ID}_${n}`;
  const isEmail = /mail/i.test(name);
  const third = ['gf-left-third', 'gf-middle-third', 'gf-right-third'][Math.min(index, 2)];
  const li = el('li', `gfield gfield-type-${isEmail ? 'email' : 'text'} ${count > 1 ? third : ''} gfield-contains-required`);
  const label = el('label', 'gfield-label gform-field-label', { for: id });
  label.textContent = name;
  label.append(requiredMark());
  const box = el('div', `ginput-container ginput-container-${isEmail ? 'email' : 'text'}`);
  box.append(el('input', 'medium', {
    name: `input_${n}`,
    id,
    type: isEmail ? 'email' : 'text',
    value: '',
    placeholder: name,
    'aria-required': 'true',
  }));
  li.append(label, box);
  return li;
}

/** the GDPR consent checkbox; the authored sentence is MOVED into the choice label */
function buildConsent(consentP, index) {
  const n = index + 1;
  const choiceId = `choice_${FORM_ID}_${n}_1`;
  const li = el('li', 'gfield gfield-type-checkbox gfield-type-choice gfield-contains-required');
  const label = el('label', 'gfield-label gform-field-label gfield-label-before-complex');
  label.textContent = 'GDPR Consent';
  label.append(requiredMark());
  const box = el('div', 'ginput-container ginput-container-checkbox');
  const choices = el('ul', 'gfield-checkbox', { id: `input_${FORM_ID}_${n}` });
  const choice = el('li', `gchoice gchoice-${FORM_ID}-${n}-1`);
  const input = el('input', 'gfield-choice-input', {
    name: `input_${n}.1`,
    type: 'checkbox',
    value: textOf(consentP),
    id: choiceId,
  });
  const choiceLabel = el('label', 'gform-field-label gform-field-label-type-inline', {
    for: choiceId,
    id: `label_${FORM_ID}_${n}_1`,
  });
  if (consentP) choiceLabel.append(consentP);
  choice.append(input, document.createTextNode(' '), choiceLabel);
  choices.append(choice);
  box.append(choices);
  li.append(label, box);
  return li;
}

function hidden(name, value) {
  return el('input', 'gform-hidden', { type: 'hidden', name, value });
}

function buildForm(fieldNames, consentP, submitP) {
  const wrapper = el('div', 'gform-wrapper gform-legacy-markup-wrapper newsletter-wrapper', {
    id: `gform_wrapper_${FORM_ID}`,
  });
  const form = el('form', 'gform-newsletter', {
    method: 'post',
    id: `gform_${FORM_ID}`,
    action: FORM_ACTION,
  });
  const body = el('div', 'gform-body');
  const fields = el('ul', 'gform-fields top-label form-sublabel-below description-below', {
    id: `gform_fields_${FORM_ID}`,
  });
  fieldNames.forEach((name, i) => fields.append(buildField(name, i, fieldNames.length)));
  fields.append(buildConsent(consentP, fieldNames.length));
  body.append(fields);

  // the handler's own bookkeeping fields (Gravity Forms legacy markup) + the Akismet honeypot
  const meta = el('div', 'gform-meta');
  meta.append(
    hidden('gform_submit', String(FORM_ID)),
    hidden(`is_submit_${FORM_ID}`, '1'),
    hidden('gform_unique_id', ''),
    hidden(`gform_target_page_number_${FORM_ID}`, '0'),
    hidden(`gform_source_page_number_${FORM_ID}`, '1'),
    hidden('gform_field_values', ''),
  );
  const honeypot = el('p', 'akismet-fields-container', { 'aria-hidden': 'true' });
  const hpLabel = el('label');
  hpLabel.append(el('textarea', null, {
    name: 'ak_hp_textarea', cols: '45', rows: '8', maxlength: '100', tabindex: '-1', autocomplete: 'off',
  }));
  honeypot.append(hpLabel);
  meta.append(honeypot);

  const footer = el('div', 'gform-footer top-label');
  footer.append(el('input', 'gform-button button', {
    type: 'submit',
    id: `gform_submit_button_${FORM_ID}`,
    value: textOf(submitP) || 'Subscribe',
  }));
  form.append(body, meta, footer);
  wrapper.append(form);
  return wrapper;
}

export default function decorate(block) {
  const nodes = collectNodes(block);
  const heading = nodes.find((n) => /^H[1-6]$/.test(n.tagName));
  const list = nodes.find((n) => n.matches('ul, ol'));
  const paragraphs = nodes.filter((n) => n.tagName === 'P'
    && !n.querySelector('a[href], picture, img'));
  const intro = heading ? paragraphs.find((p) => p.parentElement === heading.parentElement) : null;
  const others = paragraphs.filter((p) => p !== intro)
    .sort((a, b) => textOf(b).length - textOf(a).length);
  const consentP = others[0] || null;
  const submitP = others.length > 1 ? others[others.length - 1] : null;
  const fieldNames = list ? [...list.querySelectorAll('li')].map(textOf).filter(Boolean) : [];
  const consumed = new Set([heading, list, intro, consentP, submitP]);
  const rest = nodes.filter((n) => !consumed.has(n));

  const container = el('div', 'container');
  const textRow = el('div', 'row row-newsletter-txt justify-content-center');
  const textCol = el('div', 'col-md-8');
  if (heading) textCol.append(heading);
  if (intro) textCol.append(intro);
  rest.forEach((n) => textCol.append(n));
  textRow.append(textCol);
  const formRow = el('div', 'row row-news-form justify-content-center');
  const formCol = el('div', 'col-md-10');
  formCol.append(buildForm(fieldNames, consentP, submitP));
  formRow.append(formCol);
  container.append(textRow, formRow);
  block.replaceChildren(container);
}
