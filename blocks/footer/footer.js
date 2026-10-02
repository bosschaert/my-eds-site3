import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * Footer block — template-slotted (stardust/eds-conversion-log.md § Delivery design notes).
 * /footer sections: 1 newsletter (heading, description, footnote), 2 legal line,
 * 3 social link. Authored nodes are MOVED into the newsletter / legal / social slots;
 * the email field and its button are block-rendered.
 * @ew-exempt Email Address — block-rendered newsletter input label/placeholder
 * @ew-exempt Sign Up — block-rendered newsletter button label (type=button, no provider yet)
 * @param {Element} block The footer block element
 */

function buildNewsletterBody() {
  const body = document.createElement('div');
  body.className = 'newsletter-form-body';

  const fields = document.createElement('div');
  fields.className = 'newsletter-form-fields-wrapper';
  const field = document.createElement('div');
  field.className = 'newsletter-form-field-wrapper';
  const label = document.createElement('label');
  label.className = 'newsletter-form-field-label';
  label.htmlFor = 'newsletter-email';
  label.textContent = 'Email Address';
  const input = document.createElement('input');
  input.className = 'newsletter-form-field-element';
  input.id = 'newsletter-email';
  input.name = 'email';
  input.type = 'email';
  input.placeholder = 'Email Address';
  input.autocomplete = 'email';
  field.append(label, input);
  fields.append(field);

  const buttonWrapper = document.createElement('div');
  buttonWrapper.className = 'newsletter-form-button-wrapper';
  const button = document.createElement('button');
  button.className = 'newsletter-form-button';
  button.type = 'button';
  const buttonLabel = document.createElement('span');
  buttonLabel.className = 'newsletter-form-button-label';
  buttonLabel.textContent = 'Sign Up';
  const spinner = document.createElement('span');
  spinner.className = 'newsletter-form-spinner';
  const buttonIcon = document.createElement('span');
  buttonIcon.className = 'newsletter-form-button-icon';
  button.append(spinner, buttonLabel, buttonIcon);
  buttonWrapper.append(button);

  body.append(fields, buttonWrapper);
  return body;
}

function buildNewsletter(section) {
  const newsletter = document.createElement('div');
  newsletter.className = 'footer-block footer-newsletter';
  const wrapper = document.createElement('div');
  wrapper.className = 'newsletter-form-wrapper';
  const form = document.createElement('div');
  form.className = 'newsletter-form';
  const head = document.createElement('div');
  head.className = 'newsletter-form-header';
  const description = document.createElement('div');
  description.className = 'newsletter-form-header-description';
  const footnote = document.createElement('div');
  footnote.className = 'newsletter-form-footnote';

  const items = [...section.querySelectorAll(':scope > div > *')];
  const heading = items.find((el) => /^H[1-6]$/.test(el.tagName));
  const paragraphs = items.filter((el) => el !== heading);
  if (heading) head.append(heading);
  // the last paragraph is the footnote; everything before it describes the list
  const last = paragraphs.length > 1 ? paragraphs.pop() : null;
  paragraphs.forEach((p) => description.append(p));
  head.append(description);
  form.append(head, buildNewsletterBody());
  if (last) footnote.append(last);
  form.append(footnote);
  wrapper.append(form);
  newsletter.append(wrapper);
  return newsletter;
}

function buildHtmlBlock(section) {
  const html = document.createElement('div');
  html.className = 'footer-block footer-html';
  const content = document.createElement('div');
  content.className = 'sqs-html-content';
  section.querySelectorAll(':scope > div > *').forEach((el) => content.append(el));
  html.append(content);
  return html;
}

function buildSocial(section) {
  const social = document.createElement('div');
  social.className = 'social-links';
  social.id = 'socialLinks';
  section.querySelectorAll(':scope > div > *').forEach((el) => social.append(el));
  social.querySelectorAll('img').forEach((img) => {
    img.loading = 'eager';
  });
  return social;
}

export default async function decorate(block) {
  if (block.querySelector(':scope > #footerBlock')) return;

  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);
  if (!fragment) return;

  const sections = [...fragment.querySelectorAll(':scope > .section')];
  const newsletterSection = sections.find((s) => s.querySelector('h1, h2, h3, h4, h5, h6'));
  const socialSection = sections.find((s) => s !== newsletterSection
    && s.querySelector('a[href]') && !s.querySelector('h1, h2, h3, h4, h5, h6'));
  const rest = sections.filter((s) => s !== newsletterSection && s !== socialSection);

  const footerBlock = document.createElement('div');
  footerBlock.id = 'footerBlock';
  const spacer = document.createElement('div');
  spacer.className = 'footer-block footer-spacer';
  footerBlock.append(spacer);
  if (newsletterSection) footerBlock.append(buildNewsletter(newsletterSection));
  rest.forEach((section) => {
    if (section.querySelector(':scope > div > *')) footerBlock.append(buildHtmlBlock(section));
  });

  block.textContent = '';
  block.append(footerBlock);
  if (socialSection) block.append(buildSocial(socialSection));
}
