/* 第一波視覺覆寫：不改變題目、答案或跑酷規則。 */
(() => {
  const app = document.getElementById('app');
  const sceneFor = () => {
    if (app.querySelector('.runner')) return 'runner';
    const title = app.querySelector('.scene-title b')?.textContent || '';
    const paper = app.querySelector('.paper')?.textContent || '';
    if (/霧川站|第一幕/.test(title) || /查看私人訊息|站務人員/.test(paper)) return 'station';
    if (/中央街|第二幕/.test(title) || /行跡可疑|警察甲/.test(paper)) return 'control';
    if (/第三幕|比例原則|三種治安方案|方案後果/.test(title + paper)) return 'market';
    if (/第四幕|裁罰通知/.test(title + paper)) return 'return';
    return 'opening';
  };
  const say = (node, speaker, line) => {
    if (!node || node.dataset.dialogue) return;
    node.dataset.dialogue = 'true';
    node.dataset.speaker = speaker;
    node.classList.add('dialogue');
    node.textContent = line;
  };
  const addDialogue = () => {
    if (sessionStorage.getItem('gate5_no_other_passenger') === 'true') {
      const passenger = [...app.querySelectorAll('.paper p')].find((p) => p.textContent.includes('旁邊乘客低聲說'));
      if (passenger) { passenger.remove(); sessionStorage.removeItem('gate5_no_other_passenger'); }
    }
    const paragraphs = [...app.querySelectorAll('.paper p')];
    paragraphs.forEach((p) => {
      const t = p.textContent.trim();
      if (t.startsWith('站務人員攔下你')) say(p, '站務人員', '今晚附近有治安事件。進站前請先把手機解鎖，我們確認一下最近的訊息。');
      if (t.startsWith('旁邊乘客低聲說')) say(p, '其他乘客', '查看私人訊息，總要有依據吧？');
      if (t.startsWith('警察甲：')) say(p, '警察甲', '我覺得一直看手機、站在這裡不走就值得注意。');
      if (t.startsWith('警察乙：')) say(p, '警察乙', '我通常要看到反覆徘徊、一直查看店面才會攔。');
    });
  };
  const timeCost = () => {
    app.querySelectorAll('.clock-tick').forEach((tick) => {
      const note = tick.closest('small');
      if (!note || note.dataset.timeCost) return;
      const match = tick.textContent.match(/(\d{2}):(\d{2})\s*→\s*(\d{2}):(\d{2})/);
      if (!match) return;
      const minutes = (+match[3] * 60 + +match[4]) - (+match[1] * 60 + +match[2]);
      if (sessionStorage.getItem('gate5_skip_next_time_cost') === 'true') {
        sessionStorage.removeItem('gate5_skip_next_time_cost');
        note.dataset.timeCost = 'true';
        note.remove();
        const corrected = sessionStorage.getItem('gate5_correct_time_after_act1');
        if (corrected !== null) {
          sessionStorage.removeItem('gate5_correct_time_after_act1');
          localStorage.setItem('gate5_game_time', corrected);
          setTimeout(() => window.location.reload(), 0);
        }
        return;
      }
      note.dataset.timeCost = 'true';
      note.className = 'time-cost';
      note.textContent = `本次行動花費 ${minutes} 分鐘`;
      const header = app.querySelector('.hud');
      if (header && !header.querySelector('.time-shift')) {
        const shift = document.createElement('span');
        shift.className = 'time-shift';
        shift.textContent = tick.textContent;
        header.append(shift);
        setTimeout(() => shift.remove(), 1450);
      }
    });
  };
  const update = () => {
    app.dataset.gate5Scene = sceneFor();
    addDialogue();
    timeCost();
  };
  new MutationObserver(update).observe(app, { childList: true, subtree: true });
  update();
})();
