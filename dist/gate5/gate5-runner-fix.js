/* Gate 5 runner: a single-path, single-jump game. */
(() => {
  const app = document.getElementById('app');
  const DEBUG = new URLSearchParams(window.location.search).has('gate5debug');
  let active = null;

  const clearRunner = (state) => {
    if (!state) return;
    cancelAnimationFrame(state.frame);
    clearTimeout(state.obstacleTimer);
    clearTimeout(state.startTimer);
    document.removeEventListener('keydown', state.keydown);
    state.obstacles.forEach((obstacle) => obstacle.remove());
    state.obstacles.clear();
  };

  const renderFinish = (state, won, reason = 'collision') => {
    if (!state || state.finished) return;
    state.finished = true;
    clearRunner(state);
    if (active === state) active = null;
    app.replaceChildren();
    const result = document.createElement('section');
    result.className = 'auto-runner auto-runner--finish';
    result.innerHTML = won
      ? '<div class="auto-runner__finish-card"><h1>GATE 5 CLEAR</h1><p>你衝進月台，列車車門正好還開著。</p><button type="button" data-run-finish>查看今晚的判斷方式</button></div>'
      : `<div class="auto-runner__finish-card"><h1>沒能及時趕上末班車</h1><p>${reason === 'time' ? '你趕到月台時，末班車已經離站。' : '你被障礙絆住，沒能及時趕上末班車。'}</p><div class="auto-runner__fail-actions"><button type="button" data-run-retry>再試一次趕車</button><button type="button" data-run-end>結束本關</button></div></div>`;
    app.append(result);
    result.querySelector('[data-run-finish]')?.addEventListener('click', () => {
      window.Gate5Runtime?.safeTransition('summary') || window.location.reload();
    });
    result.querySelector('[data-run-retry]')?.addEventListener('click', () => startRunner());
    result.querySelector('[data-run-end]')?.addEventListener('click', () => {
      window.Gate5Runtime?.safeTransition('summary') || window.location.reload();
    });
  };

  const startRunner = () => {
    if (active) return;
    const state = {
      distance: 380,
      seconds: 20,
      started: false,
      finished: false,
      jumpStartedAt: -Infinity,
      jumpY: 0,
      maxJumpY: 120,
      jumpDuration: 780,
      playerGroundRect: null,
      lastCollision: false,
      jumpPeakLogged: false,
      jumpLandedLogged: true,
      last: performance.now(),
      startedAt: 0,
      frame: 0,
      startTimer: 0,
      obstacleTimer: 0,
      spawnCount: 0,
      obstacles: new Set(),
      keydown: null,
    };
    active = state;
    console.info('[Gate5] single-jump runner mounted; active RAF = 1');
    app.innerHTML = `<section class="auto-runner${DEBUG ? ' is-debug' : ''}" aria-label="前往月台跑酷"><div class="auto-runner__world"><div class="auto-runner__lights"></div><div class="auto-runner__floor"></div><div class="auto-runner__platform">霧川站　月台方向 →</div></div><header class="auto-runner__hud"><b>距離月台：<span data-distance>380</span> 公尺</b><b>末班車倒數：<span data-count>20.0</span> 秒</b></header><div class="auto-runner__player" aria-label="正在奔跑的學生">🏃${DEBUG ? '<i class="runner-debug-hitbox runner-debug-player" aria-hidden="true"></i>' : ''}</div>${DEBUG ? '<output class="runner-debug-readout" aria-live="off"></output>' : ''}<p class="auto-runner__hint">↑ 或 Space 跳躍<br><small>手機：點一下跳躍</small></p></section>`;
    const root = app.querySelector('.auto-runner');
    const player = root.querySelector('.auto-runner__player');
    const distanceNode = root.querySelector('[data-distance]');
    const countNode = root.querySelector('[data-count]');
    const debugNode = root.querySelector('.runner-debug-readout');
    // All visual types share the already-calibrated AABB collision system.
    const obstacleTypes = [
      { name: '小型三角錐', sprite: 0 }, { name: '水窪', sprite: 1 },
      { name: '倒下的腳踏車', sprite: 2 }, { name: '行李箱', sprite: 3 },
      { name: '小型施工牌', sprite: 4 }, { name: '清潔推車', sprite: 5 },
    ];
    state.playerGroundRect = player.getBoundingClientRect();

    const jump = () => {
      const now = performance.now();
      if (!state.started || state.finished || now - state.jumpStartedAt < state.jumpDuration) return;
      state.jumpStartedAt = now;
      state.jumpPeakLogged = false;
      state.jumpLandedLogged = false;
      if (DEBUG) console.info('[Gate5][debug] jump started');
    };
    const spawnObstacle = () => {
      if (state.finished || state.spawnCount >= 12) return;
      const type = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
      const elapsed = (performance.now() - state.startedAt) / 1000;
      // A cone must clear the player's X range well before a normal 780ms
      // jump lands. 1.85s covers the whole route; the local crossing is ~.25s.
      const duration = Math.max(1.55, 1.85 - elapsed * 0.02);
      const obstacle = document.createElement('div');
      obstacle.className = `auto-runner__obstacle type-${type.sprite}`;
      obstacle.setAttribute('aria-label', type.name);
      obstacle.style.setProperty('--obstacle-duration', `${duration}s`);
      if (DEBUG) obstacle.insertAdjacentHTML('beforeend', '<i class="runner-debug-hitbox runner-debug-obstacle" aria-hidden="true"></i>');
      root.append(obstacle);
      state.obstacles.add(obstacle);
      state.spawnCount += 1;
      if (DEBUG) console.info(`[Gate5][debug] obstacle ${state.spawnCount}/12: ${type.name} at ${elapsed.toFixed(1)}s`);
      obstacle.addEventListener('animationend', () => {
        obstacle.remove();
        state.obstacles.delete(obstacle);
      }, { once: true });
      // Front loose → middle denser → final sprint. These are spacing values,
      // not movement speed; a newly spawned obstacle always starts at the far right.
      const delay = elapsed < 5
        ? 1600 + Math.random() * 600
        : elapsed < 12
          ? 1200 + Math.random() * 500
          : 800 + Math.random() * 500;
      if (state.spawnCount < 12) state.obstacleTimer = window.setTimeout(spawnObstacle, delay);
    };
    const hitbox = (rect, { left, top, width, height }) => ({
      left: rect.left + rect.width * left,
      top: rect.top + rect.height * top,
      width: rect.width * width,
      height: rect.height * height,
      get right() { return this.left + this.width; },
      get bottom() { return this.top + this.height; },
    });
    const overlaps = (playerBox, obstacleBox) => (
      playerBox.left < obstacleBox.right && playerBox.right > obstacleBox.left
      && playerBox.top < obstacleBox.bottom && playerBox.bottom > obstacleBox.top
    );
    const makePlayerBox = (jumpY) => hitbox({
      left: state.playerGroundRect.left,
      top: state.playerGroundRect.top - jumpY,
      width: state.playerGroundRect.width,
      height: state.playerGroundRect.height,
    }, { left: .24, top: .22, width: .52, height: .72 });
    if (DEBUG) {
      // A deterministic cone check using the same AABB function as the game.
      // Its X coordinates overlap; only the Y value changes across the tests.
      const rootRect = root.getBoundingClientRect();
      const coneRect = {
        left: state.playerGroundRect.left + state.playerGroundRect.width * .3,
        top: rootRect.bottom - rootRect.height * .23 - 74,
        width: 92,
        height: 74,
      };
      const coneBox = hitbox(coneRect, { left: .22, top: .31, width: .56, height: .58 });
      state.debugChecks = {
        noJump: overlaps(makePlayerBox(0), coneBox),
        normalJump: overlaps(makePlayerBox(state.maxJumpY), coneBox),
        lateJump: overlaps(makePlayerBox(20), coneBox),
        coneBox,
      };
      // The cone's final approach covers 55% of the route in 45% of 1.85s.
      // Run the exact AABB formula across timing samples, not a visual guess.
      const coneSpeed = rootRect.width * .55 / (.45 * 1.85);
      const testJump = (distance, jumpAt = 0) => {
        for (let t = 0; t <= 1.2; t += .004) {
          const jumpProgress = (t - jumpAt) / state.jumpDuration * 1000;
          const jumpY = jumpProgress > 0 && jumpProgress < 1
            ? Math.sin(Math.PI * jumpProgress) * state.maxJumpY : 0;
          const movingCone = { ...coneBox, left: makePlayerBox(0).right + distance - coneSpeed * t };
          const coneAtTime = { ...movingCone, right: movingCone.left + movingCone.width };
          if (overlaps(makePlayerBox(jumpY), coneAtTime)) return true;
        }
        return false;
      };
      const normalSamples = Array.from({ length: 20 }, (_, index) => 90 + index * (70 / 19));
      const noJumpSamples = [90, 108, 125, 142, 160];
      const lateSamples = [0, 5, 10, 15, 20];
      state.debugChecks.timing = {
        speed: coneSpeed,
        crossing: (makePlayerBox(0).width + coneBox.width) / coneSpeed,
        normalPasses: normalSamples.filter((distance) => !testJump(distance)).length,
        noJumpHits: noJumpSamples.filter((distance) => testJump(distance, Number.POSITIVE_INFINITY)).length,
        lateHits: lateSamples.filter((distance) => testJump(distance)).length,
      };
      console.info('[Gate5][debug] cone AABB checks', JSON.stringify({
        noJump: state.debugChecks.noJump,
        normalJump: state.debugChecks.normalJump,
        lateJump: state.debugChecks.lateJump,
        playerGroundTop: makePlayerBox(0).top,
        playerGroundBottom: makePlayerBox(0).bottom,
        playerPeakBottom: makePlayerBox(state.maxJumpY).bottom,
        coneTop: coneBox.top,
        timing: state.debugChecks.timing,
      }));
    }
    const updateJump = (now) => {
      const elapsed = now - state.jumpStartedAt;
      const progress = elapsed / state.jumpDuration;
      state.jumpY = progress > 0 && progress < 1
        ? Math.sin(Math.PI * progress) * state.maxJumpY
        : 0;
      player.style.transform = `translateY(${-state.jumpY}px) scaleX(-1)`;
      if (DEBUG && progress >= .5 && !state.jumpPeakLogged && progress < 1) {
        state.jumpPeakLogged = true;
        console.info('[Gate5][debug] player at peak');
      }
      if (DEBUG && progress >= 1 && !state.jumpLandedLogged) {
        state.jumpLandedLogged = true;
        console.info('[Gate5][debug] player landed');
      }
    };
    const playerHitObstacle = () => {
      // Do not infer jumping from a CSS class. The exact jumpY that paints the
      // player above is subtracted here every frame before AABB is evaluated.
      const playerBox = makePlayerBox(state.jumpY);
      let firstObstacleBox = null;
      const collided = [...state.obstacles].some((obstacle) => {
        if (!obstacle.isConnected) return false;
        const rect = obstacle.getBoundingClientRect();
        // Obstacle: its visible lower object (56% × 58%), not the complete
        // sprite-sheet cell or any transparent margin around it.
        const obstacleBox = hitbox(rect, { left: .22, top: .31, width: .56, height: .58 });
        firstObstacleBox ||= obstacleBox;
        const xOverlaps = playerBox.left < obstacleBox.right && playerBox.right > obstacleBox.left;
        if (DEBUG && xOverlaps && obstacle.dataset.xRange !== 'entered') {
          obstacle.dataset.xRange = 'entered';
          console.info('[Gate5][debug] obstacle enters player X range');
        }
        if (DEBUG && obstacle.dataset.xRange === 'entered' && obstacleBox.right <= playerBox.left) {
          obstacle.dataset.xRange = 'left';
          console.info('[Gate5][debug] obstacle leaves player X range');
        }
        // Standard AABB: both horizontal AND vertical overlap are required.
        return xOverlaps && playerBox.top < obstacleBox.bottom && playerBox.bottom > obstacleBox.top;
      });
      state.lastCollision = collided;
      if (DEBUG && debugNode) {
        const fmt = (value) => Number(value).toFixed(1);
        const checks = state.debugChecks;
        debugNode.textContent = `jumpY ${fmt(state.jumpY)} | player top/bottom ${fmt(playerBox.top)} / ${fmt(playerBox.bottom)} | obstacle top/bottom ${firstObstacleBox ? `${fmt(firstObstacleBox.top)} / ${fmt(firstObstacleBox.bottom)}` : '—'} | collided ${collided}\ncone: peak bottom ${fmt(makePlayerBox(state.maxJumpY).bottom)} < top ${fmt(checks.coneBox.top)} | crossing ${fmt(checks.timing.crossing * 1000)}ms | normal ${checks.timing.normalPasses}/20`;
      }
      return collided;
    };

    root.addEventListener('pointerdown', (event) => {
      if (!event.target.closest('button')) jump();
    });
    state.keydown = (event) => {
      if (active !== state) return;
      if (event.code === 'ArrowUp' || event.code === 'Space') {
        event.preventDefault();
        jump();
      }
    };
    document.addEventListener('keydown', state.keydown);

    const loop = (now) => {
      if (state.finished) return;
      const dt = Math.min(0.08, (now - state.last) / 1000);
      state.last = now;
      if (state.started) {
        updateJump(now);
        state.seconds -= dt;
        state.distance -= 20.7 * dt;
        root.style.setProperty('--world-offset', `${(now / 14) % 900}px`);
        distanceNode.textContent = Math.max(0, Math.ceil(state.distance));
        countNode.textContent = Math.max(0, state.seconds).toFixed(1);
        if (playerHitObstacle()) return renderFinish(state, false, 'collision');
        if (state.distance <= 0 && state.seconds > 0) return renderFinish(state, true);
        if (state.seconds <= 0) return renderFinish(state, false, 'time');
      }
      state.frame = requestAnimationFrame(loop);
    };
    state.startTimer = window.setTimeout(() => {
      if (active !== state || state.finished) return;
      state.started = true;
      state.startedAt = performance.now();
      root.classList.add('is-running');
      // Give the player a clear read of the route before the first obstacle.
      state.obstacleTimer = window.setTimeout(spawnObstacle, 1800);
    }, 550);
    state.frame = requestAnimationFrame(loop);
  };

  document.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-act="run"]');
    if (!button) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    startRunner();
  }, true);
})();
