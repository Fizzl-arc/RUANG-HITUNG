'use strict';

    const tabButtons = document.querySelectorAll('[data-tab]');
    const panels = document.querySelectorAll('.tab-panel');

    function showTab(name) {
      panels.forEach((panel) => panel.classList.toggle('active', panel.id === `panel-${name}`));
      document.querySelectorAll('.nav-link').forEach((button) => {
        if (button.dataset.tab === name) button.setAttribute('aria-current', 'page');
        else button.removeAttribute('aria-current');
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    tabButtons.forEach((button) => button.addEventListener('click', () => showTab(button.dataset.tab)));

    function formatNumber(value) {
      if (Math.abs(value) < 1e-10) return '0';
      return Number.isInteger(value) ? String(value) : Number(value.toFixed(4)).toString();
    }

    const linearInputs = ['linearA', 'linearB', 'linearX'].map((id) => document.getElementById(id));
    function updateLinearFunction() {
      const [aInput, bInput, xInput] = linearInputs;
      const [a, b, x] = linearInputs.map((input) => input.value.trim() === '' ? 0 : Number(input.value));
      const result = a * x + b;
      document.getElementById('linearSubstitution').textContent = `f(${formatNumber(x)}) = ${formatNumber(a)} × ${formatNumber(x)} + ${formatNumber(b)}`;
      document.getElementById('linearResult').textContent = Number.isFinite(result) ? formatNumber(result) : '—';
    }
    linearInputs.forEach((input) => input.addEventListener('input', updateLinearFunction));
    updateLinearFunction();

    const questionBank = [
      { category: 'FUNGSI / EVALUASI', text: 'Jika f(x) = 3x − 2, berapakah f(4)?', options: ['10', '14', '6', '12'], answer: 0, explain: 'f(4) = 3 × 4 − 2 = 10.' },
      { category: 'FUNGSI / INVERS', text: 'Jika f(x) = 2x + 6, maka f⁻¹(x) adalah…', options: ['2x − 6', '(x − 6) / 2', '(x + 6) / 2', '6 − 2x'], answer: 1, explain: 'Tukar x dan y: x = 2y + 6, sehingga y = (x − 6) / 2.' },
      { category: 'FUNGSI / KOMPOSISI', text: 'Jika f(x) = x + 5 dan g(x) = 2x, berapakah (f ∘ g)(3)?', options: ['11', '16', '13', '8'], answer: 0, explain: 'g(3) = 6, lalu f(6) = 11.' },
      { category: 'FUNGSI / KOMPOSISI', text: 'Jika f(x) = 2x dan g(x) = x − 1, bentuk (f ∘ g)(x) adalah…', options: ['2x − 2', '2x − 1', 'x − 2', '2x + 1'], answer: 0, explain: 'f(g(x)) = 2(x − 1) = 2x − 2.' },
      { category: 'FUNGSI / INVERS', text: 'Invers dari f(x) = x − 7 adalah…', options: ['x − 7', 'x + 7', '7 − x', '−x − 7'], answer: 1, explain: 'Tukar x dan y pada y = x − 7, sehingga f⁻¹(x) = x + 7.' },
      { category: 'FUNGSI / EVALUASI', text: 'Jika f(x) = −2x + 1, berapakah f(−3)?', options: ['−5', '7', '5', '−7'], answer: 1, explain: 'f(−3) = −2 × (−3) + 1 = 7.' },
      { category: 'FUNGSI / EVALUASI', text: 'Jika f(x) = 2x + 3, berapakah f(2)?', options: ['7', '5', '10', '4'], answer: 0, explain: 'f(2) = 2(2) + 3 = 4 + 3 = 7.' },
      { category: 'FUNGSI / INVERS', text: 'Jika f(x) = 2x + 4, maka f⁻¹(x) adalah…', options: ['(x + 4) / 2', '(x − 4) / 2', '2x − 4', '4 − 2x'], answer: 1, explain: 'Tukar x dan y: x = 2y + 4, lalu isolasi y sehingga f⁻¹(x) = (x − 4) / 2.' }
    ];

    let quizQuestions = [];
    let questionIndex = 0;
    let lives = 3;
    let score = 0;
    let answeredCount = 0;
    let timeLeft = 30;
    let timerId = null;
    let questionLocked = false;
    let bestScore = Number(localStorage.getItem('ruangHitungBestScore') || 0);
    document.getElementById('bestScore').textContent = String(bestScore);

    function shuffle(items) {
      const shuffled = [...items];
      for (let index = shuffled.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(Math.random() * (index + 1));
        [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
      }
      return shuffled;
    }

    function startQuiz() {
      quizQuestions = shuffle(questionBank).slice(0, 5);
      questionIndex = 0;
      lives = 3;
      score = 0;
      answeredCount = 0;
      document.getElementById('quizIntro').classList.add('hidden');
      document.getElementById('quizResult').classList.add('hidden');
      document.getElementById('quizPlay').classList.remove('hidden');
      renderQuestion();
    }

    function renderQuestion() {
      clearInterval(timerId);
      questionLocked = false;
      timeLeft = 30;
      const question = quizQuestions[questionIndex];
      document.getElementById('questionCount').textContent = `SOAL ${questionIndex + 1} / 5`;
      document.getElementById('questionCategory').textContent = question.category;
      document.getElementById('questionText').textContent = question.text;
      document.getElementById('timerDisplay').textContent = String(timeLeft);
      document.getElementById('quizProgress').style.width = `${(questionIndex / 5) * 100}%`;
      document.getElementById('answerFeedback').textContent = '';
      const nextButton = document.getElementById('nextQuestion');
      nextButton.classList.add('hidden');
      nextButton.classList.remove('inline-flex');
      const optionsContainer = document.getElementById('answerOptions');
      optionsContainer.replaceChildren();
      question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'option-button flex min-h-14 items-center gap-3 border border-line bg-ink px-4 py-3 text-left text-sm text-paper';
        button.innerHTML = `<span class="font-mono text-xs text-muted">0${index + 1}</span><span></span>`;
        button.lastElementChild.textContent = option;
        button.addEventListener('click', () => chooseAnswer(index));
        optionsContainer.appendChild(button);
      });
      updateLives();
      timerId = setInterval(() => {
        timeLeft -= 1;
        document.getElementById('timerDisplay').textContent = String(timeLeft);
        if (timeLeft <= 0) {
          clearInterval(timerId);
          chooseAnswer(-1);
        }
      }, 1000);
    }

    function updateLives() {
      const display = document.getElementById('livesDisplay');
      display.innerHTML = Array.from({ length: 3 }, (_, index) => `<i class="fa-solid fa-heart ${index < lives ? '' : 'opacity-20'}" aria-hidden="true"></i>`).join('');
      display.setAttribute('aria-label', `${lives} nyawa tersisa`);
    }

    function chooseAnswer(selectedIndex) {
      if (questionLocked) return;
      questionLocked = true;
      clearInterval(timerId);
      answeredCount += 1;
      const question = quizQuestions[questionIndex];
      const buttons = Array.from(document.querySelectorAll('#answerOptions button'));
      buttons.forEach((button, index) => {
        button.disabled = true;
        if (index === question.answer) button.classList.add('correct');
        else if (index === selectedIndex) button.classList.add('incorrect');
      });
      const feedback = document.getElementById('answerFeedback');
      if (selectedIndex === question.answer) {
        score += 20;
        feedback.innerHTML = `<span class="font-semibold text-mint">Tepat.</span> <span class="text-muted">${question.explain}</span>`;
      } else {
        lives -= 1;
        updateLives();
        const message = selectedIndex === -1 ? 'Waktu habis.' : 'Belum tepat.';
        feedback.innerHTML = `<span class="font-semibold text-coral">${message}</span> <span class="text-muted">${question.explain}</span>`;
      }
      const nextButton = document.getElementById('nextQuestion');
      nextButton.innerHTML = lives <= 0 || questionIndex === 4 ? 'Lihat hasil <i class="fa-solid fa-arrow-right text-xs" aria-hidden="true"></i>' : 'Lanjut <i class="fa-solid fa-arrow-right text-xs" aria-hidden="true"></i>';
      nextButton.classList.remove('hidden');
      nextButton.classList.add('inline-flex');
      document.getElementById('quizProgress').style.width = `${((questionIndex + 1) / 5) * 100}%`;
    }

    function advanceQuiz() {
      if (lives <= 0 || questionIndex >= 4) {
        finishQuiz();
        return;
      }
      questionIndex += 1;
      renderQuestion();
    }

    function finishQuiz() {
      clearInterval(timerId);
      document.getElementById('quizPlay').classList.add('hidden');
      const result = document.getElementById('quizResult');
      result.classList.remove('hidden');
      const complete = lives > 0 && questionIndex === 4;
      const icon = complete ? 'fa-flag-checkered' : 'fa-heart-crack';
      const title = complete ? 'Kuis Selesai' : 'Game Over';
      const detail = complete ? `Kamu menjawab ${answeredCount} dari 5 soal.` : `Permainan berhenti di soal ${questionIndex + 1}. Kamu menjawab ${answeredCount} soal.`;
      if (score > bestScore) {
        bestScore = score;
        localStorage.setItem('ruangHitungBestScore', String(bestScore));
        document.getElementById('bestScore').textContent = String(bestScore);
      }
      result.innerHTML = `<span class="mx-auto grid h-14 w-14 place-items-center border ${complete ? 'border-mint/40 bg-mint/10 text-mint' : 'border-coral/40 bg-coral/10 text-coral'}"><i class="fa-solid ${icon} text-xl" aria-hidden="true"></i></span><p class="mt-5 font-mono text-xs uppercase tracking-[.18em] ${complete ? 'text-mint' : 'text-coral'}">${complete ? 'Tantangan tuntas' : 'Nyawa habis'}</p><h2 class="mt-2 font-display text-2xl font-semibold">${title}</h2><p class="mt-2 text-sm text-muted">${detail}</p><p class="mt-6 font-mono text-xs uppercase tracking-wider text-muted">SKOR AKHIR</p><p class="mt-1 font-display text-5xl font-semibold text-gold">${score}<span class="ml-2 text-base text-muted">/ 100</span></p><p class="mt-2 text-xs text-muted">${lives} nyawa tersisa</p><button id="replayQuiz" class="mt-7 inline-flex items-center gap-2 bg-mint px-5 py-3 text-sm font-bold text-ink transition hover:bg-[#b6f0cf]"><i class="fa-solid fa-rotate-right text-xs" aria-hidden="true"></i> Main lagi</button>`;
      document.getElementById('replayQuiz').addEventListener('click', startQuiz);
    }

    document.getElementById('startQuiz').addEventListener('click', startQuiz);
    document.getElementById('nextQuestion').addEventListener('click', advanceQuiz);
