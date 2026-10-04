/* The Scene 2 legal-clarity question has its own source of truth: answer A. */
(() => {
  const SCENE = 'quiz2';
  const app = document.getElementById('app');
  const question = {
    title: '這種情況最可能造成什麼問題？',
    answers: [
      '人民難以預先判斷自己何時可能被盤查',
      '警方完全不能使用「行跡可疑」這種文字',
      '只要有法律依據，執法標準不同也沒關係',
      '只要盤查時間不長，就不會有基本權問題',
    ],
    correctAnswer: 0,
    hint: '先想想：真正讓人無法預先判斷的，是不是「哪些行為會被算作行跡可疑」？',
    explanation: '法律可以使用抽象或不確定法律概念；但規範仍應讓人民能合理理解、預見，並使執法受到可確認的標準拘束。',
  };
  const isScene2Question = () => localStorage.getItem('gate5_current_scene') === SCENE;
  const readAttempts = () => {
    try {
      const attempts = JSON.parse(localStorage.getItem('gate5_attempts') || '{}');
      return attempts && typeof attempts === 'object' ? attempts : {};
    } catch { return {}; }
  };
  const writeAttempts = (attempts) => localStorage.setItem('gate5_attempts', JSON.stringify(attempts));
  const time = () => {
    const value = Number(localStorage.getItem('gate5_game_time') || 1300);
    const safe = Number.isFinite(value) ? value : 1300;
    return `${String(Math.floor(safe / 60)).padStart(2, '0')}:${String(safe % 60).padStart(2, '0')}`;
  };
  const shell = (body) => `<div class="street"></div><header class="hud"><div>現在時間｜<span class="time">${time()}</span><br>末班車｜22:30</div><button class="restart" data-gate5-restart>重新開始本關</button></header><div class="scene-title"><b>第二幕</b><span>GATE 5｜規則失控夜</span></div><div class="stage"><div class="paper">${body}</div></div>`;
  const bindRestart = () => app.querySelector('[data-gate5-restart]')?.addEventListener('click', () => {
    window.Gate5Runtime?.removeGate5State?.();
    window.location.reload();
  });
  const continueToScene3 = () => window.Gate5Runtime?.safeTransition('results') || window.location.reload();
  const renderSuccess = () => {
    console.info('[Gate5] Scene2Question success: A');
    app.innerHTML = shell(`<div class="hint"><b>答對了。</b><br>正確答案：A｜${question.answers[question.correctAnswer]}<br>解析：${question.explanation}</div><p class="memory">你記住了一句話：<br>「所以，到底什麼情況才算？」</p><small>法律明確性</small><button class="next" data-scene2-next>繼續前進</button>`);
    bindRestart();
    app.querySelector('[data-scene2-next]')?.addEventListener('click', continueToScene3);
  };
  const renderQuestion = (feedback = '') => {
    console.info('[Gate5] Scene2Question render; correctAnswer = A');
    app.innerHTML = shell(`<h2>${question.title}</h2>${feedback ? `<div class="hint">提示：${feedback}</div>` : ''}<div class="choices">${question.answers.map((answer, index) => `<button class="choice" type="button" data-scene2-answer="${index}"><b>${'ABCD'[index]}</b>${answer}</button>`).join('')}</div>`);
    bindRestart();
    app.querySelectorAll('[data-scene2-answer]').forEach((button) => button.addEventListener('click', () => answer(Number(button.dataset.scene2Answer))));
  };
  const answer = (selectedAnswer) => {
    const attempts = readAttempts();
    const nextCount = Number(attempts.clarity || 0) + 1;
    attempts.clarity = nextCount;
    writeAttempts(attempts);
    if (selectedAnswer === question.correctAnswer) {
      localStorage.setItem('gate5_concept_clarity', 'true');
      return renderSuccess();
    }
    localStorage.setItem('gate5_concept_clarity', 'false');
    const hint = nextCount === 1
      ? question.hint
      : '再想一想：重點是一般人能否事先理解、預見哪些行為可能受到盤查，而不是禁止使用抽象文字。';
    renderQuestion(hint);
  };
  const buttonIndex = (button) => 'ABCD'.indexOf(button.textContent.trim().charAt(0));
  document.addEventListener('click', (event) => {
    if (!isScene2Question()) return;
    const coreButton = event.target.closest('button[data-act^="answer2"]');
    if (!coreButton) return;
    const index = buttonIndex(coreButton);
    if (index < 0) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    answer(index);
  }, true);
  queueMicrotask(() => {
    if (!isScene2Question()) return;
    console.info('[Gate5] Scene2Question mounted; correctAnswer = A');
  });
})();
