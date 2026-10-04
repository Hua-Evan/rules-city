/* 使用核定 CASE1 搜證完成圖；熱區採同一容器的百分比座標。 */
(function(){
window.c1scene=function(){app.innerHTML=`<section class="case1-art"><button class="art-hot art-a" onclick="c1bag()" aria-label="證物 A｜透明證物袋"></button><button class="art-hot art-b" onclick="c1phone()" aria-label="證物 B｜被扣押的手機"></button><button class="art-hot art-c" onclick="c1record()" aria-label="證物 C｜交易查核紀錄"></button></section>`};
window.c1facts=function(){app.innerHTML=`<section class="room"><div class="shade"></div><article class="open-folder"><h2>案件事實</h2><p class="fact-line">① 查扣物為大麻，列屬第二級毒品<br><small>來源：證物鑑驗</small></p><p class="fact-line">② 陳○○有將毒品轉賣的意圖<br><small>來源：手機通訊紀錄</small></p><p class="fact-line">③ 尚未發現買家、成交及收款紀錄<br><small>來源：交易查核紀錄</small></p><p class="fact-line"><b>他準備把毒品賣掉，但目前沒有發現已完成的交易。那麼，法律上的「販賣」已經成立了嗎？</b></p></article><button class="assembly-next" onclick="c1lawReady()">查找相關法條</button></section>`};
window.c1lawReady=function(){app.innerHTML=`<section class="law-ready"><div class="shade"></div><header class="top"><div><b>案件一｜還沒賣出的大麻</b><br><small>請直接翻閱桌上的法規資料。</small></div></header><button class="book-hit" onclick="c1code()" aria-label="法規資料">法規資料</button></section>`};
})();
