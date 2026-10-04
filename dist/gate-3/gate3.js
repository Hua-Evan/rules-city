/* Gate 3 共用核心；CASE 01、CASE 02 各由專屬流程檔案實作。 */
const KEY='rules-city-gate3-v1';
const fresh={stage:'title',case1:[],case2:[],case3:[],completed:[]};
let s=load(),selected=null;
function completionSnapshot(source={}){const done=source.completed||[];const case1Completed=!!(source.case1Completed||done.includes('c1'));const case2Completed=!!(source.case2Completed||done.includes('c2'));const case3Completed=!!(source.case3Completed||done.includes('c3'));return {case1Completed,case2Completed,case3Completed,gate3Completed:case1Completed&&case2Completed&&case3Completed}}
function load(){try{const completion=completionSnapshot(JSON.parse(localStorage.getItem(KEY))||{});return {...fresh,...completion,completed:[...(completion.case1Completed?['c1']:[]),...(completion.case2Completed?['c2']:[]),...(completion.case3Completed?['c3']:[])]}}catch{return {...fresh,...completionSnapshot()}}}
/* 所有案件完成紀錄都必須走同一個入口。舊版 CASE 01 曾只更新 window.s，
   CASE 02 結案時又從舊的記憶體狀態覆寫，因而遺失案件一的完成紀錄。 */
function persistGate3Completion(source={}){const current=window.s||s||fresh;const merged={...current,...source,completed:[...new Set([...(current.completed||[]),...(source.completed||[])])]},completion=completionSnapshot(merged);s={...merged,...completion,completed:[...(completion.case1Completed?['c1']:[]),...(completion.case2Completed?['c2']:[]),...(completion.case3Completed?['c3']:[])]};window.s=s;window.state=s;localStorage.setItem(KEY,JSON.stringify(completion));return s}
window.persistGate3Completion=persistGate3Completion;
function save(){return persistGate3Completion(s)}
const app=document.querySelector('#app');
function modal(html){document.querySelector('#modal')?.remove();app.insertAdjacentHTML('beforeend',`<section class="panel" id="modal"><button class="close" onclick="closeModal()">×</button>${html}</section>`)}
function closeModal(){document.querySelectorAll('#modal').forEach(node=>node.remove())}
function toast(text){modal(`<p>${text}</p><button class="primary" onclick="closeModal()">知道了</button>`)}
function title(){app.innerHTML=`<section class="room"><div class="shade"></div><div class="title"><div class="kicker">GATE 3</div><h1>解釋的邊界</h1><button class="start-btn" onclick="goDesk()">開始測試</button><p class="tiny">Independent Test Build</p></div></section>`}
function goDesk(){s.stage='desk';save();desk()}
function headerTop(){return `<header class="top"><div><b>GATE 3｜解釋的邊界</b><br><small>深夜案件審查室</small></div></header>`}
function desk(){app.innerHTML=`<section class="room"><div class="shade"></div>${headerTop()}</section>`}

/* CASE 03 由 case3-flow.js 實作，這裡只保留 Gate 3 共用核心。 */
function finish(caseId){const current=window.s||s||fresh;const completed=[...new Set([...(current.completed||[]),caseId])];persistGate3Completion({...current,stage:'desk',completed});closeModal();(window.returnToGate3Desk||desk)()}
function finalLaw(){s.stage='law';modal(`<h2>桌上的實體法典</h2><p>先完整閱讀，再標示關鍵文字。</p><div class="lawpages"><div><b>《民法》第148條</b><br><br>權利之行使，不得違反公共利益，或以損害他人為主要目的。行使權利，履行義務，應依誠實及信用方法。</div><div><b>《行政程序法》第8條</b><br><br>行政行為，應以誠實信用之方法為之，並應保護人民正當合理之信賴。</div></div><button class="primary" onclick="closeModal();journal(true)">闔上法典</button>`)}
function journal(final=false){modal(`<h2>公民筆記</h2><div class="lawpages"><div><b>法律解釋的方法</b><p>🔍 文義<br>🎯 目的<br>🧩 體系<br>📜 歷史</p></div><div><b>法律適用／權利行使原則</b><p>🤝 誠實信用<br>🚫 禁止權利濫用</p></div></div><p class="note">誠實信用、禁止權利濫用，不是第五、第六種法律解釋方法。</p>${final?'<button class="primary" onclick="clearPage()">闔上案件紀錄本</button>':''}`)}
function clearPage(){s.stage='clear';app.innerHTML=`<section class="clear"><div><div class="kicker">GATE 3｜解釋的邊界</div><h1>CLEAR</h1><p>遠處的門鎖傳來「喀。」<br>門外是規則之城大廳的光。</p><button class="start-btn" onclick="reset(true)">重新遊玩第三關</button><p><button class="test" onclick="reset(false)">回到測試首頁</button></p></div></section>`}
function reset(play){s={...fresh};save();play?goDesk():title()}
title();
