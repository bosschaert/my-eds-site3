/**
 * Hero — fixed composition from stardust/eds-schema/index.json.
 * Authored heading and CTA paragraph are moved intact for inline editing.
 */
export default function decorate(block) {
  const media = block.querySelector('picture, img');
  const heading = block.querySelector('h1');
  const cta = block.querySelector('a');
  if (!heading) return;

  const stage = document.createElement('div');
  stage.className = 'hero-stage';
  if (media) {
    const mediaWrap = document.createElement('div');
    mediaWrap.className = 'hero-media';
    mediaWrap.append(media);
    const img = mediaWrap.querySelector('img');
    if (img) {
      img.loading = 'eager';
      img.fetchPriority = 'high';
    }
    stage.append(mediaWrap);
  }

  const card = document.createElement('div');
  card.className = 'hero-card';
  const title = document.createElement('div');
  title.className = 'hero-title';
  title.append(heading);
  card.append(title);

  const ctaParagraph = cta?.closest('p');
  if (ctaParagraph) {
    const actions = document.createElement('div');
    actions.className = 'hero-actions';
    actions.append(ctaParagraph);
    card.append(actions);
  }

  stage.append(card);
  block.replaceChildren(stage);
}
