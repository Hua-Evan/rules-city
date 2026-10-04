/* Content-only compatibility fixes for the static core renderer. */
(() => {
  const app = document.getElementById('app');
  const answers = {
    quiz1: ['被查看手機後能不能提出救濟', '「治安事件」適用範圍清不清楚', '有沒有法律或法律授權作為依據', '查看手機對治安有沒有實際效果'],
    quiz2: ['人民難以預先判斷自己何時可能被盤查', '警方完全不能使用「行跡可疑」這種文字', '只要有法律依據，執法標準不同也沒關係', '只要盤查時間不長，就不會有基本權問題'],
    quiz3: ['被盤查者事後能不能提出救濟', '「具體異常行為」是否有明確標準', '全面安檢是否具有法律依據', '各方案對隱私、行動自由等權利影響多大'],
    quiz4: ['讓當事人知道具體理由，並有適當機會說明及尋求救濟', '再確認處罰金額是否與治安目的相稱', '重新確認「拒絕配合」的意思是否清楚', '先確認這項裁罰是否具有法律依據'],
  };

  const enrichRevealedAnswer = () => {
    const scene = localStorage.getItem('gate5_current_scene');
    const choices = answers[scene];
    if (!choices) return;
    app.querySelectorAll('.hint').forEach((hint) => {
      const match = hint.innerHTML.match(/^正確答案：([ABCD])(?:<br>|\n)/);
      if (!match || hint.dataset.answerExpanded === 'true') return;
      const index = 'ABCD'.indexOf(match[1]);
      if (index < 0) return;
      hint.dataset.answerExpanded = 'true';
      hint.innerHTML = hint.innerHTML.replace(`正確答案：${match[1]}`, `正確答案：${match[1]}｜${choices[index]}`);
    });
  };

  const renderComplete = () => {
    localStorage.setItem('gate5_complete', 'true');
    app.innerHTML = '<div class="street"></div><div class="complete"><div class="paper"><h1>GATE 5 COMPLETE</h1><p>你完成了今晚的判斷與返家路程。</p><div class="gate5-complete-actions"><button class="next" type="button" data-gate5-complete-close>任務完成｜關閉此頁</button><button class="next" type="button" data-gate5-complete-restart>重新挑戰本關</button></div><p class="gate5-close-note" data-gate5-close-note hidden aria-live="polite">任務已完成，可以關閉這個頁面。</p></div></div>';
    app.querySelector('[data-gate5-complete-close]')?.addEventListener('click', () => {
      window.close();
      window.setTimeout(() => {
        if (!window.closed) app.querySelector('[data-gate5-close-note]')?.removeAttribute('hidden');
      }, 180);
    });
    app.querySelector('[data-gate5-complete-restart]')?.addEventListener('click', () => {
      window.Gate5Runtime?.removeGate5State?.();
      window.location.reload();
    });
  };

  const normalizeEnding = () => {
    const button = app.querySelector('.paper.book button[data-act="final"]');
    if (!button) return;
    if (button.textContent.trim() !== '完成本關') button.textContent = '完成本關';
    button.dataset.act = 'gate5-complete';
  };

  document.addEventListener('click', (event) => {
    const complete = event.target.closest('button[data-act="gate5-complete"]');
    if (!complete) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    renderComplete();
  }, true);

  const update = () => {
    enrichRevealedAnswer();
    normalizeEnding();
  };
  new MutationObserver(update).observe(app, { childList: true, subtree: true });
  update();
})();
