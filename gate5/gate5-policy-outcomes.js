/* 第三幕：先由玩家選方案，再依原始選擇播放三個現場後果。 */
(() => {
  const app = document.getElementById('app');
  const outcomes = {
    A: { title: '方案 A｜全面安檢', quote: '連私人訊息也要看嗎？', text: '治安事件明顯下降，但通行速度變慢，所有人都受到高度檢查。' },
    B: { title: '方案 B｜重點盤查', quote: '大部分人照常通過，警方只攔下少數具體異常者。', text: '通行較順，治安改善幅度接近全面安檢，但仍有少數漏網風險。' },
    C: { title: '方案 C｜加強一般巡邏', quote: '街上警力變多了，但大家還是照常走路。', text: '一般路人幾乎不受額外干預，但治安改善幅度低於另外兩種方案。' },
  };
  const orderFor = (original) => {
    const plan = outcomes[original] ? original : 'A';
    const plans = ['A', 'B', 'C'];
    const index = plans.indexOf(plan);
    return plans.slice(index).concat(plans.slice(0, index));
  };
  const timeHtml = () => document.querySelector('.hud')?.innerHTML || document.querySelector('.policy-outcome__hud')?.innerHTML || '現在時間｜21:40<br>末班車｜22:30';
  const setPlan = (key, value) => localStorage.setItem(`gate5_${key}_plan`, value);
  const getPlan = (key) => localStorage.getItem(`gate5_${key}_plan`);

  const renderOutcome = (order, index) => {
    const safeOrder = Array.isArray(order) && order.length === 3 ? order : orderFor(getPlan('original'));
    const safeIndex = Math.max(0, Math.min(safeOrder.length - 1, Number(index) || 0));
    const key = safeOrder[safeIndex];
    const item = outcomes[key];
    const isLast = safeIndex === safeOrder.length - 1;
    app.innerHTML = `<section class="policy-outcome" data-policy="${key}"><header class="policy-outcome__hud">${timeHtml()}</header><div class="policy-outcome__body"><div class="policy-outcome__label">${item.title}｜現場結果</div><div class="policy-outcome__panel"><div class="policy-outcome__quote">${key === 'A' ? '【路人】' : ''}「${item.quote}」</div><p>${item.text}</p><button type="button" class="policy-outcome__next">${isLast ? '比較三種結果' : '查看下一個結果'}</button></div></div></section>`;
    app.querySelector('.policy-outcome__next')?.addEventListener('click', () => {
      if (isLast) return renderDecision(getPlan('original') || safeOrder[0]);
      renderOutcome(safeOrder, safeIndex + 1);
    });
  };

  const renderDecision = (original) => {
    const alternatives = ['A', 'B', 'C'].filter((plan) => plan !== original);
    app.innerHTML = `<section class="policy-outcome" data-policy="${original}"><header class="policy-outcome__hud">${timeHtml()}</header><div class="policy-outcome__body"><div class="policy-outcome__label">三種方案比較</div><div class="policy-outcome__panel"><p>看完三種結果後，你要維持原本的選擇嗎？</p><div class="policy-compare"><div><b>方案 A</b><br>治安效果：高<br>通行影響：高</div><div><b>方案 B</b><br>治安效果：中高<br>通行影響：中</div><div><b>方案 C</b><br>治安效果：中<br>通行影響：低</div></div><div class="policy-choices"><button type="button" data-choice="${original}">維持原選擇｜方案 ${original}</button>${alternatives.map((plan) => `<button type="button" data-choice="${plan}">改選 ${plan}</button>`).join('')}</div></div></div></section>`;
    app.querySelectorAll('[data-choice]').forEach((button) => button.addEventListener('click', () => {
      const finalPlan = button.dataset.choice;
      setPlan('final', finalPlan);
      // Retain the historic key only for existing restore data; final_plan is authoritative.
      localStorage.setItem('gate5_policy_choice', finalPlan);
      window.Gate5Runtime?.safeTransition('quiz3') || window.location.reload();
    }));
  };

  const normalizeIntro = () => {
    const heading = app.querySelector('.scene-title b');
    const paper = app.querySelector('.paper');
    if (!heading || !paper || heading.textContent.trim() !== '第三幕｜三種治安方案') return;
    const intro = paper.querySelector('p');
    if (intro && intro.textContent.trim() !== '現場正在評估三種不同的管制方式。') intro.textContent = '現場正在評估三種不同的管制方式。';
    let prompt = paper.querySelector('[data-policy-prompt]');
    if (!prompt) {
      prompt = document.createElement('p');
      prompt.dataset.policyPrompt = 'true';
      prompt.textContent = '如果先由你決定，你會選哪一種？';
      paper.querySelector('.choices')?.before(prompt);
    }
    const labels = ['A｜全面安檢', 'B｜針對具體異常者盤查', 'C｜增加街上警力、少直接干預'];
    paper.querySelectorAll('button[data-act^="policy"]').forEach((button, index) => {
      const label = `<b>${labels[index].slice(0, 1)}｜</b>${labels[index].slice(2)}`;
      if (button.innerHTML !== label) button.innerHTML = label;
    });
  };

  document.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-act^="policy"]');
    if (!button) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const original = button.dataset.act.slice(-1);
    setPlan('original', outcomes[original] ? original : 'A');
    localStorage.removeItem('gate5_final_plan');
    renderOutcome(orderFor(original), 0);
  }, true);

  new MutationObserver(normalizeIntro).observe(app, { childList: true, subtree: true });
  normalizeIntro();
})();
