(() => {
  // Gate 6 uses a single-page scene controller. This is the canonical entry
  // path for intentional restarts; ordinary scene transitions never navigate.
  const GATE6_HOME = "/gate6/index.html";
  const GATE6_STATE_KEY = "rules-city-gate6-v1";
  window.GATE6_HOME = GATE6_HOME;

  // Keep the permanent completion flag, but discard every transient record
  // belonging to the current Gate 6 playthrough.
  function resetGate6State() {
    let previous = {};
    try {
      previous = JSON.parse(localStorage.getItem(GATE6_STATE_KEY) || "{}");
    } catch {
      previous = {};
    }
    localStorage.setItem(GATE6_STATE_KEY, JSON.stringify({
      s: "intro",
      t: {},
      r: {},
      complete: previous.complete === true,
    }));
  }
  window.resetGate6State = resetGate6State;

  function restartGate6Runtime() {
    const app = document.querySelector("#gate6");
    if (app) {
      app.className = "";
      app.replaceChildren();
    }

    // Gate 6 keeps its runtime state inside a closure. Loading a fresh copy of
    // its controller creates a new closure from the clean state above, without
    // reloading the document or retaining any opened-document DOM.
    const controller = document.createElement("script");
    controller.src = `/gate6/gate6.js?reset=${Date.now()}`;
    controller.onload = () => controller.remove();
    document.head.append(controller);
  }

  const correctAnswer = {
    q1: 2, q2: 2, q3: 2, q3b: 2, q4: 2,
    q5: 1, q6: 2, q6b: 2, b1: 1, b2: 2, b3: 2,
  };
  const yesNoAnswer = { c3c: 0, nf: 0, c5trap: 0, by: 1 };
  const wrongHints = {
    q1: {
      0: "判決已經確定，不一定代表救濟都走完了。阿哲原本是不是還可以上訴？",
      1: "只主張基本權受到侵害還不夠。人民聲請前，還需要先符合哪些程序要件？",
      3: "人民並不是不能聲請裁判憲法審查。再想想，阿哲真正缺少的是哪一個聲請要件？",
    },
    q2: {
      0: "承辦人只是執行處分。怡君真正質疑的是「人」，還是裁判所適用的那條規定？",
      1: "她不是主張法官個人有問題。再看看她說的是「法院判錯」，還是「規定本身可能違憲」。",
      3: "怡君不是在挑戰交通政策好不好。再看看她真正不滿的是哪一條規定本身。",
    },
    q3: {
      0: "公司能不能提告不是這一題的憲法問題。再看子翔真正不滿的是法院怎麼判。",
      1: "子翔不是主張主管機關資料一定錯。重點在法院最後如何評價他的查證與言論自由。",
      3: "公共議題報導不是一律免責。重點是法院的裁判是否過度限制言論與新聞自由。",
    },
    q3b: {
      0: "比較證人可信度屬於一般法院的事實認定，不是裁判憲法審查的功能。",
      1: "憲法法庭不是重新決定誰應該勝訴，而是檢驗確定終局裁判有沒有憲法上的問題。",
      3: "重新調查證據屬於一般審判功能，不是裁判憲法審查的重點。",
    },
    q4: {
      0: "當事人受到限制，但這一幕裡真正開始懷疑法規範違憲的是誰？",
      1: "原處分機關負責作成處分，但現在是誰在審案，而且發現自己必須適用這條法律？",
      3: "這一案不是立法委員主動提出。先看誰正在審理這個具體案件。",
    },
    q5: {
      0: "法官不是在懷疑當事人說得真不真。再看他真正停下來思考的是哪個法律問題。",
      2: "行政機關態度不是這一題焦點。法官真正質疑的是本案必須適用的規定本身。",
      3: "這裡不是在比較其他法院怎麼判。法官正在看的，是本案非適用不可的那條法律。",
    },
    q6: {
      0: "小豪的理由一直在談監視器與證人。他是在挑戰法律，還是要求重新判斷案件事實？",
      1: "基本權限制不是他這次具體要求憲法法庭做的事。再看他要求重看哪些資料。",
      3: "行政命令不是小豪聲請的焦點；他要求的是重新檢視原案的證據。",
    },
    q6b: {
      0: "監視器中的人是不是小豪，屬於原審法院的事實認定。",
      1: "證人是否說謊需要重新判斷證據，這不是裁判憲法審查的工作。",
      3: "換一位法官重判，仍是在要求一般訴訟的重新審理。",
    },
    b1: {
      0: "再想想。這一段雨婷是在抱怨法院最後怎麼判，還是在談那條禁拍規定本身限制得太廣？",
      2: "再想想。這一段雨婷是在抱怨法院最後怎麼判，還是在談那條禁拍規定本身限制得太廣？",
      3: "再想想。這一段雨婷是在抱怨法院最後怎麼判，還是在談那條禁拍規定本身限制得太廣？",
    },
    b2: {
      0: "再想想。這一次她已經不是在談規定本身，而是在談法院最後怎麼處理她的個案。",
      1: "再想想。這一次她已經不是在談規定本身，而是在談法院最後怎麼處理她的個案。",
      3: "再想想。這一次她已經不是在談規定本身，而是在談法院最後怎麼處理她的個案。",
    },
    b3: {
      0: "同一案件可以同時有不同的憲法問題，重點是分別看它們指向什麼。",
      1: "人民不只可能質疑裁判；若規定本身有問題，也可能涉及法規範審查。",
      3: "法院可以聲請法規範審查，但人民的案件也可能同時包含兩種審查對象。",
    },
  };
  const yesNoWrongHints = {
    c3c: "憲法法庭不是再打一審，也不是重新決定誰輸誰贏；它要看的是確定終局裁判有沒有憲法問題。",
    nf: "重新看監視器、判斷證人可信度，是一般審判的事實認定，不是裁判憲法審查。",
    c5trap: "只說基本權受侵害還不夠；必須具體指出哪項權利，以及裁判為何有憲法問題。",
    by: "先回看救濟流程：雨婷是否已把依法可以使用的救濟與上訴都走完？",
  };

  function showFeedback(title, body, label, onClick) {
    const area = document.querySelector(".feedback") || document.querySelector(".paper");
    area.innerHTML = `<div class="hint" style="margin-top:12px"><b>${title}</b><br>${body}</div><button class="button primary" id="retry-action">${label}</button>`;
    document.querySelector("#retry-action").onclick = onClick;
  }

  function clearAnswerState() {
    document.querySelectorAll(".answer, [data-bin]").forEach((option) => {
      option.classList.remove("error", "wrong", "correct", "selected", "active", "previous-selection");
      option.style.removeProperty("border");
      option.style.removeProperty("background");
      option.removeAttribute("aria-invalid");
    });
    const feedback = document.querySelector(".feedback");
    if (feedback) feedback.replaceChildren();
  }

  function retry(button, hint) {
    clearAnswerState();
    button.style.border = "3px solid #9a3932";
    button.style.background = "#f0d9d4";
    button.classList.add("error", "wrong", "selected", "active");
    button.setAttribute("aria-invalid", "true");
    showFeedback("再想想。", hint, "再試一次", () => {
      clearAnswerState();
    });
  }

  // Re-use the core listener for a correct answer. Its in-memory go(...) call
  // changes the scene without a page reload or a URL change.
  function continueInScene(button, body = "已完成這一項判斷。") {
    clearAnswerState();
    button.classList.add("correct", "selected");
    button.setAttribute("aria-label", `${button.textContent.trim()}，答對`);
    showFeedback("答對了。", body, "繼續", () => {
      button.onclick();
    });
  }

  // Both explicit restart controls use the same reset path.
  document.addEventListener("click", (event) => {
    const button = event.target.closest('[data-go="start"], [data-go="restart"]');
    if (!button) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    resetGate6State();
    restartGate6Runtime();
  }, { capture: true });

  // Boss claim buttons are rendered dynamically. Invoke their existing
  // scene-controller callbacks explicitly in capture phase so later layout
  // updates cannot leave the button without a working transition.
  document.addEventListener("click", (event) => {
    const button = event.target.closest('[data-go="b1"], [data-go="b2"]');
    if (!button) return;
    const advance = button.onclick;
    if (typeof advance !== "function") return;
    event.preventDefault();
    event.stopImmediatePropagation();
    advance.call(button);
  }, { capture: true });

  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-a]");
    if (!button) return;
    const [id, chosen] = button.dataset.a.split("|");
    event.preventDefault();
    event.stopImmediatePropagation();
    if (+chosen !== correctAnswer[id]) {
      retry(button, wrongHints[id]?.[chosen] || "請重新對照案件事實與題目要判斷的憲法問題。");
    } else {
      const feedback = {
        q1: "阿哲原本仍可依法上訴，卻沒有提起，因此尚未用盡審級救濟。",
        b1: "→ 法規範憲法審查：她這次是在質疑「規則本身」有沒有違憲問題。",
        b2: "→ 裁判憲法審查：她不是在挑戰規定本身，而是在主張法院最後這樣判，可能侵害她的憲法權利。",
      }[id];
      continueInScene(button, feedback);
    }
  }, { capture: true });

  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-yn]");
    if (!button) return;
    const state = JSON.parse(localStorage.getItem(GATE6_STATE_KEY) || "{}");
    if (yesNoAnswer[state.s] === undefined) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    if (+button.dataset.yn !== yesNoAnswer[state.s]) {
      retry(button, yesNoWrongHints[state.s]);
    }
    else continueInScene(button);
  }, { capture: true });

  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-bin]");
    if (!button) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    if (button.dataset.bin !== "yes") {
      retry(button, "這份卷宗質疑的是規定本身，先看問題指向法律規定，還是法院最後怎麼判。");
    } else {
      continueInScene(button);
    }
  }, { capture: true });

  function setAnswerText(id, title, choices) {
    const answers = document.querySelectorAll(`[data-a^="${id}|"]`);
    if (!answers.length) return false;
    const paper = document.querySelector(".paper");
    if (paper?.dataset.claimQuestion === id) return true;
    const heading = document.querySelector(".paper h2");
    if (heading) heading.textContent = title;
    answers.forEach((answer) => {
      const index = answer.dataset.a.split("|")[1];
      const label = answer.querySelector("b")?.textContent || "";
      answer.innerHTML = `<b>${label}</b>${choices[index]}`;
    });
    if (paper) paper.dataset.claimQuestion = id;
    return true;
  }

  function updateBossClaims() {
    setAnswerText("b1", "主張甲主要質疑的是什麼？", {
      0: "工作人員的態度", 1: "禁拍規定本身",
      2: "法院最後的判決", 3: "行政救濟程序",
    });
    setAnswerText("b2", "這次雨婷主要質疑的是什麼？", {
      0: "禁拍規定本身", 1: "工作人員的制止行為",
      2: "法院最後作成的判決", 3: "行政救濟程序",
    });

    const paper = document.querySelector(".paper");
    const heading = paper?.querySelector("h2");
    if (!paper || !heading || paper.dataset.claimPresentation) return;

    if (heading.textContent.includes("主張甲｜")) {
      paper.dataset.claimPresentation = "claim-a";
      heading.textContent = "主張甲｜這條禁拍規定本身，有沒有問題？";
      const note = paper.querySelector(".note");
      if (note) note.innerHTML = "雨婷：<br>「這條規定不管有沒有妨礙公務，<br>都要求先取得許可才能拍攝。」<br><br>「我認為問題可能出在這條規定本身：<br>它是不是限制得太廣了？」";
      paper.insertAdjacentHTML("afterbegin", "<div class=\"docview\"><b>禁拍規定</b><br>未經許可禁止攝影／錄音</div>");
    } else if (heading.textContent.includes("→ 法規範憲法審查")) {
      paper.dataset.claimPresentation = "claim-b";
      const advanceToClaimB = paper.querySelector("[data-go=\"b2\"]")?.onclick;
      paper.innerHTML = "<div class=\"docview\"><b>法院判決</b><br>雨婷個案的確定終局裁判</div><h2>主張乙｜法院在我的個案中，這樣判合理嗎？</h2><div class=\"note\">雨婷：<br>「我當時沒有阻礙辦公，<br>也沒有進入限制區。」<br><br>「可是法院最後還是認為，<br>我的拍攝行為不受保障。」<br><br>「我認為這個判決，<br>沒有充分考量我的言論與表意自由。」</div><button class=\"button primary\" data-go=\"b2\">判斷主張乙</button>";
      paper.querySelector("[data-go=\"b2\"]").onclick = advanceToClaimB;
    } else if (heading.textContent.includes("→ 裁判憲法審查")) {
      paper.dataset.claimPresentation = "comparison";
      const advanceToFinal = paper.querySelector("[data-go=\"b3\"]")?.onclick;
      paper.innerHTML = "<h2>主張甲與主張乙</h2><div class=\"docs\"><div class=\"doc\"><b>主張甲</b><small>規定本身限制太廣</small><b>→ 法規範憲法審查</b></div><div class=\"doc\"><b>主張乙</b><small>法院在我的個案中這樣判有問題</small><b>→ 裁判憲法審查</b></div></div><p class=\"pencil\">甲看「規則本身」，乙看「法院最後怎麼判」。</p><button class=\"button primary\" data-go=\"b3\">完成最後判斷</button>";
      paper.querySelector("[data-go=\"b3\"]").onclick = advanceToFinal;
    }
  }

  const appRoot = document.querySelector("#gate6");
  if (appRoot) new MutationObserver(updateBossClaims).observe(appRoot, { childList: true, subtree: true });
  updateBossClaims();
})();
