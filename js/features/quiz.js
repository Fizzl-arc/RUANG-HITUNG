import { QUESTION_DURATION_SECONDS, QUIZ_LEVELS, QUIZ_LIVES } from '../config.js';
import { getProgressState, persistProgress, updateHomeStats } from './progress.js';
import { generateQuizQuestions } from '../utils/quiz-generator.js';
import { shuffleItems } from '../utils/shuffle-items.js';
import { renderLevelCards, showLevelSelection } from '../ui/quiz/levels.js';
import { renderQuestionView, showAnswerFeedback, showQuizPlay, updateQuizTimer } from '../ui/quiz/questions.js';
import { renderQuizResult } from '../ui/quiz/results.js';

let activeLevel;
let questionIndex = 0;
let lives = QUIZ_LIVES;
let score = 0;
let correctAnswers = 0;
let timeRemaining = QUESTION_DURATION_SECONDS;
let timerId = null;
let questionLocked = false;

function getUnlockedLevel() {
  const { levelBestScores } = getProgressState();
  let level = 1;
  while (level < QUIZ_LEVELS.length && Object.prototype.hasOwnProperty.call(levelBestScores, level)) {
    level += 1;
  }
  return level;
}

export function renderLevelList() {
  renderLevelCards(QUIZ_LEVELS, getProgressState(), getUnlockedLevel(), startQuiz);
}

function startQuiz(levelId) {
  const level = QUIZ_LEVELS.find((item) => item.id === levelId);
  if (!level || levelId > getUnlockedLevel()) return;

  const state = getProgressState();
  const attemptNumber = Number(state.quizAttempts[levelId] || 0) + 1;
  state.quizAttempts[levelId] = attemptNumber;
  persistProgress();
  activeLevel = {
    ...level,
    questions: shuffleItems(generateQuizQuestions(levelId, attemptNumber))
  };
  questionIndex = 0;
  lives = QUIZ_LIVES;
  score = 0;
  correctAnswers = 0;
  questionLocked = false;

  showQuizPlay(activeLevel);
  renderQuestion();
}

function startTimer() {
  clearInterval(timerId);
  timerId = setInterval(() => {
    timeRemaining -= 1;
    updateQuizTimer(timeRemaining);
    if (timeRemaining <= 0) chooseAnswer(-1);
  }, 1000);
}

// Pause the active-question countdown so navigating to another tab mid-quiz
// does not silently drain a life in the background.
export function pauseQuizTimer() {
  if (timerId !== null) {
    clearInterval(timerId);
    timerId = null;
  }
}

// Resume the countdown only when a quiz is mid-question (not answered, not
// finished) and the play panel is actually visible.
export function resumeQuizTimer() {
  if (!activeLevel || questionLocked || timerId !== null || timeRemaining <= 0) return;
  const play = document.getElementById('quizPlay');
  if (!play || play.classList.contains('d-none')) return;
  startTimer();
}

function renderQuestion() {
  questionLocked = false;
  timeRemaining = QUESTION_DURATION_SECONDS;
  renderQuestionView({
    question: activeLevel.questions[questionIndex],
    questionIndex,
    totalQuestions: activeLevel.questions.length,
    lives,
    timeRemaining,
    onAnswer: chooseAnswer
  });
  startTimer();
}

function chooseAnswer(selectedIndex) {
  if (questionLocked || lives <= 0) return;
  clearInterval(timerId);
  questionLocked = true;
  const question = activeLevel.questions[questionIndex];
  const correct = selectedIndex === question.answer;
  if (correct) {
    correctAnswers += 1;
    score = Math.round((correctAnswers / activeLevel.questions.length) * 100);
  } else {
    lives -= 1;
  }
  showAnswerFeedback(question, selectedIndex, lives, questionIndex, activeLevel.questions.length);
}

function advanceQuiz() {
  if (lives <= 0 || questionIndex >= activeLevel.questions.length - 1) {
    finishQuiz();
    return;
  }
  questionIndex += 1;
  renderQuestion();
}

function finishQuiz() {
  clearInterval(timerId);
  const complete = lives > 0
    && questionIndex === activeLevel.questions.length - 1
    && questionLocked;
  recordQuizResult(complete);
  renderQuizResult({
    level: activeLevel,
    complete,
    score,
    lives,
    nextUnlocked: complete && activeLevel.id < QUIZ_LEVELS.length,
    onReplay: () => startQuiz(activeLevel.id),
    onBack: () => {
      showLevelSelection();
      renderLevelList();
    }
  });
}

function recordQuizResult(complete) {
  const state = getProgressState();
  state.results.push({
    level: activeLevel.id,
    score,
    completed: complete,
    date: new Date().toISOString()
  });
  if (complete) {
    state.levelBestScores[activeLevel.id] = Math.max(score, Number(state.levelBestScores[activeLevel.id] || 0));
  }
  persistProgress();
  updateHomeStats();
  renderLevelList();
}

export function initializeQuiz() {
  document.getElementById('nextQuestion').addEventListener('click', advanceQuiz);
  renderLevelList();
}
