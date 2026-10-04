/* Keep the second legal question in sync with the reordered Central Street scene. */
(() => {
  const app = document.getElementById('app');
  const question = '這種情況最可能造成什麼問題？';
  const choices = [
    '人民難以預先判斷自己何時可能被盤查',
    '警方完全不能使用「行跡可疑」這種文字',
    '只要有法律依據，執法標準不同也沒關係',
    '只要盤查時間不長，就不會有基本權問題',
  ];
  const updateQuestion = () => {
    app.querySelectorAll('.paper h2').forEach((heading) => {
      if (heading.textContent.trim() === '從目前情況來看，最需要確認的是什麼？' || heading.textContent.trim() === question) {
        const isScene2Question = localStorage.getItem('gate5_current_scene') === 'quiz2';
        // This observer also sees its own DOM writes.  Never write the same
        // question markup again: doing so creates a self-sustaining mutation
        // loop that monopolises the browser main thread.
        if (isScene2Question && heading.dataset.gate5Scene2Rendered !== 'true') {
          heading.dataset.gate5Scene2Rendered = 'true';
          console.info('[Gate5] Scene2Question render');
        }
        if (isScene2Question && heading.dataset.gate5Scene2Mounted !== 'true') {
          heading.dataset.gate5Scene2Mounted = 'true';
          console.info('[Gate5] Scene2Question mounted');
        }
        if (heading.textContent.trim() !== question) heading.textContent = question;
        const buttons = [...heading.parentElement.querySelectorAll('button[data-act^="answer2"]')];
        buttons.forEach((button, index) => {
          const label = `<b>${'ABCD'[index]}</b>${choices[index]}`;
          if (button.innerHTML !== label) button.innerHTML = label;
          // Scene 2's dedicated question controller uses the visible A/B/C/D index.
          const action = `answer2${index}`;
          if (button.dataset.act !== action) button.dataset.act = action;
        });
      }
    });
  };
  document.addEventListener('click', (event) => {
    const next = event.target.closest('button[data-act="next3"]');
    if (!next) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const stage = app.querySelector('.stage');
    if (!stage) return;
    app.dataset.gate5Scene = 'market-transition';
    stage.innerHTML = '<div class="gate5-act2-transition"><span>離開中央街管制區後，你繼續往霧川站方向走。</span><b>霧川商圈主要入口</b></div>';
    setTimeout(() => window.Gate5Runtime?.safeTransition('results') || window.location.reload(), 680);
  }, true);
  const updateThirdAct = () => {
    const heading = app.querySelector('.scene-title b');
    const paper = app.querySelector('.paper');
    if (!heading || !paper || heading.textContent.trim() !== '第三幕｜三種治安方案') return;
    const first = paper.querySelector('p');
    if (first && !first.dataset.marketCopy) {
      first.dataset.marketCopy = 'true';
      first.innerHTML = '現場正在評估三種不同的管制方式。<br>你想先看看哪一種做法會帶來什麼結果？<small>以下效果數據為遊戲情境設定。</small>';
    }
  };
  new MutationObserver(() => { updateQuestion(); updateThirdAct(); }).observe(app, { childList:true, subtree:true });
  updateQuestion();
  updateThirdAct();
})();
