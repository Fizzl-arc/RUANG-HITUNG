import { MATERIAL_COUNT, createDefaultState } from '../config.js';
import { loadState, saveState } from '../state.js';
import { showNotice } from '../ui/notifications.js';

let state = loadState();

export function getProgressState() {
  return state;
}

export function persistProgress() {
  if (saveState(state)) return true;
  showNotice('Penyimpanan browser tidak tersedia. Progres hanya bertahan selama halaman ini terbuka.', true);
  return false;
}

export function updateHomeStats() {
  const completed = state.completedMaterials.length;
  const percent = Math.round((completed / MATERIAL_COUNT) * 100);
  const bestScores = Object.values(state.levelBestScores).map(Number);
  const best = bestScores.length ? Math.max(...bestScores) : 0;
  const passedLevels = Object.keys(state.levelBestScores).length;

  document.getElementById('homeMaterialsStat').textContent = `${completed} / ${MATERIAL_COUNT}`;
  document.getElementById('homeQuizzesStat').textContent = String(state.results.length);
  document.getElementById('homeBestStat').textContent = String(best);
  document.getElementById('homeLevelStat').textContent = `${Math.min(3, passedLevels + 1)} / 3`;
  document.getElementById('homeProgressLabel').textContent = `${percent}%`;
  document.getElementById('homeProgressBar').style.width = `${percent}%`;
  document.querySelector('.app-progress[role="progressbar"]').setAttribute('aria-valuenow', String(percent));
  updateMaterialButtons();
  document.getElementById('bestScore').textContent = String(best);
}

function updateMaterialButtons() {
  document.querySelectorAll('[data-complete-material]').forEach((button) => {
    const done = state.completedMaterials.includes(Number(button.dataset.completeMaterial));
    button.classList.toggle('completed', done);
    button.innerHTML = done
      ? '<i class="bi bi-check-circle-fill me-1"></i>Selesai'
      : '<i class="bi bi-check2-circle me-1"></i>Tandai selesai';
  });
}

function completeMaterial(button) {
  const materialId = Number(button.dataset.completeMaterial);
  if (state.completedMaterials.includes(materialId)) return;

  state.completedMaterials.push(materialId);
  state.completedMaterials.sort((a, b) => a - b);
  const saved = persistProgress();
  updateHomeStats();
  if (saved) showNotice('Progres materi tersimpan di browser ini.');
}

function resetProgress(onReset) {
  if (!window.confirm('Hapus seluruh progres materi dan nilai kuis yang tersimpan di browser ini?')) return;

  state = createDefaultState();
  const saved = persistProgress();
  updateHomeStats();
  onReset();
  if (saved) showNotice('Progres belajar berhasil diatur ulang.');
}

export function initializeProgress(onReset) {
  document.querySelectorAll('[data-complete-material]').forEach((button) => {
    button.addEventListener('click', () => completeMaterial(button));
  });
  document.getElementById('resetProgress').addEventListener('click', () => resetProgress(onReset));
  updateHomeStats();
}
