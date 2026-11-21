import { QUIZ_LIVES } from '../../config.js';
import { shuffleItems } from '../../utils/shuffle-items.js';

export function showQuizPlay(level) {
  document.getElementById('quizIntro').classList.add('d-none');
  document.getElementById('quizResult').classList.add('d-none');
  document.getElementById('quizPlay').classList.remove('d-none');
  document.getElementById('quizLevelLabel').textContent = `LEVEL 0${level.id} / ${level.name}`;
}

export function renderQuestionView({ question, questionIndex, totalQuestions, lives, timeRemaining, onAnswer }) {
  document.getElementById('questionCount').textContent = `SOAL ${questionIndex + 1} / ${totalQuestions}`;
  document.getElementById('questionCategory').textContent = question.category;
  document.getElementById('questionText').textContent = question.text;
  updateQuizTimer(timeRemaining);
  document.getElementById('answerFeedback').textContent = '';
  document.getElementById('nextQuestion').classList.add('d-none');
  updateQuestionProgress(questionIndex / totalQuestions);
  updateLivesDisplay(lives);
  renderAnswerOptions(question, onAnswer);
}

function renderAnswerOptions(question, onAnswer) {
  const options = document.getElementById('answerOptions');
  options.replaceChildren();
  shuffleItems(question.options.map((option, index) => ({ option, index })))
    .forEach(({ option, index }, displayIndex) => {
      const column = document.createElement('div');
      column.className = 'col-md-6';
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'option-button w-100';
      button.dataset.optionIndex = String(index);
      button.innerHTML = `<span class="option-index">0${displayIndex + 1}</span><span class="option-label"></span>`;
      button.querySelector('.option-label').textContent = option;
      button.addEventListener('click', () => onAnswer(index));
      column.appendChild(button);
      options.appendChild(column);
    });
}

function updateLivesDisplay(lives) {
  const display = document.getElementById('livesDisplay');
  display.replaceChildren();
  for (let index = 0; index < QUIZ_LIVES; index += 1) {
    const heart = document.createElement('i');
    heart.className = `bi bi-heart-fill ${index >= lives ? 'heart-lost' : ''}`;
    heart.setAttribute('aria-hidden', 'true');
    display.appendChild(heart);
  }
  display.setAttribute('aria-label', `${lives} nyawa tersisa`);
}

export function updateQuizTimer(seconds) {
  document.getElementById('timerDisplay').textContent = String(seconds);
}

export function showAnswerFeedback(question, selectedIndex, lives, questionIndex, totalQuestions) {
  const buttons = Array.from(document.querySelectorAll('#answerOptions button'));
  buttons.forEach((button) => {
    const optionIndex = Number(button.dataset.optionIndex);
    button.disabled = true;
    if (optionIndex === question.answer) button.classList.add('correct');
    else if (optionIndex === selectedIndex) button.classList.add('incorrect');
  });

  const correct = selectedIndex === question.answer;
  const feedback = document.getElementById('answerFeedback');
  feedback.innerHTML = `<strong class="${correct ? 'feedback-correct' : 'feedback-wrong'}">${correct ? 'Tepat.' : selectedIndex === -1 ? 'Waktu habis.' : 'Belum tepat.'}</strong> `;
  feedback.appendChild(document.createTextNode(question.explain));

  const next = document.getElementById('nextQuestion');
  next.innerHTML = lives <= 0 || questionIndex === totalQuestions - 1
    ? 'Lihat hasil <i class="bi bi-arrow-right ms-1"></i>'
    : 'Lanjut <i class="bi bi-arrow-right ms-1"></i>';
  next.classList.remove('d-none');
  updateQuestionProgress((questionIndex + 1) / totalQuestions);
  return correct;
}

function updateQuestionProgress(progress) {
  const percent = Math.round(progress * 100);
  const bar = document.getElementById('quizProgress');
  bar.style.width = `${percent}%`;
  bar.parentElement.setAttribute('aria-valuenow', String(percent));
}
