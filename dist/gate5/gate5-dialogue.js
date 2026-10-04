/* 第一、二幕的可重用 RPG 逐句對話；題目與原有狀態仍由 gate5.js 接續。 */
(() => {
  const app = document.getElementById('app');
  const q = (selector, root = document) => root.querySelector(selector);

  function makeDialogue(paper, label) {
    const originalButtons = [...paper.querySelectorAll('button[data-act]')];
    paper.dataset.rpgDialogue = label;
    paper.className = 'paper rpg-dialogue';
    return {
      show(speaker, line, next = '繼續', handler = null) {
        paper.innerHTML = `<div class="rpg-dialogue__stage">${label}</div><div class="rpg-dialogue__box"><span class="rpg-dialogue__name">${speaker}</span><p class="rpg-dialogue__line">「${line}」</p><button class="rpg-dialogue__next">${next}</button></div>`;
        q('.rpg-dialogue__next', paper).addEventListener('click', () => window.Gate5Runtime?.safeDialogueNext(`${label}:${speaker}`, handler || (() => {})));
      },
      choose(options, handler) {
        paper.innerHTML = `<div class="rpg-dialogue__stage">${label}</div><div class="rpg-dialogue__choices">${options.map((x, i) => `<button class="rpg-dialogue__choice" data-choice="${i}"><b>${String.fromCharCode(65 + i)}｜</b>${x}</button>`).join('')}</div>`;
        paper.querySelectorAll('[data-choice]').forEach((button) => button.addEventListener('click', () => window.Gate5Runtime?.safeDialogueNext(`${label}:choice-${button.dataset.choice}`, () => handler(+button.dataset.choice))));
      },
      action(text, next, handler) {
        paper.innerHTML = `<div class="rpg-dialogue__stage">${label}</div><div class="rpg-dialogue__action"><b>情境</b>${text}<button class="rpg-dialogue__next">${next}</button></div>`;
        q('.rpg-dialogue__next', paper).addEventListener('click', () => window.Gate5Runtime?.safeDialogueNext(`${label}:action`, handler));
      },
      result(text, minutes, handler) {
        const clock = q('.hud .time');
        if (!clock) return;
        const oldTime = clock.textContent.trim();
        const [hours, mins] = oldTime.split(':').map(Number);
        const total = hours * 60 + mins + minutes;
        const newTime = `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
        clock.textContent = newTime;
        paper.innerHTML = `<div class="rpg-dialogue__stage">${label}</div><div class="rpg-dialogue__action rpg-result"><b>系統</b><p>${text}</p><strong>本次行動花費 ${minutes} 分鐘</strong><small>現在時間｜${newTime}</small><button class="rpg-dialogue__next">繼續</button></div>`;
        q('.rpg-dialogue__next', paper).addEventListener('click', () => window.Gate5Runtime?.safeResultNext(label, handler));
      },
      original(action) { return originalButtons.find((button) => button.dataset.act === action); },
    };
  }

  function startAct1(paper) {
    const d = makeDialogue(paper, '第一幕｜霧川站入口');
    const toQuestion = (act) => d.original(act).click();
    const passengerThenQuestion = (act, line) => d.show('其他乘客', line, '進入判斷', () => toQuestion(act));
    const endBranch = (minutes, act, resultText, passengerLine = null) => {
      if (!passengerLine) sessionStorage.setItem('gate5_no_other_passenger', 'true');
      sessionStorage.setItem('gate5_skip_next_time_cost', 'true');
      // 既有 choice11 固定累加 4 分鐘；B-A 的新規格為整條分支共 2 分鐘。
      if (minutes === 2) {
        const baseTime = Number(localStorage.getItem('gate5_game_time') || 1300);
        sessionStorage.setItem('gate5_correct_time_after_act1', String(baseTime + minutes));
      }
      d.result(resultText, minutes, () => passengerLine ? passengerThenQuestion(act, passengerLine) : toQuestion(act));
    };
    const reply = (line, next) => d.show('你', line, '繼續', next);
    const choices = () => d.choose(['「好，我配合。」', '「為什麼要看我的手機？」', '「我不想接受這個檢查。」'], (choice) => {
      if (choice === 0) {
        return reply('好，我配合。', () => {
          d.show('站務人員', '謝謝，很快就好。', '繼續', () => {
            d.action('站務人員快速查看手機的最近訊息。', '繼續', () => {
              d.show('站務人員', '好了，可以進站。', '繼續', () => endBranch(1, 'choice10', '站務人員完成檢查，示意你可以進站。', '連私人訊息都要看……這是依據哪個規定啊？'));
            });
          });
        });
      }
      if (choice === 2) {
        return reply('我不想接受這個檢查。', () => {
          d.show('站務人員', '如果不配合，目前不能從這個入口進站。', '繼續', () => {
            reply('那我改走別的方式。', () => {
              d.action('你轉身離開入口，注意到旁邊貼著「霧川站臨時安全通知」。內容寫著：本站得視治安情況加強必要安全措施。', '繼續', () => {
                d.show('你', '而且這還只是站內通知吧？上面只寫「加強安全措施」，也沒寫可以看私人訊息啊。', '繼續', () => {
                  sessionStorage.setItem('gate5_no_other_passenger', 'true');
                  sessionStorage.setItem('gate5_skip_next_time_cost', 'true');
                  d.result('你改走其他方式，查看了入口旁的通知。', 7, () => d.show('你', '所以真正要先確認的，應該是他們到底憑什麼可以這樣限制我……', '進入判斷', () => toQuestion('choice12')));
                });
              });
            });
          });
        });
      }
      return reply('為什麼要看我的手機？', () => {
        d.show('站務人員', '今晚是特殊狀況，上面有通知。', '繼續', () => {
          d.choose(['「好，我知道了。」', '「是哪一個規定？」'], (follow) => {
            if (follow === 0) {
              return reply('好，我知道了。', () => {
                d.show('站務人員', '謝謝配合。', '繼續', () => endBranch(2, 'choice11', '你在入口前多停留了一會兒。', '可是……查看私人訊息，總要有依據吧？'));
              });
            }
            return reply('是哪一個規定？', () => {
              d.show('站務人員', '規定？等一下，我找一下……', '繼續', () => {
                d.action('站務人員翻找資料，找出一份「霧川站臨時安全通知」。', '繼續', () => {
                  d.show('站務人員', '目前這裡有一份「霧川站臨時安全通知」。', '繼續', () => {
                    d.action('通知內容：本站得視治安情況加強必要安全措施。', '繼續', () => {
                      reply('而且這還只是站內通知吧？上面只寫「加強安全措施」，也沒寫可以看私人訊息啊。', () => {
                        d.show('站務人員', '……我們就是依這份通知執行。', '繼續', () => endBranch(4, 'choice11', '站務人員花了一些時間查找通知。'));
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
    d.show('站務人員', '不好意思，今晚附近有治安事件。進站前請先把手機解鎖，我們確認一下最近的訊息。', '繼續', choices);
  }

  function startAct2(paper) {
    const d = makeDialogue(paper, '第二幕｜中央街管制區');
    const special = localStorage.getItem('gate5_concept_legal_reservation') === 'true';
    const toQuestion = () => {
      d.show('你', '所以問題是……到底什麼情況才會被認定為「行跡可疑」？', '進入判斷', () => {});
      const button = paper.querySelector('.rpg-dialogue__next');
      // This is the single cross-scene action in this dialogue. Bind it directly
      // to the shared runtime rather than routing it through document delegation.
      window.Gate5Runtime?.enterScene2Question(button);
    };
    const result = (act, text, minutes) => {
      sessionStorage.setItem('gate5_skip_next_time_cost', 'true');
      d.result(text, minutes, () => toQuestion());
    };
    const reply = (line, next) => d.show('你', line, '繼續', next);
    const options = ['「好，我配合。」', '「我哪裡可疑？」', '「我拒絕盤查。」'];
    if (special) options.push('「請問你依據什麼規定盤查我？」');
    const choices = () => d.choose(options, (choice) => {
      if (choice === 0) return reply('好，我配合。', () => d.show('警察甲', '確認一下就好。', '繼續', () => result('choice20', '警察甲完成簡短確認，示意你可以繼續前進。', 1)));
      if (choice === 1) return reply('我哪裡可疑？', () => d.show('警察甲', '你一直在這附近停留，又一直看手機。', '繼續', () => reply('可是剛剛另一位警察不是這樣判斷。', () => d.show('警察甲', '每個現場狀況不一樣。', '繼續', () => result('choice21', '你花時間追問警方的判斷理由。', 3)))));
      if (choice === 2) return reply('我拒絕盤查。', () => d.show('警察甲', '你確定不配合？', '繼續', () => d.action('現場氣氛稍微緊張；另一名員警介入協調後，你才繼續前進。', '繼續', () => result('choice22', '協調結束後，你才得以繼續前進。', 4))));
      return reply('請問你依據什麼規定盤查我？', () => d.show('警察甲', '盤查有相關規定，不過現在真正的問題是，你到底符不符合「行跡可疑」的條件。', '繼續', () => result('special2', '你花時間釐清了眼前的爭點。', 2)));
    });
    d.show('警察甲', '你先等一下。一直站在這裡看手機，我覺得有點可疑。', '繼續', () => d.show('被盤查路人', '我只是在等朋友。', '繼續', () => d.action('鏡頭帶到另一側：另一名同樣拿著手機、停留在附近的路人，警察乙卻直接放行。', '繼續', () => d.show('警察乙', '你可以走。', '繼續', () => d.show('警察乙', '我通常要看到反覆徘徊、一直查看店面，才會進一步盤查。', '繼續', () => d.show('你', '同樣是「行跡可疑」，他們判斷的標準好像不太一樣……', '繼續', choices))))));
  }

  function update() {
    const paper = q('.paper');
    if (!paper || paper.dataset.rpgDialogue) return;
    if (q('[data-act="choice10"]', paper)) startAct1(paper);
    else if (q('[data-act="choice20"]', paper)) startAct2(paper);
  }
  new MutationObserver(update).observe(app, { childList: true, subtree: true });
  update();
})();
