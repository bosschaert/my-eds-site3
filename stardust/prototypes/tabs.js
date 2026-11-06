// Team tabs — mirrors the source's showTabSection(idx): one active button + one active panel.
document.querySelectorAll('.tabs').forEach((tabs) => {
  const buttons = [...tabs.querySelectorAll('.tabs-list button')];
  const panels = [...tabs.querySelectorAll('.tabs-panel')];
  buttons.forEach((button, idx) => {
    button.addEventListener('click', () => {
      buttons.forEach((b, i) => b.setAttribute('aria-selected', String(i === idx)));
      panels.forEach((p, i) => p.classList.toggle('active', i === idx));
    });
  });
});
