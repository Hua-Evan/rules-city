/* file:// 啟動前清理舊版／損毀的 Gate 5 測試狀態，避免核心載入失敗。 */
(() => {
  try {
    if (window.Gate5Runtime) { window.Gate5Runtime.boot(); return; }
    const valid = new Set(['start','intro','act1','act2','quiz1','quiz2','quiz3','quiz4','results','policyresults','proportion','fine','summary','final']);
    const scene = localStorage.getItem('gate5_current_scene');
    // Old experimental scene names are never resumed: they safely restart at the intro.
    if (scene !== null && !valid.has(scene)) localStorage.setItem('gate5_current_scene', 'start');
    const time = Number(localStorage.getItem('gate5_game_time'));
    if (localStorage.getItem('gate5_game_time') !== null && (!Number.isFinite(time) || time < 0)) localStorage.setItem('gate5_game_time', '1300');
    const attempts = localStorage.getItem('gate5_attempts');
    if (attempts !== null) { try { JSON.parse(attempts); } catch { localStorage.setItem('gate5_attempts', '{}'); } }
  } catch (error) {
    console.error('Gate 5 state preflight error:', error);
    window.gate5ShowFallback?.('無法讀取本機測試進度，請重新開始本關。');
  }
})();
