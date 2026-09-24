// team-tabs: class swap on click (observed on the live site: showTabSection(i) toggles .active on button i and panel i)
document.querySelectorAll('.team-tabs').forEach((tabs) => {
  const buttons = tabs.querySelectorAll('.team-tabs__tab');
  const panels = tabs.querySelectorAll('.team-tabs__panel');
  buttons.forEach((btn, idx) => btn.addEventListener('click', () => {
    buttons.forEach((b, i) => b.classList.toggle('active', i === idx));
    panels.forEach((p, i) => p.classList.toggle('active', i === idx));
  }));
});
