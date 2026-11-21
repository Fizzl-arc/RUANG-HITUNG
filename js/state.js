import { MATERIAL_COUNT, STORAGE_KEY, createDefaultState } from './config.js';

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function sanitizeAttempts(value) {
  if (!isRecord(value)) return {};

  return Object.fromEntries(Object.entries(value).filter(([level, attempts]) =>
    Number.isInteger(Number(level)) && Number(level) >= 1 && Number(level) <= 3
    && Number.isInteger(attempts) && attempts >= 0));
}

function sanitizeBestScores(value) {
  if (!isRecord(value)) return {};

  return Object.fromEntries(Object.entries(value).filter(([level, score]) =>
    Number.isInteger(Number(level)) && Number(level) >= 1 && Number(level) <= 3
    && Number.isFinite(Number(score)) && Number(score) >= 0));
}

export function loadState() {
  let saved;
  try {
    saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return createDefaultState();
  }
  if (!isRecord(saved)) return createDefaultState();

  return {
    completedMaterials: Array.isArray(saved.completedMaterials)
      ? saved.completedMaterials.filter((id) => Number.isInteger(id) && id >= 1 && id <= MATERIAL_COUNT)
      : [],
    results: Array.isArray(saved.results) ? saved.results.filter((result) =>
      result && Number.isInteger(result.level) && result.level >= 1 && result.level <= 3
      && Number.isFinite(result.score) && typeof result.completed === 'boolean') : [],
    levelBestScores: sanitizeBestScores(saved.levelBestScores),
    quizAttempts: sanitizeAttempts(saved.quizAttempts)
  };
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}
