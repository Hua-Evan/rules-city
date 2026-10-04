/* Gate 5 開場／第一幕轉場的相容性修正：使用 click，桌機與觸控皆適用。 */
(() => {
  const updateOpening = () => {
    const paper = document.querySelector('.paper');
    // 原程式已處理 intro → act1；將遺漏的 act1 路由改接到既有轉場。
    // onclick 會接收桌機滑鼠與手機觸控所產生的標準 click 事件。
    const stationButton = document.querySelector('button[data-act="act1"]');
    if (stationButton) stationButton.dataset.act = 'intro';
    if (!paper || !paper.querySelector('h1') || !paper.textContent.includes('康安高中放學後')) return;

    [...paper.querySelectorAll('p')].forEach((node) => {
      if (node.textContent.includes('康安高中放學後')) {
        node.textContent = '補習結束後，你走在剛下過雨的霧川商圈。';
      }
      if (node.textContent.includes('末班車｜22:30') && !paper.querySelector('.deadline-note')) {
        const deadline = document.createElement('p');
        deadline.className = 'deadline-note';
        deadline.textContent = '你最晚一定要趕上這班末班車。';
        node.after(deadline);
      }
    });
    [...paper.querySelectorAll('.chat')].forEach((node) => {
      if (node.textContent.includes('家人：今天附近')) {
        node.textContent = '家人：補習結束了嗎？今天附近好像有事情，早點回家。';
      }
    });
    [...paper.querySelectorAll('small')].forEach((node) => {
      if (node.textContent.includes('有些選擇，會讓今晚花掉更多時間')) {
        node.textContent = '有些選擇會花掉更多時間；如果錯過末班車，本關就會失敗。';
      }
    });
  };

  new MutationObserver(updateOpening).observe(document.getElementById('app'), { childList: true, subtree: true });
  updateOpening();
})();
