/* Gate 5 stability runtime: one registry, versioned storage, and safe scene recovery. */
(() => {
  const VERSION = 5;
  const DEBUG = new URLSearchParams(window.location.search).has('gate5debug');
  const SCENES = Object.freeze({
    INTRO: 'start', SCENE1_ENTRY: 'intro', SCENE1_DIALOGUE: 'act1', SCENE1_QUESTION: 'quiz1', SCENE1_RESULT: 'act1_result',
    SCENE2_INTRO: 'act2', SCENE2_DIALOGUE: 'act2', SCENE2_QUESTION: 'quiz2', SCENE2_RESULT: 'act2_result',
    SCENE3_INTRO: 'results', SCENE3_CHOICE: 'results', SCENE3_RESULT_A: 'policyresults', SCENE3_RESULT_B: 'policyresults', SCENE3_RESULT_C: 'policyresults', SCENE3_RESELECT: 'policyresults', SCENE3_QUESTION: 'quiz3', SCENE3_PROPORTIONALITY: 'proportion',
    SCENE4_INTRO: 'fine', SCENE4_DIALOGUE: 'fine', SCENE4_QUESTION: 'quiz4',
    RUNNER_INTRO: 'runner_intro', RUNNER: 'runner', RUNNER_SUCCESS: 'runner_success', RUNNER_FAIL: 'runner_fail',
    UNLOCK: 'summary', SUMMARY: 'summary', COMPLETE: 'complete',
  });
  const coreScenes = new Set(['start','intro','act1','act2','quiz1','quiz2','quiz3','quiz4','results','policyresults','proportion','fine','summary','final']);
  const transientScenes = new Set(['runner','runner_intro','runner_success','runner_fail','act1_result','act2_result']);
  const valid = new Set([...coreScenes, ...transientScenes]);
  const STORAGE_PREFIX = 'gate5_';
  let transitionLock = false;

  const removeGate5State = () => {
    try {
      for (let i = localStorage.length - 1; i >= 0; i -= 1) {
        const key = localStorage.key(i);
        if (key?.startsWith(STORAGE_PREFIX)) localStorage.removeItem(key);
      }
    } catch (error) { console.warn('[Gate5] state clear failed:', error); }
  };
  const cleanTransient = () => {
    ['gate5_dialogue_step','gate5_choice_step','gate5_result_index','gate5_result_order','gate5_runner_state'].forEach((key) => localStorage.removeItem(key));
  };
  const normalize = (scene) => valid.has(scene) && coreScenes.has(scene) ? scene : SCENES.INTRO;
  const validateScene = (scene) => {
    if (!valid.has(scene) || !coreScenes.has(scene)) {
      console.warn('[Gate5] Invalid scene recovered:', scene);
      return SCENES.INTRO;
    }
    return scene;
  };
  const boot = () => {
    try {
      const storedVersion = Number(localStorage.getItem('gate5_state_version'));
      if (storedVersion !== VERSION) {
        console.warn('[Gate5] state version reset:', storedVersion, '->', VERSION);
        removeGate5State();
        localStorage.setItem('gate5_state_version', String(VERSION));
        localStorage.setItem('gate5_current_scene', SCENES.INTRO);
        return SCENES.INTRO;
      }
      const scene = validateScene(localStorage.getItem('gate5_current_scene') || SCENES.INTRO);
      localStorage.setItem('gate5_current_scene', scene);
      const time = Number(localStorage.getItem('gate5_game_time'));
      if (!Number.isFinite(time) || time < 0 || time > 1440) localStorage.setItem('gate5_game_time', '1300');
      try { JSON.parse(localStorage.getItem('gate5_attempts') || '{}'); } catch { localStorage.setItem('gate5_attempts', '{}'); }
      if (DEBUG) console.info('[Gate5] restore state:', scene);
      return scene;
    } catch (error) {
      console.error('[Gate5] state restore failed:', error);
      window.gate5ShowFallback?.('關卡狀態無法安全還原，請重新開始本關。');
      return SCENES.INTRO;
    }
  };
  const clearOverlays = () => {
    document.querySelectorAll('.gate5-transition-mask,.gate5-dialogue-blocker,[data-gate5-overlay]').forEach((node) => node.remove());
    document.querySelectorAll('.rpg-dialogue__next,.rpg-dialogue__choices').forEach((node) => node.style.pointerEvents = 'auto');
    if (DEBUG) console.info('[Gate5] overlays cleared');
  };
  const safeTransition = (nextScene, { reload = true } = {}) => {
    try {
      const scene = validateScene(nextScene);
      const previous = localStorage.getItem('gate5_current_scene');
      const label = scene === SCENES.SCENE2_QUESTION ? 'scene2_question' : scene;
      if (scene === SCENES.SCENE2_QUESTION) {
        console.info('[Gate5] safeTransition called');
        console.info('[Gate5] target = scene2_question');
        console.info('[Gate5] target valid = true');
        console.info('[Gate5] currentScene before =', previous || SCENES.INTRO);
      }
      if (transitionLock) {
        console.warn('[Gate5] transition ignored while another transition is settling');
        return previous || SCENES.INTRO;
      }
      transitionLock = true;
      // A failed navigation must never leave visible controls permanently locked.
      window.setTimeout(() => { transitionLock = false; }, 500);
      cleanTransient();
      clearOverlays();
      localStorage.setItem('gate5_state_version', String(VERSION));
      localStorage.setItem('gate5_current_scene', scene);
      console.info('[Gate5] transition:', previous, '->', scene);
      if (scene === SCENES.SCENE2_QUESTION) {
        console.info('[Gate5] currentScene after =', localStorage.getItem('gate5_current_scene'));
        console.info('[Gate5] renderer = Scene2Question');
        console.info('[Gate5] TRANSITION OK:', label);
      }
      if (reload) window.location.reload();
      return scene;
    } catch (error) {
      console.error('[Gate5] transition failed:', error);
      window.gate5ShowFallback?.('場景轉換失敗，請重新開始本關。');
      return SCENES.INTRO;
    }
  };
  const bindSafeButton = (button, id, callback) => {
    if (!button) return;
    button.classList.add('gate5-safe-button');
    button.disabled = false;
    button.style.pointerEvents = 'auto';
    button.style.position = 'relative';
    button.style.zIndex = '10';
    button.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (button.disabled || transitionLock) {
        console.warn('[Gate5] SAFE_BUTTON blocked:', id, { disabled: button.disabled, transitionLock });
        return;
      }
      try { callback(); }
      catch (error) {
        console.error('[Gate5] safe button failed:', id, error);
        window.gate5ShowFallback?.('按鈕操作失敗，請重新開始本關。');
      }
    }, { once: true });
  };
  const enterScene2Question = (button) => {
    const target = SCENES.SCENE2_QUESTION;
    bindSafeButton(button, 'scene2-enter-judgment', () => {
      console.info('[Gate5] CLICK enter-judgment');
      console.info('[Gate5] SAFE_BUTTON fired');
      safeTransition(target);
    });
  };
  const safeDialogueNext = (id, callback) => {
    try {
      if (DEBUG) console.info('[Gate5] CLICK:', id);
      callback?.();
      if (DEBUG) console.info('[Gate5] DIALOGUE NEXT OK:', id);
    } catch (error) {
      console.error('[Gate5] DIALOGUE NEXT BLOCKED:', id, error);
      window.gate5ShowFallback?.('對話流程無法繼續，請重新開始本關。');
    }
  };
  const safeResultNext = (id, callback) => safeDialogueNext(`result:${id}`, callback);
  window.GATE5_SCENES = SCENES;
  window.Gate5Runtime = Object.freeze({ VERSION, DEBUG, SCENES, boot, safeTransition, safeDialogueNext, safeResultNext, validateScene, removeGate5State, clearOverlays, bindSafeButton, enterScene2Question, get transitionLocked() { return transitionLock; }, buildResultOrder(selected) { const plans = ['A','B','C']; return plans.includes(selected) ? [selected, ...plans.filter((plan) => plan !== selected)] : plans; } });
})();
