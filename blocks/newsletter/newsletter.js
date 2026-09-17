/**
 * Newsletter — fixed interactive form.
 * @ew-exempt field placeholders — derived from authored key-value rows.
 */
export default function decorate(block) {
  const heading = block.querySelector('h2');
  const paragraphs = [...block.querySelectorAll('p')];
  const description = paragraphs.find((p) => !p.querySelector('em, strong, code'));
  const status = paragraphs.find((p) => p.querySelector('em'));
  const configRows = [...block.children].filter((row) => row.querySelector('code'));

  const form = document.createElement('form');
  form.className = 'newsletter-form';
  form.noValidate = true;
  form.setAttribute('aria-label', 'Newsletter signup');

  configRows.forEach((row) => {
    const codes = [...row.querySelectorAll('code')];
    const labelText = [...row.querySelectorAll('p')].find((paragraph) => !paragraph.querySelector('code'));
    const kind = codes[0]?.textContent.trim();
    const type = codes[1]?.textContent.trim();
    if (!labelText || !kind) return;

    if (kind === 'field') {
      const label = document.createElement('label');
      label.className = 'newsletter-field';
      labelText.classList.add('sr-only');
      const input = document.createElement('input');
      input.type = type || 'text';
      input.name = labelText.textContent.trim().toLowerCase().replace(/\s+/g, '_');
      input.placeholder = labelText.textContent.trim();
      input.setAttribute('aria-label', labelText.textContent.trim());
      if (input.type === 'email') input.required = true;
      label.append(labelText, input);
      form.append(label);
    }

    if (kind === 'consent') {
      const label = document.createElement('label');
      label.className = 'newsletter-consent';
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.required = true;
      label.append(input, labelText);
      form.append(label);
    }
  });

  const submitRow = configRows.find((row) => row.querySelector('code')?.textContent.trim() === 'submit');
  const submitLabel = [...(submitRow?.querySelectorAll('p') || [])]
    .find((paragraph) => !paragraph.querySelector('code'));
  const submitWrap = document.createElement('div');
  submitWrap.className = 'newsletter-submit';
  if (submitLabel) submitWrap.append(submitLabel);
  const submit = document.createElement('button');
  submit.type = 'submit';
  submit.setAttribute('aria-label', submitLabel?.textContent.trim() || 'Subscribe');
  submitWrap.append(submit);
  form.append(submitWrap);

  if (status) {
    status.className = 'form-status';
    status.hidden = true;
    form.append(status);
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    if (status) status.hidden = false;
  });

  const wrap = document.createElement('div');
  wrap.className = 'newsletter-wrap';
  if (heading) {
    const title = document.createElement('div');
    title.className = 'newsletter-title';
    title.append(heading);
    wrap.append(title);
  }
  if (description) {
    const copy = document.createElement('div');
    copy.className = 'newsletter-copy';
    copy.append(description);
    wrap.append(copy);
  }
  wrap.append(form);
  block.replaceChildren(wrap);
}
