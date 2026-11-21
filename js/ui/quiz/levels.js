export function renderLevelCards(levels, state, unlockedLevel, onStart) {
  const list = document.getElementById('levelList');
  list.replaceChildren();

  levels.forEach((level) => {
    const available = level.id <= unlockedLevel;
    const best = state.levelBestScores[level.id];
    const column = document.createElement('div');
    column.className = 'col-md-4';

    const button = document.createElement('button');
    button.type = 'button';
    button.disabled = !available;
    button.className = `level-card w-100 ${available ? '' : 'locked'}`;
    button.append(createLevelTop(level, available), createLevelName(level), createLevelSubtitle(level), createLevelStatus(best, available));
    if (available) button.addEventListener('click', () => onStart(level.id));

    column.appendChild(button);
    list.appendChild(column);
  });
}

function createLevelTop(level, available) {
  const top = document.createElement('span');
  top.className = 'level-card-top';
  top.innerHTML = `<span>LEVEL 0${level.id}</span><i class="bi ${available ? level.icon : 'bi-lock-fill'}" aria-hidden="true"></i>`;
  return top;
}

function createLevelName(level) {
  const name = document.createElement('strong');
  name.textContent = level.name;
  return name;
}

function createLevelSubtitle(level) {
  const subtitle = document.createElement('span');
  subtitle.className = 'level-subtitle';
  subtitle.textContent = level.subtitle;
  return subtitle;
}

function createLevelStatus(best, available) {
  const status = document.createElement('span');
  status.className = 'level-status';
  status.textContent = best !== undefined ? `Terbaik: ${best} poin` : available ? 'Siap dimainkan' : 'Selesaikan level sebelumnya';
  return status;
}

export function showLevelSelection() {
  document.getElementById('quizResult').classList.add('d-none');
  document.getElementById('quizIntro').classList.remove('d-none');
}
