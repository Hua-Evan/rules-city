(() => {
  const gates = [...document.querySelectorAll('.gate')];
  const scene = document.querySelector('#scene');
  const finalGate = document.querySelector('#finalGate');
  const progress = document.querySelector('#progress');
  const dialog = document.querySelector('#teacherDialog');
  const dialogTitle = document.querySelector('#teacherDialogTitle');
  const dialogMessage = document.querySelector('#teacherDialogMessage');
  const dialogActions = document.querySelector('#teacherDialogActions');
  const saved = key => { try { return JSON.parse(localStorage.getItem(key) || '{}') } catch { return {} } };
  const previous = [saved('rules-city-level1-final-v1').checkoutCompleted, saved('rules-city-gate2-v5').done, saved('rules-city-gate3-v1').gate3Completed, saved('rules-city-gate4-v1').complete, localStorage.getItem('gate5_complete') === 'true', saved('rules-city-gate6-v1').complete];

  previous.forEach((value, index) => { if (value) localStorage.setItem(`gate${index + 1}Completed`, 'true') });
  const done = () => gates.filter(gate => localStorage.getItem(`gate${gate.dataset.gate}Completed`) === 'true');
  const closeTeacher = () => { dialog.hidden = true; document.body.classList.remove('dialog-open') };
  const showTeacher = ({ title, message, actions }) => {
    dialogTitle.textContent = title;
    dialogMessage.textContent = message;
    dialogActions.replaceChildren();
    actions.forEach(({ label, primary, onClick }) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = primary ? 'teacher-dialog__primary' : 'teacher-dialog__secondary';
      button.textContent = label;
      button.addEventListener('click', onClick);
      dialogActions.appendChild(button);
    });
    dialog.hidden = false;
    document.body.classList.add('dialog-open');
    dialog.querySelector('.teacher-dialog__primary, .teacher-dialog__secondary')?.focus();
  };
  const showUnlockTeacher = () => {
    if (localStorage.getItem('rulesCityFinalIntroSeen') === 'true') return;
    localStorage.setItem('rulesCityFinalIntroSeen', 'true');
    showTeacher({
      title: '恭喜你闖過六關！',
      message: '你已經一路走過權利、制度與憲法的考驗。接下來，還有最後一道關卡：規則終章。準備好把你的理解帶進最終試煉了嗎？',
      actions: [
        { label: '確定闖入最後一關', primary: true, onClick: () => { window.location.href = 'final.html' } },
        { label: '我想先留在大廳', onClick: closeTeacher }
      ]
    });
  };
  const showCompletionTeacher = () => {
    if (localStorage.getItem('rulesCityFinalCelebrationSeen') === 'true') return;
    localStorage.setItem('rulesCityFinalCelebrationSeen', 'true');
    showTeacher({
      title: '你完成規則終章了！',
      message: '恭喜你完成所有挑戰。分數是學習的線索，而你願意思考每一條規則背後的權利、責任與選擇，才是最重要的收穫。',
      actions: [{ label: '謝謝老師，回到大廳', primary: true, onClick: closeTeacher }]
    });
  };
  const openGate = button => {
    button.classList.add('entering');
    setTimeout(() => { window.location.href = button.dataset.href }, 420);
  };
  const unlock = (animate, completed) => {
    finalGate.setAttribute('aria-disabled', 'false');
    finalGate.classList.toggle('done', completed);
    finalGate.setAttribute('aria-label', completed ? 'FINAL GATE｜規則終章，已完成' : 'FINAL GATE｜規則終章，入口已開啟');
    finalGate.querySelector('small').textContent = completed ? '最終試煉完成' : '入口已開啟';
    if (animate) {
      scene.classList.add('unlocking');
      setTimeout(showUnlockTeacher, 5000);
    }
  };
  const render = () => {
    const completedGates = done();
    const finalCompleted = localStorage.getItem('rulesCityFinalCompleted') === 'true';
    gates.forEach(gate => gate.classList.toggle('done', completedGates.includes(gate)));
    progress.textContent = `已踏入 ${completedGates.length} / 6 道規則`;
    if (completedGates.length === 6) {
      const seen = localStorage.getItem('rulesCityFinalUnlocked') === 'true';
      unlock(!seen, finalCompleted);
      localStorage.setItem('rulesCityFinalUnlocked', 'true');
      if (finalCompleted) setTimeout(showCompletionTeacher, 450);
    }
  };

  gates.forEach(gate => gate.addEventListener('click', () => openGate(gate)));
  finalGate.addEventListener('click', () => { if (finalGate.getAttribute('aria-disabled') === 'false') window.location.href = 'final.html' });
  dialog.querySelector('[data-dialog-close="true"]').addEventListener('click', closeTeacher);
  render();
})();
