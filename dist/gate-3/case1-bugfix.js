/* CASE1：精準法規書熱區與文義→體系單向狀態。 */
(function(){let literal=false,systematic=false;
window.c1wordok=function(){closeModal();if(literal){systematicIntro();return}literal=true;modal(`<h2>🔍 文義線索</h2><p>你剛才是從法律文字本身可能具有的意義，判斷「販賣」的範圍。</p><p>這種方法稱為「文義解釋」。</p><button class="primary" onclick="systematicIntro()">繼續</button>`) };
window.systematicIntro=function(){closeModal();modal(`<h2>只看「販賣」兩個字，還不夠。</h2><p>再看看同一部法律的其他規定。</p><button class="primary" onclick="systematicLaw()">重新查看法規</button>`) };
window.systematicLaw=function(){closeModal();modal(`<h2>《毒品危害防制條例》</h2><p class="law-text"><b>第4條第2項｜販賣第二級毒品</b><br>無期徒刑或十年以上有期徒刑，得併科新臺幣一千五百萬元以下罰金。</p><p class="law-text"><b>第5條第2項｜意圖販賣而持有第二級毒品</b><br>五年以上有期徒刑，得併科新臺幣五百萬元以下罰金。</p><p>如果把「為了販賣而購入、持有毒品」都直接算成第4條的「販賣」，那麼第5條會發生什麼事？</p><button class="primary" onclick="systematicApply()">套用舊實務的解釋</button>`) };
window.systematicApply=function(){closeModal();modal(`<h2>第4條「販賣」</h2><p>涵蓋：為了販賣而購入／持有</p><h2 style="opacity:.35">第5條「意圖販賣而持有」</h2><p>如果這樣理解，第5條會發生什麼問題？</p><button class="choice" onclick="systematicGood()">A. 第5條會失去部分獨立適用的意義</button><button class="choice" onclick="systematicWrong()">B. 第5條的刑度會自動提高</button><button class="choice" onclick="systematicWrong()">C. 第4條會失效</button>`) };
window.systematicWrong=function(){closeModal();modal(`<p>再想想：比較的是第4條與第5條各自保留的適用空間。</p><button class="primary" onclick="systematicApply()">再想想</button>`) };
window.systematicGood=function(){closeModal();if(systematic)return;systematic=true;modal(`<h2>🧩 體系線索</h2><p>你剛才不是只看「販賣」兩個字，而是把第4條與第5條放在同一部法律中一起理解。</p><p>從法律規範彼此之間的關係理解條文意義的方法，稱為「體系解釋」。</p><button class="primary" onclick="closeModal();finish1()">繼續</button>`) };
window.c1judge=function(){modal(`<h2>依目前查得的案件事實，你會先依哪一條規定處理？</h2><button class="choice" onclick="chooseInitialDecision('article5')">第5條第2項</button><button class="choice" onclick="chooseInitialDecision('article4')">第4條第2項</button>`) };
window.chooseInitialDecision=function(answer){if(answer==='article5'){window.initialDecision='article5';closeModal();modal(`<h2>你的初步判斷已記錄。</h2><p>……</p><button class="primary" onclick="initialAlert()">繼續</button>`);return}closeModal();modal(`<h2>再看看目前查到的案件事實。</h2><p>✓ 有轉賣意圖</p><p>？ 已確認買家：未發現<br>？ 成交紀錄：未發現<br>？ 收款紀錄：未發現</p><p>在目前沒有發現完成交易的情況下，你確定要直接以「販賣」處理嗎？</p><button class="primary" onclick="closeModal();c1judge()">再想想</button>`) };
window.c1initialDecisionV2=function(){modal(`<h2>依目前查得的案件事實，你會先依哪一條規定處理？</h2><button class="choice" onclick="chooseInitialDecision('article5')">第5條第2項</button><button class="choice" onclick="chooseInitialDecision('article4')">第4條第2項</button>`) };
window.initialAlert=function(){closeModal();modal(`<h2>⚠ 發現不同見解</h2><p>但是，過去法官的見解，和你的判斷不一樣。</p><button class="primary" onclick="c1old()">查看過去實務</button>`) };
window.systematicGood=function(){closeModal();if(systematic)return;systematic=true;modal(`<h2>🧩 體系線索</h2><p>你剛才不是只看「販賣」這兩個字，而是把第4條與第5條放在一起理解。</p><p>如果把「為了販賣而購入、持有」都算成第4條的「販賣」，第5條「意圖販賣而持有」就會失去部分獨立適用的意義。</p><p><b>這種從法律規範彼此之間的關係，理解條文意義的方法，稱為「體系解釋」。</b></p><h2>🧩 體系解釋</h2><button class="primary" onclick="c1ChallengeOld()">收下線索</button>`) };
window.c1ChallengeOld=function(){closeModal();modal(`<h2>重新檢視過去實務</h2><p>你現在已經找到兩個問題。</p><p>🔍 文義　　🧩 體系</p><p>重新檢視過去實務對「販賣」的理解。</p><button class="primary" onclick="c1Reveal792()">提出異議</button>`) };
window.c1Reveal792=function(){closeModal();modal(`<h2>司法院釋字第792號</h2><p><b>① 文義</b><br>「販賣」的核心意義在出售，不能只因購入就直接等同已完成販賣。</p><p><b>② 體系</b><br>法律另規定「意圖販賣而持有」；若購入並準備轉賣就直接等於販賣既遂，條文間原有區分會被破壞。</p><button class="primary" onclick="completeCase1()">完成案件一</button>`) };

const CASE1_STORAGE_KEY='rules-city-gate3-v1';
function case1Progress(){try{const progress=JSON.parse(localStorage.getItem(CASE1_STORAGE_KEY)||'{}');const done=progress.completed||[];return {...progress,completed:[...(progress.case1Completed||done.includes('c1')?['c1']:[]),...(progress.case2Completed||done.includes('c2')?['c2']:[]),...(progress.case3Completed||done.includes('c3')?['c3']:[])]}}catch{return {completed:[]}}}
function saveCase1Progress(progress){const done=progress.completed||[];const completion={case1Completed:!!(progress.case1Completed||done.includes('c1')),case2Completed:!!(progress.case2Completed||done.includes('c2')),case3Completed:!!(progress.case3Completed||done.includes('c3'))};completion.gate3Completed=completion.case1Completed&&completion.case2Completed&&completion.case3Completed;if(window.persistGate3Completion){window.persistGate3Completion({...completion,completed:done});}else{localStorage.setItem(CASE1_STORAGE_KEY,JSON.stringify(completion));window.s={...window.s,...completion,completed:[...(completion.case1Completed?['c1']:[]),...(completion.case2Completed?['c2']:[]),...(completion.case3Completed?['c3']:[])]};window.state=window.s}console.log(localStorage.getItem(CASE1_STORAGE_KEY));}
window.completeCase1=function(){
  const progress=case1Progress();
  saveCase1Progress({completed:Array.from(new Set([...(progress.completed||[]),'c1'])),case1Completed:true});closeModal();(window.returnToGate3Desk||desk)();
};
window.openCase1Summary=function(){
  modal('<h2>案件一｜還沒賣出的大麻</h2><p><b>✓ 已結案</b></p><h3>本案取得線索</h3><p>🔍 <b>文義解釋</b><br>從法律文字可能具有的意義理解規範。</p><p>🧩 <b>體系解釋</b><br>從法律規範彼此之間的關係理解條文意義。</p><h3>案件結果</h3><p><b>司法院釋字第792號</b></p><p>本案重新檢視了過去實務對「販賣」一詞的理解。</p><button class="primary" onclick="returnToGate3Desk()">返回案件桌面</button>');
};
const case1FlowEntry=window.case1;
window.case1=function(){const progress=case1Progress();if(progress.case1Completed||(progress.completed||[]).includes('c1')){window.openCase1Summary();return}return case1FlowEntry()};
const renderDeskBeforeCase1Guard=window.desk;
window.desk=function(){
  const progress=case1Progress();window.s=progress;window.state=progress;renderDeskBeforeCase1Guard();
  const firstFolder=document.querySelector('.physical-folder');
  if((progress.case1Completed||(progress.completed||[]).includes('c1'))&&firstFolder)firstFolder.setAttribute('onclick','case1()');
};
})();
