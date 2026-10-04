/* 尚未對話化的第四幕也在選擇當下回饋時間，下一次點擊才交回既有流程。 */
(() => {
  const costs = { choice30: 1, choice31: 2, choice32: 3 };
  const messages = { choice30: '你先收起通知，繼續趕路。', choice31: '你花時間查看通知的詳細內容。', choice32: '你要求確認政府認定的具體事實。' };
  document.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-act]');
    const minutes = button && costs[button.dataset.act];
    if (!minutes || button.dataset.timeConfirmed) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const clock = document.querySelector('.hud .time');
    const paper = document.querySelector('.paper');
    if (!clock || !paper) return;
    const oldTime = clock.textContent.trim();
    const [hours, mins] = oldTime.split(':').map(Number);
    const total = hours * 60 + mins + minutes;
    const newTime = `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
    clock.textContent = newTime;
    const action = button.dataset.act;
    button.dataset.timeConfirmed = 'true';
    sessionStorage.setItem('gate5_skip_next_time_cost', 'true');
    paper.className = 'paper rpg-dialogue';
    paper.innerHTML = `<div class="rpg-dialogue__stage">第四幕｜三萬元裁罰通知</div><div class="rpg-dialogue__action rpg-result"><b>系統</b><p>${messages[action]}</p><strong>本次行動花費 ${minutes} 分鐘</strong><small>現在時間｜${newTime}</small><button class="rpg-dialogue__next" data-continue-time>繼續</button></div>`;
    paper.querySelector('[data-continue-time]').addEventListener('click', () => button.click());
  }, true);
})();
