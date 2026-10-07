// team-tabs.js — observed on the live site (stardust/replica/motion/index.json, page1.json):
// a click on tab button i adds `active` to button i and to content panel i and removes it from the others;
// the panel's fade is the CSS `fadeIn 0.4s` animation. Nothing else fires (no hash, no focus management).
document.querySelectorAll('.team-tabs').forEach((root) => {
  const buttons = root.querySelectorAll('.tab-buttons__button');
  const panels = root.querySelectorAll('.tab-content');
  buttons.forEach((button, index) => {
    button.addEventListener('click', () => {
      buttons.forEach((b, i) => b.classList.toggle('active', i === index));
      panels.forEach((p, i) => p.classList.toggle('active', i === index));
    });
  });
});
