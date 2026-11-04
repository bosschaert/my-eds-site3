/**
 * newsletter — blue sign-up band: authored heading + intro, then the subscription form.
 * Rows: (1) the heading and intro paragraph (moved into the intro wrapper).
 * The form is integration code (dynamic-features D1, interim): it posts to the existing Gravity
 * Forms endpoint with the source's field names; its labels/placeholders are the form's own.
 */

const ACTION = 'https://balbriggan.ie/#gf_1';
const CONSENT = 'I consent to the collection and storage of my data and to be contacted occasionally by email';

function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([key, value]) => {
    if (value === true) node.setAttribute(key, '');
    else node.setAttribute(key, value);
  });
  node.append(...children);
  return node;
}

function required() {
  return el('span', { class: 'gfield_required' }, el('span', { class: 'gfield_required gfield_required_asterisk' }, '*'));
}

function field(id, name, type, label) {
  return el(
    'div',
    { class: 'newsletter-field newsletter-field-third' },
    el('label', { class: 'newsletter-label', for: id }, label, required()),
    el('div', { class: 'newsletter-control' }, el('input', {
      id, name, type, placeholder: label, required: true,
    })),
  );
}

function buildForm() {
  const consent = el(
    'div',
    { class: 'newsletter-consent' },
    el('span', { class: 'newsletter-label newsletter-label-group' }, 'GDPR Consent', required()),
    el('input', {
      id: 'nl-consent', name: 'input_4.1', type: 'checkbox', value: CONSENT, required: true,
    }),
    el('label', { for: 'nl-consent' }, CONSENT),
  );
  const fields = el(
    'div',
    { class: 'newsletter-fields' },
    field('nl-first', 'input_1', 'text', 'First Name'),
    field('nl-last', 'input_2', 'text', 'Last Name'),
    field('nl-email', 'input_3', 'email', 'Email'),
    consent,
  );
  const footer = el(
    'div',
    { class: 'newsletter-footer' },
    el('input', { class: 'newsletter-submit', type: 'submit', value: 'Subscribe' }),
  );
  const honeypot = el(
    'p',
    { class: 'newsletter-hp', 'aria-hidden': 'true' },
    el('label', {}, 'Δ', el('textarea', {
      name: 'ak_hp_textarea', cols: '45', rows: '8', maxlength: '100', tabindex: '-1',
    })),
  );
  return el('form', {
    class: 'newsletter-form', method: 'post', action: ACTION, novalidate: true,
  }, fields, footer, honeypot);
}

export default function decorate(block) {
  if (block.querySelector(':scope > .newsletter-intro')) return;

  const intro = document.createElement('div');
  intro.className = 'newsletter-intro';
  [...block.children].forEach((row) => {
    [...row.children].forEach((cell) => intro.append(...cell.childNodes));
    row.remove();
  });
  const frame = el('iframe', {
    class: 'newsletter-frame',
    src: 'about:blank',
    name: 'gform_ajax_frame_1',
    title: 'This iframe contains the logic required to handle Ajax powered Gravity Forms.',
    hidden: true,
  });
  block.append(intro, buildForm(), frame);
}
