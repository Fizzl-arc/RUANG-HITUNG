export function renderQuizResult({ level, complete, score, lives, nextUnlocked, onReplay, onBack }) {
  document.getElementById('quizPlay').classList.add('d-none');
  const result = document.getElementById('quizResult');
  result.classList.remove('d-none');

  const { title, description } = getResultMessage(level.name, complete, lives);
  result.innerHTML = `
    <span class="result-icon ${complete ? 'success' : 'retry'}"><i class="bi ${complete ? 'bi-trophy' : 'bi-arrow-repeat'}"></i></span>
    <span class="eyebrow ${complete ? '' : 'coral-text'}">${complete ? 'LEVEL TUNTAS' : 'COBA LAGI'}</span>
    <h2>${title}</h2>
    <p>${description}</p>
    ${nextUnlocked ? '<p class="unlock-message"><i class="bi bi-unlock me-1"></i>Level berikutnya sudah terbuka. Lanjutkan tantanganmu!</p>' : ''}
    <div class="score-result"><span>SKOR LEVEL</span><strong>${score}<small> / 100</small></strong></div>
    <p class="result-lives">${lives} nyawa tersisa</p>
    <div class="d-flex flex-wrap justify-content-center gap-2 mt-4">
      <button id="backToLevels" class="btn btn-outline-sage">Pilih level</button>
      <button id="replayQuiz" class="btn btn-sage"><i class="bi bi-arrow-repeat me-1"></i>Ulangi level</button>
    </div>`;
  document.getElementById('replayQuiz').addEventListener('click', onReplay);
  document.getElementById('backToLevels').addEventListener('click', onBack);
}

function getResultMessage(levelName, complete, lives) {
  if (complete) {
    return {
      title: `Level ${levelName} selesai!`,
      description: 'Keren! Kamu berhasil menyelesaikan seluruh soal pada level ini.'
    };
  }
  return lives <= 0
    ? {
        title: 'Nyawa habis',
        description: 'Kamu berhenti di soal berikutnya. Pelajari pembahasan dan coba lagi.'
      }
    : {
        title: `Level ${levelName} belum tuntas`,
        description: 'Pelajari pembahasan dan coba lagi untuk menuntaskan level ini.'
      };
}
