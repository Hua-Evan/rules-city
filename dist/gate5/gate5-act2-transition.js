/* 第一幕完成後的可靠轉場：避免 next2 舊路由或殘留視覺層阻斷點擊。 */
(() => {
  const app = document.getElementById('app');
  document.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-act="next2"]');
    if (!button) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    app.dataset.gate5Scene = 'control';
    const stage = app.querySelector('.stage');
    if (!stage) return window.Gate5Runtime?.safeTransition('act2') || window.location.reload();
    stage.classList.add('gate5-act2-leave');
    stage.innerHTML = `<div class="gate5-act2-transition"><span>離開霧川站後，你改從中央街往前走。</span><b>第二幕｜中央街管制區</b></div>`;
    setTimeout(() => window.Gate5Runtime?.safeTransition('act2') || window.location.reload(), 620);
  }, true);
})();
