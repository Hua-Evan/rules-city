/* Standalone file:// safety net: a script or state failure must never leave a blank page. */
(() => {
  const app = document.getElementById('app');
  let shown = false;

  const clearGate5State = () => {
    try {
      for (let i = localStorage.length - 1; i >= 0; i -= 1) {
        const key = localStorage.key(i);
        if (key && key.startsWith('gate5_')) localStorage.removeItem(key);
      }
    } catch (_) { /* Storage can be unavailable in a restrictive file:// browser. */ }
  };

  const showFallback = (reason) => {
    if (!app || shown) return;
    shown = true;
    app.innerHTML = `<section class="gate5-safe-fallback" role="alert"><div><p>GATE 5｜規則失控夜</p><h1>關卡發生載入錯誤。</h1><p>請重新開始本關；Gate 5 state 已保護，其他關卡不受影響。</p><button type="button" data-gate5-restart>重新開始本關</button><small>${reason || '系統已安全停止這次場景載入。'}</small></div></section>`;
    app.querySelector('[data-gate5-restart]')?.addEventListener('click', () => {
      clearGate5State();
      window.location.reload();
    });
  };

  // Exposed for the startup preflight and for future scene guards.
  window.gate5ShowFallback = showFallback;

  window.addEventListener('error', (event) => {
    // A missing optional image must not replace an otherwise usable scene.
    if (event.target && event.target !== window && !event.error) {
      console.warn('Gate 5 optional asset failed to load:', event.target);
      return;
    }
    console.error('Gate 5 startup error:', event.error || event.message);
    showFallback('發現場景或資料錯誤，請重新開始本關。');
  });
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Gate 5 unhandled promise:', event.reason);
    showFallback('場景資料無法安全完成載入，請重新開始本關。');
  });

  // If a future synchronous script fails before it can render, still provide a usable page.
  window.setTimeout(() => {
    if (!shown && app && !app.children.length) showFallback('遊戲介面未能完成啟動，請重新開始本關。');
  }, 500);
})();
