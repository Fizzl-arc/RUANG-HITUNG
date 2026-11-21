export const STORAGE_KEY = 'ruangHitungProgress';
export const MATERIAL_COUNT = 5;
export const QUIZ_QUESTION_COUNT = 10;
export const QUESTION_DURATION_SECONDS = 60;
export const QUIZ_LIVES = 3;

export const QUIZ_LEVELS = [
  { id: 1, name: 'Dasar', subtitle: 'Substitusi dan operasi paling dasar', icon: 'bi-flower1' },
  { id: 2, name: 'Menengah', subtitle: 'Komposisi, invers, dan operasi fungsi', icon: 'bi-layers' },
  { id: 3, name: 'Tantangan', subtitle: 'Pemodelan, komposisi, dan soal campuran', icon: 'bi-fire' }
];

export function createDefaultState() {
  return { completedMaterials: [], results: [], levelBestScores: {}, quizAttempts: {} };
}
