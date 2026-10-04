/* CASE1 明確狀態鏈：任何時間皆有下一個可操作物件。 */
(function(){let ev=new Set();
window.title=function(){app.innerHTML=`<section class="room"><div class="shade"></div><article class="panel folder-paper"><h2>深夜案件審查室</h2><p>今晚，桌上留下了三件尚待釐清的案件。</p><p>有些問題，光看法律文字還不夠。你需要調查事實、翻閱法規，找出法律應該如何理解與適用。</p><p>完成三件案件，找出「解釋的邊界」。</p><button class="primary" onclick="desk()">開始審查</button></article></section>`};
window.c1scene=function(){app.innerHTML=`<section class="room"><div class="shade"></div><header class="top"><div><b>案件一｜還沒賣出的大麻</b><br><small>深夜案件審查室</small></div></header><div class="case-head">先查看卷宗中的證物，釐清案件事實。</div><button class="c1-folder">案件一<br><small>案件審查卷宗</small></button><button class="obj bagobj" onclick="c1bag()" aria-label="證物 A｜透明證物袋">🌿</button><button class="obj phoneobj" onclick="c1phone()" aria-label="證物 B｜被扣押的手機"></button><button class="obj recordobj" onclick="c1record()" aria-label="證物 C｜交易查核紀錄"></button></section>`};
window.c1done=function(x){ev.add(x);closeModal();if(ev.size===3){app.insertAdjacentHTML('beforeend','<button class="assembly-next" onclick="c1facts()">整理案件事實</button>')}};
window.c1facts=function(){app.innerHTML=`<section class="room"><div class="shade"></div><header class="top"><div><b>案件一｜案件事實整理</b></div></header><article class="open-folder"><h2>案件事實</h2><p class="fact-line">① 查扣物為大麻，列屬第二級毒品<br><small>來源：證物鑑驗</small></p><p class="fact-line">② 陳○○有將毒品轉賣的意圖<br><small>來源：手機通訊紀錄</small></p><p class="fact-line">③ 尚未發現買家、成交及收款紀錄<br><small>來源：交易查核紀錄</small></p><p class="fact-line"><b>他準備把毒品賣掉，但目前沒有發現已完成的交易。那麼，法律上的「販賣」已經成立了嗎？</b></p></article><button class="book-hit" onclick="c1code()" aria-label="查找相關法條">查找相關法條</button></section>`};
title();
title();
})();
