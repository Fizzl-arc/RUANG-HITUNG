import { initializeProgress } from './features/progress.js';
import { initializeQuiz, renderLevelList } from './features/quiz.js';
import { initializeSimulator } from './features/simulator.js';
import { initializeNavigation } from './ui/navigation.js';

export function initializeApp() {
  initializeNavigation();
  initializeProgress(renderLevelList);
  initializeSimulator();
  initializeQuiz();
}
